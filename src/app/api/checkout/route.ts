import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Voice Scribe - Unlimited Recordings",
              images: ["https://i.imgur.com/XnD3M5u.png"],
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      metadata: {
        clerkId: userId,
        source: "voice-scribe",
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error", err);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
