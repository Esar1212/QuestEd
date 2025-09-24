import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/Student';

export async function GET(request, { params }) {
  try {
    // Validate and sanitize the ID parameter
    const userId = String(params?.id || '');
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

   
    await dbConnect();

    // Get user by ID with proper type checking
    const user = await User.findById(userId).exec();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
    
