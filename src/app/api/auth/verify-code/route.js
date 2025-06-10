import { NextResponse } from 'next/server';
import otpStore from '../../../../../lib/otpStore';

export async function POST(request) {
    try {
        const { email, otp } = await request.json();
        const record = otpStore.get(email);

        if (!record) {
            return NextResponse.json({ error: 'Code not found' }, { status: 400 });
        }
        // Check expiry
        if (Date.now() > record.expiresAt) {
            otpStore.delete(email); // Optional: remove expired OTP
            return NextResponse.json({ error: 'Code expired' }, { status: 400 });
        }

        if (String(record.otp) !== String(otp)) {
            return NextResponse.json({ error: 'Invalid Code' }, { status: 400 });
        }

        otpStore.delete(email); // Optional: remove OTP after successful verification
        return NextResponse.json({ message: 'Code verified' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
