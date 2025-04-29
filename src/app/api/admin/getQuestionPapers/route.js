import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import QuestionPaper from "../../../../../models/QuestionPaper";

export async function GET() {
    try {
        await dbConnect();
        const questionPapers = await QuestionPaper.find({}).sort({ createdAt: -1 });
        
        return NextResponse.json({ 
            success: true, 
            questionPapers 
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
