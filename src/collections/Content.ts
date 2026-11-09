import type { CollectionConfig } from 'payload'

import { anyone, isOwner, isStaff, publishedOrStaff } from '../access/roles'
import { orderField, publishedField, slugField, textList } from '../fields/shared'
import { siteCacheHooks } from '../hooks/bustCache'

/** Occasion pages — one URL per occasion kept all year; seasons swap the content by date. */
export const Occasions: CollectionConfig = {
  slug: 'occasions',
  hooks: siteCacheHooks,
  admin: { useAsTitle: 'name', group: 'Content', defaultColumns: ['name', 'slug', 'published'] },
  access: { read: publishedOrStaff, create: isOwner, update: isOwner, delete: isOwner },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('e.g. festival-deep-cleaning-chennai'),
    publishedField,
    {
      name: 'evergreen',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Year-round page (move-in, rental handover). Leave off for seasonal pages.' },
    },
    {
      name: 'offSeasonMessage',
      type: 'textarea',
      admin: { description: 'Shown when no season is active, with the next booking-open date.' },
    },
    {
      name: 'seasons',
      type: 'array',
      admin: { description: 'e.g. Pongal (Dec–Jan) and Diwali (Sep–Nov) on the same festival page.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'bookingOpensOn', type: 'date', admin: { width: '33%' } },
            { name: 'activeFrom', type: 'date', required: true, admin: { width: '33%' } },
            { name: 'activeTo', type: 'date', required: true, admin: { width: '33%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'rushFrom', type: 'date', admin: { width: '50%', description: 'Peak week shown in the live slot meter (from)' } },
            { name: 'rushTo', type: 'date', admin: { width: '50%', description: '(to), e.g. the 7 days before Bhogi' } },
          ],
        },
        { name: 'badge', type: 'text' },
        { name: 'h1', type: 'text', required: true },
        { name: 'subline', type: 'textarea' },
        { name: 'extras', type: 'relationship', relationTo: 'addons', hasMany: true },
        {
          name: 'focus',
          label: 'What this clean puts first',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea' },
          ],
        },
        {
          name: 'timeline',
          type: 'array',
          fields: [
            { name: 'when', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea' },
          ],
        },
        textList('prepList', 'Prep list (e.g. Bhogi declutter)'),
        { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
      ],
    },
  ],
}

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  hooks: siteCacheHooks,
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { useAsTitle: 'question', group: 'Content', defaultColumns: ['question', 'topic', 'order'] },
  access: { read: anyone, create: isOwner, update: isOwner, delete: isOwner },
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'topic',
      type: 'select',
      required: true,
      defaultValue: 'booking',
      options: [
        { label: 'Booking', value: 'booking' },
        { label: 'Price & payment', value: 'payment' },
        { label: 'On the day', value: 'day' },
        { label: 'Safety', value: 'safety' },
        { label: 'After the clean', value: 'after' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'showOnHome', type: 'checkbox', admin: { width: '50%' } },
        { name: 'showOnPricing', type: 'checkbox', admin: { width: '50%' } },
      ],
    },
    orderField,
  ],
}

export const Areas: CollectionConfig = {
  slug: 'areas',
  admin: { useAsTitle: 'name', group: 'Operations', defaultColumns: ['name', 'served'] },
  access: { read: anyone, create: isOwner, update: isOwner, delete: isOwner },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    textList('pincodes', 'Pincodes'),
    { name: 'served', type: 'checkbox', defaultValue: true },
    { name: 'note', type: 'text', admin: { description: 'e.g. "Partner usually 20 min away"' } },
  ],
}

/** "Fresh from the field" — real before/after from recent jobs. */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  hooks: siteCacheHooks,
  labels: { singular: 'Field job', plural: 'Fresh from the field' },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'service', 'area', 'date', 'published'] },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isOwner,
  },
  defaultSort: '-date',
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Heavy-grease kitchen"' } },
    { name: 'service', type: 'relationship', relationTo: 'services', required: true },
    {
      type: 'row',
      fields: [
        { name: 'area', type: 'text', required: true, admin: { width: '40%' } },
        { name: 'date', type: 'date', required: true, admin: { width: '30%' } },
        { name: 'durationHrs', type: 'number', admin: { width: '15%' } },
        { name: 'crewSize', type: 'number', admin: { width: '15%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'beforeImage', type: 'upload', relationTo: 'media', required: true, admin: { width: '50%' } },
        { name: 'afterImage', type: 'upload', relationTo: 'media', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'customerQuote', type: 'textarea' },
    { name: 'customerRating', type: 'number', min: 1, max: 5 },
    { name: 'booking', type: 'relationship', relationTo: 'bookings', admin: { position: 'sidebar' } },
    {
      name: 'customerConsent',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Customer agreed to show these photos.' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Only published jobs appear on the website.' },
      validate: (value, { siblingData }) =>
        value && !(siblingData as { customerConsent?: boolean })?.customerConsent
          ? 'Tick customer consent before publishing.'
          : true,
    },
  ],
}

/**
 * Text pages written in admin: policies (privacy, terms, cancellation, damage) and any other simple page.
 * Served at /{slug}. Drafts stay unpublished until the owner has reviewed the wording.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: siteCacheHooks,
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'slug', 'published', 'updatedAt'] },
  access: { read: publishedOrStaff, create: isOwner, update: isOwner, delete: isOwner },
  versions: { maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('e.g. privacy-policy'),
    publishedField,
    { name: 'metaDescription', type: 'textarea', maxLength: 155 },
    { name: 'body', type: 'richText', required: true },
  ],
}
