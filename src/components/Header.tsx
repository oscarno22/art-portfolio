import Link from "next/link";

export default function Header() {
  return (
    <header className="px-6 sm:px-8 py-4 sm:py-6 flex flex-wrap items-center justify-between gap-y-3 border-b border-stone-200">
      <Link
        href="/"
        className="font-serif text-lg sm:text-xl tracking-wide text-stone-900 hover:text-stone-600 transition-colors"
      >
        Dink Nolen III
      </Link>
      <nav className="flex gap-6 sm:gap-8 text-sm text-stone-500">
        <Link href="/gallery" className="hover:text-stone-900 transition-colors">
          Work
        </Link>
        <Link href="/about" className="hover:text-stone-900 transition-colors">
          About
        </Link>
        <Link
          href="/contact"
          className="hover:text-stone-900 transition-colors"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
