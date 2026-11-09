# DeepCleanz Website Revamp — Design Spec

> Living document. The single source of truth for the website revamp.
> Update this file every time a decision is made. Code starts only after the design sections below are marked **Confirmed**.

- **Owner:** Madhan
- **Domain:** deepcleanz.com
- **Last updated:** 1 Nov 2026
- **Status:** Design discussion (no code yet)

---

## 0. Guiding principle (applies to every decision)

**Every design and content decision must do three things:**
1. **Attract customers** — build trust and push toward Book Now / WhatsApp / Call.
2. **Rank in Google search** — crawlable, fast, one clear search intent per page, structured data.
3. **Work for Google Ads** — message match with ads, fast landing, trackable conversions, consistent numbers across ads, site and Business Profile.

Each section below records how it meets all three before it is marked Confirmed.

---

## 1. Business snapshot (from the current site)

| Item | Detail |
|---|---|
| Business | Home deep cleaning service, Chennai |
| Address | 41, South Lock St, Kotturpuram, Chennai – 600 085 |
| Phone / WhatsApp | +91 93636 09470 |
| Email | info@deepcleanz.com |
| Hours | Mon–Sat 8:00 AM – 7:00 PM · Sun 9:00 AM – 4:00 PM |
| Google rating | 4.6★ (77 reviews, as of 1 Nov 2026) |
| Homes cleaned | Almost 250 → shown as "200+ homes cleaned" until 250 is actually passed, then "250+" |
| Key selling points | Pay after service · Same-day callback · Trained team · Real work videos on YouTube |

### Current services and starting prices

| Service | Starting price |
|---|---|
| Bathroom Cleaning | ₹599 |
| Kitchen Cleaning | ₹1,299 |
| Bedroom Cleaning | ₹1,299 |
| 1 BHK Full House | ₹2,499 |
| 2 BHK Full House (most popular) | ₹3,799 |
| 3 BHK Full House | ₹4,799 |
| Sofa Cleaning | Not listed |
| Carpet & Mattress Cleaning | Not listed |
| Move-In / Move-Out Cleaning | Not listed |
| Post-Renovation Cleaning | Not listed |

---

## 2. Goals

1. **Rank on Google** for service + Chennai/area searches (organic + Maps).
2. **Attract and convert visitors** into enquiries and bookings.
3. **Make Google Ads profitable** with proper tracking and matching landing pages.
4. Run day-to-day operations (bookings, leads, teams) from an admin panel.

### Current problems
- Too few enquiries.
- Traffic comes from Google Maps and Google Ads.
- No analytics or conversion tracking connected.

---

## 3. Audit findings — current site (1 Nov 2026)

**Keep**
- Pay-after-service message, 4.6★ rating, real Google reviews
- Visible starting prices
- Floating Call + WhatsApp buttons
- Real work videos (YouTube)
- URLs: `/about`, `/services`, `/pricing`, `/appointment`

**Fix**
- No GA4 / GTM / Google Ads conversion tracking
- React SPA: every page's canonical points to the home page → inner pages don't rank
- Service details all on one page (`/servicesDetails#kitchen` etc.) → no page can rank per service
- No structured data (LocalBusiness / Service / FAQ)
- Conflicting numbers: 500+ vs 200+ homes; 80+ vs 70 reviews; "consistent 5-star" vs 4.7
- Stock hero photo instead of real team photo
- Weak CTA: "Book Free Consultation"
- Booking form lacks home size (BHK) and preferred date
- Move-In/Move-Out "Details" link points to `#commercial`; Post-Renovation has no detail section
- Home page form sits below the fold on mobile

---

## 4. Confirmed decisions

| # | Decision | Date |
|---|---|---|
| D1 | Complete revamp, built from scratch | 1 Nov 2026 |
| D2 | Dynamic website (booking + admin), not a static site | 1 Nov 2026 |
| D3 | Main focus: Google ranking + attracting customers + Google Ads | 1 Nov 2026 |
| D4 | Design is discussed in words first and recorded here before any code | 1 Nov 2026 |
| D5 | Complete rebrand (new visual identity — colours, fonts, logo, photo style, tone) | 1 Nov 2026 |
| D6 | Keep the name "DeepCleanz" and the domain deepcleanz.com (protects Google reviews, Maps ranking, Ads history) | 1 Nov 2026 |
| D7 | Brand personality: Fresh & friendly | 1 Nov 2026 |
| D8 | Colour palette B — Sky & Sunshine (sky `#1C9BE6`, deep sky `#0B6FAE` for text/links, yellow `#FFC233` for Book Now only, ink `#1D2B36`, bg `#F3F9FD`, WhatsApp `#25D366`) | 1 Nov 2026 |
| D9 | Font: Plus Jakarta Sans for headings and body (Noto Sans Tamil if Tamil is added later) | 1 Nov 2026 |
| D10 | Logo: original design made for DeepCleanz (no third-party artwork); 3 concepts on the Brand Board, choice pending | 1 Nov 2026 |
| D11 | URLs: service pages keyword-in-URL (`/kitchen-cleaning-chennai`); area pages nested (`/areas/velachery`) | 1 Nov 2026 |
| D12 | Service area: all of Chennai for now; specific area pages added when the area list is provided | 1 Nov 2026 |
| D13 | Services: keep the current 8 services | 1 Nov 2026 |
| D14 | Logo: Concept 2 — Home + sparkle (house outline, yellow sparkle inside, sky tile; wordmark "Deep" ink + "Cleanz" deep sky) | 1 Nov 2026 |
| D15 | Sitemap S2 confirmed | 1 Nov 2026 |
| D16 | Working mode: Claude has full design control. Decisions are made fresh from best practice (not from the old site), checked against §0, recorded here, and Madhan reviews | 1 Nov 2026 |
| D17 | The old site is NOT a design reference — no reused structure, sections or copy. Only real business facts carry over (name, address, prices, rating, pay-after-service policy) | 1 Nov 2026 |
| D18 | Plan the full dynamic system now; build in phases. Phase 1 = dynamic core that drives ranking and bookings; staff view, team-on-confirmation, payments, portal = Phase 2 | 1 Nov 2026 |
| D19 | **Business model: partner network, not in-house teams.** DeepCleanz takes the booking, sends the job request to partner cleaners, keeps a 20–30% commission and pays the balance to the partner. 3–4 partner crews are typically available. All copy, capacity, admin and data model follow this | 3 Nov 2026 |
| D20 | Partner model details: **customer pays DeepCleanz**; partners are ID- and address-checked before joining (no other verification claimed); **partners bring their own machines and chemicals**; **commission rate set per partner** | 3 Nov 2026 |
| D21 | No payment gateway — payments are marked manually in admin. Approved chemicals list deferred; until then no chemical-safety claims on the site and the baby-safe occasion page is held | 3 Nov 2026 |

---

## 5. Proposed (awaiting confirmation)

### 5.1 System parts
| Part | Users | Launch phase |
|---|---|---|
| Public website (admin-managed content) | Customers, Google | Phase 1 |
| Booking engine | Customers | Phase 1 |
| Admin panel | Owner / ops team | Phase 1 |
| Customer portal | Registered customers | Phase 2 |
| Partner mobile view (accept jobs, upload photos, mark done, see payouts) | Partner cleaners | Phase 2 |

### 5.2 Tech stack
| Layer | Proposal |
|---|---|
| Frontend | Next.js with server-side rendering |
| Backend | NestJS API |
| Database | MongoDB Atlas + Redis (slot locking, OTP) |
| Admin | Separate Next.js app on `admin.deepcleanz.com` |
| Media | Cloudinary or S3 |
| Messaging | WhatsApp Business API provider + SMS/OTP provider |
| Payments | Manual: customer pays DeepCleanz by UPI (or cash via crew); ops marks paid in admin. No payment gateway (D21) |
| Tracking | GA4 + Google Tag Manager + Google Ads conversions |

### 5.3 Phases
| Phase | Weeks | Scope |
|---|---|---|
| 0 | This week | Tracking on current site, Google Business Profile cleanup, review routine, job photos |
| 1 | 1–8 | Dynamic core: SSR public site from admin-managed content (home, 8 service pages, occasion pages, pricing, policies), SEO layer, Clean Planner pricing engine, booking + leads, admin panel, "Fresh from the field" feed **uploaded by office in admin**, GA4/Ads tracking, launch with redirects. Target live before Pongal (mid-Jan 2027) |
| 2 | 9–12 | Partner mobile view (accept/decline job offers, job status, photo upload → feeds "Fresh from the field" automatically, payout statements), crew profiles on booking confirmation, customer portal |
| 3 | 13–16 | Coupons, referrals, recurring plans, reports, landing page builder |

