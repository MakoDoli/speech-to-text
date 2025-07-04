import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const voiceUser = await prisma.voiceUser.findUnique({
    where: { clerkId: userId },
    include: {
      recordings: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!voiceUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    recordings: voiceUser.recordings.map((r) => ({
      id: r.id,
      fileUrl: r.fileUrl,
      transcript: r.transcript,
      createdAt: r.createdAt,
    })),
  });
}
