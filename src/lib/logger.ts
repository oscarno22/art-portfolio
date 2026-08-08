/**
 * Structured logger for server-side use.
 *
 * Outputs JSON lines — readable in Vercel's log viewer and easily parsed
 * by any log aggregator. All log calls accept a `meta` object; only
 * explicitly safe fields are forwarded so PII (email, name, address, etc.)
 * can never leak in accidentally.
 *
 * Safe fields (extend this list deliberately — never add customer details):
 *   artworkId, artworkStatus, slug, sessionId, eventType, amountTotal,
 *   currency, paymentStatus, error, statusCode
 */

type Level = "info" | "warn" | "error";

type SafeMeta = {
  artworkId?: string;
  artworkTitle?: string;
  artworkStatus?: string;
  slug?: string;
  sessionId?: string;
  eventType?: string;
  amountTotal?: number | null;
  currency?: string | null;
  paymentStatus?: string | null;
  statusCode?: number;
  error?: string;
};

function log(level: Level, event: string, meta: SafeMeta = {}) {
  // Pick only the fields we've explicitly declared safe.
  const safe: SafeMeta = {};
  if (meta.artworkId !== undefined) safe.artworkId = meta.artworkId;
  if (meta.artworkTitle !== undefined) safe.artworkTitle = meta.artworkTitle;
  if (meta.artworkStatus !== undefined) safe.artworkStatus = meta.artworkStatus;
  if (meta.slug !== undefined) safe.slug = meta.slug;
  if (meta.sessionId !== undefined) safe.sessionId = meta.sessionId;
  if (meta.eventType !== undefined) safe.eventType = meta.eventType;
  if (meta.amountTotal !== undefined) safe.amountTotal = meta.amountTotal;
  if (meta.currency !== undefined) safe.currency = meta.currency;
  if (meta.paymentStatus !== undefined) safe.paymentStatus = meta.paymentStatus;
  if (meta.statusCode !== undefined) safe.statusCode = meta.statusCode;
  if (meta.error !== undefined) safe.error = meta.error;

  const entry = {
    level,
    event,
    ...safe,
    ts: new Date().toISOString(),
  };

  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (event: string, meta?: SafeMeta) => log("info", event, meta),
  warn: (event: string, meta?: SafeMeta) => log("warn", event, meta),
  error: (event: string, meta?: SafeMeta) => log("error", event, meta),
};
