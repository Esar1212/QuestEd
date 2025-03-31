import dbConnect from '../../../lib/dbConnect';
import Student from '../../../models/Student';
import Teacher from '../../../models/Teacher';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Extract token from cookies
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // 2. Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // 3. Fetch user based on type
    let user;
    if (decoded.userType === 'student') {
      user = await Student.findById(decoded.userId).select('-password');
    } else if (decoded.userType === 'teacher') {
      user = await Teacher.findById(decoded.userId).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Return safe user data
    res.status(200).json({
      ...user.toObject(),
      userType: decoded.userType // Include type from token
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}