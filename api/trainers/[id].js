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
    const { id } = req.query;

    // PUT /api/trainers/[id] - Update trainer
    if (req.method === 'PUT') {
      const { name, specialization, status } = req.body;
      const updatedTrainer = await Trainer.findByIdAndUpdate(
        id,
        { name, specialization, status },
        { new: true }
      );
      return res.status(200).json({ message: "Trainer Updated", trainer: updatedTrainer });
    }

    // DELETE /api/trainers/[id] - Delete trainer
    if (req.method === 'DELETE') {
      await Trainer.findByIdAndDelete(id);
      return res.status(200).json({ message: "Trainer Deleted" });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
