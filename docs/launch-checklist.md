# Launch checklist

Tick everything in order. Anything unticked in **Must** blocks launch.

## Must — content (admin)
- [ ] **Prices**: every option of every service you want live has a real price → tick *Published* on the service. (Services with any ₹0 option can't be published — by design.)
- [ ] **Add-ons**: price + *Active* for each extra you sell (Sofa, Mattress, festival extras…).
- [ ] **Service page content** reviewed: zones, "not included", handover checklist, care tips, FAQs. Kitchen has a draft; write the other services (thin pages rank poorly).
- [ ] **Privacy policy**: fill every `[bracket]` (retention period, grievance contact) → *Published*. Google Ads reviewers look for it; the footer links to it.
- [ ] Terms, cancellation and damage policies: fill brackets → *Published* (footer links 404 until then).
- [ ] **Site settings**: rating + review count current, homes cleaned, Google review link, Maps link, UPI id, GST note.
- [ ] Booking settings: crews per day, start times, booking window.
- [ ] Capacity: block festival / holiday days with no partners.

## Must — operations
- [ ] Owner + ops logins created (Settings → Users). Ops cannot change prices or settings.
- [ ] Partners added with **commission %**, ID/address check dates, services, payout UPI.
- [ ] Decide who watches **Admin → Bookings / Leads** during working hours (phone numbers aren't OTP-verified yet — confirm every booking by call).
- [ ] Email alerts: set `SMTP_*` + `ALERT_EMAIL` in the server `.env`, make a test booking, confirm the email arrives.

## Must — hosting
- [ ] Own server set up per `deploy/server-setup.md` (Node 22, pm2, Nginx, HTTPS, `shared/.env`); old static-site Nginx block disabled.
- [ ] Production env: `DATABASE_URL` (Atlas, network access allows the server), `PAYLOAD_SECRET` (new, long, random), `NEXT_PUBLIC_SERVER_URL=https://deepcleanz.com`, images in `shared/media` with a backup.
- [ ] HTTPS works for `deepcleanz.com` and `www.deepcleanz.com` (www redirects to bare domain).

## Must — tracking (docs/tracking-setup.md)
- [ ] GTM id in Site settings; GA4 + Ads tags published; `booking_confirmed` fires once in GTM Preview.
- [ ] Google Ads conversion actions created, including *Paid job* for uploads.

## Launch day
1. Merge `revamp/nextjs-payload` → `main` (CI deploys; check the run is green). Point DNS only if the server's IP changed.
2. Test: home → planner → book → thank-you on a real phone (Android + iPhone). Booking appears in admin, capacity count goes up, alert email arrives.
3. Check redirects: `/appointment`, `/services`, `/servicesDetails`, `/home`.
4. Check `/sitemap.xml` (only published pages) and `/robots.txt`.
5. Search Console: submit sitemap, URL-inspect home + one service page.
6. Google Business Profile: website link + service links.
7. Point each Google Ads ad group at its matching service page (spec S2 table); prices in ads = prices on pages.

## First two weeks
- Daily: new bookings and leads followed up the same day; mark jobs *Paid* with amount.
- Weekly: upload paid jobs to Google Ads; Ads search-terms report → add negatives; pay partners from **Payouts**.
- Watch: lead → booking rate, booking → paid rate, cost per booking.

## Not in this launch (planned)
Phone OTP (Firebase) · partner phone view · automated WhatsApp messages · customer portal · area pages · other occasion pages · admin "Today" dashboard view · old API (`/api/v1/appointments`, `/api/v1/tracking`) decision.
