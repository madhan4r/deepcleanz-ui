import type { Field } from 'payload'

/** A simple list of short text lines, e.g. "Not included" items or handover checks. */
export const textList = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'array',
  admin: { description, initCollapsed: true },
  fields: [{ name: 'item', type: 'text', required: true }],
})

/** URL slug: lowercase, hyphens only. */
export const slugField = (description?: string): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description },
  validate: (value: unknown) =>
    typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? true
      : 'Use lowercase letters, numbers and hyphens only (e.g. kitchen-cleaning-chennai).',
})

export const publishedField: Field = {
  name: 'published',
  type: 'checkbox',
  defaultValue: false,
  admin: { position: 'sidebar', description: 'Only published records appear on the website.' },
}

export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 0,
  admin: { position: 'sidebar', description: 'Lower numbers show first.' },
}

/** Calendar day as YYYY-MM-DD (Asia/Kolkata), used for capacity and bookings. */
export const dayField = (name = 'day', label = 'Day (YYYY-MM-DD)'): Field => ({
  name,
  label,
  type: 'text',
  required: true,
  index: true,
  validate: (value: unknown) =>
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? true : 'Format: YYYY-MM-DD',
})

export const halfOptions = [
  { label: 'Morning (AM)', value: 'am' },
  { label: 'Afternoon (PM)', value: 'pm' },
]
