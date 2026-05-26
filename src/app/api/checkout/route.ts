import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { client } from "@/sanity/lib/client";
import { artworkForCheckoutQuery } from "@/sanity/lib/queries";

export const runtime = "nodejs";

type CheckoutArtwork = {
  _id: string;
  title: string;
  price?: number;
  forSale?: boolean;
  sold?: boolean;
  imageUrl?: string;
};

export async function POST(request: Request) {
  const { slug } = (await request.json().catch(() => ({}))) as {
    slug?: string;
  };

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const artwork = await client.fetch<CheckoutArtwork | null>(
    artworkForCheckoutQuery,
    { slug }
  );

  if (!artwork) {
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }

  if (!artwork.forSale || artwork.sold || !artwork.price) {
    return NextResponse.json(
      { error: "Artwork is not available for purchase" },
      { status: 409 }
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

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
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/artwork/${slug}`,
  });

  return NextResponse.json({ url: session.url });
}
