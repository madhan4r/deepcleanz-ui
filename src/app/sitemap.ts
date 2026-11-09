import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/site'

export const dynamic = 'force-dynamic'

const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

/**
 * sitemap.xml from what is actually published (spec S13), with real last-modified dates.
 * Unpublished services (missing prices), drafts and noindex pages are never listed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const published = { published: { equals: true } }
  const [services, occasions, pages, settings] = await Promise.all([
    payload.find({ collection: 'services', where: published, limit: 0, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'occasions', where: published, limit: 0, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'pages', where: published, limit: 0, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
  ])
  const latest = [...services.docs, ...occasions.docs].map((d) => d.updatedAt).sort().pop()
  const at = (d?: string | null) => (d ? new Date(d) : undefined)

  return [
    { url: `${siteUrl}/`, lastModified: at(latest), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/pricing`, lastModified: at(settings.pricesUpdatedAt ?? latest), changeFrequency: 'weekly', priority: 0.9 },
    ...services.docs.map((s) => ({ url: `${siteUrl}/${s.slug}`, lastModified: at(s.updatedAt), changeFrequency: 'weekly' as const, priority: 0.9 })),
    ...occasions.docs.map((o) => ({ url: `${siteUrl}/${o.slug}`, lastModified: at(o.updatedAt), changeFrequency: 'weekly' as const, priority: 0.8 })),
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    ...pages.docs.map((p) => ({ url: `${siteUrl}/${p.slug}`, lastModified: at(p.updatedAt), changeFrequency: 'yearly' as const, priority: 0.3 })),
  ]
}
