import { NextResponse } from 'next/server';
import Student from '../../../../../models/Student';
import Teacher from '../../../../../models/Teacher';
import dbConnect from '../../../../../lib/dbConnect'; 

export async function GET(request) {
    try {

        // Connect to database
        await dbConnect();  // Use the default export

        // Fetch all students and teachers concurrently
        const [students, teachers] = await Promise.all([
            Student.find({}).select('-password'),
            Teacher.find({}).select('-password')
        ]);

        // Format and combine the data
        const userData = {
            students: students.map(student => ({
                id: student._id,
                name: student.fullName,
                email: student.email,
                role: 'student',
                registrationDate: student.createdAt,
                studentType: student.studentType,
                classStream: student.stream || student.class,
                status: student.status || 'active'
            })),
            teachers: teachers.map(teacher => ({
                id: teacher._id,
                name: teacher.fullName,
                email: teacher.email,
                role: 'teacher',
                registrationDate: teacher.createdAt,
                subject: teacher.subject,
                status: teacher.status || 'active'
            }))
        };

        return NextResponse.json(userData, { status: 200 });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 }
        );
    }
}
