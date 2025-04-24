import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAX_AGE = 60 * 10;

export const createToken = (userId, userType, fullName) => {
  return jwt.sign({ 
    userId: userId.toString(), // Convert ObjectId to string
    userType,
    fullName 
  }, JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
};

export const setTokenCookie = (res, token) => {
  try {
    const cookieOptions = {
      maxAge: MAX_AGE * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    };

    res.setHeader('Set-Cookie', serialize('authToken', token, cookieOptions));
    return true;
  } catch (error) {
    console.error('Cookie setting error:', error);
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const getTokenFromRequest = (req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.token || null;
};
