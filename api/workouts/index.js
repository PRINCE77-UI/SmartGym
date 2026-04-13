import { connectDB } from '../../config/db.js';
import { Workout } from '../../models/schemas.js';
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

    // GET /api/workouts - Get all workouts
    if (req.method === 'GET') {
      const workouts = await Workout.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: workouts,
        count: workouts.length
      });
    }

    // POST /api/workouts - Create new workout (Admin only)
    if (req.method === 'POST') {
      const decoded = auth(req, res);
      if (!decoded) return;

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can add workouts'
        });
      }

      const { name, trainer, difficulty, duration } = req.body;

      // Validation
      if (!name || !trainer || !difficulty || !duration) {
        return res.status(400).json({
          success: false,
          message: 'Name, trainer, difficulty, and duration are required'
        });
      }

      try {
        const newWorkout = new Workout({ name, trainer, difficulty, duration });
        await newWorkout.save();
        return res.status(201).json({
          success: true,
          message: 'Workout added successfully',
          data: newWorkout
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
    console.error('Workouts API error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
