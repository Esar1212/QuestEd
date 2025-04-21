import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Solution from '../../../../models/Solution';
import { headers } from 'next/headers';

export async function GET(request) {
  try {
    // Get auth data from verify endpoint
    const headersList = await headers();
    const authResponse = await fetch('https://quested.onrender.com/api/auth/verify', {
        headers: {
            cookie: headersList.get('cookie'),
          }
    });

    if (!authResponse.ok) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const authData = await authResponse.json();
    
    if (!authData.authenticated || !authData.userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Find solutions for this student
    const solutions = await Solution.find({ 
      studentId: authData.userId 
    }).sort({ createdAt: -1 });

    return NextResponse.json(solutions);

  } catch (error) {
    console.error('Error checking completed papers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
