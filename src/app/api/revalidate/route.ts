/**
 * On-demand revalidation endpoint called by a Sanity webhook.
 *
 * Set up in Sanity → your project → API → Webhooks:
 *   URL:     https://<your-vercel-domain>/api/revalidate
 *   Dataset: production
 *   Trigger: Create, Update, Delete
 *   Filter:  _type == "artwork"
 *   HTTP method: POST
 *   Headers:  x-revalidate-secret: <value of SANITY_REVALIDATE_SECRET>
 *
 * Sanity sends the full document as the POST body, so `slug.current`
 * is available to revalidate the specific artwork page.
 */

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

type SanityWebhookBody = {
  _id?: string;
  _type?: string;
  slug?: { current?: string };
};

export async function POST(request: Request) {
  const incomingSecret = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret) {
    logger.error("revalidate.secret_not_configured");
    return new Response("Server misconfiguration", { status: 500 });
  }

  if (!incomingSecret || incomingSecret !== expectedSecret) {
    logger.warn("revalidate.unauthorized");
    return new Response("Unauthorized", { status: 401 });
  }

  let body: SanityWebhookBody = {};
  try {
    body = (await request.json()) as SanityWebhookBody;
  } catch {
    logger.warn("revalidate.invalid_body");
    return new Response("Invalid JSON body", { status: 400 });
  }

  const slug = body?.slug?.current;

  // Always revalidate the listing pages — a title/image/featured change
  // affects the homepage and gallery regardless of which artwork changed.
  revalidatePath("/");
  revalidatePath("/gallery");

  if (slug) {
    revalidatePath(`/artwork/${slug}`);
    logger.info("revalidate.artwork", { slug });
  } else {
    logger.warn("revalidate.no_slug_in_payload");
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? null });
}
