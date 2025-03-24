import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Define the base user schema
const baseUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['student', 'teacher']),
});

// Define the student-specific schema
const studentSchema = baseUserSchema.extend({
  userType: z.literal('student'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  class: z.string().min(1, 'Class is required'),
  studentSubject: z.string().min(1, 'Subject is required'),
});

// Define the teacher-specific schema
const teacherSchema = baseUserSchema.extend({
  userType: z.literal('teacher'),
  subject: z.string().min(1, 'Subject is required'),
  qualification: z.string().min(1, 'Qualification is required'),
});

// Combined schema using discriminated union
const registerSchema = z.discriminatedUnion('userType', [
  studentSchema,
  teacherSchema,
]);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body against our schema
    const validatedData = registerSchema.parse(body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Prepare the user data based on user type
    const userData = {
      ...validatedData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Here you would typically save the user to your database
    // TODO: Add your database logic here

    // Remove password from response
    const { password, ...userWithoutPassword } = userData;

    return NextResponse.json(
      {
        message: `${validatedData.userType} registered successfully`,
        user: userWithoutPassword,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 