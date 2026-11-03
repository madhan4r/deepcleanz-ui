import type { CollectionConfig } from 'payload'

import { anyone, isOwner, isStaff } from '../access/roles'

/** Public images used on the website. Alt text is required for SEO and accessibility. */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isOwner,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the photo for Google, e.g. "Kitchen tiles before and after degreasing, 2BHK in Velachery".',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'hero', width: 1440 },
    ],
  },
}
