/**
 * Seeds DeepCleanz with real business facts and the 8 services.
 * Safe to run more than once: records are matched by slug / name and updated.
 *
 *   npm run seed
 *
 * Services without confirmed prices are created with price 0 and left UNPUBLISHED,
 * so nothing with a placeholder price can reach the website.
 */
import { getPayload } from 'payload'

import config from '../payload.config'

type Condition = {
  key: string
  label: string
  price: number
  units: 'half' | 'whole'
  description?: string
  durationHrs?: string
  crewSize?: number
}

type ServiceSeed = {
  name: string
  slug: string
  menuLabel: string
  h1: string
  subline: string
  order: number
  conditions: Condition[]
}

const services: ServiceSeed[] = [
  {
    name: 'Full Home Deep Cleaning',
    slug: 'home-deep-cleaning-chennai',
    menuLabel: 'Full home',
    h1: 'Home Deep Cleaning in Chennai',
    subline: 'Kitchen grease, bathroom stains, dusty corners — done in one visit. Check the work, then pay.',
    order: 1,
    conditions: [
      { key: '1bhk', label: '1 BHK', price: 2499, units: 'whole' },
      { key: '2bhk', label: '2 BHK', price: 3799, units: 'whole' },
      { key: '3bhk', label: '3 BHK', price: 4799, units: 'whole' },
    ],
  },
  {
    name: 'Kitchen Deep Cleaning',
    slug: 'kitchen-cleaning-chennai',
    menuLabel: 'Kitchen',
    h1: 'Kitchen Deep Cleaning in Chennai',
    subline: 'That sticky layer on your tiles, the black on your chimney, the stains round the sink — gone in one visit.',
    order: 2,
    conditions: [
      { key: 'light', label: 'Light', price: 1299, units: 'half', description: 'Cooked in daily, cleaned weekly. A thin film on tiles.' },
      { key: 'regular', label: 'Regular', price: 0, units: 'half', description: 'Sticky tiles, dull stove, chimney turning brown.' },
      { key: 'heavy', label: 'Heavy grease', price: 0, units: 'half', description: 'Not deep cleaned in a year or more. Black on chimney.' },
    ],
  },
  {
    name: 'Bathroom Deep Cleaning',
    slug: 'bathroom-cleaning-chennai',
    menuLabel: 'Bathroom',
    h1: 'Bathroom Deep Cleaning in Chennai',
    subline: 'Hard-water stains, yellowed grout and dull fittings — machine-scrubbed back to clean.',
    order: 3,
    conditions: [
      { key: 'regular', label: 'Regular', price: 599, units: 'half' },
      { key: 'hard-water', label: 'Hard-water stains', price: 0, units: 'half' },
      { key: 'neglected', label: 'Not cleaned in months', price: 0, units: 'half' },
    ],
  },
  {
    name: 'Bedroom Deep Cleaning',
    slug: 'bedroom-cleaning-chennai',
    menuLabel: 'Bedroom',
    h1: 'Bedroom Deep Cleaning in Chennai',
    subline: 'Fan blades, wardrobe tops, window grills and under the bed — the dust daily sweeping never reaches.',
    order: 4,
    conditions: [
      { key: 'regular', label: 'Regular', price: 1299, units: 'half' },
      { key: 'dusty', label: 'Dusty / closed for months', price: 0, units: 'half' },
    ],
  },
  {
    name: 'Sofa Cleaning',
    slug: 'sofa-cleaning-chennai',
    menuLabel: 'Sofa',
    h1: 'Sofa Cleaning in Chennai',
    subline: 'Shampoo and extraction that lifts dust, stains and smells from deep in the fabric.',
    order: 5,
    conditions: [
      { key: '3-fabric', label: '3 seater · fabric', price: 0, units: 'half' },
      { key: '5-fabric', label: '5 seater · fabric', price: 0, units: 'half' },
      { key: 'leather', label: 'Leather (any size)', price: 0, units: 'half' },
    ],
  },
  {
    name: 'Carpet & Mattress Cleaning',
    slug: 'carpet-mattress-cleaning-chennai',
    menuLabel: 'Carpet & mattress',
    h1: 'Carpet & Mattress Cleaning in Chennai',
    subline: 'Dust, stains and sweat marks lifted from mattresses and carpets.',
    order: 6,
    conditions: [
      { key: 'single', label: 'Single mattress', price: 0, units: 'half' },
      { key: 'queen-king', label: 'Queen / king mattress', price: 0, units: 'half' },
      { key: 'carpet', label: 'Carpet', price: 0, units: 'half' },
    ],
  },
  {
    name: 'Move-In / Move-Out Cleaning',
    slug: 'move-in-move-out-cleaning-chennai',
    menuLabel: 'Move-in / out',
    h1: 'Move-In & Move-Out Cleaning in Chennai',
    subline: 'Every cabinet, tile and fitting in an empty home — before you move in or hand back the keys.',
    order: 7,
    conditions: [
      { key: '1bhk-empty', label: '1 BHK empty', price: 0, units: 'whole' },
      { key: '2bhk-empty', label: '2 BHK empty', price: 0, units: 'whole' },
      { key: '3bhk-empty', label: '3 BHK empty', price: 0, units: 'whole' },
    ],
  },
  {
    name: 'Post-Renovation Cleaning',
    slug: 'post-renovation-cleaning-chennai',
    menuLabel: 'Post-renovation',
    h1: 'Post-Renovation Cleaning in Chennai',
    subline: 'Paint drops, cement marks and fine construction dust removed so your home is ready to use.',
    order: 8,
    conditions: [
      { key: 'light-dust', label: 'Light dust (after painting)', price: 0, units: 'whole' },
      { key: 'paint-cement', label: 'Paint and cement marks', price: 0, units: 'whole' },
    ],
  },
]

