import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  studentType: {
    type: String,
    required: true,
    enum: ['school', 'college']
  },
  rollNumber: {
    type: Number,
    required: true,
    unique: true
  },
  // School student fields
  class: {
    type: String,
    required: function() { return this.studentType === 'school'; }
  },
  // College student fields
  stream: {
    type: String,
    required: function() { return this.studentType === 'college'; }
  },
  year: {
    type: String,
    required: function() { return this.studentType === 'college'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export default Student;