**Rule (D18):** design and data model cover all phases now; build ships in phases. Every Phase 2/3 feature already has its place in the design, so nothing is redesigned later.

### 5.5 One-week sprint plan (Madhan's target, 3 Nov 2026 — proposed)

**Sprint stack (simplified for speed):** Next.js (App Router, SSR) + **Payload CMS 3** inside the same app (gives the admin panel, auth and content editing out of the box) + MongoDB Atlas + Vercel Blob for public images, deployed on Vercel. Separate NestJS API, Redis and separate admin app deferred — slot locking via an atomic MongoDB update. Phone OTP via Firebase Auth (avoids SMS DLT template registration delays).

| Day | Build | Business side (in parallel) |
|---|---|---|
| 1 | Repo, Next.js + Payload + Mongo, Vercel staging. Collections: Services, Conditions/prices, Add-ons, Occasions, Settings (rating, reviews, homes), Jobs feed, Bookings, Leads, Slot capacity, FAQs, Policies | Final prices for every condition card and add-on; GST and cancellation policy |
| 2 | Design tokens and shared components (header, bottom bar, planner, chat FAQ, cards); Home page with live planner | Shoot or collect real photos: team, condition cards, before/after |
| 3 | Service page template (all 8 from admin data) + Pricing page | Hours and team size per condition; equipment/chemical names |
| 4 | Booking flow: steps, slot capacity, lead saved at phone number, Firebase OTP, `/thank-you`, owner alert by email | Decide slot capacity per day; who answers booking calls |
| 5 | Pongal occasion page; About, Contact, FAQ, Policies; SEO layer (titles, meta, schema, sitemap, robots, 301 redirects) | Write/approve policy text |
| 6 | GTM + GA4 + Google Ads conversions; performance pass; enter all content in admin; QA on 3 real phones | Review every page on your phone |
| 7 | Launch: DNS, redirects live, Search Console sitemap, Google Business Profile links, Ads pointed to new pages; monitor bookings | Start Pongal campaign prep |

**Deferred to after week 1:** partner phone view, customer portal, automated WhatsApp messages (Business API approval), Google Places autocomplete (week 1 uses area list check), reminder automation, area pages, occasion pages other than Pongal (template ready; content added later).

**Main risk:** content, not code. Pages cannot launch with [placeholders] — real prices, photos and policies are needed by day 5.

### 5.4 Out of scope for now
Native mobile app · live GPS partner tracking · AI chatbot · third-party vendor marketplace

---

## 6. Design discussion tracker

Work through these in order. Each section gets its own write-up below once agreed.

| # | Section | Status |
|---|---|---|
| S1 | Brand & visual direction (colours, fonts, logo, photo style, tone of voice) | Confirmed |
| S2 | Sitemap & URL structure | Confirmed |
| S3 | Navigation (header, footer, mobile menu, action bar) | Confirmed (Claude, D16) |
| S3b | Desktop layout rules | Proposed (desktop home mockup) |
| S4 | Home page — section by section | v2 "Plan your clean" proposed; v1 superseded |
| S5 | Service page template | v2 proposed (condition planner, zone map, handover checklist) |
| S6 | Area page template | Pending (waiting for area list) |
| S6b | Occasion page template | Proposed (Pongal mockup) |
| S7 | Pricing page | v2 proposed (service tabs, price factors, price promise) |
| S8 | Booking flow (step by step) | v2 proposed (4 steps + confirmation) |
| S9 | Ads landing page template | Proposed |
| S10 | About, Contact, FAQ, Policies | Proposed (adds damage policy) |
| S11 | Admin panel modules | Proposed |
| S12 | Notifications (WhatsApp / SMS / email) | Proposed (week 1 via click-to-WhatsApp from admin) |
| S13 | SEO rules (titles, schema, content standards) | Proposed |
| S14 | Tracking & conversions | Proposed (incl. paid-job offline conversions) |

### S1 — Brand & visual direction (Confirmed — palette B + Plus Jakarta Sans; logo artwork pending)

**Personality:** Fresh & friendly (D7). Bright, warm, approachable, rounded shapes — but still clean and trustworthy.

**How S1 meets the guiding principle**
- *Attract:* one high-contrast yellow CTA colour used only for Book Now; WhatsApp green kept distinct; real team photos; price, 4.6★ and "Pay after service" visible on the first mobile screen.
- *Rank:* Google Fonts loaded with `display=swap` and only 2 families/needed weights; photos compressed (WebP/AVIF) with descriptive alt text; no heavy hero sliders — keeps Core Web Vitals green.
- *Ads:* the same colours, logo and headline wording used in ad image assets and landing pages so the click feels continuous; text/background contrast ≥ 4.5:1 for readability.

**Canvas:** brand board with both palettes on a mobile hero and a font comparison — "DeepCleanz Brand Board" (Design artifact).

**Colour palette options**

| Role | A: Mint & Sunshine | B: Sky & Sunshine (recommended) |
|---|---|---|
| Primary (headers, icons, links) | Fresh mint `#12B886` | Sky blue `#1C9BE6` |
| Accent (Book Now buttons) | Sunny yellow `#FFC233` + dark text | Sunny yellow `#FFC233` + dark text |
| Text | Ink `#1D2B36` | Ink `#1D2B36` |
| Background | Soft mint white `#F4FBF8` | Soft sky white `#F3F9FD` |
| Success / WhatsApp | WhatsApp green `#25D366` | WhatsApp green `#25D366` |

Why B is recommended: blue reads as water and cleanliness; WhatsApp green stays distinct from the brand colour; yellow CTA stands out on both.

**Typography:** one rounded, friendly sans-serif for headings and body — Plus Jakarta Sans (modern, slightly rounded) or Nunito (very round, softer). Noto Sans Tamil as the pair if Tamil content is added later. Body text min 16px on mobile.

**Shapes:** rounded corners (12–16px) on cards and buttons, pill-shaped CTAs, soft shadows, simple line icons.

**Logo direction:** clear "DeepCleanz" wordmark, readable at small sizes, plus a simple icon (e.g. sparkle / water drop / house with sparkle) usable alone as favicon, WhatsApp profile picture and uniform badge. Works in one colour.

**Photo style:** real only — team in branded uniforms at Chennai homes, smiling, bright natural light; before/after pairs from the same angle; close-ups of results (shiny tiles, clean stove). No stock models.

**Tone of voice:** warm, simple English; short sentences; price and benefit first; light friendliness without jokes about dirt. Example: "Your 2BHK, sparkling in a day. Pay only after you check."

### S2 — Sitemap & URL structure (Confirmed)

**Core pages**

| URL | Page | Indexed | Notes |
|---|---|---|---|
| `/` | Home | Yes | Targets "home deep cleaning Chennai", "cleaning services Chennai" |
| `/services` | Services hub | Yes | Links to all 8 service pages |
| `/pricing` | Pricing | Yes | All prices in one table; targets "deep cleaning price Chennai" |
| `/book` | Booking flow | No | `/appointment` → 301 → `/book` |
| `/thank-you` | Booking confirmed | No | Fires the Google Ads / GA4 conversion |
| `/about` | About | Yes | Team, process, verification |
| `/contact` | Contact | Yes | NAP identical to Google Business Profile |
| `/reviews` | Reviews | Yes | Google reviews + per-service reviews |
| `/gallery` | Before / after | Yes | Real job photos with alt text |
| `/faq` | FAQ | Yes | FAQ structured data |
| `/privacy-policy`, `/terms`, `/cancellation-policy` | Policies | Yes | Required for Google Ads trust |

**Service pages (D11, D13)**

| URL | Service | Main target searches | Ads ad group |
|---|---|---|---|
| `/home-deep-cleaning-chennai` | Full House Deep Cleaning (1/2/3 BHK sections) | home deep cleaning chennai, full house cleaning, 2bhk deep cleaning | Full Home |
| `/kitchen-cleaning-chennai` | Kitchen Cleaning | kitchen deep cleaning chennai, kitchen cleaning service | Kitchen |
| `/bathroom-cleaning-chennai` | Bathroom Cleaning | bathroom cleaning service chennai, toilet deep cleaning | Bathroom |
| `/bedroom-cleaning-chennai` | Bedroom Cleaning | bedroom deep cleaning chennai | Bedroom |
| `/sofa-cleaning-chennai` | Sofa Cleaning | sofa cleaning chennai, sofa shampoo cleaning | Sofa |
| `/carpet-mattress-cleaning-chennai` | Carpet & Mattress Cleaning | carpet cleaning chennai, mattress cleaning chennai | Carpet & Mattress |
| `/move-in-move-out-cleaning-chennai` | Move-In / Move-Out Cleaning | move in cleaning, vacate cleaning, new house cleaning chennai | Move-In/Out |
| `/post-renovation-cleaning-chennai` | Post-Renovation Cleaning | post construction cleaning, after painting cleaning chennai | Post-Renovation |

