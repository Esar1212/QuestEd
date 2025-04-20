import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Video from "../../../../models/Video";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const video = await Video.create({
            title: body.title,
            link: body.link,
            subject: body.subject,
            teacherId: body.teacherId,
            uploadedAt: new Date()
        });

        return NextResponse.json({ success: true, video }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}