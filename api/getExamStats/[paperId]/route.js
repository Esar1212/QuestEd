import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Solution from "../../../../../models/Solution";

export async function GET(request, { params }) {
    try {
        await dbConnect();
        
        const paperId = params.paperId;
        const userId = request.headers.get('userId'); // Get userId from request headers

        if (!paperId || !userId) {
            return NextResponse.json(
                { error: 'Missing required parameters' }, 
                { status: 400 }
            );
        }

        const solution = await Solution.findOne({
            paperId: paperId,
            studentId: userId
        }).sort({ submittedAt: -1 });

        if (!solution) {
            return NextResponse.json(
                { error: 'No exam results found' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(solution);
    } catch (error) {
        console.error('Get exam stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exam stats' },
            { status: 500 }
        );
    }
}