**Area pages (D12)** — `/areas` hub now (Chennai-wide); `/areas/<area>` added only for areas with real jobs and local reviews, once the list is provided.

**Ads landing pages** — `/lp/<service>` (e.g. `/lp/kitchen-cleaning`): focused versions of each service page, no main menu, `noindex` to avoid duplicate content. Ads can start on the service pages and move to `/lp/` pages once built.

**Later** — `/blog/<slug>` (cleaning tips, festival cleaning, monsoon care).
**Redirects (301)** — `/appointment` → `/book`; `/servicesDetails` → `/services`.

**How S2 meets the guiding principle**
- *Attract:* every service has its own page answering price, inclusions and booking in one place.
- *Rank:* one page per search intent, keyword in URL and title, self-canonical, sitemap.xml, no `#` URLs.
- *Ads:* one landing page per ad group for message match and Quality Score; `/thank-you` gives a clean conversion event.

### S3 — Navigation (Confirmed, Claude decision under D16)

**Desktop header (sticky, shrinks on scroll)**
- Left: logo (Concept 2), links to `/`.
- Menu: **Services** (dropdown listing all 8 services, each with "from ₹" price) · Pricing · Reviews · Areas · About.
- Right: phone number as tap/click-to-call · **Book Now** (yellow, the only yellow element in the header).
- Optional admin-controlled announcement bar above the header for offers (off by default).

**Mobile header (sticky, 56–60px)**
- Logo · call icon button · menu icon. No Book button in the header — the bottom bar carries it.

**Mobile bottom action bar (replaces floating bubbles)** — always visible on mobile:
- `Call` · `WhatsApp` · **`Book Now`** (yellow, widest).
- Thumb-reachable, never covers content, each button a tracked conversion (call_click, whatsapp_click, book_click).
- WhatsApp opens with a pre-filled message naming the page's service (e.g. "Hi, I need kitchen cleaning").

**Mobile menu (full-screen sheet)**
- Services list with starting prices → Pricing, Reviews, Areas, About, Contact, FAQ.
- Bottom of sheet: Call + WhatsApp buttons, hours, 4.6★ Google badge.

**Page-specific variants**
- `/lp/*` (Ads landing): logo + call only, no menu, no footer links except policies → no exits from the ad click.
- `/book`: logo + call + step progress; bottom bar hidden so the flow has one path.
- Service and area pages: breadcrumbs (Home › Services › Kitchen Cleaning) with BreadcrumbList schema.

**Footer**
- Business block: name, address, phone, email, hours — identical to Google Business Profile.
- Services column: all 8, keyword anchor text ("Kitchen cleaning in Chennai").
- Areas column: Chennai hub now; area links as they are added.
- Company: About, Reviews, Gallery, FAQ, Contact, Blog (later).
- Policies: Privacy, Terms, Cancellation.
- Google rating badge linking to reviews; YouTube link.

**How S3 meets §0**
- *Attract:* one Book Now action always in reach; WhatsApp pre-filled per service; prices visible from the menu.
- *Rank:* crawlable text links to every service; keyword-rich footer anchors; breadcrumbs; NAP consistency with GBP.
- *Ads:* distraction-free `/lp/` navigation; every action button tracked as a conversion.

### S4 v2 — Home page concept: "Plan your clean" (Proposed, awaiting Madhan's review)

**Why v2:** v1 followed the old site's structure (reviews block, video block, services grid). v2 is designed from the customer's problem instead: *"How much will it cost, can I trust these people in my home, and will it actually be deep?"* Mockup: "v2 Home · Plan your clean · mobile" on the canvas (interactive — tap BHK and extras).

| # | Section | What it does | Why it's new |
|---|---|---|---|
| 1 | **Clean Planner hero** | H1 "Tell us about your home. See your price now." Pick 1/2/3 BHK → add extras (sofa, mattress, heavy grease, balcony, empty house) → live price, team size, hours → "Pick a date" | The page *is* the booking start. No "price on request", no hunting |
| 2 | **Clean for the moment** | 6 occasion packages: Moving in · Rental handover · Pongal & Diwali ready · Just renovated · Baby or elders at home · After the monsoon | Matches how people actually search and think; each becomes a seasonal Ads campaign + landing page |
| 3 | **Inspect, tick, then pay** | The actual room-by-room handover checklist the customer signs off before paying | Turns "pay after service" from a slogan into a visible ritual |
| 4 | **Fresh from the field** | Live feed of this week's jobs: before/after from the partner's phone, BHK, area, time, customer rating | Proof that updates itself (powered by the partner view); replaces static review/video blocks |
| 5 | **What "deep" actually means** | Daily help vs DeepCleanz table: fan blades, grout, chimney, behind fridge, window tracks, hard-water stains, wardrobe tops | Educates and justifies price; rich SEO content |
| 6 | **Meet the people before they arrive** | Team names + photos shown in booking confirmation; verification points | Tackles the #1 fear: strangers at home |
| 7 | **You asked, we answered** | FAQ as chat bubbles (FAQ schema underneath) | Friendlier, scannable |
| 8 | **Service links** | Pill links to all 8 service pages | Internal links for SEO |
| — | Bottom bar | Call · WhatsApp · **Plan my clean** | Main CTA renamed to match the concept |

**System impact (per D18):** section 4 launches in Phase 1 with jobs uploaded by the office in admin, and becomes automatic in Phase 2 when the partner view ships. Section 6 launches with team photos on the page; names on the booking confirmation arrive in Phase 2.

**New occasion pages (added to sitemap if v2 is approved):** `/move-in-cleaning-chennai`, `/rental-move-out-cleaning-chennai`, `/festival-deep-cleaning-chennai`, `/baby-safe-home-cleaning-chennai`, `/monsoon-deep-cleaning-chennai` (post-renovation and move-in map to existing service pages where they overlap).

**How v2 meets §0**
- *Attract:* price in 30 seconds, visible trust ritual, real people, live proof.
- *Rank:* occasion pages capture searches the old structure missed; deep-vs-regular and job feed add fresh, unique content Google rewards.
- *Ads:* seasonal campaigns (Pongal, Diwali, monsoon, move-in) each get a matching page; planner start = trackable micro-conversion.

### S4 v1 — Home page, section by section (Superseded by v2)

Mobile-first order. One H1; each section an H2. Target ~900–1,100 words of useful copy.

| # | Section | Content | Why |
|---|---|---|---|
| 1 | **Hero** | H1 "Home Deep Cleaning in Chennai"; one-line benefit; trust chips (Pay after service · 4.6★ Google · Trained team); price anchor "Full home from ₹2,499"; Book Now + WhatsApp; real team photo | Everything needed to act on the first mobile screen |
| 2 | **Instant price checker** | Pick service → home size (BHK) → shows starting price → "Book this" | Removes "how much?" — the biggest reason people leave; starts the booking flow |
| 3 | **Trust bar** | Google rating + review count, one verified "homes cleaned" number, pay after service, same-week slots | Proof right after the offer |
| 4 | **Services grid** | 8 cards: real photo, name, "from ₹", time taken, link to service page | Internal links for SEO; quick routing |
| 5 | **How it works** | 3 steps: Book in a minute → Team arrives with all equipment → Check the work, then pay | Lowers fear for first-time buyers |
| 6 | **Before / after** | 4–6 real pairs with drag slider; link to `/gallery` | Strongest visual proof |
| 7 | **What a full-home deep clean includes** | Room-by-room checklist (kitchen, bathrooms, bedrooms, living, balcony) + what's not included | Sets expectations, reduces disputes, adds depth for SEO |
| 8 | **Why DeepCleanz** | 4 points: pay after service, trained & verified team, own machines & safe chemicals, re-clean if unhappy (policy to confirm) | Differentiation |
| 9 | **Reviews** | 6 Google reviews (service + area tagged), rating summary, "Read all on Google" | Social proof |
| 10 | **Pricing snapshot** | 1/2/3 BHK + bathroom, kitchen, sofa from-prices; link to `/pricing` | Price transparency; matches ad prices |
| 11 | **Watch us work** | 2 YouTube videos, lazy-loaded (thumbnail first) | Proof without slowing the page |
| 12 | **Areas we serve** | "All of Chennai" + popular areas (as area pages are added) | Local relevance |
| 13 | **FAQ** | 6–8 questions (payment, time taken, need to be home?, water/power, cancellation, safety of chemicals) with FAQ schema | Answers objections; long-tail searches |
| 14 | **Final CTA band** | "Book your deep clean — pay only after you check" + Book Now / WhatsApp | Last push before footer |

