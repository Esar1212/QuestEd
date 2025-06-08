import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Student from '../../../../models/Student';
import Teacher from '../../../../models/Teacher';
const sg= require('@sendgrid/mail');

export async function POST(req) {
  await dbConnect();
  sg.setApiKey(process.env.SENDGRID_API_KEY);
 
  try {
    const { userType, ...data } = await req.json();

    // Validate role
    if (!['student', 'teacher'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "student" or "teacher"' },
        { status: 400 }
      );
    }

    // Role-specific validations
    if (userType === 'student') {
      if (data.studentType === 'school' && !data.class) {
        return NextResponse.json(
          { error: 'Class is required for school students' },
          { status: 400 }
        );
      }
      if (data.studentType === 'college' && (!data.stream || !data.year)) {
        return NextResponse.json(
          { error: 'Stream and year are required for college students' },
          { status: 400 }
        );
      }
    } else {
      if (!data.subject?.length || !data.qualification?.length) {
        return NextResponse.json(
          { error: 'Subject and qualification are required for teachers' },
          { status: 400 }
        );
      }
    }

    // Create user (password auto-hashed by model middleware)
    const Model = userType === 'student' ? Student : Teacher;
    const user = await Model.create(data);
    const mail={
      from: 'shubhradeeproy343@gmail.com',
      to: user.email,
      subject: 'Registration successful into QuestEd!' ,
      text: `Thank you, ${user.fullName} for getting registered in our online examination website QuestEd.
              Kindly stay tuned for upcoming updates`
    }
    await sg.send(mail);
    console.log("Email sent");
    // Return safe user data (exclude password)
    return NextResponse.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType,
      ...(userType === 'student' && { 
        studentType: user.studentType,
        ...(user.studentType === 'school' ? { class: user.class } : { 
          stream: user.stream, 
          year: user.year 
        })
      }),
      ...(userType === 'teacher' && {
        subject: user.subject,
        qualification: user.qualification
      })
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: error.code === 11000 
          ? 'Email already exists' 
          : 'Registration failed',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.message
        })
      },
      { status: 500 }
    );
  }
}
