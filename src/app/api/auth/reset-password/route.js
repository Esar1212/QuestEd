import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Student from '../../../../../models/Student';
import Teacher from '../../../../../models/Teacher';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

     const msg = {
            to: email,
            from: 'shubhradeeproy343@gmail.com', // Must be verified in SendGrid
            subject: 'Password Updated for your QuestEd Account',
            text: `Dear ${userType}, we are gld to inform you that your password has been updated successfully.\nThank you for using our platform.\n\nIf you didn't request this verification, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2a5298;">QuestEd</h2>
                    <p>Dear ${userType}, we are glad to inform you that your password has been updated successfully.</p>
                    <p>Thank you for using our platform.</p>
                    <p style="color: #666;">If you didn't request this verification, please ignore this email.</p>
                </div>
                <div>
                <p>Thank you for registering yourself in our online examination platform QuestEd as a ${userType}.</p>
                </div>
            `
        };
    await sgMail.send(msg);

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