**Rules**
- All numbers (rating, reviews, prices, homes cleaned) come from one admin setting so site, ads and GBP never disagree.
- No sliders/carousels above the fold; hero image preloaded, everything below lazy-loaded.
- Home page `<title>`: "Home Deep Cleaning in Chennai from ₹2,499 | DeepCleanz" (≤ 60 chars).

**How S4 meets §0**
- *Attract:* price, proof and action on the first screen; instant price removes friction.
- *Rank:* clear H1/H2 structure, real depth, FAQ schema, internal links to all services.
- *Ads:* works as the landing page for brand and generic "deep cleaning Chennai" ads; consistent numbers.

**Canvas:** "Home page · mobile" artboard on the Brand Board.

### S5 v2 — Service page template (Proposed in the v2 concept, awaiting review)

One template, filled from admin for all 8 services. Mockup: "v2 Service page · Kitchen · mobile" on the canvas (interactive). v1 table removed — superseded.

| # | Block | What it does | Admin fields |
|---|---|---|---|
| 1 | Breadcrumb | Home › Services › {Service} | auto |
| 2 | **Condition planner hero** | H1 "{Service} in Chennai"; pain-led subline; "Which looks most like yours?" — 2–4 condition cards with real photos (e.g. Light / Regular / Heavy grease) → add-on chips → live price, hours, team size → "Pick a date" | conditions[] (label, description, photo, price, hours, team), add-ons[] (label, price) |
| 3 | **Zone map** | Simple illustrated layout of the room with numbered pins; each zone explained below (what we clean there and how). "Not included" line | zones[] (pin x/y, title, description), excluded[] |
| 4 | **Handover checklist** | The service-specific items the customer checks before paying ("tiles feel smooth, not sticky") | handover[] |
| 5 | **Fresh from the field** | Swipe row of recent jobs for this service only (before/after, area, date, hours) | auto from job feed, filtered by service |
| 6 | **After we leave** | "Keep it clean for 3 months" — 5 Chennai-specific care tips + "Remind me in 3 months" (WhatsApp opt-in = repeat booking) | tips[], reminder interval |
| 7 | **Questions as chat** | 5–8 service-specific Q&As, FAQ schema | faqs[] |
| 8 | **Upgrade nudge** | "Make it a full home" with the price difference | related package |
| — | Bottom bar | Call · WhatsApp · **Book · {live price}** | auto |

**Per-service equivalents of the condition cards and zone map**

| Service | Condition cards | Zone map shows |
|---|---|---|
| Full home | 1 / 2 / 3 BHK (+ "lived-in" vs "empty") | Floor plan with rooms |
| Kitchen | Light / Regular / Heavy grease | Tiles, chimney, platform, stove, sink, cabinets |
| Bathroom | Regular / Hard-water stains / Not cleaned in months | Tiles, floor, toilet, basin, fittings, glass |
| Bedroom | Regular / Dusty (closed for months) | Fan, windows, wardrobe top, bed area, floor |
| Sofa | Seats (3 / 5 / 7) × Fabric / Leather | Seats, back, arms, cushions, base |
| Carpet & mattress | Single / Double / King / carpet size | Surface, edges, stains |
| Move-in / out | BHK × Empty | Floor plan + cabinets inside |
| Post-renovation | Light dust / Paint & cement marks | Floor plan + windows, grills, fittings |

**SEO rules for every service page**
- `<title>`: "{Service} in Chennai from ₹{price} | DeepCleanz" (≤ 60 chars). Meta description: benefit + price + pay-after + rating (≤ 155 chars).
- One H1 with service + Chennai; H2s use natural variations ("kitchen cleaning price", "kitchen cleaning FAQs").
- 800–1,200 words of unique copy per page; no copy shared between service pages except the footer.
- Schema: `Service` (provider = LocalBusiness, areaServed = Chennai, `Offer` with lowest price), `BreadcrumbList`, `FAQPage`.
- Images: real photos, WebP, descriptive file names and alt text ("kitchen-tiles-degreasing-before-after-chennai.webp").

**Ads rules**
- Each service page is the landing page for its ad group until `/lp/` versions exist; ad headline wording = H1 wording; ad price = page price.
- `/lp/{service}` reuses blocks 2, 3, 4, 5, 7 with no menu and `noindex`.
- Planner interactions (condition picked, add-on added, "Pick a date") are tracked as micro-conversions so Ads can optimise even before enough bookings exist.
- WhatsApp pre-fill and Book button carry the service name so leads arrive tagged by service.

**How S5 meets §0**
- *Attract:* price, time, team and proof answered before the first scroll; exclusions set honest expectations.
- *Rank:* one search intent per page, deep unique content, Service/FAQ/Breadcrumb schema, internal links.
- *Ads:* message match from ad → H1 → price; service-tagged conversions.

**Content needed from Madhan per service:** price per condition card, add-on prices, hours and team size per condition, equipment/chemical names, a real photo per condition card, 6–8 before/after photos, re-clean policy.

### S8 — Booking flow (Proposed in the v2 concept, awaiting review)

URL `/book` (`noindex`). Mockup: "v2 Booking flow · tap through 5 steps" on the canvas (interactive). Opens pre-filled from whichever planner the customer used (home or service page). No menu; header has Back, progress bar and a call button. A sticky footer always shows the live total, "₹0 now · pay after", and one Continue button.

| Step | Screen | Fields | Rules |
|---|---|---|---|
| 1 | **Your clean** | Summary of what was planned (Change link), team size, hours; optional chips: Pets · Baby/elders · Limited water · Watchman has key | Price promise: "If something on the day is very different, we tell you before starting — never after" |
| 2 | **Date & time** | Next 14 days as chips showing Open / Few left / Full; start times 8:30 AM, 10:30 AM, 1:00 PM, Flexible (optional discount) | Only slots with team capacity shown; full days disabled; seasonal notice (e.g. Pongal) from admin; slot held 10 min in Redis |
| 3 | **Address** | Area/apartment search (Google Places) → instant "We serve this area" check; flat no. and street; landmark; lift yes/no | Out-of-area → offer WhatsApp callback instead of a dead end |
| 4 | **Your details** | Name; WhatsApp number → 6-digit OTP; order summary with "Pay now ₹0" | Lead saved the moment a valid number is entered, so abandoned bookings can be followed up |
| 5 | **Confirmed** (`/thank-you`) | Booking ID; "What happens next" timeline: call within 1 hr → evening-before WhatsApp with team names and photos → team arrives → walk-through, then pay; Add to calendar; Chat on WhatsApp | Fires the main Google Ads + GA4 conversion (once per booking); team names on WhatsApp ship in Phase 2 |

**Not asked:** email, password, account creation, payment details. Four screens, about 60 seconds.

**Tracking events:** `planner_start`, `book_step_1…4`, `otp_verified`, `booking_confirmed` (primary conversion, with value = booking total and service tag), plus `call_click` / `whatsapp_click` on every screen.

**How S8 meets §0**
- *Attract:* no advance payment, no account, a visible price promise, and a clear "what happens next" removes the fear of booking with strangers.
- *Rank:* not indexed itself; it turns the traffic SEO brings into bookings.
- *Ads:* one clean conversion with booking value lets Google Ads bid toward real revenue; step events show exactly where people drop off.

### S7 — Pricing page (Proposed in the v2 concept, awaiting review)

URL `/pricing` (indexed). Mockup: "v2 Pricing page · tap the service tabs" on the canvas.

| # | Block | What it does |
|---|---|---|
| 1 | **Hero** | "Updated {month year}" stamp; H1 "Deep Cleaning Prices in Chennai"; "What you see here is what you pay" |
| 2 | **Sticky service tabs** | 8 tabs (Full home, Kitchen, Bathroom, Bedroom, Sofa, Carpet & mattress, Move-in/out, Post-renovation). Each shows its condition/size rows with price, team, hours and a "Plan this" button that opens that service's planner pre-filled; add-on prices below |
| 3 | **Why two 2BHKs can cost differently** | The only 4 price factors: size, condition, empty vs lived-in, add-ons — all chosen by the customer in the planner |
| 4 | **Never charged extra** | Travel in Chennai, machines, chemicals, walk-through fixes, rescheduling window, GST status |
| 5 | **Price promise** | Any difference is agreed before starting; price never changes after the work |
| 6 | **Price questions (chat)** | GST, payment method, cancellation, combo savings — FAQ schema |
| 7 | **"Not sure?" band** | Send 3 photos on WhatsApp → exact price in [15] min |

**Rules:** every price comes from the same admin pricing rules as the planners (one source of truth). All 8 services' rows are server-rendered in the HTML (tabs only toggle visibility) so Google indexes every price.

