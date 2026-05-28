import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const MIN_DOLLARS = 1;
const MAX_DOLLARS = 10_000;

export async function POST(request: Request) {
  const { amount } = (await request.json().catch(() => ({}))) as {
    amount?: number;
  };

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount < MIN_DOLLARS ||
    amount > MAX_DOLLARS
  ) {
    logger.warn("donate.invalid_amount");
    return NextResponse.json(
      { error: `Amount must be between $${MIN_DOLLARS} and $${MAX_DOLLARS}.` },
      { status: 400 }
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: "Support Dink's work",
              description: "A contribution to the artist — thank you.",
            },
          },
        },
      ],
      metadata: { type: "donation" },
      success_url: `${siteUrl}/checkout/donate-success`,
      cancel_url: `${siteUrl}/contact`,
    });

    logger.info("donate.session_created", {
      amountTotal: amount,
      currency: "usd",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("donate.session_failed", { error: message });
    return NextResponse.json(
      { error: "Could not start donation checkout." },
      { status: 500 }
    );
  }
}
