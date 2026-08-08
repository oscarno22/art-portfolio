import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * CDN-backed client for rendering published content. Wrapped by `sanityFetch`
 * in ./live.ts, which pairs it with the Live Content API so pages update as
 * soon as content changes in the Studio.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Bypasses the CDN so reads always reflect the current dataset.
 *
 * Use this only where a stale read would be a correctness bug — notably the
 * checkout availability guard, which must not approve a purchase against a
 * cached `status`. Anything that merely renders should use `sanityFetch`.
 */
export const freshClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});
