import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { freshClient } from "@/sanity/lib/client";
import { artworkForCheckoutQuery } from "@/sanity/lib/queries";

export const runtime = "nodejs";

type CheckoutArtwork = {
  _id: string;
  title: string;
  price?: number;
  status?: "display" | "forSale" | "sold";
  imageUrl?: string;
};

export async function POST(request: Request) {
  const { slug } = (await request.json().catch(() => ({}))) as {
    slug?: string;
  };

  if (!slug) {
    logger.warn("checkout.missing_slug");
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  // Deliberately a non-CDN read: a cached `status` could let someone buy a
  // piece that has already sold.
  const artwork = await freshClient.fetch<CheckoutArtwork | null>(
    artworkForCheckoutQuery,
    { slug }
  );

  if (!artwork) {
    logger.warn("checkout.artwork_not_found", { slug });
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }

  if (artwork.status !== "forSale" || !artwork.price) {
    logger.warn("checkout.artwork_unavailable", {
      slug,
      artworkId: artwork._id,
      artworkStatus: artwork.status,
    });
    return NextResponse.json(
      { error: "Artwork is not available for purchase" },
      { status: 409 }
    );
  }

  logger.info("checkout.session_creating", {
    slug,
    artworkId: artwork._id,
    amountTotal: artwork.price,
    currency: "usd",
  });

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
            unit_amount: Math.round(artwork.price * 100),
            product_data: {
              name: artwork.title,
              images: artwork.imageUrl ? [artwork.imageUrl] : undefined,
            },
          },
        },
      ],
      metadata: {
        artworkId: artwork._id,
        slug,
        title: artwork.title,
      },
      // Stripe collects the buyer's email during checkout and sends them a receipt
      // automatically if "Successful payments" email is enabled in the Stripe Dashboard
      // (Dashboard → Settings → Emails).
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/artwork/${slug}`,
    });

    logger.info("checkout.session_created", {
      slug,
      artworkId: artwork._id,
      sessionId: session.id,
      amountTotal: artwork.price,
      currency: "usd",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("checkout.session_failed", {
      slug,
      artworkId: artwork._id,
      error: message,
    });
    return NextResponse.json(
      { error: "Checkout could not start" },
      { status: 500 }
    );
  }
}
