import { APIError, type CollectionConfig, type Field } from 'payload'

import { isOwner, isStaff } from '../access/roles'
import { dayField, halfOptions } from '../fields/shared'
import { bustCapacityOnChange } from '../hooks/bustCache'

// Payload hook data (data / originalDoc / req) is untyped; this alias keeps the hooks readable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>
const idOf = (v: unknown) => (typeof v === 'string' ? v : (v as { id: string })?.id)

/** Half-day units per day. Records are created automatically from Booking settings when first needed. */
export const Capacity: CollectionConfig = {
  slug: 'capacity',
  labels: { singular: 'Capacity day', plural: 'Capacity' },
  admin: { useAsTitle: 'day', group: 'Operations', defaultColumns: ['day', 'half', 'booked', 'capacity', 'blocked'] },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isOwner },
  indexes: [{ fields: ['day', 'half'], unique: true }],
  hooks: { afterChange: [bustCapacityOnChange] },
  defaultSort: 'day',
  fields: [
    {
      type: 'row',
      fields: [
        { ...dayField(), admin: { width: '40%' } } as Field,
        { name: 'half', type: 'select', required: true, options: halfOptions, admin: { width: '30%' } },
        { name: 'blocked', type: 'checkbox', defaultValue: false, admin: { width: '30%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'capacity', type: 'number', required: true, min: 0, admin: { width: '50%', description: 'Partner crews available' } },
        { name: 'booked', type: 'number', defaultValue: 0, min: 0, admin: { width: '50%', readOnly: true } },
      ],
    },
    { name: 'note', type: 'text', admin: { description: 'e.g. Pongal — fewer partners' } },
  ],
}

/** Anyone who reached the phone-number step. Saved even if they never finish booking. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: { useAsTitle: 'phone', group: 'Operations', defaultColumns: ['phone', 'name', 'stepReached', 'status', 'createdAt'] },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isOwner },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true, index: true, admin: { width: '40%' } },
        { name: 'name', type: 'text', admin: { width: '60%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Converted', value: 'converted' },
            { label: 'Lost', value: 'lost' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'stepReached',
          type: 'select',
          options: [
            { label: 'Your details', value: 'details' },
            { label: 'OTP', value: 'otp' },
            { label: 'Booked', value: 'booked' },
          ],
          admin: { width: '33%' },
        },
        { name: 'followUpAt', type: 'date', admin: { width: '34%' } },
      ],
    },
    { name: 'plannerSnapshot', type: 'json', admin: { description: 'What they planned: service, option, add-ons, price, date' } },
    { name: 'landingPage', type: 'text' },
    {
      name: 'tracking',
      type: 'group',
      fields: [
        { name: 'gclid', type: 'text' },
        { name: 'utmSource', type: 'text' },
        { name: 'utmMedium', type: 'text' },
        { name: 'utmCampaign', type: 'text' },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
}

/** Each job offer sent to a partner. Accepting assigns the partner and confirms the booking. */
export const Dispatch: CollectionConfig = {
  slug: 'dispatch',
  labels: { singular: 'Job offer', plural: 'Dispatch' },
  admin: { group: 'Operations', defaultColumns: ['booking', 'partner', 'response', 'sentAt'] },
  access: { read: isStaff, create: isStaff, update: isStaff, delete: isOwner },
  defaultSort: '-sentAt',
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (doc.response !== 'accepted' || previousDoc?.response === 'accepted') return doc
        const bookingId = idOf(doc.booking)
        const booking = await req.payload.findByID({ collection: 'bookings', id: bookingId, req, overrideAccess: true })
        if (booking.partner && idOf(booking.partner) !== idOf(doc.partner)) {
          throw new APIError('This booking already has a partner.', 409)
        }
        await req.payload.update({
          collection: 'bookings',
          id: bookingId,
          data: {
            partner: idOf(doc.partner),
            status: ['new', 'partner_requested'].includes(booking.status) ? 'confirmed' : booking.status,
          },
          req,
          overrideAccess: true,
        })
        // Close the other open offers for this booking.
        await req.payload.update({
          collection: 'dispatch',
          where: { booking: { equals: bookingId }, response: { equals: 'pending' }, id: { not_equals: doc.id } },
          data: { response: 'expired', respondedAt: new Date().toISOString() },
          req,
          overrideAccess: true,
        })
        return doc
      },
    ],
  },
  fields: [
    { name: 'booking', type: 'relationship', relationTo: 'bookings', required: true, index: true },
    { name: 'partner', type: 'relationship', relationTo: 'partners', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'response',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Accepted', value: 'accepted' },
            { label: 'Declined', value: 'declined' },
            { label: 'Expired', value: 'expired' },
          ],
          admin: { width: '34%' },
        },
        { name: 'sentAt', type: 'date', defaultValue: () => new Date().toISOString(), admin: { width: '33%' } },
        { name: 'respondedAt', type: 'date', admin: { width: '33%' } },
      ],
    },
    { name: 'note', type: 'text' },
  ],
}

