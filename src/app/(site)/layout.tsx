import { SanityLive } from "@/sanity/lib/live";

/**
 * Layout for the public site.
 *
 * `<SanityLive />` lives here rather than in the root layout on purpose: it
 * opens a Live Content API subscription and refreshes the tree when content
 * changes, which causes unexpected reloads if it renders over the embedded
 * Studio at /studio. Route groups don't affect URLs, so every path is
 * unchanged — /studio and /api simply sit outside this group.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SanityLive />
    </>
  );
}
