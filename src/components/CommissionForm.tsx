"use client";

import { useState } from "react";

const BUDGETS = ["Not sure yet", "Under $500", "$500 – $1,000", "$1,000 – $2,500", "$2,500+"];

const inputClass =
  "w-full px-3 py-2.5 border border-stone-300 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-stone-700 bg-white";

export default function CommissionForm() {
  const [fields, setFields] = useState({ name: "", email: "", description: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="py-6">
        <p className="text-stone-900 font-medium mb-1">Message sent.</p>
        <p className="text-sm text-stone-500">Dink will be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
            Name <span className="text-stone-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fields.name}
            onChange={set("name")}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
            Email <span className="text-stone-500">*</span>
          </label>
          <input
            type="email"
            required
            value={fields.email}
            onChange={set("email")}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
          Budget
        </label>
        <select
          value={fields.budget}
          onChange={set("budget")}
          className={inputClass}
        >
          <option value="">Select a range</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">
          Tell Dink about the piece <span className="text-stone-500">*</span>
        </label>
        <textarea
          required
          value={fields.description}
          onChange={set("description")}
          rows={5}
          placeholder="Size, subject matter, color palette, where it'll hang — any detail helps."
          className={`${inputClass} resize-y`}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-stone-900 text-stone-100 text-xs uppercase tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
