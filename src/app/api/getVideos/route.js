import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Video from "../../../../models/Video";

export async function GET() {
    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ uploadedAt: -1 });
        
        return NextResponse.json({ 
            success: true, 
            videos 
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}