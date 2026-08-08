import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { Resend } from "resend";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { writeClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";

// Lazily instantiated so the module loads during build without the env var.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

async function sendSaleNotification(
  session: Stripe.Checkout.Session,
  artworkTitle: string,
  slug: string | undefined
) {
  const artistEmail = process.env.ARTIST_EMAIL;
  if (!artistEmail || !process.env.RESEND_API_KEY) {
    logger.warn("webhook.email_skipped_missing_config");
    return;
  }

  const amount = session.amount_total ? session.amount_total / 100 : null;
  const buyerEmail = session.customer_details?.email ?? "unknown";
  const buyerName = session.customer_details?.name ?? "unknown";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const artworkUrl = slug ? `${siteUrl}/artwork/${slug}` : siteUrl;

  const priceDisplay =
    amount != null ? `$${amount.toLocaleString("en-US")}` : "(unknown price)";

  try {
    const { error } = await getResend().emails.send({
      from: "Dink's Gallery <onboarding@resend.dev>",
      to: artistEmail,
      subject: `🎨 "${artworkTitle}" just sold for ${priceDisplay}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #10132E;">
          <h1 style="font-size: 22px; margin: 0 0 24px;">A piece sold!</h1>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #E4E0EE; color: #1E2456; font-size: 13px; width: 120px;">Artwork</td><td style="padding: 8px 0; border-bottom: 1px solid #E4E0EE; font-size: 14px;">${artworkTitle}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #E4E0EE; color: #1E2456; font-size: 13px;">Price</td><td style="padding: 8px 0; border-bottom: 1px solid #E4E0EE; font-size: 14px;">${priceDisplay}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #E4E0EE; color: #1E2456; font-size: 13px;">Buyer</td><td style="padding: 8px 0; border-bottom: 1px solid #E4E0EE; font-size: 14px;">${buyerName} (${buyerEmail})</td></tr>
          </table>
          <p style="font-size: 13px; color: #1E2456; margin: 0 0 8px;">
            The piece has been marked as sold on the site automatically.
          </p>
          <a href="${artworkUrl}" style="font-size: 13px; color: #6D3FD1;">View artwork →</a>
        </div>
      `,
    });
    if (error) {
      logger.error("webhook.email_failed", {
        error: error.message,
        artworkTitle,
      });
    } else {
      logger.info("webhook.email_sent", { artworkTitle });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("webhook.email_exception", {
      error: message,
      artworkTitle: artworkTitle,
    });
  }
}

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
    const artworkTitle = session.metadata?.title ?? "Untitled";
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
      await writeClient.patch(artworkId).set({ status: "sold" }).commit();

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

    // Send seller notification email (non-fatal — don't block the response).
    await sendSaleNotification(session, artworkTitle, slug);

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
