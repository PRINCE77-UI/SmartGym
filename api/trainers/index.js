import { connectDB } from '../../config/db.js';
import { Trainer } from '../../models/schemas.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // GET /api/trainers - Get all trainers
    if (req.method === 'GET') {
      const trainers = await Trainer.find();
      return res.status(200).json(trainers);
    }

    // POST /api/trainers - Create new trainer
    if (req.method === 'POST') {
      const { name, specialization, status } = req.body;
      const newTrainer = new Trainer({ name, specialization, status });
      await newTrainer.save();
      return res.status(201).json({ message: "Trainer Added", trainer: newTrainer });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
