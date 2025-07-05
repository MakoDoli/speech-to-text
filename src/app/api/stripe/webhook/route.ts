import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No Stripe signature" }, { status: 400 });
  }

  // get body from request
  const bodyBuffer = await req.arrayBuffer();
  const body = Buffer.from(bodyBuffer);

  // trigger stripe webhook
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook error ", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const clerkId = session.metadata?.clerkId;
    if (!clerkId) {
      console.error("Missing clerkId");
      return NextResponse.json({ error: "Missing clerk id" }, { status: 400 });
    }
    //update user in database as paid
    await prisma.voiceUser.update({
      where: { clerkId: clerkId },
      data: { isPaid: true },
    });
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
