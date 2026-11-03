import type { CollectionConfig } from 'payload'

import { isOwner, isStaff, roleOf } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    read: isStaff,
    create: isOwner,
    delete: isOwner,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (roleOf(user) === 'owner') return true
      return { id: { equals: user.id } }
    },
  },
  hooks: {
    beforeChange: [
      // The very first account becomes the owner.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          // The match-all `where` makes the Mongo adapter use countDocuments; with no filter it uses
          // estimatedDocumentCount, which MongoDB refuses inside a transaction.
          const { totalDocs } = await req.payload.count({ collection: 'users', where: { id: { exists: true } }, req })
          if (totalDocs === 0) data.role = 'owner'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'ops',
      options: [
        { label: 'Owner — everything', value: 'owner' },
        { label: 'Ops — bookings, dispatch, leads, capacity, jobs feed', value: 'ops' },
      ],
      access: {
        update: ({ req: { user } }) => roleOf(user) === 'owner',
      },
    },
  ],
}
