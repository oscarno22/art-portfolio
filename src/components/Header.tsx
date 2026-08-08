import Link from "next/link";

export default function Header() {
  return (
    <header className="band border-b-2 border-ink px-6 sm:px-8 py-4 sm:py-6 flex flex-wrap items-center justify-between gap-y-3">
      <Link
        href="/"
        className="font-serif text-lg sm:text-xl tracking-wide text-paper hover:text-white transition-colors"
      >
        Dink Nolen III
      </Link>
      <nav className="flex gap-6 sm:gap-8 text-sm text-paper/75">
        <Link href="/gallery" className="hover:text-white transition-colors">
          Work
        </Link>
        <Link href="/about" className="hover:text-white transition-colors">
          About
        </Link>
        <Link href="/contact" className="hover:text-white transition-colors">
          Contact
        </Link>
      </nav>
    </header>
  );
}
