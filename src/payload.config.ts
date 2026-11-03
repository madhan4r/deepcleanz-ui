import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Bookings } from './collections/Bookings'
import { Areas, Faqs, Jobs, Occasions } from './collections/Content'
import { Media } from './collections/Media'
import { Capacity, Dispatch, Leads, Payouts } from './collections/Operations'
import { Partners } from './collections/Partners'
import { Addons, Services } from './collections/Services'
import { Users } from './collections/Users'
import { BookingSettings, SiteSettings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · DeepCleanz Admin' },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    // Operations
    Bookings,
    Dispatch,
    Leads,
    Capacity,
    Areas,
    // Partners
    Partners,
    Payouts,
    // Catalogue
    Services,
    Addons,
    // Content
    Occasions,
    Jobs,
    Faqs,
    Media,
    // Settings
    Users,
  ],
  globals: [SiteSettings, BookingSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    // Public images on Vercel Blob in production; local disk in development.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
