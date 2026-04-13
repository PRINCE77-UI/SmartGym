import { connectDB } from '../../config/db.js';
import { Trainer } from '../../models/schemas.js';
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
        message: 'Invalid trainer ID'
      });
    }

    // PUT /api/trainers/[id] - Update trainer (Admin only)
    if (req.method === 'PUT') {
      const decoded = auth(req, res);
      if (!decoded) return;

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can update trainers'
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
        const updatedTrainer = await Trainer.findByIdAndUpdate(
          id,
          { name, specialization, status },
          { new: true, runValidators: true }
        );

        if (!updatedTrainer) {
          return res.status(404).json({
            success: false,
            message: 'Trainer not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Trainer updated successfully',
          data: updatedTrainer
        });
      } catch (validationErr) {
        return res.status(400).json({
          success: false,
          message: validationErr.message || 'Validation error'
        });
      }
    }

    // DELETE /api/trainers/[id] - Delete trainer (Admin only)
    if (req.method === 'DELETE') {
      const decoded = auth(req, res);
      if (!decoded) return;

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can delete trainers'
        });
      }

      const deletedTrainer = await Trainer.findByIdAndDelete(id);

      if (!deletedTrainer) {
        return res.status(404).json({
          success: false,
          message: 'Trainer not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Trainer deleted successfully'
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (err) {
    console.error('Trainer API error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
