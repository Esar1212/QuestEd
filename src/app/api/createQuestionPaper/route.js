import { NextResponse } from 'next/server';
import dbConnect from "../../../../lib/dbConnect";  // Fix the import path
import QuestionPaper from "../../../../models/QuestionPaper";

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, classStream, subject, timeLimit, questions, totalMarks } = body;  // Add totalMarks to destructuring

    // Basic validation
    if (!title || !classStream || !subject || !timeLimit || !questions.length || !totalMarks) {
      return NextResponse.json(
        { message: "All fields are required" }, 
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Create a new QuestionPaper document
    const newQuestionPaper = new QuestionPaper({
      title,
      subject,
      timeLimit: Number(timeLimit),
      totalMarks: Number(totalMarks),  // Ensure totalMarks is a number
      classStream,
      questions,
      createdAt: new Date(),
    });

    // Save to database
    await newQuestionPaper.save();

    return NextResponse.json(
      { message: "Question Paper Created", id: newQuestionPaper._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question paper:", error);
    // Return more specific error message
    return NextResponse.json(
      { 
        message: "Internal Server Error", 
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}