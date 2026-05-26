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
  mainImage?: { asset: object; alt?: string };
  medium?: string;
  year?: number;
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <a
                key={artwork._id}
                href={`/artwork/${artwork.slug.current}`}
                className="group"
              >
                <div className="aspect-[4/5] bg-stone-100 overflow-hidden mb-4">
                  {artwork.mainImage ? (
                    <Image
                      src={urlFor(artwork.mainImage)
                        .width(600)
                        .height(750)
                        .url()}
                      alt={artwork.mainImage.alt ?? artwork.title}
                      width={600}
                      height={750}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm italic">
                      No image yet
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
