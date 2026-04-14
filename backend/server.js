import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Step 2: Connect MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster.mongodb.net/gymapp?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

mongoose.connect(MONGODB_URI, {
  // Connection pool configuration optimized for OLTP workload
  maxPoolSize: 50,           // Handle peak concurrent requests
  minPoolSize: 10,           // Pre-warmed connections ready for traffic
  maxIdleTimeMS: 600000,     // 10 minutes - stable server benefits from persistent connections
  connectTimeoutMS: 10000,   // 10 seconds - fail fast on connection issues
  socketTimeoutMS: 30000,    // 30 seconds - prevent hanging queries
  serverSelectionTimeoutMS: 5000, // 5 seconds - quick failover
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log('✓ MongoDB Atlas Connected Successfully');
})
.catch((err) => {
  console.error('✗ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Step 3: Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String, // admin or user
  plan: {
  type: String,
  default: "Weight Loss Program"
}
});
const User = mongoose.model('User', userSchema);

app.get('/', async (req, res) => {
  res.send("Welcome to Smart GYM API");
});
// Step 4: Register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;


    if (!name || !email || !password) {
      return res.json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.json({ message: "Registered Successfully" });

  } catch (err) {
    res.json({ message: "Registration failed" });
  }
});

// Step 5: Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "Email not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    res.json({ message: "Login failed" });
  }
});

// Step 6: Middleware
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.send('No token');

  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
};

app.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.json({ message: "Error fetching user" });
  }
});
app.get("/user/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  if (!user) return res.json({ message: "User not found" });

  res.json(user);

});
app.put("/user", auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.json({ message: "Update failed" });
  }
});

//member schema
const memberSchema = new mongoose.Schema({
  name: String,
  plan: String,
  status: String
});

const Member = mongoose.model("Member", memberSchema);

app.get("/members", async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

app.post("/members", async (req, res) => {
  try {
    const { name, plan, status } = req.body;

    const newMember = new Member({ name, plan, status });
    await newMember.save();

    res.json({ message: "Member Added" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Error" });
  }
});

app.put("/members/:id", async (req, res) => {
  const { name, plan, status } = req.body;

  await Member.findByIdAndUpdate(req.params.id, {
    name,
    plan,
    status
  });

  res.json({ message: "Member Updated" });
});
app.delete("/members/:id", async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ message: "Member Deleted" });
});

// Trainer Schema
const trainerSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  status: String
});

const Trainer = mongoose.model("Trainer", trainerSchema);

app.get("/trainers", async (req, res) => {
  const trainers = await Trainer.find();
  res.json(trainers);
});

app.post("/trainers", async (req, res) => {
  const { name, specialization, status } = req.body;

  const newTrainer = new Trainer({ name, specialization, status });
  await newTrainer.save();

  res.json({ message: "Trainer Added" });
});

app.put("/trainers/:id", async (req, res) => {
  const { name, specialization, status } = req.body;

  await Trainer.findByIdAndUpdate(req.params.id, {
    name,
    specialization,
    status
  });

  res.json({ message: "Trainer Updated" });
});

app.delete("/trainers/:id", async (req, res) => {
  await Trainer.findByIdAndDelete(req.params.id);
  res.json({ message: "Trainer Deleted" });
});

// Workout Schema
const workoutSchema = new mongoose.Schema({
  name: String,
  trainer: String,
  difficulty: String,
  duration: String
});

const Workout = mongoose.model("Workout", workoutSchema);

app.get("/workouts", async (req, res) => {
  const workouts = await Workout.find();
  res.json(workouts);
});

app.post("/workouts", async (req, res) => {
  const { name, trainer, difficulty, duration } = req.body;

  const newWorkout = new Workout({ name, trainer, difficulty, duration });
  await newWorkout.save();

  res.json({ message: "Workout Added" });
});

app.put("/workouts/:id", async (req, res) => {
  const { name, trainer, difficulty, duration } = req.body;

  await Workout.findByIdAndUpdate(req.params.id, {
    name,
    trainer,
    difficulty,
    duration
  });

  res.json({ message: "Workout Updated" });
});

app.delete("/workouts/:id", async (req, res) => {
  await Workout.findByIdAndDelete(req.params.id);
  res.json({ message: "Workout Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// module.exports = app;