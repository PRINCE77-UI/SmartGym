import { connectDB } from '../../config/db.js';
import { Trainer } from '../../models/schemas.js';
import { auth } from '../../middleware/auth.js';

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
      const trainers = await Trainer.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: trainers,
        count: trainers.length
      });
    }

    // POST /api/trainers - Create new trainer (Admin only)
    if (req.method === 'POST') {
      const decoded = auth(req, res);
      if (!decoded) return;

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can add trainers'
        });
      }

      const { name, specialization, status } = req.body;

      // Validation
      if (!name || !specialization || !status) {
        return res.status(400).json({
          success: false,
          message: 'Name, specialization, and status are required'
        });
      }

      try {
        const newTrainer = new Trainer({ name, specialization, status });
        await newTrainer.save();
        return res.status(201).json({
          success: true,
          message: 'Trainer added successfully',
          data: newTrainer
        });
      } catch (validationErr) {
        return res.status(400).json({
          success: false,
          message: validationErr.message || 'Validation error'
        });
      }
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (err) {
    console.error('Trainers API error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
