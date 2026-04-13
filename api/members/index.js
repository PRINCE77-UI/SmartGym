import { connectDB } from '../../config/db.js';
import { Member } from '../../models/schemas.js';

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

    // GET /api/members - Get all members
    if (req.method === 'GET') {
      const members = await Member.find();
      return res.status(200).json(members);
    }

    // POST /api/members - Create new member
    if (req.method === 'POST') {
      const { name, plan, status } = req.body;
      const newMember = new Member({ name, plan, status });
      await newMember.save();
      return res.status(201).json({ message: "Member Added", member: newMember });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
