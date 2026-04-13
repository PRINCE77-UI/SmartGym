import mongoose from 'mongoose';

// User Schema
export const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  plan: {
    type: String,
    default: "Weight Loss Program"
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Member Schema
export const memberSchema = new mongoose.Schema({
  name: String,
  plan: String,
  status: String
});

export const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

// Trainer Schema
export const trainerSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  status: String
});

export const Trainer = mongoose.models.Trainer || mongoose.model('Trainer', trainerSchema);

// Workout Schema
export const workoutSchema = new mongoose.Schema({
  name: String,
  trainer: String,
  difficulty: String,
  duration: String
});

export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
