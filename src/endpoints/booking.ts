import { APIError, type Endpoint, type PayloadRequest } from 'payload'

import { roleOf } from '../access/roles'
import {
  assertStartTime,
  availability,
  BookingInputError,
  checkArea,
  isIndianMobile,
  loadSelection,
  normalisePhone,
  NOTE_KEYS,
  readAttribution,
} from '../lib/booking'

/**
 * Public booking API (spec S8), served by Payload under /api/bookings/...
 *   GET  /api/bookings/availability?service=&option=&addons=a,b
 *   GET  /api/bookings/area-check?q=
 *   POST /api/bookings/lead      — saved the moment a valid phone number is entered
 *   POST /api/bookings/request   — creates the booking (price + capacity enforced on the server)
 *   GET  /api/bookings/ads-conversions.csv — owner only: paid jobs with a Google Ads click id, for
 *        Google Ads → Conversions → Uploads (spec S14). Add ?mark=1 to mark them as uploaded.
 */

// Best-effort abuse guard: per-IP limit for the two write endpoints (per server instance).
const hits = new Map<string, number[]>()
function limited(req: PayloadRequest, max: number, windowMs = 10 * 60_000) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > max
}

const fail = (err: unknown) => {
  if (err instanceof BookingInputError) return Response.json({ error: err.message }, { status: err.status })
  if (err instanceof APIError) return Response.json({ error: err.message }, { status: err.status })
  console.error('[booking]', err)
  return Response.json({ error: 'Something went wrong. Please call or WhatsApp us.' }, { status: 500 })
}

