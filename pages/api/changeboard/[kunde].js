import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { kunde } = req.query;
  const client = await clientPromise;
  const db = client.db('easylog');
  const collection = db.collection('changeboard_' + kunde);

  if (req.method === 'GET') {
    const posts = await collection.find().sort({ createdAt: -1 }).toArray();
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const entry = {
      text: req.body.text,
      createdAt: new Date(),
      user: 'DemoUser'
    };
    await collection.insertOne(entry);
    return res.status(201).json({ message: 'Gespeichert', entry });
  }

  res.status(405).end();
}