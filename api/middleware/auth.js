import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/db.js';

export function auth(req, res) {
  const token = req.headers['authorization'];
  
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return null;
  }
}
