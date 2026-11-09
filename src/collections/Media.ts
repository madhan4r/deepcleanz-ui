import type { CollectionConfig } from 'payload'

import { siteCacheHooks } from '../hooks/bustCache'
import { anyone, isOwner, isStaff } from '../access/roles'

/** Public images used on the website. Alt text is required for SEO and accessibility. */
export const Media: CollectionConfig = {
  slug: 'media',
  hooks: siteCacheHooks,
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
    // Uploaded images live outside the release folder on the server so deploys never wipe them.
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'hero', width: 1440 },
    ],
  },
}
