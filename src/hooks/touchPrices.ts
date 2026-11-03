import type { CollectionAfterChangeHook } from 'payload'

/**
 * Any change to a price-bearing record stamps siteSettings.pricesUpdatedAt,
 * which the Pricing page shows as "Updated {month year}".
 */
export const touchPrices: CollectionAfterChangeHook = async ({ req, doc }) => {
  await req.payload.updateGlobal({
    slug: 'site-settings',
    data: { pricesUpdatedAt: new Date().toISOString() },
    req,
  })
  return doc
}
