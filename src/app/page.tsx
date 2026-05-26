import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { featuredArtworksQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type Artwork = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: object; alt?: string };
  medium?: string;
  year?: number;
};

export default async function Home() {
  const artworks: Artwork[] = await client.fetch(featuredArtworksQuery);

  return (
    <main>
      <header className="px-8 py-6 flex items-center justify-between border-b border-stone-200">
        <span className="font-serif text-xl tracking-wide text-stone-900">
          Dink Nolen III
        </span>
        <nav className="flex gap-8 text-sm text-stone-500">
          <a href="/gallery" className="hover:text-stone-900 transition-colors">
            Work
          </a>
          <a href="/about" className="hover:text-stone-900 transition-colors">
            About
          </a>
          <a href="/contact" className="hover:text-stone-900 transition-colors">
            Contact
          </a>
        </nav>
      </header>

      <section className="px-8 pt-24 pb-16 text-center">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-5">
          Charlotte, NC
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-stone-900 leading-tight max-w-2xl mx-auto">
          From the
          <br />
          heart of the Carolinas
        </h1>
      </section>

      <section id="work" className="px-8 pb-24 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-8">
          Featured Work
        </p>
        {artworks.length === 0 ? (
          <p className="text-stone-400 text-center py-16">
            No featured works yet.
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
      </section>
    </main>
  );
}
