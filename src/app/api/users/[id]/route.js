import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/Student';
import { headers } from 'next/headers';

export async function GET(request, { params }) {
  try {
    // Verify authentication
    const headersList = headers();
    const authResponse = await fetch('http://quested.onrender.com/api/auth/verify', {
      headers: {
        cookie: headersList.get('cookie'),
      }
    });

    if (!authResponse.ok) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const authData = await authResponse.json();
    
    if (!authData.authenticated) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get user by ID
    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
