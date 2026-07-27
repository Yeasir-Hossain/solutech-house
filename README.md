# Solutech House — Next.js site

Cash house-buyer marketing site, deployed on Vercel. Replaces the WordPress
build that lives in the parent directory.

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Rendering:** fully static (595 prerendered routes). Only `/admin`, `/api/lead`
  and `/api/admin/*` run on demand.
- **Content:** a static snapshot migrated out of WordPress, committed under `content/`.
  There is no CMS at runtime.
- **Database:** MongoDB Atlas — used *only* for valuation submissions and admin
  login throttling.
- **Styling:** the design system from the WordPress theme, ported verbatim
  (`src/styles/tokens.css`, `main.css`, `valuation.css`). No Tailwind, no UI kit —
  the tokens, contrast rules and component classes were already settled and
  swapping them out would have thrown that work away.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | yes | Atlas connection string. Submissions fail closed without it. |
| `MONGODB_DB` | no | Database name (default `solutechhouse`). |
| `ADMIN_USERNAME` | yes | Sign-in for `/admin`. |
| `ADMIN_PASSWORD` | yes | Sign-in for `/admin`. |
| `AUTH_SECRET` | yes | Signs the admin session cookie. Min 32 chars — `openssl rand -base64 48`. |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | Canonical origin for metadata, OG tags and the sitemap. |
| `NEXT_PUBLIC_BRAND_NAME` | no | Overrides the display brand without a rebuild of content. |
| `NEXT_PUBLIC_BRAND_LEGAL` | no | Registered company name in the footer. |
| `NEXT_PUBLIC_BRAND_COMPANY_NO` | no | Registered company number in the footer. |

---

## Routes

| Route | Notes |
| --- | --- |
| `/` | Home |
| `/blog/`, `/blog/page/[n]/` | 327 posts, 12 per page |
| `/blog/[slug]/` | Post |
| `/blog/category/[slug]/`, `…/page/[n]/` | 14 categories |
| `/faqs/` | 131 FAQs, client-side search |
| `/faqs/[slug]/` | Single FAQ |
| `/success-stories/`, `/success-stories/[slug]/` | 16 reviews |
| `/sell-house-fast/`, `/sell-house-fast/[slug]/` | 14 locations |
| `/reasons-to-sell/`, `/reasons-to-sell/[slug]/` | 6 reasons |
| `/get-a-valuation/` | 3-step form |
| `/[slug]/` | 34 pages; `how-it-works`, `about-us`, `why-choose-us` and `sell-problem-property-fast` have bespoke templates |
| `/admin/`, `/admin/login/` | Submissions, password-protected |
| `/api/lead` | `POST` — stores a submission |
| `/api/admin/export` | `GET` — CSV of all submissions (auth required) |
| `/sitemap.xml`, `/robots.txt` | Generated |

URLs keep WordPress's trailing slash so existing inbound links don't take a
redirect hop. Slugs that changed are 301'd in `next.config.ts`.

---

## Regenerating content from WordPress

Only needed if the WordPress source changes. Both scripts are idempotent.

```bash
# 1. Start the old stack and dump it to JSON.
#    The exporter is copied into uploads/ because that is the only writable
#    path the wp-cli container shares with the host.
cd .. && podman compose up -d
cp web/scripts/wp-export.php wp-content/uploads/_wbah_export.php
podman compose --profile cli run --rm wp-cli \
  wp eval-file /var/www/html/wp-content/uploads/_wbah_export.php

# 2. Re-encode images  (uploads/**  ->  public/media/**.webp  +  content/images.json)
cd web && npm run migrate:images

# 3. Normalise content (URL rewriting, rebranding, link audit)
npm run migrate:content
```

`build-images.mjs` migrates only the 402 originals, not WordPress's ~1,775
generated thumbnails, and caps them at 1600px WebP: **393 MB → 33 MB**.

`build-content.mjs` rewrites uploads URLs to `/media/`, turns absolute internal
links into relative ones, stamps `width`/`height` on images, and applies the
brand rename. **The trading name is a single constant** — `BRAND` at the top of
that file. Change it, re-run the script, redeploy.

It also writes `content/broken-links.json`: internal links in body copy that
point at routes we don't publish. These were already broken in the WordPress
build (416 instances, mostly to blog posts that were never imported). The
worthwhile ones are redirected in `next.config.ts`; the rest are listed there for
an editorial pass.

---

## Deploying to Vercel

1. Push this directory to a Git repo.
2. Import it in Vercel. If `web/` is a subdirectory, set **Root Directory** to `web`.
   Framework preset, build command and output directory are all detected.
3. Add every required environment variable above to **Production** (and Preview,
   if previews should reach the database).
4. In **Atlas → Network Access**, allow the deployment's egress. Vercel's
   serverless functions do not have stable IPs, so either allow `0.0.0.0/0` and
   rely on the credential, or attach a Vercel Static IP / VPC integration and
   allow just that range.
5. Point the domain at the project and set `NEXT_PUBLIC_SITE_URL` to it.

`content/` and `public/media/` are committed on purpose — the build reads them
from disk, so nothing else has to be available at build time.

---

## Security notes

- `/admin` is gated by `middleware.ts` **and** re-checked inside each page and
  API route. Middleware is the front door, not the only lock.
- The session is a signed JWT (HS256) in an `HttpOnly`, `SameSite=Lax`,
  `Secure`-in-production cookie, valid 8 hours.
- Credentials are compared with `crypto.timingSafeEqual` over SHA-256 digests.
- Failed logins are throttled per client at 10 per 15 minutes, counted in
  MongoDB — an in-process counter would reset on every cold start, which is
  exactly what a brute-force run causes.
- The lead endpoint has a honeypot field, a minimum fill-time trap, and a limit
  of 5 submissions per client per 10 minutes.
- Client IPs are stored only as an HMAC keyed with `AUTH_SECRET` — enough to
  rate-limit, not enough to identify.
- Post bodies are injected with `dangerouslySetInnerHTML`. That HTML is a
  build-time snapshot that already passed through WordPress's `wp_kses_post`
  on import; **no runtime user input is ever rendered this way.** If content
  ever becomes user-editable, sanitise it at that boundary.
