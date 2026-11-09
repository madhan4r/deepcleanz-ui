# DeepCleanz — project guide for Claude Code

Home deep-cleaning service in Chennai. This repo is the new website + admin, replacing the old CRA site (still on `main`).
Full design spec and decision log: `docs/deepcleanz-website-spec.md` — read it before making design or business-logic changes, and add new decisions to its decision log.

## Golden rule (spec §0)
Every change must **attract customers**, **rank on Google** and **work for Google Ads**. Say how a change meets all three.

## Business facts that code and copy must respect
- Partner model (D19–D20): no in-house teams. Jobs go to partner cleaners; DeepCleanz keeps a **per-partner commission** (typically 20–30%) and pays the balance weekly. **Customer pays DeepCleanz.** Partners bring their own machines and chemicals.
- Claims: say "verified cleaning partners" (ID + address checked). Never "employees", "in-house", "payroll", "trained in-house", "uniformed". **No chemical-safety claims** ("gentle", "baby-safe", "pet-safe") until an approved chemicals list exists (D21).
- No payment gateway (D21): payments are marked paid manually in admin.
- Proof numbers come only from `site-settings` (4.6★, 77 Google reviews, "200+" homes as of Nov 2026). Never hard-code them.
- Prices come only from the catalogue and are computed on the server (`src/lib/pricing.ts`). Services with any ₹0 option stay unpublished.
- Capacity: each partner crew = AM + PM half-day. Whole-day jobs (full home, move-in/out, post-renovation) or 2+ half-day items take both halves. Reserve via `src/lib/capacity.ts` (Mongo transaction — DB must be a replica set).
- The old site is **not** a design reference (D17). Design source: the "DeepCleanz Website Design" canvas + spec.

## Brand
Sky `#1C9BE6` · deep sky `#0B6FAE` (text/links) · yellow `#FFC233` (Book / primary CTA only) · ink `#1D2B36` · bg `#F3F9FD` · WhatsApp `#25D366`. Font: Plus Jakarta Sans. Rounded cards (12–16px), pill buttons, real photos only.

## Stack & commands
Next.js 16 + Payload CMS 3 + MongoDB (Atlas). Admin at `/admin`.
- `npm run dev` · `npm run build` · `npm run typecheck` · `npm run seed`
- After changing collections: `npm run generate:types` and `npm run generate:importmap`
- Env: copy `.env.example` → `.env` (never commit `.env`)

## Sprint status (Nov 2026)
Day 1 done: data model, roles, pricing, capacity, dispatch, payouts, seed.
Day 2 done: brand CSS (`src/app/(frontend)/globals.css`), header/footer/action bar (`src/components/site`), home page with planner (`src/components/home`), schema, GTM + gclid cookie.
Day 3 done: `/[slug]` service template (`src/components/service`), `/pricing` (`src/components/pricing`); pages = data loader + view component.
Day 4 done: `/book` + `/thank-you` (`src/components/booking`), booking API as Payload endpoints in `src/endpoints/booking.ts` + `src/lib/booking.ts`. Route groups: `(site)` = header/footer pages, `(focus)` = booking pages (noindex).
Day 5 done: occasions + admin pages via `/[slug]` (`src/components/occasion`, `src/components/pages`), `/about`, `/contact`, `/faq`, `pages` collection (policy drafts unpublished), `src/app/sitemap.ts`, `src/app/robots.ts`, redirects in `next.config.ts`.
Day 6 done: data caching (`src/lib/cache.ts`, tags `site`/`capacity`, busted by `src/hooks/bustCache.ts`), security headers, optional SMTP email + new-booking alert (`ALERT_EMAIL`), owner-only `GET /api/bookings/ads-conversions.csv` (Google Ads offline upload, `?mark=1`), `docs/tracking-setup.md`, `docs/launch-checklist.md`.
Day 7 in progress: own-server deploy set up (standalone build, pm2, Nginx, CI deploy with health check + rollback).
Next: server setup, merge to main, launch (DNS, Search Console, GBP, Ads landing pages) per `docs/launch-checklist.md`. Pending integrations: phone OTP (Firebase), admin "Today" view.
New cached reads go through `cachedQuery()`; any new collection that feeds pages needs `siteCacheHooks`.
Rules: hide any section that has no real data — never show placeholder content on the live site.

## Repo notes
- Windows checkout with `core.autocrlf=true`.
- Hosting: own server. Nginx → pm2 → Next.js standalone bundle built in CI, deployed on push to `main` (`deploy/`, `deploy/server-setup.md`). Uploaded images: `MEDIA_DIR` (server: `shared/media`).
- Open decision: retire the old API (`/api/v1/appointments`, `/api/v1/tracking`) or forward bookings to it.
