import { NextResponse } from 'next/server';
import dbConnect from "../../../../lib/dbConnect";
import QuestionPaper from "../../../../models/QuestionPaper";
import { headers } from 'next/headers';

export async function GET(request) {
  try {
    const headersList = await headers();
    
    // Forward all headers from the original request to verify endpoint
    const authRes = await fetch('https://quested.onrender.com/api/auth/verify', {
      headers: {
        cookie: headersList.get('cookie'),
      }
    });

    const authData = await authRes.json();

    if (!authRes.ok || !authData.authenticated) {
      return NextResponse.json(
        { message: 'Unauthorized access' }, 
        { status: 401 }
      );
    }

    await dbConnect();

    // Query papers for the specific subject
    const papers = await QuestionPaper.find({ 
      subject: authData.subject 
    }).sort({ createdAt: -1 });

    return NextResponse.json(papers);
  } catch (error) {
    console.error('Error fetching question papers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch question papers' }, 
      { status: 500 }
    );
  }
}
