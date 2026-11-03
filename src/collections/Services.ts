import type { CollectionConfig } from 'payload'

import { isOwner, publishedOrStaff } from '../access/roles'
import { orderField, publishedField, slugField, textList } from '../fields/shared'
import { touchPrices } from '../hooks/touchPrices'

/**
 * One record per service page (8 at launch). Drives the service page, the planners,
 * the pricing page and server-side booking prices.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    group: 'Catalogue',
    defaultColumns: ['name', 'slug', 'published', 'order'],
  },
  access: {
    read: publishedOrStaff,
    create: isOwner,
    update: isOwner,
    delete: isOwner,
  },
  versions: { maxPerDoc: 50 },
  hooks: { afterChange: [touchPrices] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('e.g. kitchen-cleaning-chennai'),
    publishedField,
    orderField,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page & SEO',
          fields: [
            { name: 'h1', type: 'text', required: true, admin: { description: '"{Service} in Chennai"' } },
            { name: 'subline', type: 'textarea', admin: { description: 'Pain-led one-liner under the H1.' } },
            {
              name: 'seoTitle',
              type: 'text',
              maxLength: 60,
              admin: { description: '≤ 60 chars: "{Service} in Chennai from ₹{price} | DeepCleanz"' },
            },
            { name: 'metaDescription', type: 'textarea', maxLength: 155 },
            { name: 'menuLabel', type: 'text', admin: { description: 'Short name for tabs and menus.' } },
          ],
        },
        {
          label: 'Conditions & prices',
          fields: [
            {
              name: 'conditions',
              label: 'Condition cards ("Which looks most like yours?")',
              type: 'array',
              minRows: 1,
              admin: { description: 'Each card is one price option, e.g. Light / Regular / Heavy grease or 1/2/3 BHK.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'key',
                      type: 'text',
                      required: true,
                      admin: { width: '25%', description: 'Stable id, e.g. light, 2bhk' },
                    },
                    { name: 'label', type: 'text', required: true, admin: { width: '35%' } },
                    { name: 'price', type: 'number', required: true, min: 0, admin: { width: '20%', description: '₹' } },
                    {
                      name: 'units',
                      type: 'select',
                      required: true,
                      defaultValue: 'half',
                      options: [
                        { label: 'Half day', value: 'half' },
                        { label: 'Whole day', value: 'whole' },
                      ],
                      admin: { width: '20%' },
                    },
                  ],
                },
                { name: 'description', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'durationHrs', type: 'text', admin: { width: '50%', description: 'e.g. 3–4' } },
                    { name: 'crewSize', type: 'number', min: 1, admin: { width: '50%' } },
                  ],
                },
                { name: 'photo', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'addons',
              type: 'relationship',
              relationTo: 'addons',
              hasMany: true,
            },
          ],
        },
        {
          label: 'What we clean',
          fields: [
            { name: 'zoneImage', type: 'upload', relationTo: 'media' },
            {
              name: 'zones',
              type: 'array',
              admin: { description: 'Numbered pins on the zone map (pin position in % of the image).' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'pinX', type: 'number', min: 0, max: 100, admin: { width: '20%' } },
                    { name: 'pinY', type: 'number', min: 0, max: 100, admin: { width: '20%' } },
                    { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
                { name: 'description', type: 'textarea' },
              ],
            },
            textList('excluded', 'Not included'),
            textList('handover', 'Handover checklist', 'What the customer checks before paying.'),
          ],
        },
        {
          label: 'After & FAQs',
          fields: [
            textList('tips', 'Care tips ("Keep it clean for 3 months")'),
            { name: 'reminderMonths', type: 'number', defaultValue: 3, min: 1 },
            { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
            { name: 'related', label: 'Upgrade / related services', type: 'relationship', relationTo: 'services', hasMany: true },
          ],
        },
      ],
    },
  ],
}

export const Addons: CollectionConfig = {
  slug: 'addons',
  labels: { singular: 'Add-on', plural: 'Add-ons' },
  admin: { useAsTitle: 'name', group: 'Catalogue', defaultColumns: ['name', 'price', 'active'] },
  access: {
    read: () => true,
    create: isOwner,
    update: isOwner,
    delete: isOwner,
  },
  versions: { maxPerDoc: 50 },
  hooks: { afterChange: [touchPrices] },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', required: true, min: 0, admin: { width: '50%', description: '₹' } },
        { name: 'unit', type: 'text', admin: { width: '50%', description: 'e.g. per sofa, per bathroom' } },
      ],
    },
    {
      name: 'makesWholeDay',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Tick if adding this turns a half-day job into a whole-day job.' },
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
