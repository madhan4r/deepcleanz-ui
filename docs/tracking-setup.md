# Tracking setup — Google Tag Manager, GA4, Google Ads

The site already sends every event below to the `dataLayer`. Nothing is tracked until you put a
Google Tag Manager ID in **Admin → Settings → Site settings → Tracking**. This guide is the GTM / GA4 / Ads side.

## 1. Events the site sends

| Event | When | Parameters |
|---|---|---|
| `planner_start` | First tap in any planner | `service` |
| `condition_selected` | Option picked (BHK / condition) | `service`, `option`, `value` |
| `addon_added` | Extra ticked | `service`, `addon`, `value` |
| `book_start` | "Pick a date" tapped | `service`, `option`, `value` |
| `book_step_1` … `book_step_4` | Each booking screen | `service` |
| `lead_phone_entered` | Valid mobile number typed on step 4 | `service`, `value` |
| `booking_confirmed` | Thank-you page, **once per booking** | `transaction_id` (booking no.), `value`, `currency` = INR, `service` |
| `call_click` | Any phone link tapped | `place`, `page` |
| `whatsapp_click` | Any WhatsApp link tapped | `place`, `page` |

The site also stores the Google Ads click id (`gclid`) and UTM tags for 90 days and saves them on every lead and booking.

## 2. Google Tag Manager

1. Create a **Web** container at tagmanager.google.com → copy the `GTM-XXXXXXX` id → paste it into Site settings → Tracking.
2. **Variables** → New → *Data Layer Variable*: `value`, `transaction_id`, `currency`, `service`, `place`.
3. **Triggers** → New → *Custom Event*, one per event name: `booking_confirmed`, `lead_phone_entered`, `call_click`, `whatsapp_click`, `planner_start`, `book_start`.
4. **Tags**
   - **Google tag** (GA4 measurement id `G-…`) → trigger *Initialization – All Pages*.
   - **Conversion Linker** → *All Pages* (keeps the Ads click id working).
   - **GA4 Event** tags for `booking_confirmed` (send `value`, `currency`, `transaction_id`, `service`), `lead_phone_entered`, `call_click`, `whatsapp_click`, `planner_start`.
   - **Google Ads Conversion Tracking** → *Booking confirmed*: conversion id + label from Ads, **Value** `{{value}}`, **Currency** `INR`, **Transaction ID** `{{transaction_id}}` (stops double counting) → trigger `booking_confirmed`.
   - Google Ads conversion tags for *Lead – phone entered*, *Call click*, *WhatsApp click* (secondary, see §4).
5. **Preview** → make a real test booking → check that `booking_confirmed` fires once with the right value → **Submit/Publish**.

## 3. GA4

- Admin → Events → mark `booking_confirmed` and `lead_phone_entered` as **key events**.
- Link GA4 to Google Ads (Admin → Product links).
- Keep **Enhanced measurement → Page changes based on browser history events** ON (default). Internal links load without a full page reload, so GA4 counts those page views from history changes.

## 4. Google Ads conversion actions

| Action | Source | Goal | Count | Value |
|---|---|---|---|---|
| Booking confirmed | Website (GTM tag) | **Primary** | One | From tag (booking total) |
| Lead – phone entered | Website | Secondary | One | — |
| Call click / WhatsApp click | Website | Secondary | One | — |
| Calls from ads (≥ 60 s) | Call asset | Secondary | One | — |
| **Paid job** | Import → *Track conversions from clicks* (file upload) | Secondary now → **Primary** once uploads are steady | One | Amount paid |

The upload name must match **Site settings → Tracking → Ads offline conversion name** (default `Paid job`).
Create the *Paid job* action a day before the first upload.

### Weekly: upload paid jobs (≈ 2 minutes)
1. Log in to `/admin` as **owner**.
2. Open `https://deepcleanz.com/api/bookings/ads-conversions.csv` → a CSV of paid bookings that came from an ad and haven't been uploaded.
3. Google Ads → Goals → Conversions → **Uploads** → upload the file → check it was accepted.
4. Open `…/ads-conversions.csv?mark=1` once to mark those bookings as uploaded (the next file only has new ones).
   - `?all=1` re-downloads everything (no marking).
   - Clicks older than 90 days are rejected by Google — upload weekly.

### Bidding path (spec S14)
Maximize Conversions on *Booking confirmed* → after ~30 conversions, Target CPA → once paid-job uploads are steady, make *Paid job* primary and move to Maximize Conversion Value / Target ROAS.

## 5. Search Console & Business Profile
- Verify the **domain** property (DNS TXT record), submit `https://deepcleanz.com/sitemap.xml`.
- After launch, URL-inspect `/`, one service page and `/pricing`; check the old URLs (`/appointment`, `/services`, `/servicesDetails`, `/home`) redirect.
- Google Business Profile: website = home page; add each service with its price and link it to its service page.
