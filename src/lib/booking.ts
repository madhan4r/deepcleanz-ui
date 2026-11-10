import type { Payload } from 'payload'

import type { BookingSetting, Service } from '@/payload-types'

import { addonPriceFor, type Half, priceItems } from './pricing'

export const TZ = 'Asia/Kolkata'
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
export const NOTE_KEYS = ['pets', 'kids_elders', 'limited_water', 'watchman_key'] as const
export type NoteKey = (typeof NOTE_KEYS)[number]

/** YYYY-MM-DD for "now" in India, plus n days. */
export function istDay(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

/** Weekday key for a YYYY-MM-DD calendar day (timezone-independent). */
export function weekdayOf(day: string): (typeof WEEKDAYS)[number] {
  const [y, m, d] = day.split('-').map(Number)
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
}

export function dayLabel(day: string) {
  const [y, m, d] = day.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return {
    weekday: date.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' }),
    date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
  }
}

export class BookingInputError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message)
  }
}

export type Selection = {
  service: Service
  conditionKey: string
  conditionLabel: string
  addonIds: string[]
  total: number
  wholeDay: boolean
}

/**
 * Validates what the customer picked against the live catalogue: published service,
 * a real option with a price, and only add-ons offered for that service.
 */
export async function loadSelection(
  payload: Payload,
  input: { service?: unknown; option?: unknown; addons?: unknown },
): Promise<Selection> {
  const slug = typeof input.service === 'string' ? input.service : ''
  const optionKey = typeof input.option === 'string' ? input.option : ''
  const res = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const service = res.docs[0]
  if (!service) throw new BookingInputError('This service is not available for online booking.')
  const condition = (service.conditions ?? []).find((c) => c.key === optionKey)
  if (!condition || !(condition.price > 0)) throw new BookingInputError('Please pick an option.')

  const offered = new Set((service.addons ?? []).map((a) => (typeof a === 'string' ? a : a.id)))
  const requested = Array.isArray(input.addons) ? input.addons.filter((a): a is string => typeof a === 'string') : []
  const candidates = Array.from(new Set(requested)).filter((id) => offered.has(id))
  // Keep only add-ons that are live and priced for this option (a stale link may carry others).
  const addonIds: string[] = []
  for (const id of candidates) {
    const addon = await payload.findByID({ collection: 'addons', id, depth: 0, overrideAccess: true }).catch(() => null)
    const price = addon?.active ? addonPriceFor(addon, condition.key) : null
    if (price !== null && price > 0) addonIds.push(id)
  }

  const priced = await priceItems(payload, [{ service: service.id, conditionKey: condition.key, addons: addonIds }])
  return {
    service,
    conditionKey: condition.key,
    conditionLabel: condition.label,
    addonIds,
    total: priced.total,
    wholeDay: priced.wholeDay,
  }
}

export type StartTimeAvailability = { key: string; label: string; available: boolean }
export type DayAvailability = { day: string; weekday: string; date: string; status: 'open' | 'few' | 'full'; startTimes: StartTimeAvailability[] }

/** Start times allowed on a weekday for this job length. */
function startTimesFor(settings: BookingSetting, day: string, wholeDay: boolean) {
  const wd = weekdayOf(day)
  return (settings.startTimes ?? []).filter((s) => (s.days ?? []).includes(wd) && (!wholeDay || s.allowWholeDay))
}

/**
 * Next N bookable days (from tomorrow, India time) with each start time marked available or full.
 * Uses the same capacity rules as reserveHalves: one unit per half-day per partner crew.
 */
export async function availability(payload: Payload, wholeDay: boolean): Promise<DayAvailability[]> {
  const settings = await payload.findGlobal({ slug: 'booking-settings', overrideAccess: true })
  const windowDays = settings.bookingWindowDays ?? 14
  const days = Array.from({ length: windowDays }, (_, i) => istDay(i + 1))

  const cap = await payload.find({
    collection: 'capacity',
    where: { day: { in: days } },
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })
  const defaultCapacity = settings.crewsPerDay ?? 3
  const free = (day: string, half: Half) => {
    const rec = cap.docs.find((c) => c.day === day && c.half === half)
    if (rec?.blocked) return 0
    return Math.max(0, (rec?.capacity ?? defaultCapacity) - (rec?.booked ?? 0))
  }

  return days.map((day) => {
    const { weekday, date } = dayLabel(day)
    const startTimes = startTimesFor(settings, day, wholeDay).map((s) => {
      const halves: Half[] = wholeDay ? ['am', 'pm'] : [s.half as Half]
      return { key: s.key, label: s.label, available: halves.every((h) => free(day, h) > 0) }
    })
    const minFree = Math.min(free(day, 'am'), free(day, 'pm'))
    const anyOpen = startTimes.some((s) => s.available)
    const status: DayAvailability['status'] = !anyOpen ? 'full' : minFree <= 1 ? 'few' : 'open'
    return { day, weekday, date, status, startTimes }
  })
}

/** Is this start time valid for this day and job length? (Re-checked on the server before booking.) */
export async function assertStartTime(payload: Payload, day: string, startTime: string, wholeDay: boolean) {
  const settings = await payload.findGlobal({ slug: 'booking-settings', overrideAccess: true })
  const windowDays = settings.bookingWindowDays ?? 14
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < istDay(1) || day > istDay(windowDays)) {
    throw new BookingInputError('Please pick a date from the calendar.')
  }
  if (!startTimesFor(settings, day, wholeDay).some((s) => s.key === startTime)) {
    throw new BookingInputError('Please pick a start time.')
  }
}

/**
 * Service-area check (spec S8 step 3). If no areas are set up in admin, all of Chennai is served (D12).
 * Matches an area name or a 6-digit pincode inside what the customer typed.
 */
export async function checkArea(payload: Payload, text: string): Promise<{ served: boolean; area?: { id: string; name: string; note?: string | null } }> {
  const res = await payload.find({ collection: 'areas', limit: 0, depth: 0, overrideAccess: true })
  if (!res.docs.length) return { served: true }
  const q = text.toLowerCase()
  const pin = q.match(/\b6\d{5}\b/)?.[0]
  const hit = res.docs.find(
    (a) => q.includes(a.name.toLowerCase()) || (pin && (a.pincodes ?? []).some((p) => p.item === pin)),
  )
  if (!hit) return { served: false }
  return { served: Boolean(hit.served), area: { id: hit.id, name: hit.name, note: hit.note } }
}

export const isIndianMobile = (phone: string) => /^[6-9]\d{9}$/.test(phone)

/** Normalises "+91 98765 43210" / "098765-43210" to 10 digits. */
export const normalisePhone = (raw: unknown) => {
  const d = String(raw ?? '').replace(/\D/g, '')
  return d.length > 10 ? d.slice(-10) : d
}

/** Attribution cookie written by <Tracking /> (gclid + UTM, 90 days). */
export function readAttribution(cookieHeader: string | null | undefined) {
  const raw = (cookieHeader ?? '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('dc_attr='))
  if (!raw) return {}
  try {
    const v = JSON.parse(decodeURIComponent(raw.slice('dc_attr='.length)))
    const str = (x: unknown) => (typeof x === 'string' ? x.slice(0, 200) : undefined)
    return {
      gclid: str(v.gclid),
      utmSource: str(v.utmSource),
      utmMedium: str(v.utmMedium),
      utmCampaign: str(v.utmCampaign),
      landingPage: str(v.landingPage),
    }
  } catch {
    return {}
  }
}
