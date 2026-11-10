/**
 * Seeds DeepCleanz with real business facts and the 8 services.
 * Safe to run more than once: records are matched by slug / name and updated.
 *
 *   npm run seed
 *
 * Services without confirmed prices are created with price 0 and left UNPUBLISHED,
 * so nothing with a placeholder price can reach the website.
 */
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { getPayload } from 'payload'

import config from '../payload.config'
import { catalogue, officeChairService, seoTitleFor } from './catalogue'
import { policies } from './policies'

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
  /** Draft page content — review in admin before publishing. */
  zones?: { title: string; description: string; pinX?: number; pinY?: number }[]
  excluded?: string[]
  handover?: string[]
  tips?: string[]
  faqs?: { question: string; answer: string }[]
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
    handover: [
      'Kitchen — tiles, stove, chimney',
      'Bathrooms — tiles, fittings, toilet',
      'Bedrooms — fans, windows, floor',
      'Living room & balcony',
    ],
    excluded: ['Pest control', 'Painting or wall repairs', 'Plumbing or electrical work'],
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
    zones: [
      { title: 'Wall tiles & backsplash', description: 'Degreased tile by tile, grout lines brushed, oil splatter behind the stove lifted.' },
      { title: 'Chimney & exhaust fan', description: 'Outer body and hood degreased.' },
      { title: 'Platform & countertop', description: 'Granite or tile scrubbed, including edges and corners where crumbs and oil collect.' },
      { title: 'Gas stove', description: 'Top, burner area and knobs cleaned of burnt-on spills.' },
      { title: 'Sink & tap', description: 'Hard-water scale removed from sink, tap and drain area.' },
      { title: 'Cabinet fronts, window & floor', description: 'Handles and shutters wiped, window and grill cleaned, floor scrubbed.' },
    ],
    excluded: ['Inside of appliances', 'Pest control', 'Plumbing or electrical repairs'],
    handover: [
      'Tiles feel smooth, not sticky',
      'No oil film on the chimney hood',
      'Stove top free of burnt spots',
      'Tap and sink shine, no white scale',
      'Cabinet handles clean to touch',
      'Floor dry, no slippery residue',
    ],
    tips: [
      'Wipe the tiles behind the stove right after tadka, while the oil is still warm.',
      'Run the chimney for 10 minutes after cooking to clear steam and smoke.',
      'Dry the sink every night — Chennai hard water leaves scale within days.',
      'Clean the chimney filter once a month with hot water and soap.',
      'Leave a window open for 15 minutes after cooking to cut humidity.',
    ],
    faqs: [
      { question: 'How long does kitchen deep cleaning take?', answer: 'It depends on how heavy the grease is — the planner shows the time for the option you pick.' },
      { question: 'Do I need to empty the kitchen?', answer: 'Just clear the counters and the stove top before the crew arrives.' },
      { question: 'How often should a kitchen be deep cleaned?', answer: 'Every three months if you cook every day. Tap "Remind me" and we will message you when it is time.' },
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
  {
    ...officeChairService,
    conditions: [],
  },
]

