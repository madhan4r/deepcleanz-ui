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
Day 1 done: data model, roles, pricing, capacity, dispatch, payouts, seed. Next: Day 2 shared components + "Plan your clean" home page, then service pages, pricing page, booking flow API, Pongal occasion page, SEO layer, tracking (spec §5.5, §9, S1–S14).

## Repo notes
- Windows checkout with `core.autocrlf=true`.
- CI deploy job is disabled until hosting for a Node server is chosen (own server with pm2 + Nginx, or Vercel).
- Open decision: retire the old API (`/api/v1/appointments`, `/api/v1/tracking`) or forward bookings to it.
