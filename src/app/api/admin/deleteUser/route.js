import { NextResponse } from 'next/server';
import Student from '../../../../../models/Student';
import Solution from '../../../../../models/Solution';
import Teacher from '../../../../../models/Teacher';
import dbConnect from '../../../../../lib/dbConnect';

export async function DELETE(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');
        const userType = searchParams.get('type');

        if (!userId || !userType) {
            return NextResponse.json({ error: 'Missing user ID or type' }, { status: 400 });
        }

        let deletedUser;
        if (userType === 'student') {
            deletedUser = await Student.findByIdAndDelete(userId);
            await Solution.deleteMany({ studentId: userId });

        } else if (userType === 'teacher') {
            deletedUser = await Teacher.findByIdAndDelete(userId);
        } else {
            return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
        }

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'User deleted successfully',
            user: {
                id: deletedUser._id,
                name: deletedUser.fullName,
                email: deletedUser.email,
                type: userType
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
