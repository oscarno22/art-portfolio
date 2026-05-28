import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Header from "@/components/Header";
import BuyButton from "@/components/BuyButton";
import ArtworkImage from "@/components/ArtworkImage";
import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";
import { artworkBySlugQuery, allArtworksQuery } from "@/sanity/lib/queries";

type Artwork = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: { _id: string; metadata: { dimensions: { width: number; height: number } } };
    alt?: string;
  };
  medium?: string;
  dimensions?: string;
  year?: number;
  category?: { title: string };
  description?: PortableTextBlock[];
  forSale?: boolean;
  price?: number;
  sold?: boolean;
};

export async function generateStaticParams() {
  const artworks: { slug: { current: string } }[] =
    await client.fetch(allArtworksQuery);
  return artworks.map((a) => ({ slug: a.slug.current }));
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork: Artwork | null = await client.fetch(artworkBySlugQuery, {
    slug,
  });

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
          className="text-sm text-stone-400 hover:text-stone-700 transition-colors mb-12 inline-block"
        >
          ← Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            {artwork.mainImage ? (
              <ArtworkImage
                image={artwork.mainImage}
                title={artwork.title}
                width={artwork.mainImage.asset?.metadata?.dimensions?.width ?? 900}
                height={artwork.mainImage.asset?.metadata?.dimensions?.height ?? 900}
              />
            ) : (
              <div className="aspect-square bg-stone-100 flex items-center justify-center text-stone-300 text-sm italic">
                No image yet
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            {artwork.category && (
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
                {artwork.category.title}
              </p>
            )}
            <h1 className="font-serif text-4xl text-stone-900 mb-3">
              {artwork.title}
            </h1>
            {meta && <p className="text-stone-500 text-sm mb-8">{meta}</p>}

            {artwork.description && artwork.description.length > 0 && (
              <div className="text-stone-700 text-sm leading-relaxed space-y-3 mb-10">
                <PortableText value={artwork.description} />
              </div>
            )}

            {artwork.forSale && !artwork.sold && artwork.price && (
              <div className="border-t border-stone-200 pt-6">
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                  Available
                </p>
                <p className="font-serif text-3xl text-stone-900">
                  ${artwork.price.toLocaleString()}
                </p>
                <BuyButton slug={artwork.slug.current} price={artwork.price} />
                <p className="mt-3 text-xs text-stone-500">
                  Shipping or local pickup arranged after purchase.
                </p>
              </div>
            )}

            {artwork.sold && (
              <div className="border-t border-stone-200 pt-6">
                <p className="text-xs uppercase tracking-widest text-stone-400">
                  Sold
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
