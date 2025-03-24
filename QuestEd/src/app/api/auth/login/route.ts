import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Debug log (remove in production)
    console.log('Login attempt:', {
      providedEmail: validatedData.email,
      providedPassword: validatedData.password,
      expectedEmail: process.env.ADMIN_EMAIL,
      expectedPassword: process.env.ADMIN_PASSWORD,
    });

    // Check if it's an admin login attempt
    if (validatedData.email === process.env.ADMIN_EMAIL) {
      // Verify admin password
      if (validatedData.password === process.env.ADMIN_PASSWORD) {
        // Set admin token in cookies
        cookies().set('admin_token', 'admin_authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return NextResponse.json({
          success: true,
          message: 'Admin login successful',
          role: 'admin',
        });
      }
    }

    // If not admin or invalid credentials
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid email or password',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
} 