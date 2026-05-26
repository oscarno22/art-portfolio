export default function AboutPage() {
  return (
    <main>
      <header className="px-8 py-6 flex items-center justify-between border-b border-stone-200">
        <a href="/" className="font-serif text-xl tracking-wide text-stone-900">
          Dink Nolen III
        </a>
        <nav className="flex gap-8 text-sm text-stone-500">
          <a href="/#work" className="hover:text-stone-900 transition-colors">Work</a>
          <a href="/about" className="hover:text-stone-900 transition-colors">About</a>
          <a href="/contact" className="hover:text-stone-900 transition-colors">Contact</a>
        </nav>
      </header>

      <div className="px-8 py-20 max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-5">About</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-tight mb-12">
          Dink Nolen III
        </h1>

        <div className="space-y-6 text-stone-700 leading-relaxed">
          <p>
            Dink Nolen III is a mixed-media and painting artist based in Charlotte, North Carolina —
            a city that sits at a rare crossroads, close enough to feel the pull of the Appalachian
            mountains to the west and the Low Country coast to the east. That geography lives in his work.
          </p>
          <p>
            His practice spans painting, collage, and mixed media, drawing on the textures and rhythms
            of the Carolinas — raw and layered, unhurried but alive. He calls it Appalachian low-country
            punk: a sensibility that finds beauty in weathered things and honest places.
          </p>
          <p>
            His work is rooted in a simple belief: that where you&apos;re from shapes what you make,
            and that the heart of the Carolinas is worth putting on canvas.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-200">
          <p className="text-sm text-stone-400">Charlotte, NC</p>
        </div>
      </div>
    </main>
  );
}
