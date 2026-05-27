"use client";

import { useState } from "react";

const PRESETS = [10, 25, 50];

export default function DonateForm() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const dollars = parseFloat(amount);
    if (!dollars || dollars < 1) {
      setError("Enter an amount of at least $1.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: dollars }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {/* Preset amounts */}
      <div className="flex gap-2 mb-4">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(String(preset))}
            className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
              amount === String(preset)
                ? "border-stone-900 text-stone-900"
                : "border-stone-300 text-stone-400 hover:border-stone-500 hover:text-stone-700"
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="flex items-stretch gap-3">
        <div className="relative flex-1 max-w-[160px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm select-none">
            $
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Other"
            className="w-full pl-7 pr-3 py-2.5 border border-stone-300 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-stone-700 bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !amount}
          className="px-6 py-2.5 bg-stone-900 text-stone-100 text-xs uppercase tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Redirecting…" : "Donate"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}
