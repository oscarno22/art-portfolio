# Running Costs

**Short version: this site runs at $0/month. The only unavoidable cost is the domain name.**

Every service in the stack has a free tier that this single-artist portfolio stays far below.

## Per-service cost

| Service         | What it does                  | Cost for this site                                    |
| --------------- | ----------------------------- | ----------------------------------------------------- |
| **Stripe**      | Checkout + payments           | No fixed fee. ~2.9% + 30¢ per _successful_ sale only. |
| **Sanity**      | CMS / content + image hosting | **Free plan** (see below). $0.                        |
| **Vercel**      | Hosting (Hobby tier)          | $0 for personal/non-commercial use.                   |
| **Resend**      | Seller email on sale          | Free tier covers this volume. $0.                     |
| **Domain name** | The URL                       | The one real cost (~$10–15/yr, from your registrar).  |

## Sanity: trial vs. Free plan

New Sanity projects start on a temporary **Growth trial** that unlocks extra paid features
for a window. **When the trial ends, the project automatically converts to the permanent
Free plan** — it is _not_ deleted and _not_ billed. Nothing in this site depends on a
paid-only feature, so when the trial ends the site keeps working at $0.

### Free-plan limits vs. realistic usage

The Free plan's limits dwarf what a single artist's portfolio uses:

| Free plan allows            | Realistic usage here                   |
| --------------------------- | -------------------------------------- |
| 20 user seats               | ~3                                     |
| 1,000,000 CDN requests / mo | a tiny fraction (reads are ISR-cached) |
| 250,000 API requests / mo   | a tiny fraction                        |
| 100 GB bandwidth / mo       | a tiny fraction                        |
| 100 GB asset storage        | dozens–hundreds of images              |
| 10,000 documents            | likely < 500 artworks                  |
| 2 public datasets           | 1 (`production`)                       |

There is enormous headroom on every limit.

### ⚠️ One gotcha: member roles when the trial ends

The Free plan exposes **only two roles: Administrator and Viewer** (Viewer is **read-only**).
During the trial a member may hold an **Editor** role that no longer exists after conversion.

**Make sure anyone who edits content (i.e. the artist) is set to `Administrator`** in
[sanity.io/manage](https://www.sanity.io/manage) → project → Members. Otherwise they could be
left as Viewer and lose the ability to edit artwork.

## If we ever outgrow Free

Not planned — included only for reference. If usage ever exceeds the Free limits, the options
are: upgrade to Sanity **Growth** (paid), or self-host the content layer (a database + image
storage + a custom admin UI). Self-hosting is real ongoing work and is **not** reliably
cheaper than the free Sanity tier, so staying on Free is the recommended path.