async function upsertService(payload: Awaited<ReturnType<typeof getPayload>>, s: ServiceSeed) {
  const allPriced = s.conditions.every((c) => c.price > 0)
  const data = {
    ...s,
    published: allPriced,
    seoTitle: `${s.h1}${allPriced ? ` from ₹${Math.min(...s.conditions.map((c) => c.price)).toLocaleString('en-IN')}` : ''} | DeepCleanz`.slice(0, 60),
  }
  const existing = await payload.find({ collection: 'services', where: { slug: { equals: s.slug } }, limit: 1, overrideAccess: true })
  if (existing.docs[0]) {
    await payload.update({ collection: 'services', id: existing.docs[0].id, data, overrideAccess: true })
    return 'updated'
  }
  await payload.create({ collection: 'services', data, overrideAccess: true })
  return 'created'
}

async function run() {
  const payload = await getPayload({ config: await config })

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      businessName: 'DeepCleanz',
      phone: '+91 93636 09470',
      whatsapp: '919363609470',
      email: 'info@deepcleanz.com',
      address: '41, South Lock St, Kotturpuram, Chennai – 600 085',
      hours: [
        { days: 'Mon–Sat', open: '8:00 AM', close: '7:00 PM' },
        { days: 'Sun', open: '9:00 AM', close: '4:00 PM' },
      ],
      googleRating: 4.6,
      googleReviewCount: 77,
      homesCleanedDisplay: '200+',
    },
  })

  await payload.updateGlobal({
    slug: 'booking-settings',
    overrideAccess: true,
    data: {
      crewsPerDay: 3,
      startTimes: [
        { key: 'am-0830', label: '8:30 AM', half: 'am', allowWholeDay: true, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] },
        { key: 'am-1030', label: '10:30 AM', half: 'am', allowWholeDay: true, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] },
        { key: 'pm-1300', label: '1:00 PM', half: 'pm', allowWholeDay: false, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] },
        { key: 'sun-0900', label: '9:00 AM', half: 'am', allowWholeDay: true, days: ['sun'] },
      ],
      bookingWindowDays: 14,
      dispatchTimeoutMinutes: 45,
      rescheduleHours: 24,
    },
  })

  for (const s of services) {
    const result = await upsertService(payload, s)
    payload.logger.info(`${result}: ${s.name}`)
  }

  const ownerEmail = process.env.SEED_OWNER_EMAIL
  const ownerPassword = process.env.SEED_OWNER_PASSWORD
  if (ownerEmail && ownerPassword) {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: ownerEmail } }, limit: 1, overrideAccess: true })
    if (!existing.docs[0]) {
      await payload.create({
        collection: 'users',
        data: { email: ownerEmail, password: ownerPassword, name: 'Owner', role: 'owner' },
        overrideAccess: true,
      })
      payload.logger.info(`created owner login: ${ownerEmail}`)
    }
  }

  payload.logger.info('Seed complete. Services with any ₹0 option are unpublished until real prices are entered.')
  process.exit(0)
}

// Top-level await: `payload run` calls process.exit(0) as soon as this module finishes importing,
// so an un-awaited run() would be killed before it does anything.
await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