**How S7 meets §0**
- *Attract:* full transparency removes the "hidden charges" fear; photo-quote catches undecided visitors.
- *Rank:* targets "deep cleaning price Chennai", "{service} cleaning charges Chennai"; `Offer` schema per service; date stamp signals freshness.
- *Ads:* destination for price-intent keywords ("cost", "charges", "rate"); prices identical to ads and planners.

### S6b — Occasion page template (Proposed, awaiting review)

Example: Pongal. Mockup: "v2 Occasion page · Pongal season" on the canvas.

| # | Block | What it does |
|---|---|---|
| 1 | **Season hero** | Season badge; H1 "{Occasion} Deep Cleaning in Chennai"; outcome-led subline; **live slot meter** ("Pongal week slots: 62% booked") from the capacity calendar |
| 2 | **Occasion planner** | BHK + occasion-specific extras (Pongal: pooja room detail, entrance & kolam area wash, all windows & grills, sofa for guests) → price → "Pick a {occasion} date" |
| 3 | **What this clean puts first** | 6 priority areas specific to the occasion |
| 4 | **Timing timeline** | When bookings open → best days to clean → last slots → team leave days |
| 5 | **Prep list** | Customer prep themed to the occasion (Pongal: Bhogi declutter list) |
| 6 | **Questions (chat)** | Occasion-specific FAQs, FAQ schema |
| 7 | **Related links** | Core service pages (internal links) |

**Occasion pages and seasons**

| URL | Season content in admin | Peak Ads window |
|---|---|---|
| `/festival-deep-cleaning-chennai` | Pongal (Dec–Jan) ↔ Diwali (Sep–Nov) — hero, extras and timeline switch by date | 4–6 weeks before each festival |
| `/move-in-cleaning-chennai` | Year-round | Always on |
| `/rental-move-out-cleaning-chennai` | Year-round | Always on; month-end boost |
| ~~`/baby-safe-home-cleaning-chennai`~~ | Deferred until the approved chemicals list exists (D21) | — |
| `/monsoon-deep-cleaning-chennai` | Post-monsoon (Nov–Jan in Chennai) | Dec–Jan |

**Rule:** one URL per occasion kept all year (builds ranking history); admin swaps seasonal content instead of creating new pages each year. Out of season the page shows the next booking-open date and a "remind me" opt-in.

**How S6b meets §0**
- *Attract:* speaks to the exact moment; live slot meter creates honest urgency.
- *Rank:* captures festival/occasion searches the service pages miss; page gains authority every year.
- *Ads:* each occasion = one campaign with perfect message match; seasonal budgets switch on/off by date.

### S3b — Desktop layout rules (Proposed)

Mockup: "6 · Home · desktop" on the canvas. Same content and order as mobile; layout widens instead of changing.

- Content width max 1200 px, 24 px side padding; sections alternate white / soft sky / soft yellow bands.
- Header: logo · Services ▾ · Occasions ▾ · Prices · Who comes · Questions · phone number · **Plan my clean** (yellow). No bottom action bar on desktop.
- Hero: headline + trust chips on the left, **planner card on the right** — price visible without scrolling at 1280 × 720.
- Two-column sections (promise + checklist, deep vs regular, meet the team) collapse to one column below ~900 px; card grids use auto-fit (3 across on desktop, 1 on phone).
- Footer: 4 columns (business details, services, occasions, company & policies).
- Breakpoints are content-driven (flex-wrap / auto-fit), so tablets get a sensible in-between layout without extra design.

### S9 — Ads landing page template (Proposed)

URLs `/lp/{service}` and `/lp/{occasion}` — `noindex`, excluded from sitemap. Built from the same admin data as the service/occasion page; no separate content to maintain.

| # | Block | Notes |
|---|---|---|
| 1 | Header | Logo + call button only. No menu, no outbound links |
| 2 | Planner hero | H1 from an admin-defined **headline variant** chosen by `?v=` in the ad's final URL (e.g. `v=price`, `v=grease`, `v=same-week`) so each ad group gets exact message match without keyword-stuffing the URL |
| 3 | Proof strip | 4.6★ · 77 Google reviews · 200+ homes · ₹0 advance (from `siteSettings`) |
| 4 | Zone map (short) | Top 4 zones only |
| 5 | Fresh from the field | 3 latest jobs for this service |
| 6 | Handover checklist | Same as service page |
| 7 | 4 chat FAQs | Objection-focused: price, payment, time, safety |
| 8 | Footer | Business name, address, phone, Privacy · Terms · Cancellation (Google Ads requires visible business identity and policies) |
| — | Bottom bar | Call · WhatsApp · Book · {price} |

**Ads policy guardrails:** prices on the page must equal prices in the ad; no unverifiable claims ("No.1 in Chennai", "best"); describe cleaners as **verified cleaning partners** — never "our employees", "in-house" or "on our payroll" (D19); every claim (rating, homes, ₹0 advance) pulled from `siteSettings`; page must load and work on mobile with no pop-ups.
**Speed budget:** LCP < 2.0 s on 4G; planner is the only client-side JavaScript.

### S10 — About, Contact, FAQ, Policies (Proposed)

