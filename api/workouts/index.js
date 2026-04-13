import { connectDB } from '../../config/db.js';
import { Workout } from '../../models/schemas.js';

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
      const workouts = await Workout.find();
      return res.status(200).json(workouts);
    }

    // POST /api/workouts - Create new workout
    if (req.method === 'POST') {
      const { name, trainer, difficulty, duration } = req.body;
      const newWorkout = new Workout({ name, trainer, difficulty, duration });
      await newWorkout.save();
      return res.status(201).json({ message: "Workout Added", workout: newWorkout });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
