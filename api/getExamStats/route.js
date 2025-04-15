import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Solution from '../../../../../models/Solution';

export async function GET(request) {
    try {
        // Extract paperId from URL pathname
        const url = new URL(request.url);
        const paperId = url.pathname.split('/').pop();

        // Connect to database
        await dbConnect();

        // Fetch all solutions for the given paperId
        const solutions = await Solution.find({ paperId: paperId });

        if (!solutions) {
            return NextResponse.json(
                { error: "No solutions found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { solutions },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
