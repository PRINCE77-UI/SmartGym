import { connectDB } from '../../config/db.js';
import { Member } from '../../models/schemas.js';
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
        message: 'Invalid member ID'
      });
    }

    // PUT /api/members/[id] - Update member (Admin only)
    if (req.method === 'PUT') {
      const decoded = auth(req, res);
      if (!decoded) return;

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can update members'
        });
      }

      const { name, plan, status } = req.body;

      // Validation
      if (!name || !plan || !status) {
        return res.status(400).json({
          success: false,
          message: 'Name, plan, and status are required'
        });
      }

      try {
        const updatedMember = await Member.findByIdAndUpdate(
          id,
          { name, plan, status },
          { new: true, runValidators: true }
        );

        if (!updatedMember) {
          return res.status(404).json({
            success: false,
            message: 'Member not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Member updated successfully',
          data: updatedMember
        });
      } catch (validationErr) {
        return res.status(400).json({
          success: false,
          message: validationErr.message || 'Validation error'
        });
      }
    }

    // DELETE /api/members/[id] - Delete member (Admin only)
    if (req.method === 'DELETE') {
      const decoded = auth(req, res);
      if (!decoded) return;

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can delete members'
        });
      }

      const deletedMember = await Member.findByIdAndDelete(id);

      if (!deletedMember) {
        return res.status(404).json({
          success: false,
          message: 'Member not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Member deleted successfully'
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (err) {
    console.error('Member API error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
