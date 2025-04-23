import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  // Aktivieren von CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Behandlung von OPTIONS-Anfragen (für CORS-Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extrahieren des Kundennamens aus der URL
  const { kunde } = req.query;

  // Nur POST-Anfragen zulassen
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Methode nicht erlaubt' });
  }

  try {
    const { title, description, priority, status } = req.body;

    // Überprüfen, ob alle erforderlichen Felder vorhanden sind
    if (!title || !description) {
      return res.status(400).json({ message: 'Titel und Beschreibung sind erforderlich' });
    }

    // Verbindung zur Datenbank herstellen
    const { db } = await connectToDatabase();
    
    // Benutzerinformationen aus dem JWT-Token extrahieren
    // In einer echten Anwendung würde hier eine Authentifizierungsprüfung stattfinden
    
    // Neuen ChangeBoard-Eintrag erstellen
    const newChange = {
      title,
      description,
      priority: priority || 'medium',
      status: status || 'pending',
      customer: kunde,
      assignedTo: req.body.assignedTo || 'Nicht zugewiesen',
      createdAt: new Date(),
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Standard: 1 Woche
    };

    // Eintrag in die Datenbank einfügen
    const result = await db.collection('changes').insertOne(newChange);

    return res.status(201).json({ 
      message: 'ChangeBoard-Eintrag erfolgreich erstellt',
      change: {
        ...newChange,
        _id: result.insertedId
      }
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des ChangeBoard-Eintrags:', error);
    return res.status(500).json({ message: 'Serverfehler beim Erstellen des ChangeBoard-Eintrags' });
  }
}
