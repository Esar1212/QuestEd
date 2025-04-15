import Solution from '../../../../models/Solution';
import dbConnect from '../../../../lib/dbConnect';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Connect to database first
    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.studentId || !body.paperId || !body.questions) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new solution record
    const solution = await Solution.create({
      studentId: body.studentId,
      paperId: body.paperId,
      title: body.title,
      subject: body.subject,
      timeLimit: body.timeLimit,
      totalMarks: body.totalMarks,
      classStream: body.classStream,
      questions: body.questions,
      startedAt: body.startedAt,
      completedAt: body.completedAt,
      submittedAt: body.submittedAt,
      totalScore: body.totalScore,
      status: body.status
    });
    
    return NextResponse.json({ success: true, solution }, { status: 201 });

  } catch (error) {
    console.error('Submit exam error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit exam: ' + error.message },
      { status: 500 }
    );
  }
}