| Page | Content | Why |
|---|---|---|
| `/about` "Who comes to your home" | Short founder note (why DeepCleanz started, in Madhan's words); team cards from `team`; how we hire, verify and train; machines and chemicals we use; the inspect-then-pay promise | Trust is the #1 barrier; E-E-A-T signals for Google |
| `/contact` | Name, address, phone, hours exactly as on Google Business Profile; WhatsApp + call buttons; map loaded only on tap (keeps the page fast); "send photos for a quote" | NAP consistency for local ranking |
| `/faq` | All FAQs grouped: Booking · Price & payment · On the day · Safety & chemicals · After the clean | One place for long-tail questions; links to service pages |
| `/cancellation-policy` | Reschedule window, cancellation fee (if any), what happens if we cancel | Required for Ads trust; reduces disputes |
| `/damage-policy` | What happens if something breaks during cleaning (report window, how it's settled) | Directly answers "what if they break something?" — a common reason people hesitate |
| `/privacy-policy` | What data is collected (name, phone, address, gclid), why, how long it's kept, how to ask for deletion; consent line for WhatsApp updates — written to India's DPDP Act requirements | Legal + Ads requirement |
| `/terms` | Service terms, pay-after-service terms, photo consent for the jobs feed | Legal |

### S11 — Admin panel modules (Proposed, built on Payload)

| Module | What the team does there | Roles |
|---|---|---|
| **Today** dashboard | Today's jobs by partner, jobs still needing a partner, new leads waiting, capacity next 7 days (AM/PM per day), unpaid completed jobs | Owner, Ops |
| **Bookings** | List + calendar; status flow new → partner requested → confirmed → in progress → completed → paid / cancelled; assign partner; manual booking for phone/WhatsApp customers; **mark paid** queues the Ads offline conversion | Owner, Ops |
| **Dispatch** | Bookings waiting for a partner, oldest first; "Send to partners" (WhatsApp per matching partner); mark who accepted; alert if not accepted within [45] min | Owner, Ops |
| **Partners** | Onboard partner (ID check, documents, agreement, services, areas, commission rate, payout UPI); rating and jobs done; pause / remove | Owner (Ops view only) |
| **Payouts** | Weekly statement per partner: jobs, collected, commission, cash already taken, amount to pay; mark paid with UPI reference | Owner only |
| **Leads** | Follow-up queue sorted by newest; step reached; one-tap call / WhatsApp; status and notes | Owner, Ops |
| **Capacity** | Partner crews expected per day, block dates (festivals, low availability), override a day's capacity | Owner, Ops |
| **Catalogue** | Services, condition cards, add-ons, prices, half/whole-day units; saving a price updates `pricesUpdatedAt` | Owner only |
| **Content** | Occasions + season dates, FAQs, jobs feed (consent required to publish), team profiles, policies | Owner (Ops can add jobs) |
| **Settings** | Rating, review count, homes cleaned, contact details, tracking IDs, announcement bar | Owner only |

Payload versions are on for Catalogue and Settings so every price or claim change is logged with who and when.

**Today screen (mockup "7 · Admin · Today")** — a custom Payload dashboard view: 4 stat cards (today's jobs, new leads with oldest wait time, done-not-paid, partner payouts due); today's jobs table with team, job, area, start, status and one context action per row (Send on WhatsApp / Mark paid / Ask for review); "Leads to call" with the step each lead stopped at plus Call and WhatsApp buttons; 7-day AM/PM capacity grid (blue = open, yellow = 1 left, red = full) with the reminder to pause Ads when the next 3 days are full.

### S12 — Notifications (Proposed)

**Week 1 (no WhatsApp Business API needed)**

| Trigger | Who | How |
|---|---|---|
| New booking | Owner + ops | Email (Resend or SES) with full booking details |
| New lead (phone entered, not booked) | Ops | Email digest every 30 min |
| Booking confirmed by ops | Customer | Admin button **"Send on WhatsApp"** opens `wa.me/91{phone}?text=…` with a pre-filled confirmation; ops taps send from the business phone |
| Booking needs a partner | Partners | Admin **"Send to partners"** opens a pre-filled WhatsApp per matching partner (job, area, date, time, payout) |
| Partner accepted | Customer | Admin button sends confirmation with crew names on WhatsApp |
| Weekly payout | Partner | Statement on WhatsApp after Owner marks payout paid |
| Job marked paid | Customer | Admin button **"Ask for review"** opens WhatsApp with the Google review link pre-filled |
| OTP | Customer | Firebase SMS |

**Phase 2 (WhatsApp Business Platform, approved templates)**
Booking confirmed → evening-before with team names and photos → "team on the way" → job done + UPI details → review request 2 hours after payment → 3-month reminder (only for customers who opted in).

**Why the review button matters:** more recent Google reviews is one of the strongest levers for Maps ranking. Asking every paid customer, every time, is the cheapest growth channel the business has.

### S13 — SEO rules (Proposed)

**Per page type**

| Page | `<title>` pattern (≤ 60 chars) | Schema | Indexed |
|---|---|---|---|
| Home | Home Deep Cleaning in Chennai from ₹2,499 \| DeepCleanz | LocalBusiness | Yes |
| Service | {Service} in Chennai from ₹{price} \| DeepCleanz | Service + Offer, BreadcrumbList, FAQPage | Yes |
| Occasion | {Occasion} Deep Cleaning in Chennai \| DeepCleanz | Service, BreadcrumbList | Yes |
| Pricing | Deep Cleaning Prices in Chennai ({Year}) \| DeepCleanz | ItemList of Offers | Yes |
| About / Contact / FAQ / Policies | {Page} \| DeepCleanz | LocalBusiness on Contact | Yes |
| `/book`, `/thank-you`, `/lp/*`, `/admin` | — | — | **No** (`noindex`, not in sitemap) |

**Rules**
- One H1 per page; self-referencing canonical; lowercase hyphenated URLs, no trailing slash; old URLs 301 to new.
- `sitemap.xml` generated from published records with real `lastmod`; `robots.txt` blocks `/admin`, `/book`, `/thank-you`, `/lp/`.
- **Do not** add self-written review/rating markup (AggregateRating) to our own pages — Google doesn't show stars for self-serving reviews and it can be treated as spam. Show the Google rating as normal text instead.
- FAQPage schema is kept for clarity, but FAQ rich results are now rarely shown for business sites — the FAQ content is there for visitors and long-tail searches, not for rich snippets.
- Unique copy per page (service pages 800–1,200 words); no copy reused across pages except footer; area pages only where real local jobs exist (no doorway pages).
- Images: real photos, WebP/AVIF via `next/image`, descriptive file names, required alt text in admin.
- **Core Web Vitals targets:** LCP < 2.5 s, INP < 200 ms, CLS < 0.1. Fonts via `next/font` (self-hosted), content blocks as server components, planner and booking as the only client components.
- Fresh signals: jobs feed weekly, `pricesUpdatedAt` stamp on Pricing, occasion pages updated each season.
- Google Business Profile: services list mirrors the 8 service pages with links; weekly photo from the jobs feed; reply to every review.

### S14 — Tracking & conversions (Proposed)

**Setup:** Google Tag Manager container; GA4; Google Ads conversion tag + conversion linker; gclid + UTM stored in a first-party cookie (90 days) and saved on leads and bookings.

| Event | GA4 | Google Ads | Value |
|---|---|---|---|
| `booking_confirmed` | Key event | **Primary** conversion | Booking total |
| `lead_phone_entered` | Key event | Secondary | — |
| `call_click`, `whatsapp_click` | Event | Secondary | — |
| Calls from ad call asset ≥ 60 s | — | Secondary (Google forwarding number) | — |
| `planner_start`, `condition_selected`, `addon_added`, `book_step_1…4`, `otp_verified` | Events | Not imported (funnel analysis only) | — |
| **Paid job** (offline) | — | **Primary** once volume allows; uploaded via gclid when admin marks paid (CSV in week 1, Ads API later) | Amount paid |

**Bidding path:** start Maximize Conversions on `booking_confirmed` → after ~30 conversions switch to Target CPA → once paid-job uploads are steady, optimise to paid-job value (Maximize Conversion Value / Target ROAS).

**Weekly numbers (admin dashboard + GA4):** leads and bookings by source (Ads, Maps, organic, WhatsApp, direct); cost per booking; lead → booking rate; booking → paid rate; team utilisation (booked half-days ÷ available).

---

## 9. Build — Day 1: data model (Payload CMS + MongoDB)

Madhan is working full-time on the 1-week sprint (3 Nov 2026). Rule: **every price is computed on the server** from these records at booking time; the browser's number is display only.

### Globals (single records)

| Global | Fields |
|---|---|
| `siteSettings` | businessName, phone, whatsapp, email, address, hours[] (day, open, close), googleRating, googleReviewCount, homesCleanedDisplay ("200+"), gstNote, pricesUpdatedAt, announcementBar {enabled, text, link}, gtmId, ga4Id, adsConversionId + labels |
| `bookingSettings` | crewsPerDay (partner crews ops expects to be available; default **3**), startTimes[] (key, label, half: am/pm, weekdays), bookingWindowDays (14), holdMinutes (10), rescheduleHours, cancellationPolicy (rich text) |

### Collections

| Collection | Key fields | Used by |
|---|---|---|
| `services` | slug, name, h1, subline, seoTitle, metaDescription, conditions[] {key, label, description, photo, price, durationHrs, teamSize}, addons (rel), zoneImage, zones[] {pinX, pinY, title, description}, excluded[], handover[], tips[], faqs (rel), related (rel), reminderMonths, order, published | Home planner, service pages, pricing page, booking |
| `addons` | name, price, unit, services (rel), active | Planners, booking |
| `occasions` | slug, name, evergreen, seasons[] {label, activeFrom, activeTo, bookingOpensOn, badge, h1, subline, extras (rel addons), focus[] {title, text}, timeline[] {when, title, text}, prepList[], faqs (rel)}, offSeasonMessage | Occasion pages (Pongal first) |
| `faqs` | question, answer, services (rel), occasions (rel), showOnHome, showOnPricing, order | All pages + FAQPage schema |
| `jobs` ("Fresh from the field") | service (rel), title, area, date, durationHrs, teamSize, beforeImage, afterImage, customerQuote, customerConsent (must be true to publish), published | Home + service feeds |
| `partners` | name, phone, crewSize, crewMembers[] {name, photo}, services (rel), areas (rel), idCheckedAt, checks {idType, idCheckedAt, addressCheckedAt, checkedBy, agreementSignedAt} — documents are kept offline, not uploaded, equipment[] (machines they bring), commissionRate (required, per partner), payoutUpi / bank, rating (avg of customer ratings), jobsDone, status (active / paused / removed), notes | Dispatch, payouts, "meet the people" (with consent), confirmation (Phase 2) |
| `dispatch` | booking (rel), partner (rel), sentAt, response (pending / accepted / declined / expired), respondedAt | Offer history per booking; who accepts fastest |
| `payouts` | partner (rel), period, bookings (rel), grossCollected, commission, payoutAmount, collectedByPartner (cash taken by partner, to be offset), status (due / paid), paidAt, reference | Weekly partner settlement |
| `areas` | name, pincodes[], served, note | Booking step 3 "we serve this area" check (week 1, no Places API) |
| `capacity` | date, half (am / pm), capacity, booked, blocked, note — unique on (date, half) | Booking step 2; full days; Pongal slot meter |
| `leads` | phone, name, stepReached, plannerSnapshot {service, condition, addons, price}, landingPage, utmSource/Medium/Campaign, **gclid**, status (new / contacted / converted / lost), notes, followUpAt | Saved at booking step 4 phone entry; admin follow-up |
| `bookings` | bookingNo (DC-1001…), customer {name, phone, phoneVerified}, items[] {service, condition, addons, price}, total, notes[] (pets, kids, water, key), date, slotKey, address {area, line, landmark, lift}, status (new → **partner_requested** → confirmed (partner accepted) → in_progress → completed → paid / cancelled), partner (rel), commissionRate, commissionAmount, partnerPayout, collectedBy (deepcleanz / partner), paymentMethod, paidAmount, customerRating, ratingNote, gclid + utm, lead (rel), conversionSentAt | Booking flow, admin operations |
| `media` | Cloudinary-backed uploads with required alt text | All images |
| `users` | email, role (owner / ops) | Admin login |

### Logic to build on Day 1–4

- **Capacity model (partner crews, D19):** each available partner crew = 2 half-day units per day (AM, PM). Capacity per half = `crewsPerDay` (default 3, the number of partner crews ops can normally get; raise it when more partners confirm availability, lower it for festivals). Bookings stay **partner_requested** until a partner accepts; the customer is told "we confirm your cleaning partner within 1 hour".

  | Job type | Units | Start times offered |
  |---|---|---|
  | Full home (1/2/3 BHK), move-in/out, post-renovation | AM + PM (whole day) | 8:30 AM, 10:30 AM (Mon–Sat); 9:00 AM (Sun) |
  | Kitchen, bathroom(s), bedroom, sofa, carpet & mattress | AM **or** PM | AM: 8:30 / 10:30 · PM: 1:00 PM (Mon–Sat; Sun AM only) |

  At 3 crews: max 3 full-home jobs **or** 6 half-day jobs per day, about 18–21 full-home-equivalent jobs a week. Each service condition gets a `units` field (1 or 2); booking step 2 only shows start times whose halves are free.
- **Combined bookings:** two or more half-day items in one booking reserve the whole day (AM + PM) for one team; admin can override per booking.
- **Slot booking:** `capacity.findOneAndUpdate({date, half, blocked: false, $expr: {$lt: ["$booked", "$capacity"]}}, {$inc: {booked: 1}})` — succeeds only if a unit is free; no Redis needed. Whole-day jobs reserve AM and PM inside one MongoDB transaction (both or neither). Missing capacity docs are created from `bookingSettings.crewsPerDay`.
- **Dispatch (week 1):** booking arrives → admin **"Send to partners"** picks matching partners (service + area + active) and opens a WhatsApp message per partner with job type, area (not full address), date, start time and partner payout amount. First to accept is assigned; full address and customer phone are shared only after acceptance. If nobody accepts within [45] min, ops calls the customer to offer another slot.
- **Money flow (D20, confirmed):** the customer pays **DeepCleanz** at the walk-through. Week 1: DeepCleanz business UPI QR (crew lead shows a printed QR card; admin can also send the UPI link on WhatsApp) — ops marks the booking paid when the credit arrives. Payment is always recorded manually in admin (D21) — marking a booking paid also queues the Google Ads paid-job conversion. Cash is an exception: if the crew collects cash it's recorded as `collectedBy: partner` and deducted from that partner's next payout.
- **Partner equipment (D20):** partners bring their own machines and chemicals. Onboarding records each partner's equipment list; An approved chemicals list is **deferred** (D21). Until it exists the site makes **no chemical-safety claims** (no "gentle", "baby-safe", "safe for pets"); the baby/elders note in booking is passed to the crew instead.
- **Commission (D20):** rate is **set per partner** (typically 20–30%) and required on the partner record; `commissionAmount = paidAmount × partner.commissionRate`, overridable per booking; payout statement sent to each partner every week.
- **Leakage control:** customers only ever have the DeepCleanz number before the job; partner agreement includes a no-direct-booking clause for DeepCleanz customers; repeat bookings get a small returning-customer benefit so booking through DeepCleanz stays the easy choice.
- **Ads ↔ capacity:** daily Ads budget is sized to what the teams can absorb; when the next 3 days are full, admin can pause campaigns (manual in week 1, automated later via the Google Ads API).
- **Price:** `condition.price + Σ addon.price` recomputed server-side; booking stores the line items as a snapshot so later price changes don't alter old bookings.
- **gclid capture:** read `gclid` and UTM params on first landing, keep in a first-party cookie for 90 days, save on lead and booking. When a booking is marked **paid**, it can be uploaded to Google Ads as an offline conversion — Ads then optimises for jobs that actually got paid, not just form fills.
- **Owner alert (week 1):** email on every new booking and new lead; WhatsApp automation after Business API approval.

### Content checklist for Madhan (needed by Day 5)

- [ ] Price, hours and team size for every condition card (8 services) and every add-on
- [ ] GST included or extra; cancellation and reschedule policy
- [x] Slot capacity → 3–4 teams; default 3, half-day units (§9)
- [x] Job length → every kitchen condition, including heavy grease, is half-day (confirmed 3 Nov). All non-full-home services default to half-day (units = 1); full home, move-in/out and post-renovation = whole day (units = 2)
- [ ] Areas served (or "all of Chennai" pincode list)
- [ ] Photos: 1 per condition card, 3+ team photos, 6+ before/after pairs, with customer consent
- [ ] Equipment and chemical names per service
- [ ] Pongal answers: pricing, team leave days, brass/idol cleaning, discarded items
- [ ] Damage policy: how a breakage is reported and settled — and who pays (DeepCleanz or the partner)
- [x] Who collects payment? → DeepCleanz (D20)
- [x] Partner checks? → ID and address only (site claims only these)
- [x] Equipment? → Partners bring their own machines and chemicals
- [x] Commission? → Different per partner
- [ ] Approved chemicals list — deferred by Madhan (D21); needed before any chemical-safety claim or the baby-safe page
- [x] Payment gateway? → Not needed; payments updated manually (D21)
- [ ] Partner photos on the site/confirmation: partners' consent
- [ ] Founder note for About page (a few lines, your own words)
- [ ] Google review link (from Google Business Profile → "Ask for reviews")

---

## 7. Open questions

- [ ] Monthly Google Ads budget?
- [ ] Which page(s) do current ads land on?
- [ ] Final list of areas served in Chennai?
- [ ] Prices for Sofa, Carpet & Mattress, Move-In/Out, Post-Renovation?
- [ ] Will partners use a phone view (Phase 2), or will ops update job status for them?
- [x] Keep the current brand or refresh it? → Complete rebrand (D5)
- [x] Does the rebrand include the business name and domain? → No, keep "DeepCleanz" + deepcleanz.com (D6)
- [x] Brand personality? → Fresh & friendly (D7)
- [x] Colour palette? → B, Sky & Sunshine (D8)
- [x] Font? → Plus Jakarta Sans (D9)
- [x] Logo? → Concept 2, Home + sparkle (D14)
- [x] Verified numbers? → 4.6★, 77 reviews, almost 250 homes (shown as 200+)
- [ ] Final list of Chennai areas (for area pages) — Madhan to provide later
- [ ] Who builds: Madhan solo, or with help? Hours per week available?
- [ ] Hosting for the new Node.js site: existing server (pm2 + Nginx) or Vercel?
- [ ] Old API (`/api/v1/appointments`, `/api/v1/tracking`): retire, or forward new bookings to it?
- [ ] Is GST included in prices, or added?
- [ ] Cancellation / reschedule policy (hours before, any fee)?
- [ ] Pongal: same prices as rest of year? Team leave days? Brass/idol cleaning offered? Do you take away discarded items?

---

## 8. Decision log

| Date | Change |
|---|---|
| 1 Nov 2026 | Spec created. Audit recorded. D1–D4 confirmed. |
| 1 Nov 2026 | D5 confirmed: complete rebrand. S1 (Brand) moved to In discussion. |
| 1 Nov 2026 | D6 confirmed: keep name DeepCleanz and domain; rebrand is visual identity only. |
| 1 Nov 2026 | D7 confirmed: Fresh & friendly personality. S1 draft added (palette, type, shapes, logo, photos, tone). |
| 1 Nov 2026 | Guiding principle added (§0): every decision must attract customers, rank on Google and work for Google Ads. Brand Board canvas created. |
| 1 Nov 2026 | D8 palette B (Sky & Sunshine) and D9 Plus Jakarta Sans confirmed. S1 confirmed; logo artwork pending. Next: S2 Sitemap & URLs. |
| 1 Nov 2026 | D10–D13: original logo (3 concepts on canvas), keyword URLs, Chennai-wide for now, keep 8 services. S2 sitemap drafted. |
| 1 Nov 2026 | D14 logo Concept 2, D15 sitemap confirmed, D16 full design control to Claude. S3 Navigation and S4 Home page written and confirmed. |
| 1 Nov 2026 | Verified numbers: 4.6★, 77 Google reviews, almost 250 homes (display 200+). Rating/review/homes figures are admin-managed and auto-update. |
| 1 Nov 2026 | Home page and Kitchen service page mobile mockups added to the canvas. S5 service page template confirmed. |
| 1 Nov 2026 | Madhan: v1 too close to the old site. Rule added — old site is not a design reference. S4 v2 "Plan your clean" concept proposed (planner hero, occasion packages, inspect-then-pay checklist, live job feed, deep-vs-regular, meet the team). S5 reopened. |
| 1 Nov 2026 | D18: plan the full dynamic system now, build in phases; Phase 1 targets launch before Pongal. |
| 3 Nov 2026 | S5 v2 service page (condition planner, zone map, handover checklist, care tips + 3-month reminder) and S8 booking flow (4 steps + confirmation, ₹0 now, lead saved at phone number) proposed with interactive mockups. |
| 3 Nov 2026 | S7 pricing page (service tabs, 4 price factors, never-extra list, price promise, WhatsApp photo quote) and S6b occasion page template (Pongal example, live slot meter, one URL per occasion kept all year) proposed with mockups. |
| 3 Nov 2026 | Madhan targets completing development in 1 week. 7-day sprint plan and simplified sprint stack (Next.js + Payload CMS + MongoDB + Vercel) proposed in §5.5. |
| 3 Nov 2026 | Madhan confirms full-time on the sprint. §9 Day 1 data model (globals, collections, slot/price/gclid logic) and content checklist added. |
| 3 Nov 2026 | 3–4 teams confirmed. Capacity model: half-day units (AM/PM) per team, default 3 teams with the 4th as buffer; whole-day jobs reserve both halves in one transaction. Price list to follow from Madhan. |
| 3 Nov 2026 | Heavy-grease kitchen confirmed as half-day. Rule: single-room/item services = half-day; full home, move-in/out, post-renovation = whole day. |
| 3 Nov 2026 | S9–S14 written: Ads landing pages (headline variants via `?v=`), info pages + damage policy, admin modules and roles, week-1 notifications via admin click-to-WhatsApp, SEO rules (no self-serving rating schema), tracking with paid-job offline conversions. All design sections now drafted. |
| 3 Nov 2026 | Canvas cleaned and renamed "DeepCleanz Website Design": Brand row (colours & type, chosen logo) + Pages row (1 Home, 2 Service, 3 Pricing, 4 Pongal, 5 Booking). Rejected options and v1 mockups removed. |
| 3 Nov 2026 | Desktop home mockup and admin "Today" dashboard mockup added (canvas 6 and 7). S3b desktop layout rules written; Today screen described under S11. |
| 3 Nov 2026 | D19 partner model: no in-house teams; jobs sent to partner cleaners, 20–30% commission, balance paid out. Data model adds partners, dispatch, payouts; capacity = partner crews per day; admin adds Dispatch, Partners, Payouts; site copy changed to "verified cleaning partners". Canvas updated. |
| 3 Nov 2026 | D20: customer pays DeepCleanz (UPI QR week 1, Razorpay links next); partner checks = ID + address; partners bring own equipment (approved chemicals list); commission per partner. |
| 3 Nov 2026 | D21: no Razorpay — manual payment updates; chemicals list deferred, so chemical-safety claims removed and baby-safe page held. |
| 3 Nov 2026 | Day 1 code delivered (deepcleanz-day1.zip): Next.js 16 + Payload 3.92 + MongoDB; all collections/globals, server-side pricing, transactional capacity, dispatch → confirm, paid → commission, payouts, roles, seed. Type-check, production build and logic checks pass; not yet run against a live database. Images on Vercel Blob (public only), so partner ID documents are not stored — only check dates. |
| 3 Nov 2026 | Repo: existing UI repo (`admin-deepcleanz/ui`, CRA + separate API at `/api/v1/appointments` and `/api/v1/tracking`, static deploy over SSH). New branch `revamp/nextjs-payload` replaces the CRA app with the Next.js + Payload project; `main` unchanged. CI now type-checks and builds; deploy job disabled until hosting for a Node server is chosen (own server with pm2 + Nginx, or Vercel). Open: retire or keep the old API. |
| 3 Nov 2026 | Madhan fixed seed (top-level await) and count-in-transaction bugs in Users/Bookings hooks. Day 2 delivered: brand tokens + self-hosted Plus Jakarta Sans (@fontsource, no Google Fonts call), header with services dropdown, mobile menu and action bar, footer with NAP, "Plan your clean" home page (planner, moments, inspect-then-pay, field jobs, deep vs regular, verified partners, chat FAQ, service links), LocalBusiness + FAQPage schema (no rating markup), GTM + gclid/UTM 90-day cookie + call/WhatsApp click events. Seed adds 5 full-home extras (inactive, ₹0 until priced) and 5 home FAQs. Sections with no real data (field jobs, crew photos) stay hidden. |
| 3 Nov 2026 | Day 3 delivered: `/[slug]` service page template (condition planner with photo rows, zone list/map, handover checklist, recent jobs for that service, care tips + WhatsApp 3-month reminder, service FAQs, "also popular" upgrade) and `/pricing` (anchor tabs instead of JS tabs so every price is in the HTML for Google; per-option "Plan this" opens the service planner pre-selected; 4 price factors; never-charged-extra list limited to confirmed facts — travel charges not claimed; price promise; WhatsApp photo quote without a response-time promise). Mobile action bar now per page with service-specific WhatsApp text. Schemas: Service + AggregateOffer, BreadcrumbList, FAQPage, OfferCatalog. Seed adds draft kitchen content and the full-home checklist; pages stay unpublished until every option has a price. |
| 3 Nov 2026 | Day 4 delivered: `/book` (4 steps: your clean + notes → date & start time from live capacity → address with area check → name + WhatsApp number) and `/thank-you` (fires `booking_confirmed` once per booking with value; add-to-calendar .ics; WhatsApp). Public API as Payload endpoints: `GET /api/bookings/availability`, `GET /api/bookings/area-check`, `POST /api/bookings/lead` (one open lead per phone, saved at the phone step), `POST /api/bookings/request` (server re-validates service/option/add-ons, date window, start time, area, phone; booking hooks re-price and reserve capacity; 409 if the slot just filled → customer picks again). Honeypot + per-IP rate limit. Thank-you reads the booking from the visitor's own session only (booking numbers are sequential, so they are never looked up by URL). Routes split into `(site)` (header/footer) and `(focus)` (logo + call only, noindex). Not done yet: phone OTP (Firebase keys needed) — bookings arrive with phoneVerified = false and ops confirms by call; owner email alerts (no email provider configured) — new bookings show in admin. No response-time promise in copy until ops commits to one. |
| 3 Nov 2026 | Day 5 delivered: `/[slug]` now serves services → occasions → admin-written pages. Festival occasion page with Pongal 2027 season (dates verified: Bhogi Thu 14 Jan, Thai Pongal Fri 15 Jan 2027; bookings open 1 Dec; live peak-week slot meter for 7–13 Jan shown only once ≥ 25% booked; before 1 Dec the page shows the opening date + WhatsApp reminder instead of the planner). Festival extras must also be Full Home add-ons (enforced). New `pages` collection for policies; privacy, terms, cancellation and damage seeded as UNPUBLISHED drafts — [brackets] need Madhan's decisions; privacy draft lists exactly what the site collects (name, phone, address, notes, dc_attr cookie, GTM/GA4/Ads). `/about` (how it works, verified partners, optional founder note from Settings), `/contact` (NAP, hours, Maps link — no embedded map for speed), `/faq` (grouped, FAQPage schema). SEO: `sitemap.xml` from published records with real lastmod; `robots.txt` blocks /admin, /api/, /book, /thank-you, /lp/; 301s: /home → /, /appointment → / (not /book: noindex would waste its ranking), /services and /servicesDetails → /pricing, www → bare domain. |
| 3 Nov 2026 | Day 6 delivered: speed — Payload reads cached with Next data cache (tags `site`, `capacity`), busted instantly by admin save hooks, so pages stay fresh but most visits skip the database; security headers, no `X-Powered-By`. Google Ads — owner-only `GET /api/bookings/ads-conversions.csv` exports paid jobs that came from an ad (gclid, IST time, amount paid) in Google's click-conversion upload format; `?mark=1` marks them uploaded; conversion name set in Site settings (default "Paid job"). Optional email (nodemailer, on only when `SMTP_HOST` set): new-booking alert to `ALERT_EMAIL`, admin password resets. Guides: `docs/tracking-setup.md` (GTM variables/triggers/tags, GA4 key events, Ads conversion actions + bidding path, weekly upload), `docs/launch-checklist.md`. |
| 3 Nov 2026 | Hosting decided: **Madhan's own server**. Nginx (HTTPS, www → bare domain, gzip, X-Forwarded-For overwritten so the booking rate limit can't be spoofed) → pm2 → Next.js standalone bundle on 127.0.0.1:3000. CI builds and packages; pushes to `main` deploy over SSH with the old deploy secrets into `releases/<id>`, switch `current`, health-check the home page (reads the DB) and roll back automatically on failure; last 5 releases kept. Settings in `shared/.env` (loaded with `node --env-file`); uploaded images in `shared/media` (Vercel Blob not used). Merging the revamp branch into `main` is the launch switch. |