const readJson = async (req: PayloadRequest): Promise<Record<string, unknown>> => {
  try {
    const body = req.json ? await req.json() : {}
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export const bookingEndpoints: Endpoint[] = [
  {
    path: '/availability',
    method: 'get',
    handler: async (req) => {
      try {
        const q = req.searchParams
        const sel = await loadSelection(req.payload, {
          service: q.get('service'),
          option: q.get('option'),
          addons: (q.get('addons') ?? '').split(',').filter(Boolean),
        })
        const days = await availability(req.payload, sel.wholeDay)
        return Response.json({
          service: { slug: sel.service.slug, name: sel.service.name },
          option: sel.conditionLabel,
          total: sel.total,
          wholeDay: sel.wholeDay,
          days,
        })
      } catch (err) {
        return fail(err)
      }
    },
  },
  {
    path: '/area-check',
    method: 'get',
    handler: async (req) => {
      try {
        const q = str(req.searchParams.get('q'), 120)
        if (q.length < 3) return Response.json({ served: null })
        const res = await checkArea(req.payload, q)
        return Response.json({ served: res.served, note: res.area?.note ?? null })
      } catch (err) {
        return fail(err)
      }
    },
  },
  {
    path: '/lead',
    method: 'post',
    handler: async (req) => {
      try {
        if (limited(req, 20)) return Response.json({ error: 'Too many requests' }, { status: 429 })
        const body = await readJson(req)
        if (str(body.website, 100)) return Response.json({ ok: true }) // honeypot
        const phone = normalisePhone(body.phone)
        if (!isIndianMobile(phone)) throw new BookingInputError('Enter a 10-digit mobile number.')
        const attribution = readAttribution(req.headers.get('cookie'))
        const data = {
          phone,
          name: str(body.name, 60) || undefined,
          stepReached: 'details' as const,
          // Small, plain object only (what they planned: service, option, add-ons, price).
          plannerSnapshot:
            typeof body.plan === 'object' && body.plan && !Array.isArray(body.plan) && JSON.stringify(body.plan).length <= 2000
              ? (body.plan as Record<string, unknown>)
              : undefined,
          landingPage: attribution.landingPage,
          tracking: {
            gclid: attribution.gclid,
            utmSource: attribution.utmSource,
            utmMedium: attribution.utmMedium,
            utmCampaign: attribution.utmCampaign,
          },
        }
        // One open lead per phone: update it instead of creating duplicates.
        const existing = await req.payload.find({
          collection: 'leads',
          where: { phone: { equals: phone }, status: { in: ['new', 'contacted'] } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        if (existing.docs[0]) {
          await req.payload.update({ collection: 'leads', id: existing.docs[0].id, data, overrideAccess: true })
        } else {
          await req.payload.create({ collection: 'leads', data: { ...data, status: 'new' }, overrideAccess: true })
        }
        return Response.json({ ok: true })
      } catch (err) {
        return fail(err)
      }
    },
  },
  {
    path: '/request',
    method: 'post',
    handler: async (req) => {
      try {
        if (limited(req, 8)) return Response.json({ error: 'Too many requests' }, { status: 429 })
        const body = await readJson(req)
        if (str(body.website, 100)) return Response.json({ error: 'Rejected' }, { status: 400 }) // honeypot

        const sel = await loadSelection(req.payload, { service: body.service, option: body.option, addons: body.addons })
        const day = str(body.day, 10)
        const startTime = str(body.startTime, 40)
        await assertStartTime(req.payload, day, startTime, sel.wholeDay)

        const customer = (body.customer ?? {}) as Record<string, unknown>
        const name = str(customer.name, 60)
        const phone = normalisePhone(customer.phone)
        if (name.length < 2) throw new BookingInputError('Please enter your name.')
        if (!isIndianMobile(phone)) throw new BookingInputError('Enter a 10-digit mobile number.')

        const address = (body.address ?? {}) as Record<string, unknown>
        const areaText = str(address.area, 120)
        const line = str(address.line, 200)
        if (areaText.length < 3 || line.length < 3) throw new BookingInputError('Please add your area and address.')
        const area = await checkArea(req.payload, areaText)
        if (!area.served) throw new BookingInputError("We don't cover this area yet — please WhatsApp us and we'll check.", 422)

        const notes = Array.isArray(body.notes)
          ? body.notes.filter((n): n is (typeof NOTE_KEYS)[number] => (NOTE_KEYS as readonly string[]).includes(n as string))
          : []
        const attribution = readAttribution(req.headers.get('cookie'))

        const lead = await req.payload.find({
          collection: 'leads',
          where: { phone: { equals: phone }, status: { in: ['new', 'contacted'] } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })

        // Bookings hooks recompute the price and reserve capacity atomically (409 if the slot just filled).
        const booking = await req.payload.create({
          collection: 'bookings',
          overrideAccess: true,
          data: {
            status: 'new',
            customer: { name, phone, phoneVerified: false },
            items: [{ service: sel.service.id, conditionKey: sel.conditionKey, addons: sel.addonIds }],
            notes,
            specialInstructions: str(body.instructions, 500) || undefined,
            day,
            startTime,
            address: {
              area: area.area?.id,
              areaText,
              line,
              landmark: str(address.landmark, 120) || undefined,
              lift: address.lift !== false,
            },
            lead: lead.docs[0]?.id,
            tracking: attribution,
          },
        })

        const settings = await req.payload.findGlobal({ slug: 'booking-settings', overrideAccess: true })
        const startLabel = (settings.startTimes ?? []).find((s) => s.key === startTime)?.label ?? startTime
        return Response.json({
          bookingNo: booking.bookingNo,
          total: booking.total,
          day,
          startLabel,
          item: `${sel.service.name} · ${sel.conditionLabel}`,
          service: sel.service.slug,
          name,
        })
      } catch (err) {
        return fail(err)
      }
    },
  },
  {
    path: '/ads-conversions.csv',
    method: 'get',
    handler: async (req) => {
      if (roleOf(req.user) !== 'owner') return Response.json({ error: 'Owner login required' }, { status: 403 })
      const all = req.searchParams.get('all') === '1'
      const mark = req.searchParams.get('mark') === '1'
      const settings = await req.payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
      const name = settings.tracking?.adsOfflineConversionName || 'Paid job'
      const res = await req.payload.find({
        collection: 'bookings',
        where: {
          status: { equals: 'paid' },
          'tracking.gclid': { exists: true },
          ...(all ? {} : { conversionUploadedAt: { exists: false } }),
        },
        limit: 0,
        depth: 0,
        overrideAccess: true,
      })
      // Google Ads click-conversion template; times in India time (TimeZone parameter row).
      const fmt = (iso: string) =>
        new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
          .format(new Date(iso))
          .replace(',', '')
      const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
      const rows = res.docs
        .filter((b) => b.tracking?.gclid && b.paidAt)
        .map((b) => [b.tracking!.gclid!, name, fmt(b.paidAt!), String(b.paidAmount ?? b.total ?? 0), 'INR'].map(esc).join(','))
      const csv = ['Parameters:TimeZone=Asia/Kolkata', 'Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency', ...rows].join('\n')
      if (mark) {
        const now = new Date().toISOString()
        for (const b of res.docs) {
          await req.payload.update({ collection: 'bookings', id: b.id, data: { conversionUploadedAt: now }, overrideAccess: true })
        }
      }
      return new Response(csv + '\n', {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="deepcleanz-paid-jobs-${new Date().toISOString().slice(0, 10)}.csv"`,
          'Cache-Control': 'no-store',
        },
      })
    },
  },
]
