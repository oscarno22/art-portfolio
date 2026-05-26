export default function ContactPage() {
  return (
    <main>
      <header className="px-8 py-6 flex items-center justify-between border-b border-stone-200">
        <a href="/" className="font-serif text-xl tracking-wide text-stone-900">
          Dink Nolen III
        </a>
        <nav className="flex gap-8 text-sm text-stone-500">
          <a href="/#work" className="hover:text-stone-900 transition-colors">
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

      <div className="px-8 py-20 max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-5">
          Contact
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-tight mb-12">
          Get in touch
        </h1>

        <div className="space-y-6 text-stone-700 leading-relaxed">
          <p>
            Interested in a piece, have a question about the work, or just want
            to say hello — reach out directly by email.
          </p>
          <a
            href="mailto:dinknolen@gmail.com"
            className="inline-block text-stone-900 font-medium border-b border-stone-400 pb-0.5 hover:border-stone-900 transition-colors"
          >
            dinknolen@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}
