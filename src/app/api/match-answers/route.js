import { NextResponse } from 'next/server';
import dbConnect from "../../../../lib/dbConnect";  
import QuestionPaper from "../../../../models/QuestionPaper";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: `${process.env.GOOGLE_GEMINI_API}` });
  try {
    const { question , answer, marks } = await request.json();
    if (!question || !answer) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }
    await dbConnect();
    const paper = await QuestionPaper.findOne({ "questions.question": question }, { "questions.$": 1 });
    
    if (!paper || !paper.questions || paper.questions.length === 0) {
      return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
    }

    const correctAnswer = paper.questions[0].answer;

    const SystemPrompt = `You are a helpful assistant that matches answers to questions.
    You are an exam evaluator. The following is the correct answer and a student's answer. Give a score between 0 and ${marks} based on how closely the student's answer matches the correct answer. Also give a short justification.
    Analyze the student's answer based on:
   - Conceptual understanding
   - Key points covered
   - Clarity and structure
   - Accuracy and depth of explanation
       Given Question:
      ${question}    

       Correct Answer:
       ${correctAnswer}

      Student's Answer:
      ${answer}

Respond in JSON format:
{
  "score": [0-${marks}],
  "reason": "[Brief Explanation. Please refer the student as 'You']"
}
Make sure the reason:
- Highlights both strengths and weaknesses
- Suggests specific improvements
- Is concise (2–3 sentences max)`;

   const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${SystemPrompt}`,
  });
    
    let score = null;
    let reason = null;
    try {
      const match = response.text && typeof response.text === "string"
        ? response.text.match(/\{[\s\S]*\}/)  
        : null;
      const parsed = match ? JSON.parse(match[0]) : response.text;
      score = parsed.score;
      reason = parsed.reason;
    } catch (e) {
      return NextResponse.json({ error: "Failed to parse model response", raw: response.text }, { status: 500 });
    } 


    return NextResponse.json({ score, reason });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}
