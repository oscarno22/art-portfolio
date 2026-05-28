import Header from "@/components/Header";
import DonateForm from "@/components/DonateForm";
import CommissionForm from "@/components/CommissionForm";

export default function ContactPage() {
  return (
    <main>
      <Header />

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

        <div className="mt-16 pt-12 border-t border-stone-200">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
            Commission a piece
          </p>
          <p className="text-stone-700 leading-relaxed mb-6">
            Interested in a custom work? Share what you have in mind and Dink
            will be in touch to discuss.
          </p>
          <CommissionForm />
        </div>

        <div className="mt-16 pt-12 border-t border-stone-200">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
            Support the work
          </p>
          <p className="text-stone-700 leading-relaxed mb-6">
            If you&apos;d like to support Dink&apos;s practice directly, a
            contribution of any size is deeply appreciated.
          </p>
          <DonateForm />
        </div>
      </div>
    </main>
  );
}
