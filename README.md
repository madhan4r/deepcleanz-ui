# DeepCleanz — website + admin (Day 1)

Next.js 16 + Payload CMS 3 + MongoDB, one app. The public site and the admin panel (`/admin`) run together.
Design source of truth: `deepcleanz-website-spec.md` (Project docs) and the "DeepCleanz Website Design" canvas.

## What's in Day 1

| Area | Collections / globals |
|---|---|
| Operations | `bookings`, `dispatch` (job offers to partners), `leads`, `capacity`, `areas` |
| Partners | `partners` (per-partner commission, ID/address checks, payout UPI), `payouts` (weekly settlement) |
| Catalogue | `services` (condition cards with price + half/whole day, zones, handover, tips), `addons` |
| Content | `occasions` (seasons by date), `jobs` ("Fresh from the field", consent required), `faqs`, `media` |
| Settings | `users` (owner / ops), `site-settings` (contact, rating, reviews, homes, tracking IDs), `booking-settings` (crews per day, start times) |

### Business rules already enforced on the server
- **Prices** are recomputed from the catalogue whenever a booking's items change (`src/lib/pricing.ts`). The browser's number is display-only.
- **Capacity**: each partner crew = morning + afternoon. Whole-day jobs, or 2+ half-day items, take both halves. Reservation is atomic in a MongoDB transaction — two customers can't take the last slot (`src/lib/capacity.ts`). Cancelling or rescheduling gives the units back.
- **Partner flow**: booking → `partner_requested` → a `dispatch` offer marked *accepted* assigns the partner, confirms the booking and expires the other offers. A booking can't move past "partner requested" without a partner.
- **Paid**: entering the amount and setting status *Paid* locks the partner's commission %, commission and partner payout. Partner rating and jobs done update automatically.
- **Payouts**: pick a partner's paid bookings → totals computed; cash taken by the partner is deducted. A negative amount means the partner owes DeepCleanz.
- **Roles**: Ops can run bookings, dispatch, leads, capacity and the jobs feed. Only the Owner can change prices, settings, partners and payouts.
- **Honesty guards**: services with any ₹0 option are seeded unpublished; field jobs can't be published without customer consent; partner ID documents are not stored — only the check dates.

## Run it locally

1. **Database** (must be a replica set, for booking transactions). Either:
   - MongoDB Atlas free cluster → copy the connection string, or
   - `docker compose up -d` → `mongodb://localhost:27017/deepcleanz?replicaSet=rs0&directConnection=true`
2. `cp .env.example .env` and fill `DATABASE_URL`, `PAYLOAD_SECRET` (`openssl rand -hex 32`), optionally `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD`.
3. `npm install`
4. `npm run seed` — loads contact details, 4.6★ / 77 reviews / 200+ homes, start times, crews per day = 3, and all 8 services.
5. `npm run dev` → site at http://localhost:3000, admin at http://localhost:3000/admin (create the first user if you didn't set the seed owner — the first account becomes Owner).

After changing collections: `npm run generate:types` and `npm run generate:importmap`.

## Deploy

The old site was static files copied to the server. The new site is a **Node.js server** (website + admin + API), so the server must run Node. Two options:

**A. Your existing server (where the old CI deployed)**
1. Install Node 22+ and pm2 on the server.
2. Build on the server or in CI: `npm ci && npm run build`.
3. Run: `pm2 start npm --name deepcleanz -- start` (listens on port 3000).
4. Put Nginx in front: proxy `deepcleanz.com` → `127.0.0.1:3000`, keep HTTPS.
5. Leave `BLOB_READ_WRITE_TOKEN` empty → uploaded images are stored in `./media` on the server (back this folder up).

**B. Vercel**
- Import the repo, set the env vars plus `BLOB_READ_WRITE_TOKEN` (Vercel → Storage → Blob) so uploaded images persist.

Either way, use MongoDB Atlas (or a replica-set Mongo) and point DNS only when the new site is ready. The CI deploy job is switched off (`.github/workflows/ci-cd.yml`) until one option is chosen.

## Old site and old API
- The old React site stays on `main` until this branch is merged.
- The old site posted forms to `REACT_APP_API_BASE_URL/api/v1/appointments` and visits to `/api/v1/tracking`. The new site stores bookings and leads in its own database (Payload). The old API isn't called from this branch; decide whether to retire it or forward new bookings to it.

## Before launch (needs real content)
- Fill every ₹0 condition and add-on price in **Catalogue → Services / Add-ons**, then tick *Published*.
- Add partners with their commission %, check dates and payout UPI.
- Add Google review link, UPI ID and tracking IDs in **Settings**.

## Next (Day 2 →)
Shared components and the "Plan your clean" home page; then service pages, pricing, booking API (`priceItems` + `reserveHalves` + lead capture), occasion page, SEO layer and tracking — see spec §5.5.
