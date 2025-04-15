import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Check if it's an admin login attempt
    if (validatedData.email === process.env.ADMIN_EMAIL) {
      // Verify admin password
      if (validatedData.password === process.env.ADMIN_PASSWORD) {
        // Return success with token
        return NextResponse.json({
          success: true,
          message: 'Login successful',
          role: 'admin',
          token: 'admin_authenticated'
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