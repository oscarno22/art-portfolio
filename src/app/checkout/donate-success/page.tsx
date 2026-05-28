import Link from "next/link";
import Header from "@/components/Header";

export default function DonateSuccessPage() {
  return (
    <main>
      <Header />
      <div className="px-8 py-24 max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
          Thank you
        </p>
        <h1 className="font-serif text-4xl text-stone-900 mb-6">
          Your support means a lot.
        </h1>
        <p className="text-stone-700 leading-relaxed mb-10">
          A receipt is on its way to your email. Every contribution goes
          directly toward the work — thank you for being a part of it.
        </p>
        <Link
          href="/gallery"
          className="text-sm uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
        >
          ← Back to the gallery
        </Link>
      </div>
    </main>
  );
}
