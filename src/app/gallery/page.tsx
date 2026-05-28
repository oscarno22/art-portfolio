import Image from "next/image";
import Header from "@/components/Header";
import { client } from "@/sanity/lib/client";
import {
  allArtworksQuery,
  artworksByCategoryQuery,
  allCategoriesQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type Artwork = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: { _id: string; metadata: { dimensions: { width: number; height: number } } };
    alt?: string;
  };
  medium?: string;
  year?: number;
  sold?: boolean;
  forSale?: boolean;
  price?: number;
};

type Category = {
  _id: string;
  title: string;
  slug: { current: string };
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [artworks, categories]: [Artwork[], Category[]] = await Promise.all([
    category
      ? client.fetch(artworksByCategoryQuery, { category })
      : client.fetch(allArtworksQuery),
    client.fetch(allCategoriesQuery),
  ]);

  return (
    <main>
      <Header />

      <div className="px-8 py-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <p className="text-xs uppercase tracking-widest text-stone-400">
            Work
          </p>

          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <a
                href="/gallery"
                className={`text-xs uppercase tracking-widest px-4 py-1.5 border transition-colors ${
                  !category
                    ? "border-stone-900 text-stone-900"
                    : "border-stone-300 text-stone-400 hover:border-stone-500 hover:text-stone-700"
                }`}
              >
                All
              </a>
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`/gallery?category=${cat.slug.current}`}
                  className={`text-xs uppercase tracking-widest px-4 py-1.5 border transition-colors ${
                    category === cat.slug.current
                      ? "border-stone-900 text-stone-900"
                      : "border-stone-300 text-stone-400 hover:border-stone-500 hover:text-stone-700"
                  }`}
                >
                  {cat.title}
                </a>
              ))}
            </div>
          )}
        </div>

        {artworks.length === 0 ? (
          <p className="text-stone-400 text-center py-24">
            No works in this category yet.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-8">
            {artworks.map((artwork) => {
              const w = artwork.mainImage?.asset?.metadata?.dimensions?.width ?? 600;
              const h = artwork.mainImage?.asset?.metadata?.dimensions?.height ?? 600;
              return (
                <a
                  key={artwork._id}
                  href={`/artwork/${artwork.slug.current}`}
                  className="group block break-inside-avoid mb-8"
                >
                  <div className="relative bg-stone-100 overflow-hidden mb-3">
                    {artwork.mainImage ? (
                      <Image
                        src={urlFor(artwork.mainImage).width(700).url()}
                        alt={artwork.mainImage.alt ?? artwork.title}
                        width={w}
                        height={h}
                        className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="aspect-square flex items-center justify-center text-stone-300 text-sm italic">
                        No image yet
                      </div>
                    )}
                    {artwork.sold && (
                      <div className="absolute inset-0 bg-stone-900/40 flex items-end">
                        <span className="m-3 px-2.5 py-1 bg-stone-900 text-stone-100 text-[10px] uppercase tracking-widest">
                          Sold
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-stone-900">{artwork.title}</p>
                  {(artwork.medium || artwork.year) && (
                    <p className="text-sm text-stone-500 mt-0.5">
                      {[artwork.medium, artwork.year].filter(Boolean).join(", ")}
                    </p>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
