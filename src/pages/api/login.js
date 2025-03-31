import dbConnect from '../../../lib/dbConnect';
import Student from '../../../models/Student';
import Teacher from '../../../models/Teacher';
import { createToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { email, password, userType } = req.body;

    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else if (userType === 'teacher') {
      user = await Teacher.findOne({ email });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = createToken(user._id, userType, user.fullName);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error'
    });
  }
}