/** Weekly partner settlement. Totals are computed from the selected paid bookings. */
export const Payouts: CollectionConfig = {
  slug: 'payouts',
  admin: { group: 'Partners', defaultColumns: ['partner', 'periodStart', 'payoutAmount', 'status'] },
  access: { read: isOwner, create: isOwner, update: isOwner, delete: isOwner },
  defaultSort: '-periodEnd',
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const bookingIds: string[] = (data.bookings ?? originalDoc?.bookings ?? []).map(idOf)
        const partnerId = idOf(data.partner ?? originalDoc?.partner)
        if (!bookingIds.length) return data
        const { docs } = await req.payload.find({
          collection: 'bookings',
          where: { id: { in: bookingIds } },
          limit: 0,
          depth: 0,
          req,
          overrideAccess: true,
        })
        for (const b of docs as Row[]) {
          if (b.status !== 'paid') throw new APIError(`${b.bookingNo} is not marked paid yet.`, 400)
          if (idOf(b.partner) !== partnerId) throw new APIError(`${b.bookingNo} belongs to another partner.`, 400)
        }
        const sum = (rows: Row[], key: string) => rows.reduce((s, r) => s + (Number(r[key]) || 0), 0)
        const byPartner = (docs as Row[]).filter((b) => b.collectedBy === 'partner')
        data.grossCollected = sum(docs as Row[], 'paidAmount')
        data.commission = sum(docs as Row[], 'commissionAmount')
        data.collectedByPartner = sum(byPartner, 'paidAmount')
        // DeepCleanz pays: everything it collected minus all commission. Negative = partner owes DeepCleanz.
        data.payoutAmount = data.grossCollected - data.collectedByPartner - data.commission
        return data
      },
    ],
  },
  fields: [
    { name: 'partner', type: 'relationship', relationTo: 'partners', required: true },
    {
      type: 'row',
      fields: [
        { name: 'periodStart', type: 'date', required: true, admin: { width: '50%' } },
        { name: 'periodEnd', type: 'date', required: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'bookings',
      type: 'relationship',
      relationTo: 'bookings',
      hasMany: true,
      filterOptions: ({ data }) => ({
        status: { equals: 'paid' },
        ...(data?.partner ? { partner: { equals: idOf(data.partner) } } : {}),
      }),
    },
    {
      type: 'row',
      fields: [
        { name: 'grossCollected', type: 'number', admin: { width: '25%', readOnly: true } },
        { name: 'commission', type: 'number', admin: { width: '25%', readOnly: true } },
        { name: 'collectedByPartner', label: 'Cash taken by partner', type: 'number', admin: { width: '25%', readOnly: true } },
        { name: 'payoutAmount', label: 'Pay partner', type: 'number', admin: { width: '25%', readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'due',
          options: [
            { label: 'Due', value: 'due' },
            { label: 'Paid', value: 'paid' },
          ],
          admin: { width: '33%' },
        },
        { name: 'paidAt', type: 'date', admin: { width: '33%' } },
        { name: 'reference', type: 'text', admin: { width: '34%', description: 'UPI reference' } },
      ],
    },
  ],
}
