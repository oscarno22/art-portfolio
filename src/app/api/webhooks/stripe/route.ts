import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { writeClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    logger.error("webhook.missing_signature_or_secret");
    return new Response("Missing signature", { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    logger.error("webhook.signature_invalid", { error: message });
    return new Response(`Webhook error: ${message}`, { status: 400 });
  }

  logger.info("webhook.event_received", { eventType: event.type });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const artworkId = session.metadata?.artworkId;
    const slug = session.metadata?.slug;

    logger.info("webhook.checkout_completed", {
      sessionId: session.id,
      artworkId,
      slug,
      amountTotal: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency,
      paymentStatus: session.payment_status,
    });

    if (!artworkId) {
      logger.warn("webhook.missing_artwork_id", { sessionId: session.id });
      return NextResponse.json({ received: true });
    }

    try {
      await writeClient
        .patch(artworkId)
        .set({ sold: true, forSale: false })
        .commit();

      logger.info("webhook.artwork_marked_sold", { artworkId, slug });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error("webhook.sanity_patch_failed", {
        artworkId,
        slug,
        error: message,
      });
      // Return 500 so Stripe retries the webhook.
      return new Response("Sanity patch failed", { status: 500 });
    }

    if (slug) {
      revalidatePath(`/artwork/${slug}`);
      revalidatePath("/");
      revalidatePath("/gallery");
      logger.info("webhook.cache_revalidated", { slug });
    } else {
      logger.warn("webhook.missing_slug_for_revalidation", { artworkId });
    }
  }

  return NextResponse.json({ received: true });
}
