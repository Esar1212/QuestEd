// src/app/api/db/test-insert/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Student from '../../../../../models/Student';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    
    const testStudent = await Student.create({
      fullName: "Test User",
      email: `test${Math.random().toString(36).substring(7)}@example.com`,
      password: "temp123",
      studentType: "school",
      class: "10A",
      organizationId: new mongoose.Types.ObjectId()
    });

    return NextResponse.json(testStudent);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}