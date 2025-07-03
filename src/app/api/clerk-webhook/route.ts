import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Set this to your Clerk Webhook secret
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  if (!CLERK_WEBHOOK_SECRET)
    throw new Error("Missing CLERK_WEBHOOK_SECRET env variable");
  const svix_id = req.headers.get("svix-id");
  const svix_signature = req.headers.get("svix-signature");
  const svix_timestamp = req.headers.get("svix-timestamp");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("No svix headers found", { status: 400 });
  }
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const { id: clerkId } = data;

    const existingUser = await prisma.voiceUser.findUnique({
      where: { clerkId },
    });

    // Create user in Supabase via Prisma
    if (!existingUser) {
      await prisma.voiceUser.create({
        data: {
          clerkId,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
