import { connectToDatabase } from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

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

    const customers = [
      { name: 'Kunde A', contactPerson: 'Max Mustermann', email: 'kontakt@kunde-a.de', createdAt: new Date() },
      { name: 'Kunde B', contactPerson: 'Erika Musterfrau', email: 'kontakt@kunde-b.de', createdAt: new Date() },
      { name: 'Kunde C', contactPerson: 'John Doe', email: 'kontakt@kunde-c.de', createdAt: new Date() }
    ];

    await db.collection('customers').insertMany(customers);

    return res.status(200).json({ 
      message: 'Bootstrap erfolgreich durchgeführt',
      adminEmail: admin.email,
      staffEmail: staff.email,
      defaultPassword: 'admin123 / staff123'
    });
  } catch (error) {
    console.error('Bootstrap-Fehler:', error);
    return res.status(500).json({ message: 'Serverfehler beim Bootstrap-Prozess' });
  }
}
