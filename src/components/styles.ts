/**
 * Shared class recipes for the sharpie-outlined UI.
 *
 * These were previously duplicated across CommissionForm, DonateForm and the
 * gallery filters, which let them drift apart. Keep new form controls and
 * pills pointing here.
 */

export const inputClass =
  "w-full px-3 py-2.5 sharpie-flat bg-white text-ink text-sm placeholder:text-navy/40 focus:outline-none focus:border-purple transition-colors";

export const primaryButtonClass =
  "sharpie px-6 py-2.5 bg-navy text-paper text-xs uppercase tracking-widest hover:bg-magenta transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

export const eyebrowClass = "text-xs uppercase tracking-widest text-purple";

export const errorClass = "text-sm text-magenta";

/** Toggle pill — gallery category filters and donation presets. */
export function pillClass(active: boolean) {
  return [
    "px-4 py-1.5 text-xs uppercase tracking-widest border-2 transition-colors",
    active
      ? "border-ink bg-ink text-paper"
      : "border-paper-dim text-navy/60 hover:border-purple hover:text-purple",
  ].join(" ");
}
