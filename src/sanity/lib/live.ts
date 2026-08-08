import { defineLive } from "next-sanity/live";
import { client } from "./client";

/**
 * Live Content API wiring. `sanityFetch` renders published content and
 * `<SanityLive />` (mounted in src/app/(site)/layout.tsx) keeps it current.
 *
 * Both tokens are explicitly `false`: this site only ever renders published
 * content, and there is no draft-preview or Presentation Tool flow. Passing
 * `false` rather than omitting them is what silences next-sanity's startup
 * warnings — omitting them means "not configured yet", `false` means
 * "deliberately not used". Add a viewer-scoped token here if draft previewing
 * is ever wanted.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: false,
  browserToken: false,
});
