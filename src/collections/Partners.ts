import type { CollectionConfig } from 'payload'

import { isOwner, isStaff, ownerOnlyField } from '../access/roles'
import { textList } from '../fields/shared'

/**
 * Partner cleaners (D19/D20). DeepCleanz sends them jobs, keeps a per-partner commission
 * and pays the balance weekly. Only checks actually done (ID + address) may be claimed on the site.
 */
export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    group: 'Partners',
    defaultColumns: ['name', 'phone', 'crewSize', 'commissionRate', 'rating', 'status'],
  },
  access: {
    read: isStaff,
    create: isOwner,
    update: isOwner,
    delete: isOwner,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', required: true, admin: { width: '30%', description: '10-digit mobile' } },
        { name: 'crewSize', type: 'number', min: 1, defaultValue: 2, admin: { width: '20%' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active — receives job offers', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Removed', value: 'removed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'commissionRate',
      label: 'Commission %',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      admin: { position: 'sidebar', description: 'Set per partner (typically 20–30).' },
      access: { read: ownerOnlyField },
    },
    {
      type: 'row',
      fields: [
        { name: 'rating', type: 'number', admin: { width: '50%', readOnly: true, description: 'Average customer rating' } },
        { name: 'jobsDone', type: 'number', defaultValue: 0, admin: { width: '50%', readOnly: true } },
      ],
    },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    {
      name: 'areas',
      type: 'relationship',
      relationTo: 'areas',
      hasMany: true,
      admin: { description: 'Leave empty if the partner covers all of Chennai.' },
    },
    {
      name: 'crewMembers',
      type: 'array',
      admin: { description: 'Shown to customers on the confirmation (Phase 2) only with consent.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'consentToShow', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'checks',
      type: 'group',
      admin: { description: 'Record the checks done. Keep copies of documents offline — they are not stored here.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'idType', type: 'text', admin: { width: '34%', description: 'e.g. Aadhaar, Voter ID' } },
            { name: 'idCheckedAt', type: 'date', admin: { width: '33%' } },
            { name: 'addressCheckedAt', type: 'date', admin: { width: '33%' } },
          ],
        },
        { name: 'checkedBy', type: 'relationship', relationTo: 'users' },
        { name: 'agreementSignedAt', type: 'date', admin: { description: 'Includes no-direct-booking clause.' } },
      ],
    },
    textList('equipment', 'Equipment they bring'),
    {
      name: 'payout',
      type: 'group',
      access: { read: ownerOnlyField, update: ownerOnlyField },
      fields: [
        { name: 'upiId', type: 'text' },
        { name: 'bankDetails', type: 'textarea' },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
}
