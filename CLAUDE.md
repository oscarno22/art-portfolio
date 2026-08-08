# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Art portfolio site for a Matthews, NC mixed-media/painting artist with an "Appalachian low-country punk" aesthetic. Built to display work now, sell it later (Phase 2). Hosted on Vercel.

## Stack

- **Next.js 16** (App Router) — see `AGENTS.md` for important notes on this version
- **TypeScript** with path alias `@/*` → `src/*`
- **Tailwind CSS** (v4, PostCSS-based — no `tailwind.config.js`)
- **Sanity.io** — CMS for artwork content; studio embedded at `/studio`
- `next-sanity`, `@sanity/image-url`, `sanity`

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Environment variables

Copy `.env.local.example` → `.env.local` and fill in values. Required:

| Variable                             | Purpose                                                             |
| ------------------------------------ | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`      | Sanity project ID (from sanity.io/manage)                           |
| `NEXT_PUBLIC_SANITY_DATASET`         | Defaults to `production`                                            |
| `SANITY_API_READ_TOKEN`              | Server-side draft/preview fetching                                  |
| `SANITY_API_WRITE_TOKEN`             | Server-only — sets artwork `status: "sold"` from the Stripe webhook |
| `STRIPE_SECRET_KEY`                  | Stripe secret key (sk*test*… until going live)                      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk*test*…)                                  |
| `STRIPE_WEBHOOK_SECRET`              | Signing secret for `/api/webhooks/stripe`                           |
| `NEXT_PUBLIC_SITE_URL`               | Base URL used to build Stripe success/cancel redirect URLs          |
| `SANITY_REVALIDATE_SECRET`           | Shared secret for the Sanity → `/api/revalidate` webhook            |

## Sanity setup

First-time setup requires creating a Sanity project and connecting it:

```bash
npx sanity init --env   # creates project, writes NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local
```

The embedded Sanity Studio runs at `http://localhost:3000/studio` (defined in `src/app/studio/[[...tool]]/page.tsx`). The studio config lives in `sanity.config.ts` at the project root.

## Architecture

```
src/
├── app/
│   ├── (site)/               # Public site — its layout renders <SanityLive />
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/ contact/ gallery/ artwork/[slug]/ checkout/
│   ├── api/                  # Route handlers (outside the live subscription)
│   ├── studio/[[...tool]]/   # Embedded Sanity Studio (client component)
│   ├── layout.tsx            # Root layout — <html>/<body>, fonts
│   └── globals.css           # Color tokens + sharpie/band utilities
├── components/
│   └── styles.ts             # Shared class recipes (inputs, buttons, pills)
└── sanity/
    ├── lib/
    │   ├── client.ts          # client (CDN) + freshClient (no CDN, authoritative)
    │   ├── live.ts            # sanityFetch + SanityLive (Live Content API)
    │   ├── image.ts           # urlFor() helper wrapping @sanity/image-url
    │   └── queries.ts         # All GROQ queries as named exports
    └── schemaTypes/
        ├── artwork.ts         # Main content type
        ├── category.ts        # Artwork categories
        └── index.ts           # Re-exports schemaTypes array for sanity.config.ts
```

### Data fetching pattern

Render with `sanityFetch` from `@/sanity/lib/live`. It wraps the CDN client with the Live Content API, so published changes reach open pages without a refresh. It returns `{ data, sourceMap, tags }` — destructure `data`. All queries live in `src/sanity/lib/queries.ts`; add new ones there rather than inline.

```ts
import { sanityFetch } from "@/sanity/lib/live";
import { allArtworksQuery } from "@/sanity/lib/queries";

const { data: artworks } = await sanityFetch({ query: allArtworksQuery });
```

Two deliberate exceptions:

- **`generateStaticParams`** uses the plain `client` with `perspective: "published"` — it runs at build time where a live subscription is meaningless.
- **`freshClient`** (no CDN) is for reads where staleness is a correctness bug, notably the checkout availability guard in `api/checkout/route.ts`. Never use `sanityFetch` in a route handler.

`<SanityLive />` renders in `src/app/(site)/layout.tsx`, **not** the root layout — over the embedded Studio it causes reload loops. Keep `/studio` and `/api` outside the `(site)` group.

### Images

Use `urlFor()` from `@/sanity/lib/image` to build Sanity CDN URLs. The `cdn.sanity.io` domain is whitelisted in `next.config.ts` for `next/image`.

```ts
import { urlFor } from "@/sanity/lib/image";
<Image src={urlFor(artwork.mainImage).width(800).url()} ... />
```

### Artwork schema fields

`artwork` documents have: `title`, `slug`, `mainImage` (with `alt`), `medium`, `dimensions`, `year`, `category` (ref), `description` (block), `featured` (bool), `status`, `price` (number).

`status` is a required enum — `"display"` (shown but not for sale), `"forSale"`, or `"sold"` — and is the single source of truth for availability. It replaced an earlier pair of `forSale`/`sold` booleans, which could encode the same state two different ways and hid the `sold` field exactly when it was needed to re-list a piece. Keep it one field: a purchase sets `status: "sold"`, and re-listing after a refund is one change in the Studio.

`price` is hidden only when `status` is `"display"` — it stays visible on sold pieces so it survives a re-list — and is required when `status` is `"forSale"`. The artwork page renders a branch for every status, including a "price on request" fallback, so no state renders blank.

## Deploying to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the three env vars in Vercel's project settings.
3. In Sanity project settings → API → CORS origins, add the Vercel deployment URL.
4. In Sanity project settings → API → Tokens, the read token must be added as `SANITY_API_READ_TOKEN`.