async function upsertService(payload: Awaited<ReturnType<typeof getPayload>>, seed: ServiceSeed) {
  // Confirmed prices live in ./catalogue.ts, so re-running the seed never reverts them.
  const s = { ...seed, conditions: catalogue[seed.slug] ?? seed.conditions }
  const allPriced = s.conditions.every((c) => c.price > 0)
  const { zones, excluded, handover, tips, faqs, ...base } = s
  const faqIds: string[] = []
  for (const [i, f] of (faqs ?? []).entries()) {
    const found = await payload.find({ collection: 'faqs', where: { question: { equals: f.question } }, limit: 1, overrideAccess: true })
    const doc =
      found.docs[0] ??
      (await payload.create({ collection: 'faqs', data: { ...f, topic: 'day', order: 100 + i }, overrideAccess: true }))
    faqIds.push(doc.id)
  }
  const data = {
    ...base,
    ...(zones ? { zones } : {}),
    ...(excluded ? { excluded: excluded.map((item) => ({ item })) } : {}),
    ...(handover ? { handover: handover.map((item) => ({ item })) } : {}),
    ...(tips ? { tips: tips.map((item) => ({ item })) } : {}),
    ...(faqIds.length ? { faqs: faqIds } : {}),
    published: allPriced,
    seoTitle: seoTitleFor(s.h1, s.conditions),
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
      mapsLink: 'https://maps.app.goo.gl/8eaRtPbwnZ74kt4L8',
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
      rescheduleHours: 3,
    },
  })

  for (const s of services) {
    const result = await upsertService(payload, s)
    payload.logger.info(`${result}: ${s.name}`)
  }

  // Full-home extras for the home-page planner. Created INACTIVE with ₹0 —
  // the planner only shows active add-ons with a real price.
  const fullHome = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'home-deep-cleaning-chennai' } },
    limit: 1,
    overrideAccess: true,
  })
  const extras = [
    { name: 'Sofa', unit: 'per sofa' },
    { name: 'Mattress', unit: 'per mattress' },
    { name: 'Heavy kitchen grease', unit: '' },
    { name: 'Big balcony', unit: '' },
    { name: 'Empty house (moving)', unit: '' },
  ]
  const extraIds: string[] = []
  for (const e of extras) {
    const found = await payload.find({ collection: 'addons', where: { name: { equals: e.name } }, limit: 1, overrideAccess: true })
    const doc =
      found.docs[0] ??
      (await payload.create({
        collection: 'addons',
        data: { name: e.name, unit: e.unit, price: 0, active: false },
        overrideAccess: true,
      }))
    extraIds.push(doc.id)
  }
  if (fullHome.docs[0]) {
    const current = (fullHome.docs[0].addons ?? []).map((a) => (typeof a === 'string' ? a : a.id))
    await payload.update({
      collection: 'services',
      id: fullHome.docs[0].id,
      data: { addons: Array.from(new Set([...current, ...extraIds])) },
      overrideAccess: true,
    })
  }

  // "Make it a full home" upgrade on single-room service pages.
  if (fullHome.docs[0]) {
    for (const slug of ['kitchen-cleaning-chennai', 'bathroom-cleaning-chennai', 'bedroom-cleaning-chennai', 'sofa-cleaning-chennai']) {
      const found = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
      if (found.docs[0] && !(found.docs[0].related ?? []).length) {
        await payload.update({
          collection: 'services',
          id: found.docs[0].id,
          data: { related: [fullHome.docs[0].id] },
          overrideAccess: true,
        })
      }
    }
  }

  // ---- Pongal occasion (spec S6b). Dates verified: Bhogi Thu 14 Jan 2027, Thai Pongal Fri 15 Jan 2027.
  const pongalExtras = [
    { name: 'Pooja room detail', unit: '' },
    { name: 'Entrance & kolam area wash', unit: '' },
    { name: 'All windows & grills', unit: '' },
  ]
  const pongalExtraIds: string[] = []
  for (const e of pongalExtras) {
    const found = await payload.find({ collection: 'addons', where: { name: { equals: e.name } }, limit: 1, overrideAccess: true })
    const doc =
      found.docs[0] ??
      (await payload.create({ collection: 'addons', data: { name: e.name, unit: e.unit, price: 0, active: false }, overrideAccess: true }))
    pongalExtraIds.push(doc.id)
  }
  const sofa = await payload.find({ collection: 'addons', where: { name: { equals: 'Sofa' } }, limit: 1, overrideAccess: true })
  if (fullHome.docs[0]) {
    // Festival extras must also be Full Home add-ons, or bookings would drop them.
    const fh = await payload.findByID({ collection: 'services', id: fullHome.docs[0].id, depth: 0, overrideAccess: true })
    const current = (fh.addons ?? []).map((a) => (typeof a === 'string' ? a : a.id))
    await payload.update({
      collection: 'services',
      id: fh.id,
      data: { addons: Array.from(new Set([...current, ...pongalExtraIds])) },
      overrideAccess: true,
    })
  }
  const pongalFaqs = [
    { question: 'Can you come on Bhogi day?', answer: 'Only a few slots, and they go first. Booking 5–7 days before Bhogi is safer.' },
    { question: 'When should I book my Pongal clean?', answer: 'As early as you can — weekends in the week before Bhogi fill first.' },
  ]
  const pongalFaqIds: string[] = []
  for (const [i, f] of pongalFaqs.entries()) {
    const found = await payload.find({ collection: 'faqs', where: { question: { equals: f.question } }, limit: 1, overrideAccess: true })
    const doc = found.docs[0] ?? (await payload.create({ collection: 'faqs', data: { ...f, topic: 'booking', order: 200 + i }, overrideAccess: true }))
    pongalFaqIds.push(doc.id)
  }
  const festival = {
    name: 'Festival Deep Cleaning',
    slug: 'festival-deep-cleaning-chennai',
    published: true,
    evergreen: false,
    offSeasonMessage: 'Get a WhatsApp reminder the day bookings open — or book a regular deep clean now.',
    seasons: [
      {
        label: 'Pongal',
        bookingOpensOn: '2026-12-01T00:00:00.000Z',
        activeFrom: '2026-12-01T00:00:00.000Z',
        activeTo: '2027-01-17T00:00:00.000Z',
        rushFrom: '2027-01-07T00:00:00.000Z',
        rushTo: '2027-01-13T00:00:00.000Z',
        badge: 'Pongal 2027 · Bhogi Thu 14 Jan',
        h1: 'Pongal Deep Cleaning in Chennai',
        subline: 'A sparkling home before Bhogi — so the week before the festival goes to kolam, shopping and family, not scrubbing.',
        extras: [...pongalExtraIds, ...(sofa.docs[0] ? [sofa.docs[0].id] : [])],
        focus: [
          { title: 'Entrance & doorstep', text: 'Gate, steps and the kolam spot scrubbed so the kolam sits on a clean floor.' },
          { title: 'Pooja room', text: 'Shelves, walls and floor cleaned with care. Idols and lamps are handled only if you ask.' },
          { title: 'Kitchen', text: 'Degreased before the biggest cooking week of the year — tiles, stove, chimney.' },
          { title: 'Living room & sofa', text: 'Where guests sit: fan, lights, windows, sofa and floor.' },
          { title: 'Guest bathroom', text: 'Tiles and fittings scrubbed, hard-water stains removed.' },
          { title: 'Windows, grills & balcony', text: 'Months of road dust cleared from every grill.' },
        ],
        timeline: [
          { when: 'From 1 Dec', title: 'Bookings open', text: 'Lock your date early — weekends before Bhogi fill first.' },
          { when: '7–12 Jan', title: 'Best days to clean', text: 'Your home stays clean through the festival and leaves days for decorating.' },
          { when: '13 Jan', title: 'Last slots before Bhogi', text: 'Limited — book these only if you must.' },
        ],
        prepList: [
          { item: 'Old mats, torn curtains and broken utensils' },
          { item: 'Expired items in the kitchen and fridge' },
          { item: 'Newspapers and boxes under beds' },
          { item: 'Clothes nobody wears' },
        ],
        faqs: pongalFaqIds,
      },
    ],
  }
  const existingFestival = await payload.find({ collection: 'occasions', where: { slug: { equals: festival.slug } }, limit: 1, overrideAccess: true })
  if (existingFestival.docs[0]) {
    await payload.update({ collection: 'occasions', id: existingFestival.docs[0].id, data: festival, overrideAccess: true })
  } else {
    await payload.create({ collection: 'occasions', data: festival, overrideAccess: true })
  }

  // ---- Policy pages (confirmed 10 Nov 2026) — text lives in ./policies.ts; `npm run policies` updates existing ones.
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const policyDrafts = policies.map((p) => ({
    title: p.title,
    slug: p.slug,
    metaDescription: p.metaDescription,
    body: convertMarkdownToLexical({ editorConfig, markdown: p.markdown }),
  }))
  for (const pg of policyDrafts) {
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: pg.slug } }, limit: 1, overrideAccess: true })
    if (!found.docs[0]) {
      await payload.create({ collection: 'pages', data: { ...pg, published: true }, overrideAccess: true })
    }
  }

  // Home-page FAQs — only answers that match confirmed decisions (spec D20/D21).
  const faqs = [
    {
      question: 'Do I pay anything before the cleaning?',
      answer: 'Nothing. You pay DeepCleanz only after you walk through your home and tick the checklist.',
      topic: 'payment' as const,
    },
    {
      question: 'How do I pay?',
      answer: 'By UPI to DeepCleanz after the walk-through. Cash is also fine.',
      topic: 'payment' as const,
    },
    {
      question: 'What if something is missed?',
      answer: 'Point it out during the walk-through and the crew fixes it before leaving.',
      topic: 'day' as const,
    },
    {
      question: 'I have kids and pets at home.',
      answer: 'Tick "Pets" or "Baby / elders" when you book and we brief your crew before they arrive.',
      topic: 'safety' as const,
    },
    {
      question: 'Who comes to my home?',
      answer: 'A verified DeepCleanz cleaning partner — ID and address checked before joining, and rated by every customer.',
      topic: 'safety' as const,
    },
  ]
  for (const [i, f] of faqs.entries()) {
    const found = await payload.find({ collection: 'faqs', where: { question: { equals: f.question } }, limit: 1, overrideAccess: true })
    if (!found.docs[0]) {
      await payload.create({
        collection: 'faqs',
        data: { ...f, showOnHome: true, showOnPricing: f.topic === 'payment', order: i + 1 },
        overrideAccess: true,
      })
    }
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
