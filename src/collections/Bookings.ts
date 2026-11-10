import { APIError, type CollectionConfig, type Field } from 'payload'

import { isOwner, isStaff } from '../access/roles'
import { bookingEndpoints } from '../endpoints/booking'
import { bustCapacityOnChange } from '../hooks/bustCache'
import { dayField, halfOptions } from '../fields/shared'
import { releaseHalves, reserveHalves } from '../lib/capacity'
import { type Half, halvesFor, priceItems, splitCommission } from '../lib/pricing'

const ASSIGNED_STATUSES = ['confirmed', 'in_progress', 'completed', 'paid']

// Payload hook data (data / originalDoc / req) is untyped; this alias keeps the hooks readable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

async function startTimeHalf(req: Row['req'], startTime: string): Promise<Half> {
  const settings = await req.payload.findGlobal({ slug: 'booking-settings', req, overrideAccess: true })
  const slot = (settings.startTimes ?? []).find((s: Row) => s.key === startTime)
  if (!slot) throw new APIError(`Unknown start time "${startTime}"`, 400)
  return slot.half as Half
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'bookingNo',
    group: 'Operations',
    defaultColumns: ['bookingNo', 'day', 'startTime', 'status', 'partner', 'total'],
    listSearchableFields: ['bookingNo', 'customer.phone', 'customer.name'],
  },
  access: {
    read: isStaff,
    create: isStaff, // public bookings come through the booking API route (server-side)
    update: isStaff,
    delete: isOwner,
  },
  defaultSort: '-createdAt',
  endpoints: bookingEndpoints,
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        const prev: Row = originalDoc ?? {}
        const items = data.items ?? prev.items

        // 1. Price on the server, every time items change.
        if (operation === 'create' || data.items !== undefined) {
          if (!items?.length) throw new APIError('Add at least one item.', 400)
          const priced = await priceItems(
            req.payload,
            items.map((i: Row) => ({ service: i.service, conditionKey: i.conditionKey, addons: i.addons })),
            req,
          )
          data.items = items.map((i: Row, idx: number) => ({
            ...i,
            label: priced.items[idx].conditionLabel,
            linePrice: priced.items[idx].linePrice,
          }))
          data.total = priced.total
          data.wholeDay = priced.wholeDay
        }

        const day = data.day ?? prev.day
        const startTime = data.startTime ?? prev.startTime
        const wholeDay = data.wholeDay ?? prev.wholeDay ?? false

        // 2. New booking: number + reserve capacity.
        if (operation === 'create') {
          // Match-all `where` → countDocuments (estimatedDocumentCount is refused inside a transaction).
          const { totalDocs } = await req.payload.count({ collection: 'bookings', where: { id: { exists: true } }, req, overrideAccess: true })
          data.bookingNo = `DC-${1001 + totalDocs}`
          data.halves = halvesFor(await startTimeHalf(req, startTime), wholeDay)
          const ok = await reserveHalves(req.payload, day, data.halves)
          if (!ok) throw new APIError('That date and time is full — please pick another slot.', 409)
          data.status = data.status ?? 'new'
        }

        // 3. Rescheduled (or job length changed): take new units, give back old ones.
        if (operation === 'update') {
          const newHalves = halvesFor(await startTimeHalf(req, startTime), wholeDay)
          const moved =
            day !== prev.day || JSON.stringify(newHalves) !== JSON.stringify(prev.halves ?? [])
          const live = (data.status ?? prev.status) !== 'cancelled'
          if (moved && live) {
            const ok = await reserveHalves(req.payload, day, newHalves)
            if (!ok) throw new APIError('The new date and time is full.', 409)
            if (prev.day && prev.halves?.length) await releaseHalves(req.payload, prev.day, prev.halves)
            data.halves = newHalves
          }
        }

        // 4. A partner must be assigned once the job is confirmed.
        const status = data.status ?? prev.status
        const partner = data.partner ?? prev.partner
        if (ASSIGNED_STATUSES.includes(status) && !partner) {
          throw new APIError('Assign a partner before moving past "Partner requested".', 400)
        }

        // 5. Marked paid: lock in commission and partner payout.
        if (status === 'paid' && prev.status !== 'paid') {
          const paidAmount = data.paidAmount ?? prev.paidAmount
          if (typeof paidAmount !== 'number') throw new APIError('Enter the amount paid.', 400)
          let rate = data.commissionRate ?? prev.commissionRate
          if (typeof rate !== 'number') {
            const partnerId = typeof partner === 'string' ? partner : partner.id
            const p = await req.payload.findByID({ collection: 'partners', id: partnerId, req, overrideAccess: true })
            rate = p.commissionRate
          }
          const split = splitCommission(paidAmount, rate)
          data.commissionRate = rate
          data.commissionAmount = split.commissionAmount
          data.partnerPayout = split.partnerPayout
          data.paidAt = data.paidAt ?? new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      bustCapacityOnChange,
      // New booking → email the owner/ops (only when ALERT_EMAIL and SMTP are set).
      async ({ doc, operation, req }) => {
        const to = process.env.ALERT_EMAIL
        if (operation !== 'create' || !to || !process.env.SMTP_HOST) return doc
        try {
          const settings = await req.payload.findGlobal({ slug: 'booking-settings', req, overrideAccess: true })
          const start = (settings.startTimes ?? []).find((s) => s.key === doc.startTime)?.label ?? doc.startTime
          const notes = (doc.notes ?? []).join(', ')
          const lines = [
            `New booking ${doc.bookingNo}`,
            '',
            ...(doc.items ?? []).map((i: Row) => `• ${i.label} — ₹${i.linePrice}`),
            `Total: ₹${doc.total}  (pay after service)`,
            `When: ${doc.day} · ${start}${doc.wholeDay ? ' · whole day' : ''}`,
            `Customer: ${doc.customer?.name} · ${doc.customer?.phone} (phone not verified — call to confirm)`,
            `Address: ${doc.address?.line}, ${doc.address?.areaText}${doc.address?.landmark ? ` (near ${doc.address.landmark})` : ''}${doc.address?.lift === false ? ' · NO LIFT' : ''}`,
            notes ? `Notes: ${notes}` : '',
            doc.specialInstructions ? `Instructions: ${doc.specialInstructions}` : '',
            '',
            `Open in admin: ${(process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')}/admin/collections/bookings/${doc.id}`,
          ].filter((l) => l !== '')
          await req.payload.sendEmail({ to, subject: `New booking ${doc.bookingNo} · ${doc.day} · ₹${doc.total}`, text: lines.join('\n') })
        } catch (err) {
          req.payload.logger.error({ err }, `Booking alert email failed for ${doc.bookingNo}`)
        }
        return doc
      },
      async ({ doc, previousDoc, operation, req }) => {
        const prev: Row = previousDoc ?? {}
        // Cancelled: free the capacity.
        if (operation === 'update' && doc.status === 'cancelled' && prev.status !== 'cancelled') {
          if (prev.day && prev.halves?.length) await releaseHalves(req.payload, prev.day, prev.halves)
        }
        // Lead → converted.
        if (operation === 'create' && doc.lead) {
          const leadId = typeof doc.lead === 'string' ? doc.lead : doc.lead.id
          await req.payload.update({ collection: 'leads', id: leadId, data: { status: 'converted' }, req, overrideAccess: true })
        }
        // Partner stats: jobs done + average rating.
        const partnerId = doc.partner ? (typeof doc.partner === 'string' ? doc.partner : doc.partner.id) : null
        const becamePaid = doc.status === 'paid' && prev.status !== 'paid'
        const ratingChanged = doc.customerRating !== prev.customerRating
        if (partnerId && (becamePaid || ratingChanged)) {
          const paid = await req.payload.find({
            collection: 'bookings',
            where: { partner: { equals: partnerId }, status: { equals: 'paid' } },
            limit: 0,
            depth: 0,
            req,
            overrideAccess: true,
          })
          const rated = paid.docs.filter((b) => typeof b.customerRating === 'number')
          const rating = rated.length
            ? Math.round((rated.reduce((s, b) => s + (b.customerRating as number), 0) / rated.length) * 10) / 10
            : undefined
          await req.payload.update({
            collection: 'partners',
            id: partnerId,
            data: { jobsDone: paid.totalDocs, rating },
            req,
            overrideAccess: true,
          })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'bookingNo',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Partner requested', value: 'partner_requested' },
        { label: 'Confirmed (partner accepted)', value: 'confirmed' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Completed — awaiting payment', value: 'completed' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'partner', type: 'relationship', relationTo: 'partners', admin: { position: 'sidebar' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Job',
          fields: [
            {
              name: 'customer',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'phone', type: 'text', required: true, index: true, admin: { width: '40%' } },
                    { name: 'phoneVerified', type: 'checkbox', admin: { width: '20%' } },
                  ],
                },
              ],
            },
            {
              name: 'items',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'service', type: 'relationship', relationTo: 'services', required: true, admin: { width: '50%' } },
                    { name: 'conditionKey', type: 'text', required: true, admin: { width: '50%', description: 'Condition key from the service, e.g. 2bhk' } },
                  ],
                },
                { name: 'addons', type: 'relationship', relationTo: 'addons', hasMany: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', admin: { width: '70%', readOnly: true } },
                    { name: 'linePrice', type: 'number', admin: { width: '30%', readOnly: true } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'total', type: 'number', admin: { width: '50%', readOnly: true, description: 'Computed on the server' } },
                { name: 'wholeDay', type: 'checkbox', admin: { width: '50%', readOnly: true } },
              ],
            },
            {
              name: 'notes',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Pets at home', value: 'pets' },
                { label: 'Baby / elders', value: 'kids_elders' },
                { label: 'Limited water', value: 'limited_water' },
                { label: 'Watchman has key', value: 'watchman_key' },
              ],
            },
            { name: 'specialInstructions', type: 'textarea' },
          ],
        },
        {
          label: 'When & where',
          fields: [
            {
              type: 'row',
              fields: [
                { ...dayField(), admin: { width: '40%' } } as Field,
                {
                  name: 'startTime',
                  type: 'text',
                  required: true,
                  admin: { width: '30%', description: 'Start-time key from Booking settings, e.g. am-0830' },
                },
                {
                  name: 'halves',
                  type: 'select',
                  hasMany: true,
                  options: halfOptions,
                  admin: { width: '30%', readOnly: true },
                },
              ],
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'area', type: 'relationship', relationTo: 'areas' },
                { name: 'areaText', type: 'text', admin: { description: 'As typed by the customer' } },
                { name: 'line', type: 'text', required: true },
                { name: 'landmark', type: 'text' },
                { name: 'lift', type: 'checkbox', defaultValue: true },
              ],
            },
          ],
        },
        {
          label: 'Payment',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'paidAmount', type: 'number', min: 0, admin: { width: '25%' } },
                {
                  name: 'paymentMethod',
                  type: 'select',
                  options: [
                    { label: 'UPI to DeepCleanz', value: 'upi' },
                    { label: 'Cash', value: 'cash' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'collectedBy',
                  type: 'select',
                  defaultValue: 'deepcleanz',
                  options: [
                    { label: 'DeepCleanz', value: 'deepcleanz' },
                    { label: 'Partner (cash) — deduct from payout', value: 'partner' },
                  ],
                  admin: { width: '25%' },
                },
                { name: 'paidAt', type: 'date', admin: { width: '25%' } },
              ],
            },
            { name: 'paymentReference', type: 'text', admin: { description: 'UPI reference number' } },
            {
              type: 'row',
              fields: [
                { name: 'commissionRate', label: 'Commission %', type: 'number', admin: { width: '33%', description: 'Defaults to the partner’s rate' } },
                { name: 'commissionAmount', type: 'number', admin: { width: '33%', readOnly: true } },
                { name: 'partnerPayout', type: 'number', admin: { width: '34%', readOnly: true } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'customerRating', type: 'number', min: 1, max: 5, admin: { width: '30%' } },
                { name: 'ratingNote', type: 'text', admin: { width: '70%' } },
              ],
            },
            { name: 'cancelReason', type: 'text' },
          ],
        },
        {
          label: 'Tracking',
          fields: [
            { name: 'lead', type: 'relationship', relationTo: 'leads' },
            {
              name: 'tracking',
              type: 'group',
              fields: [
                { name: 'gclid', type: 'text' },
                { name: 'utmSource', type: 'text' },
                { name: 'utmMedium', type: 'text' },
                { name: 'utmCampaign', type: 'text' },
                { name: 'landingPage', type: 'text' },
              ],
            },
            {
              name: 'conversionUploadedAt',
              type: 'date',
              admin: { description: 'Set when this paid job is uploaded to Google Ads as an offline conversion.' },
            },
          ],
        },
      ],
    },
  ],
}
