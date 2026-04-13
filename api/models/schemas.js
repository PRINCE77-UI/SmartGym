import mongoose from 'mongoose';

// User Schema
export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    plan: {
      type: String,
      default: 'Weight Loss Program'
    }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Member Schema
export const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    plan: {
      type: String,
      required: [true, 'Plan is required'],
      enum: ['Weight Loss Program', 'Muscle Gain', 'Fitness Maintenance', 'Custom'],
      default: 'Weight Loss Program'
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['active', 'inactive', 'paused'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

// Trainer Schema
export const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trainer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      enum: ['Cardio', 'Strength', 'Flexibility', 'CrossFit', 'Yoga', 'Other'],
      default: 'Other'
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['active', 'inactive', 'on_leave'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export const Trainer = mongoose.models.Trainer || mongoose.model('Trainer', trainerSchema);

// Workout Schema
export const workoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    trainer: {
      type: String,
      required: [true, 'Trainer name is required']
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      match: [/^\d+\s(min|mins|minutes|hr|hrs|hours)$/, 'Duration format: "30 min" or "1 hr"']
    }
  },
  { timestamps: true }
);

export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
