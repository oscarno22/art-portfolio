import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { featuredArtworksQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Header from "@/components/Header";

type Artwork = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: object; alt?: string };
  medium?: string;
  year?: number;
};

export default async function Home() {
  const { data } = await sanityFetch({ query: featuredArtworksQuery });
  const artworks = (data ?? []) as Artwork[];

  return (
    <main>
      <Header />

      <section className="band border-b-2 border-ink px-8 pt-20 pb-16 text-center">
        <p className="text-xs uppercase tracking-widest text-paper/70 mb-5">
          Matthews, NC
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-paper leading-tight max-w-2xl mx-auto">
          From the
          <br />
          heart of the Carolinas
        </h1>
      </section>

      <section id="work" className="px-8 py-20 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-purple mb-8">
          Featured Work
        </p>
        {artworks.length === 0 ? (
          <p className="text-navy/60 text-center py-16">
            No featured works yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {artworks.map((artwork, index) => (
              <a
                key={artwork._id}
                href={`/artwork/${artwork.slug.current}`}
                className="group"
              >
                <div className="sharpie aspect-[4/5] bg-paper-dim overflow-hidden mb-4">
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
                      priority={index === 0}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-navy/40 text-sm italic">
                      No image yet
                    </div>
                  )}
                </div>
                <p className="font-medium text-ink group-hover:text-purple transition-colors">
                  {artwork.title}
                </p>
                {(artwork.medium || artwork.year) && (
                  <p className="text-sm text-navy/60 mt-0.5">
                    {[artwork.medium, artwork.year].filter(Boolean).join(", ")}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
