"use client";

import { useState } from "react";
import { errorClass } from "./styles";

type Props = {
  slug: string;
  price: number;
};

export default function BuyButton({ slug, price }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout could not start");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="sharpie mt-4 w-full sm:w-auto px-8 py-3 bg-navy text-paper text-sm tracking-wide uppercase hover:bg-magenta transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting…" : `Buy — $${price.toLocaleString()}`}
      </button>
      {error && <p className={`mt-3 ${errorClass}`}>{error}</p>}
    </div>
  );
}
