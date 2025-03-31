import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user is a student
    if (decoded.role !== 'student') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Fetch student data from database
    const studentData = await getStudentFromDB(decoded.userId);
    
    return NextResponse.json({
      username: studentData.username,
      studentId: studentData.id,
      email: studentData.email,
      class: studentData.classLevel,
      // Add other student-specific fields
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}