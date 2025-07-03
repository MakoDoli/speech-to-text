import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

import { OpenAI } from "openai";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { join } from "path";
import { tmpdir } from "os";
import fs, { writeFileSync } from "fs";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  // checking user
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // getting file from request
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // Upload to supabase storage bucket
  const fileName = `${Date.now()}-${file.name}`;
  const { error: storageError } = await supabase.storage
    .from("recordings") // storage bucket name in supabase
    .upload(`voice/${userId}/${fileName}`, fileBuffer, {
      contentType: file.type,
    });

  if (storageError) {
    console.error("Storage error", storageError);
    return NextResponse.json(
      { error: "Storage upload failed" },
      { status: 500 }
    );
  }
  // create file url for recording
  const { data: publicUrlData } = supabase.storage
    .from("recordings")
    .getPublicUrl(`voice/${userId}/${fileName}`);

  const fileUrl = publicUrlData.publicUrl;

  // create temporary file path and send to openai for transcription
  const tempFilePath = join(tmpdir(), `recording-${Date.now()}.webm`);
  writeFileSync(tempFilePath, fileBuffer);
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(tempFilePath),
    model: "whisper-1",
    response_format: "text",
  });

  // save recording with transcript to supabase

  const voiceUser = await prisma.voiceUser.findUnique({
    where: { clerkId: userId },
  });
  if (!voiceUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  await prisma.recording.create({
    data: {
      userId: voiceUser.id,
      fileUrl,
      transcript: transcription,
    },
  });

  return NextResponse.json({ success: true, fileUrl, transcription });
}
