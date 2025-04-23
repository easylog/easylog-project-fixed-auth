import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Methode nicht erlaubt' });
  }

  try {
    const { db } = await connectToDatabase();

    const userCount = await db.collection('users').countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ message: 'Bootstrap kann nur auf einer leeren Datenbank ausgeführt werden' });
    }

    const adminPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);

    const admin = {
      name: 'Administrator',
      email: 'admin@easylog.de',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date()
    };

    const staff = {
      name: 'Mitarbeiter',
      email: 'staff@easylog.de',
      password: staffPassword,
      role: 'staff',
      createdAt: new Date()
    };

    await db.collection('users').insertMany([admin, staff]);

    return res.status(200).json({
      message: 'Bootstrap erfolgreich durchgeführt',
      users: [admin.email, staff.email]
    });

  } catch (error) {
    console.error('❌ Bootstrap-Fehler:', error);
    return res.status(500).json({ message: 'Serverfehler beim Bootstrap-Prozess' });
  }
}
