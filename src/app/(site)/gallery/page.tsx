import Image from "next/image";
import Header from "@/components/Header";
import { sanityFetch } from "@/sanity/lib/live";
import {
  allArtworksQuery,
  artworksByCategoryQuery,
  allCategoriesQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { pillClass } from "@/components/styles";

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
  year?: number;
  status?: "display" | "forSale" | "sold";
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

  const [artworkResult, categoryResult] = await Promise.all([
    category
      ? sanityFetch({ query: artworksByCategoryQuery, params: { category } })
      : sanityFetch({ query: allArtworksQuery }),
    sanityFetch({ query: allCategoriesQuery }),
  ]);

  const artworks = (artworkResult.data ?? []) as Artwork[];
  const categories = (categoryResult.data ?? []) as Category[];

  return (
    <main>
      <Header />

      <div className="px-8 py-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <p className="text-xs uppercase tracking-widest text-purple">Work</p>

          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <a href="/gallery" className={pillClass(!category)}>
                All
              </a>
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`/gallery?category=${cat.slug.current}`}
                  className={pillClass(category === cat.slug.current)}
                >
                  {cat.title}
                </a>
              ))}
            </div>
          )}
        </div>

        {artworks.length === 0 ? (
          <p className="text-navy/60 text-center py-24">
            No works in this category yet.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-8">
            {artworks.map((artwork) => {
              const w =
                artwork.mainImage?.asset?.metadata?.dimensions?.width ?? 600;
              const h =
                artwork.mainImage?.asset?.metadata?.dimensions?.height ?? 600;
              return (
                <a
                  key={artwork._id}
                  href={`/artwork/${artwork.slug.current}`}
                  className="group block break-inside-avoid mb-10"
                >
                  <div className="sharpie relative bg-paper-dim overflow-hidden mb-3">
                    {artwork.mainImage ? (
                      <Image
                        src={urlFor(artwork.mainImage).width(700).url()}
                        alt={artwork.mainImage.alt ?? artwork.title}
                        width={w}
                        height={h}
                        className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="aspect-square flex items-center justify-center text-navy/40 text-sm italic">
                        No image yet
                      </div>
                    )}
                    {artwork.status === "sold" && (
                      <div className="absolute inset-0 bg-ink/50 flex items-end">
                        <span className="m-3 px-2.5 py-1 bg-magenta text-white text-[10px] uppercase tracking-widest">
                          Sold
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-ink group-hover:text-purple transition-colors">
                    {artwork.title}
                  </p>
                  {(artwork.medium || artwork.year) && (
                    <p className="text-sm text-navy/60 mt-0.5">
                      {[artwork.medium, artwork.year]
                        .filter(Boolean)
                        .join(", ")}
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
