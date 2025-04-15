import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../../lib/dbConnect';
import Student from '../../../../../models/Student';
import Teacher from '../../../../../models/Teacher';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json(
        { authenticated: false, error: 'No token found' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    await dbConnect();
    
    // Fetch user details based on userType
    let userDetails;
    if (decoded.userType === 'teacher') {
      userDetails = await Teacher.findById(decoded.userId);
    } else {
      userDetails = await Student.findById(decoded.userId);
    }

    // Base response
    const response = {
      authenticated: true,
      userType: decoded.userType,
      userId: decoded.userId,
      fullName: decoded.fullName,
      _id: decoded.userId
    };

    // Add type-specific fields
    if (decoded.userType === 'teacher') {
      response.subject = userDetails.subject;
      response.qualification = userDetails.qualification;
    } else {
      response.studentType = userDetails.studentType;
      response.rollNumber = userDetails.rollNumber;
      response.class = userDetails.class;
      response.stream = userDetails.stream;
      response.year = userDetails.year;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 401 }
    );
  }
}