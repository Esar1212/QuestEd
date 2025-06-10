import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import otpStore from '../../../../../lib/otpStore';
import dbConnect from '../../../../../lib/dbConnect';
import Student from '../../../../../models/Student';
import Teacher from '../../../../../models/Teacher';
// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
    try {
        const { email, userType, otp } = await request.json();
        if (!email || !otp || !userType) {
            return NextResponse.json(
                { error: 'email, user type, and otp are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        let userExists = false;
        if (userType === 'student') {
            userExists = await Student.exists({ email });
        } else if (userType === 'teacher') {
            userExists = await Teacher.exists({ email });
        }

        if (!userExists) {
            return NextResponse.json(
                { error: 'No user found with this email and user type' },
                { status: 404 }
            );
        }

        const expiresAt = Date.now() + 5 * 60 * 1000;
        otpStore.set(email, { userType, otp, expiresAt });

        // Email template
        const msg = {
            to: email,
            from: 'shubhradeeproy343@gmail.com', // Must be verified in SendGrid
            subject: 'Verification Code for QuestEd Login',
            text: `Your Verification Code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this verification, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2a5298;">QuestEd</h2>
                    <p>Your Verification Code is:</p>
                    <h1 style="color: #2a5298; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 5 minutes.</p>
                    <p style="color: #666;">If you didn't request this verification, please ignore this email.</p>
                </div>
                <div>
                <p>Thank you for registering yourself in our online examination platform QuestEd as a ${userType}.</p>
                <p>On entering this code on the screen within 5 minutes, you will be securely redirected to reset password page.</p>
                </div>
            `
        };

        // Send email
        await sgMail.send(msg);

        return NextResponse.json(
            { message: 'OTP sent successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
