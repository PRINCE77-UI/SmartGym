import { connectDB } from '../../config/db.js';
import { User } from '../../models/schemas.js';
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

    // GET /api/users/profile - Get authenticated user
    if (req.method === 'GET') {
      const decoded = auth(req, res);
      if (!decoded) return;

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    }

    // PUT /api/users/profile - Update authenticated user
    if (req.method === 'PUT') {
      const decoded = auth(req, res);
      if (!decoded) return;

      const { name, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        { name, email },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
