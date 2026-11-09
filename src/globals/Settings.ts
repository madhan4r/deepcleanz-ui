import type { GlobalConfig } from 'payload'

import { anyone, isOwner, isStaff } from '../access/roles'
import { bustSiteGlobal } from '../hooks/bustCache'

/**
 * One source of truth for every number the site, ads and Google Business Profile show.
 * Change it here and the whole site updates.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  hooks: { afterChange: [bustSiteGlobal] },
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isOwner },
  versions: { max: 50 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business',
          fields: [
            { name: 'businessName', type: 'text', required: true, defaultValue: 'DeepCleanz' },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true, admin: { width: '33%' } },
                { name: 'whatsapp', type: 'text', required: true, admin: { width: '33%' } },
                { name: 'email', type: 'email', admin: { width: '34%' } },
              ],
            },
            { name: 'address', type: 'textarea', required: true, admin: { description: 'Exactly as on Google Business Profile.' } },
            {
              name: 'hours',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'days', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'open', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'close', type: 'text', required: true, admin: { width: '30%' } },
                  ],
                },
              ],
            },
            { name: 'upiId', label: 'DeepCleanz UPI ID', type: 'text', admin: { description: 'For the payment message sent at the walk-through.' } },
            { name: 'mapsLink', label: 'Google Maps link', type: 'text', admin: { description: 'Your Google Business Profile link (used on Contact).' } },
            {
              name: 'founderNote',
              type: 'textarea',
              admin: { description: 'A few lines in your own words for the About page. Hidden until filled.' },
            },
          ],
        },
        {
          label: 'Proof numbers',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'googleRating', type: 'number', min: 1, max: 5, admin: { width: '33%' } },
                { name: 'googleReviewCount', type: 'number', min: 0, admin: { width: '33%' } },
                { name: 'homesCleanedDisplay', type: 'text', admin: { width: '34%', description: 'e.g. 200+ — only claim what is true' } },
              ],
            },
            { name: 'googleReviewLink', type: 'text', admin: { description: 'Used by the "Ask for review" button.' } },
            { name: 'gstNote', type: 'text', admin: { description: 'e.g. "Prices include GST"' } },
            { name: 'pricesUpdatedAt', type: 'date', admin: { readOnly: true, description: 'Set automatically when prices change.' } },
          ],
        },
        {
          label: 'Announcement',
          fields: [
            {
              name: 'announcementBar',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'text', type: 'text' },
                { name: 'link', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Tracking',
          fields: [
            {
              name: 'tracking',
              type: 'group',
              fields: [
                { name: 'gtmId', label: 'Google Tag Manager ID', type: 'text' },
                { name: 'ga4Id', label: 'GA4 measurement ID', type: 'text' },
                { name: 'adsConversionId', label: 'Google Ads conversion ID', type: 'text' },
                { name: 'adsBookingLabel', label: 'Ads label — booking confirmed', type: 'text' },
                { name: 'adsLeadLabel', label: 'Ads label — lead (phone entered)', type: 'text' },
                {
                  name: 'adsOfflineConversionName',
                  label: 'Ads offline conversion name (paid jobs)',
                  type: 'text',
                  defaultValue: 'Paid job',
                  admin: { description: 'Must match the conversion action name in Google Ads exactly.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const BookingSettings: GlobalConfig = {
  slug: 'booking-settings',
  hooks: { afterChange: [bustSiteGlobal] },
  label: 'Booking settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isStaff },
  fields: [
    {
      name: 'crewsPerDay',
      label: 'Partner crews expected per day',
      type: 'number',
      required: true,
      defaultValue: 3,
      min: 0,
      admin: {
        description:
          'Each crew = one morning + one afternoon. Used for days without their own capacity record. Raise when more partners confirm; lower for festivals.',
      },
    },
    {
      name: 'startTimes',
      type: 'array',
      minRows: 1,
      admin: { description: 'Start times offered in booking step 2.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'key', type: 'text', required: true, admin: { width: '25%', description: 'e.g. am-0830' } },
            { name: 'label', type: 'text', required: true, admin: { width: '25%', description: 'e.g. 8:30 AM' } },
            {
              name: 'half',
              type: 'select',
              required: true,
              options: [
                { label: 'Morning', value: 'am' },
                { label: 'Afternoon', value: 'pm' },
              ],
              admin: { width: '20%' },
            },
            {
              name: 'allowWholeDay',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '15%', description: 'Can a whole-day job start here?' },
            },
            {
              name: 'days',
              type: 'select',
              hasMany: true,
              defaultValue: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
              options: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => ({ label: d, value: d })),
              admin: { width: '15%' },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'bookingWindowDays', type: 'number', defaultValue: 14, admin: { width: '33%' } },
        { name: 'dispatchTimeoutMinutes', type: 'number', defaultValue: 45, admin: { width: '33%', description: 'Alert if no partner accepts' } },
        { name: 'rescheduleHours', type: 'number', defaultValue: 24, admin: { width: '34%' } },
      ],
    },
    { name: 'cancellationPolicy', type: 'richText' },
  ],
}
