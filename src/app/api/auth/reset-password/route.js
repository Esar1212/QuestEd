import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Student from '../../../../../models/Student';
import Teacher from '../../../../../models/Teacher';

export async function POST(request) {
  try {
    const { email, userType, newPassword } = await request.json();

    if (!email || !userType || !newPassword) {
      return NextResponse.json({ error: 'Email, userType, and newPassword are required.' }, { status: 400 });
    }

    await dbConnect();

    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else if (userType === 'teacher') {
      user = await Teacher.findOne({ email });
    } else {
      return NextResponse.json({ error: 'Invalid userType.' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

   
    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
