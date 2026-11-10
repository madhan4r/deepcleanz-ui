/**
 * Policy pages — confirmed by Madhan on 10 Nov 2026. Single source for `npm run seed` and `npm run policies`.
 * Written in Markdown; converted to the rich-text editor format when saved.
 */
export type PolicyPage = { title: string; slug: string; metaDescription: string; markdown: string }

export const policies: PolicyPage[] = [
  {
    title: 'Privacy policy',
    slug: 'privacy-policy',
    metaDescription: 'What DeepCleanz collects when you book, why, how long we keep it and how to ask for it to be deleted.',
    markdown: `DeepCleanz ("we") runs deepcleanz.com. This page explains what we collect when you use the site or book a clean.

## What we collect
- **When you book:** your name, mobile/WhatsApp number, address, the date and time you picked, what you want cleaned and any notes (for example "pets at home").
- **When you type your number but don't finish:** your number and what you were planning, so we can call you back.
- **When you arrive from an ad or link:** a cookie called \`dc_attr\` that remembers the ad click id and campaign tags for 90 days.
- **Analytics:** if enabled, Google Tag Manager, Google Analytics and Google Ads measure visits and bookings.

## Why we use it
- To confirm your booking, assign a cleaning partner and contact you by phone or WhatsApp.
- To share your name, address and phone with the cleaning partner who accepts your job — only after they accept.
- To see which ads lead to bookings.

We do not sell your information.

## How long we keep it
- **Bookings and payments:** 6 years after the booking, because tax law requires us to keep these records.
- **Numbers from bookings that weren't finished:** 12 months.
- **The \`dc_attr\` cookie:** 90 days.

## Your choices
You can ask us to show, correct or delete your information by emailing info@deepcleanz.com or messaging us on WhatsApp. Records we must keep for tax are deleted when that period ends.

**Grievance Officer, DeepCleanz** — info@deepcleanz.com
`,
  },
  {
    title: 'Terms of service',
    slug: 'terms',
    metaDescription: 'The terms for booking a DeepCleanz deep clean: who does the work, price, payment, cancellation and damage.',
    markdown: `## Who does the work
DeepCleanz takes your booking and assigns it to a verified cleaning partner (ID and address checked). The partner brings their own machines and chemicals.

## Price
The price is fixed for what you pick in the planner. If your home is very different from what you booked, we tell you before work starts and you can say no. The price never changes after the work is done.

## Payment
You pay DeepCleanz after you inspect the work — by UPI or cash. Nothing is paid in advance.

## Cancellation and damage
See our [cancellation policy](/cancellation-policy) and [damage policy](/damage-policy).
`,
  },
  {
    title: 'Cancellation & reschedule policy',
    slug: 'cancellation-policy',
    metaDescription: 'Reschedule or cancel a DeepCleanz booking free up to 3 hours before the start time.',
    markdown: `## Rescheduling
Free up to 3 hours before your start time, subject to free slots. Call or WhatsApp us.

## Cancelling
- **Up to 3 hours before your start time:** free.
- **Less than 3 hours before:** 25% of the booking price, paid by UPI.

## If we have to cancel
If no partner is available, or heavy rain makes the visit unsafe, we tell you by call or WhatsApp as soon as we know and offer you the next free slot that suits you, at the same price. If no new slot works for you, the booking is cancelled with no charge.
`,
  },
  {
    title: 'Damage policy',
    slug: 'damage-policy',
    metaDescription: 'What happens if something is damaged during a DeepCleanz clean, and how to report it.',
    markdown: `## Report it before the partner leaves
Walk through your home with the partner before they leave. If anything is damaged, show it to them then and send us photos on WhatsApp straight away. We can't accept damage reported after the partner has left, because we can't confirm how it happened.

## How it is settled
The cleaning partner who did the job is responsible. After we check the photos and the item, the partner pays to repair it — or its fair current value if it can't be repaired. DeepCleanz arranges this between you and the partner.

## What isn't covered
- Damage that was there before the clean.
- Items that were already loose, broken or badly fixed (for example a loose tile or a leaking tap).
- Normal wear, and old stains or marks that don't come off.

Please put away cash, jewellery and other valuables before the clean.
`,
  },
]
