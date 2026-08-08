import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Header from "@/components/Header";
import BuyButton from "@/components/BuyButton";
import ArtworkImage from "@/components/ArtworkImage";
import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { artworkBySlugQuery, allArtworksQuery } from "@/sanity/lib/queries";

type Artwork = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: {
      _id: string;
      metadata: { dimensions: { width: number; height: number } };
    };
    alt?: string;
  };
  medium?: string;
  dimensions?: string;
  year?: number;
  category?: { title: string };
  description?: PortableTextBlock[];
  status?: "display" | "forSale" | "sold";
  price?: number;
};

export async function generateStaticParams() {
  // Plain client, not sanityFetch: generateStaticParams runs at build time
  // where the Live subscription has no meaning, and it must read published
  // content only.
  const artworks: { slug: { current: string } }[] = await client.fetch(
    allArtworksQuery,
    {},
    { perspective: "published" }
  );
  return artworks.map((a) => ({ slug: a.slug.current }));
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: artworkBySlugQuery,
    params: { slug },
  });
  const artwork = data as Artwork | null;

  if (!artwork) notFound();

  const meta = [artwork.medium, artwork.dimensions, artwork.year]
    .filter(Boolean)
    .join(" · ");

  return (
    <main>
      <Header />

      <div className="px-8 py-12 max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-sm text-purple hover:text-magenta transition-colors mb-12 inline-block"
        >
          ← Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            {artwork.mainImage ? (
              <ArtworkImage
                image={artwork.mainImage}
                title={artwork.title}
                width={
                  artwork.mainImage.asset?.metadata?.dimensions?.width ?? 900
                }
                height={
                  artwork.mainImage.asset?.metadata?.dimensions?.height ?? 900
                }
              />
            ) : (
              <div className="sharpie aspect-square bg-paper-dim flex items-center justify-center text-navy/40 text-sm italic">
                No image yet
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            {artwork.category && (
              <p className="text-xs uppercase tracking-widest text-purple mb-4">
                {artwork.category.title}
              </p>
            )}
            <h1 className="font-serif text-4xl text-ink mb-3">
              {artwork.title}
            </h1>
            {meta && <p className="text-navy/60 text-sm mb-8">{meta}</p>}

            {artwork.description && artwork.description.length > 0 && (
              <div className="text-navy/85 text-sm leading-relaxed space-y-3 mb-10">
                <PortableText value={artwork.description} />
              </div>
            )}

            {/* Availability. Every status renders something — a piece that is
                for sale without a price falls back to an inquiry rather than
                silently showing nothing. */}
            {artwork.status === "sold" && (
              <div className="border-t-2 border-paper-dim pt-6">
                <p className="text-xs uppercase tracking-widest text-magenta">
                  Sold
                </p>
              </div>
            )}

            {artwork.status === "forSale" && artwork.price ? (
              <div className="border-t-2 border-paper-dim pt-6">
                <p className="text-xs uppercase tracking-widest text-teal mb-2">
                  Available
                </p>
                <p className="font-serif text-3xl text-ink">
                  ${artwork.price.toLocaleString()}
                </p>
                <BuyButton slug={artwork.slug.current} price={artwork.price} />
                <p className="mt-3 text-xs text-navy/60">
                  Shipping or local pickup arranged after purchase.
                </p>
              </div>
            ) : null}

            {artwork.status === "forSale" && !artwork.price ? (
              <div className="border-t-2 border-paper-dim pt-6">
                <p className="text-xs uppercase tracking-widest text-teal mb-2">
                  Available
                </p>
                <p className="font-serif text-3xl text-ink">Price on request</p>
                <Link
                  href="/contact"
                  className="sharpie mt-4 inline-block px-8 py-3 bg-navy text-paper text-sm tracking-wide uppercase hover:bg-magenta transition-colors"
                >
                  Inquire
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
