import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import otpStore from '../../../../../lib/otpStore';
// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
    try {
        const { email,otp } = await request.json();
        const expiresAt = Date.now()+5*60*1000;
        otpStore.set(email,{otp,expiresAt});
        // Validate input
        if (!email||!otp) {
            return NextResponse.json(
                { error: 'Email and otp is required' },
                { status: 400 }
            );
        }

        // Email template
        const msg = {
            to: email,
            from: 'shubhradeeproy343@gmail.com', // Must be verified in SendGrid
            subject: 'OTP for QuestEd Registration',
            text: `Your OTP for QuestEd registration is: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nIf you didn't request this OTP, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2a5298;">QuestEd Registration OTP</h2>
                    <p>Your OTP for QuestEd registration is:</p>
                    <h1 style="color: #2a5298; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p style="color: #666;">If you didn't request this OTP, please ignore this email.</p>
                </div>
                <div>
                <p>Thank you for registering yourself in our online examination platform QuestEd.Please stay tuned for upcoming updates.</p>
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
