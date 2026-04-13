import { connectDB } from '../../config/db.js';
import { Workout } from '../../models/schemas.js';
import { auth } from '../../middleware/auth.js';
import mongoose from 'mongoose';

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

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID'
      });
    }

    // PUT /api/workouts/[id] - Update workout (Admin only)
    if (req.method === 'PUT') {
      const decoded = auth(req, res);
      if (!decoded) return;

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can update workouts'
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
        const updatedWorkout = await Workout.findByIdAndUpdate(
          id,
          { name, trainer, difficulty, duration },
          { new: true, runValidators: true }
        );

        if (!updatedWorkout) {
          return res.status(404).json({
            success: false,
            message: 'Workout not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Workout updated successfully',
          data: updatedWorkout
        });
      } catch (validationErr) {
        return res.status(400).json({
          success: false,
          message: validationErr.message || 'Validation error'
        });
      }
    }

    // DELETE /api/workouts/[id] - Delete workout (Admin only)
    if (req.method === 'DELETE') {
      const decoded = auth(req, res);
      if (!decoded) return;

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can delete workouts'
        });
      }

      const deletedWorkout = await Workout.findByIdAndDelete(id);

      if (!deletedWorkout) {
        return res.status(404).json({
          success: false,
          message: 'Workout not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Workout deleted successfully'
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (err) {
    console.error('Workout API error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
