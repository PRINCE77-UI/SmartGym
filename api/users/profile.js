import { connectDB } from '../../config/db.js';
import { User } from '../../models/schemas.js';
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

    // GET /api/users/profile - Get authenticated user profile
    if (req.method === 'GET') {
      const decoded = auth(req, res);
      if (!decoded) return;

      // Validate user ID format
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    }

    // PUT /api/users/profile - Update authenticated user profile
    if (req.method === 'PUT') {
      const decoded = auth(req, res);
      if (!decoded) return;

      // Validate user ID format
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      const { name, email } = req.body;

      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
      }

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate name length
      if (name.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters long'
        });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: decoded.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        { name, email },
        { new: true, runValidators: true }
      ).select('-password');

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors)
        .map(error => error.message)
        .join(', ');
      
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`
      });
    }

    console.error('Profile endpoint error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
