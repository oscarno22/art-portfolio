"use client";

import { useState } from "react";
import {
  errorClass,
  inputClass,
  pillClass,
  primaryButtonClass,
} from "./styles";

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
            className={pillClass(amount === String(preset))}
          >
            ${preset}
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="flex items-stretch gap-3">
        <div className="relative flex-1 max-w-[160px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50 text-sm select-none z-10">
            $
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Other"
            className={`${inputClass} pl-7`}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !amount}
          className={primaryButtonClass}
        >
          {loading ? "Redirecting…" : "Donate"}
        </button>
      </div>

      {error && <p className={`mt-3 ${errorClass}`}>{error}</p>}
    </form>
  );
}
