"use client";

import { useState } from "react";
import {
  errorClass,
  eyebrowClass,
  inputClass,
  primaryButtonClass,
} from "./styles";

const BUDGETS = [
  "Not sure yet",
  "Under $200",
  "$200 – $500",
  "$500 – $1,000",
  "$1,000+",
];

const labelClass = `block ${eyebrowClass} mb-1.5`;

export default function CommissionForm() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    description: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function set(key: keyof typeof fields) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setFields((f) => ({ ...f, [key]: e.target.value }));
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
        <p className="text-ink font-medium mb-1">Message sent.</p>
        <p className="text-sm text-navy/60">Dink will be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Name <span className="text-magenta">*</span>
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
          <label className={labelClass}>
            Email <span className="text-magenta">*</span>
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
        <label className={labelClass}>Budget</label>
        <select
          value={fields.budget}
          onChange={set("budget")}
          className={inputClass}
        >
          <option value="">Select a range</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Tell Dink about the piece <span className="text-magenta">*</span>
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

      {error && <p className={errorClass}>{error}</p>}

      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
