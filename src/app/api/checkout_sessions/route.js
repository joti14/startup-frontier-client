export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getUser } from "@/lib/api/session";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const user = await getUser();

    // Create Checkout Sessions from body params.
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1Tm50l1M1Z0gAaXRyn6q5twY",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard/founder/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });
    // console.log(session);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
