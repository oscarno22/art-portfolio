import Link from "next/link";
import Header from "@/components/Header";

export default function CheckoutSuccessPage() {
  return (
    <main>
      <Header />
      <div className="px-8 py-24 max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
          Thank you
        </p>
        <h1 className="font-serif text-4xl text-stone-900 mb-6">
          Your purchase is complete
        </h1>
        <p className="text-stone-700 leading-relaxed mb-10">
          A receipt is on the way to your email. We&apos;ll be in touch shortly
          to arrange shipping or local pickup.
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
