import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import { CAPACITY_TAG, cachedQuery } from './cache'
import type { Addon, Faq, Job, Media, Occasion, Service, SiteSetting } from '@/payload-types'

export const FULL_HOME_SLUG = 'home-deep-cleaning-chennai'
export const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')

export const getPayloadClient = cache(async () => getPayload({ config: await config }))

export const getSettings = cachedQuery('getSettings', async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 0 })
})

/** Published services, ordered for menus. Public access rules apply (only published). */
export const getServices = cachedQuery('getServices', async (): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'services',
    where: { published: { equals: true } },
    sort: 'order',
    limit: 50,
    depth: 1,
    overrideAccess: false,
  })
  return res.docs
})

export const getHomeFaqs = cachedQuery('getHomeFaqs', async (): Promise<Faq[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'faqs',
    where: { showOnHome: { equals: true } },
    sort: 'order',
    limit: 8,
    depth: 0,
  })
  return res.docs
})

export const getRecentJobs = cachedQuery(
  'getRecentJobs',
  async (limit: number = 3, serviceId?: string): Promise<Job[]> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'jobs',
      where: serviceId
        ? { published: { equals: true }, service: { equals: serviceId } }
        : { published: { equals: true } },
      sort: '-date',
      limit,
      depth: 1,
      overrideAccess: false,
    })
    return res.docs
  },
)

/** Crew members whose partners agreed to show their photo. Never exposes partner money or contact fields. */
export const getVisibleCrew = cachedQuery('getVisibleCrew', async (limit: number = 4) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'partners',
    where: { status: { equals: 'active' } },
    limit: 50,
    depth: 1,
    overrideAccess: true,
    select: { crewMembers: true, rating: true, jobsDone: true },
  })
  const crew: { name: string; photo: Media; rating?: number | null; jobsDone?: number | null }[] =
    []
  for (const p of res.docs) {
    for (const m of p.crewMembers ?? []) {
      if (m.consentToShow && m.photo && typeof m.photo === 'object') {
        crew.push({ name: m.name, photo: m.photo, rating: p.rating, jobsDone: p.jobsDone })
      }
    }
  }
  return crew.slice(0, limit)
})

/** Lowest price across a service's options; null if any option is unpriced. */
export function fromPrice(service: Pick<Service, 'conditions'>): number | null {
  const prices = (service.conditions ?? []).map((c) => c.price)
  if (!prices.length || prices.some((p) => !p || p <= 0)) return null
  return Math.min(...prices)
}

/** Per-option prices of an add-on as { optionKey: price }, or undefined when it has one flat price. */
export function addonOptionPrices(a: Pick<Addon, 'optionPrices'>): Record<string, number> | undefined {
  const rows = (a.optionPrices ?? []).filter((p) => p.price > 0)
  return rows.length ? Object.fromEntries(rows.map((p) => [p.conditionKey, p.price])) : undefined
}

/** Active add-ons with a real price, ready for a planner. */
export function plannerAddons(service: Pick<Service, 'addons'>) {
  return (service.addons ?? [])
    .filter((a): a is Addon => typeof a === 'object' && a !== null && Boolean(a.active))
    .map((a) => ({ id: a.id, name: a.name, price: a.price, unit: a.unit ?? '', optionPrices: addonOptionPrices(a) }))
    // Flat-price add-ons need a price; per-option ones are priced per option.
    .filter((a) => (a.optionPrices ? true : a.price > 0))
}

export const mediaUrl = (m: unknown, size?: 'card' | 'hero'): string | null => {
  if (!m || typeof m !== 'object') return null
  const media = m as Media
  return (size && media.sizes?.[size]?.url) || media.url || null
}

/** One published service with its options, add-ons, FAQs and related services populated. */
export const getServiceBySlug = cachedQuery(
  'getServiceBySlug',
  async (slug: string): Promise<Service | null> => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug }, published: { equals: true } },
      limit: 1,
      depth: 2,
      overrideAccess: false,
    })
    return res.docs[0] ?? null
  },
)

export const getPricingFaqs = cachedQuery('getPricingFaqs', async (): Promise<Faq[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'faqs',
    where: { showOnPricing: { equals: true } },
    sort: 'order',
    limit: 8,
    depth: 0,
  })
  return res.docs
})

export const getBookingSettings = cachedQuery('getBookingSettings', async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'booking-settings', depth: 0 })
})

/** Short lower-case name used in sentences, e.g. "kitchen", "full home". */
export const shortName = (s: Pick<Service, 'menuLabel' | 'name'>) =>
  (s.menuLabel || s.name).toLowerCase()

export const getOccasionBySlug = cachedQuery('getOccasionBySlug', async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'occasions',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })
  return res.docs[0] ?? null
})

export const getPageBySlug = cachedQuery('getPageBySlug', async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return res.docs[0] ?? null
})

export const getAllFaqs = cachedQuery('getAllFaqs', async (): Promise<Faq[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'faqs', sort: 'order', limit: 200, depth: 0 })
  return res.docs
})

/** Calendar day (YYYY-MM-DD) of a stored date, in India time. */
export const istDate = (iso: string | null | undefined) =>
  iso
    ? new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(iso))
    : null

type Season = NonNullable<Occasion['seasons']>[number]

/** The season to show today: the one running now, else the next one coming up (spec S6b). */
export function currentSeason(
  occasion: Occasion,
  today: string,
): { season: Season; live: boolean } | null {
  const seasons = (occasion.seasons ?? []).map((s) => ({
    s,
    from: istDate(s.activeFrom)!,
    to: istDate(s.activeTo)!,
  }))
  const live = seasons.find((x) => x.from <= today && today <= x.to)
  if (live) return { season: live.s, live: true }
  const upcoming = seasons
    .filter((x) => x.from > today)
    .sort((a, b) => a.from.localeCompare(b.from))[0]
  return upcoming ? { season: upcoming.s, live: false } : null
}

/**
 * Live slot meter for a season's peak week: share of half-day units already booked.
 * Returns null when there is no peak week set or it has passed.
 */
export const seasonSlotMeter = cachedQuery(
  'seasonSlotMeter',
  async (from: string | null, to: string | null, today: string) => {
    if (!from || !to || to < today) return null
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'booking-settings', depth: 0 })
    const days: string[] = []
    for (let d = new Date(`${from}T00:00:00Z`); ; d = new Date(d.getTime() + 86_400_000)) {
      const day = d.toISOString().slice(0, 10)
      if (day > to) break
      if (day > today) days.push(day)
    }
    if (!days.length) return null
    const cap = await payload.find({
      collection: 'capacity',
      where: { day: { in: days } },
      limit: 0,
      depth: 0,
      overrideAccess: true,
    })
    let total = 0
    let booked = 0
    for (const day of days) {
      for (const half of ['am', 'pm'] as const) {
        const rec = cap.docs.find((c) => c.day === day && c.half === half)
        const capacity = rec?.blocked ? 0 : (rec?.capacity ?? settings.crewsPerDay ?? 3)
        total += capacity
        booked += Math.min(rec?.booked ?? 0, capacity)
      }
    }
    return total ? Math.round((booked / total) * 100) : 100
  },
  { tags: [CAPACITY_TAG], revalidate: 120 },
)
