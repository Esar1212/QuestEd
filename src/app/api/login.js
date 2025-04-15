import dbConnect from '@/lib/dbConnect';
import Student from '../../../models/Student';
import Teacher from '../../../models/Teacher';
import { createToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, userType } = req.body;

  try {
    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else if (userType === 'teacher') {
      user = await Teacher.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id, userType, user.fullName);
    setTokenCookie(res, token);

    // Return common user data
    const response = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType,
      rollNumber: user.rollNumber,  // Add roll number to response
      studentType: user.studentType
    };

    // Add type-specific fields
    if (userType === 'student') {
      if (user.studentType === 'school') {
        response.class = user.class;
      } else {
        response.stream = user.stream;
        response.year = user.year;
      }
    } else {
      response.subject = user.subject;
      response.qualification = user.qualification;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}