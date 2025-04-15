import { NextResponse } from 'next/server';
import QuestionPaper from '../../../../../models/QuestionPaper';
import dbConnect from '../../../../../lib/dbConnect';
import { headers } from 'next/headers';

export async function GET(request) {
    try {
        const headersList = await headers();
        
        // Verify authentication
        const authRes = await fetch('/api/auth/verify', {
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

        // Extract paper ID from URL
        const id = request.nextUrl.pathname.split('/').pop();
        
        if (!id) {
            return NextResponse.json(
                { message: 'Paper ID is required' },
                { status: 400 }
            );
        }

        // Fetch the specific paper
        const paper = await QuestionPaper.findById(id);

        if (!paper) {
            return NextResponse.json(
                { message: 'Question paper not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(paper);
    } catch (error) {
        console.error('Error fetching question paper:', error);
        return NextResponse.json(
            { message: 'Failed to fetch question paper' },
            { status: 500 }
        );
    }
}
