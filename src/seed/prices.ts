/**
 * Applies the confirmed catalogue prices (src/seed/catalogue.ts) to the database.
 *   npm run prices            → dry run: shows old → new, changes nothing
 *   APPLY=1 npm run prices  → writes, publishes fully priced services (Windows: set APPLY=1 && npm run prices)
 * Keeps page content (zones, FAQs, photos…) as it is; only options, publish flag and SEO title change.
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { catalogue, officeChairService, seoTitleFor } from './catalogue'
import { applyCatalogueAddons } from './catalogue-addons'

// `payload run` does not pass CLI flags through, so the switch is an env var.
const apply = process.env.APPLY === '1'

async function run() {
  const payload = await getPayload({ config })
  for (const [slug, options] of Object.entries(catalogue)) {
    const found = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })
    const doc = found.docs[0]
    const published = options.every((o) => o.price > 0)
    const old = new Map((doc?.conditions ?? []).map((c) => [c.key, c]))
    const conditions = options.map((o) => {
      const prev = old.get(o.key)
      return {
        key: o.key,
        label: o.label,
        price: o.price,
        units: o.units,
        description: o.description ?? prev?.description ?? undefined,
        durationHrs: prev?.durationHrs ?? undefined,
        crewSize: prev?.crewSize ?? undefined,
        photo: prev?.photo ?? undefined,
      }
    })
    const h1 = doc?.h1 ?? (slug === officeChairService.slug ? officeChairService.h1 : slug)
    const seoTitle = seoTitleFor(h1, options)

    console.log(`\n${doc ? doc.name : '(new) ' + officeChairService.name}  [${slug}]  published: ${doc?.published ?? '-'} → ${published}`)
    for (const c of doc?.conditions ?? []) {
      if (!options.some((o) => o.key === c.key)) console.log(`   - remove ${c.label} ₹${c.price}`)
    }
    for (const o of options) {
      const p = old.get(o.key)
      console.log(`   ${p ? (p.price === o.price && p.label === o.label ? '=' : '~') : '+'} ${o.label}: ${p ? `₹${p.price} → ` : ''}₹${o.price} (${o.units === 'whole' ? 'full day' : 'half day'})`)
    }
    if (doc?.seoTitle !== seoTitle) console.log(`   title: ${doc?.seoTitle ?? '-'} → ${seoTitle}`)
    if (doc?.metaDescription && /₹\s?[\d,]+/.test(doc.metaDescription)) console.log(`   ! meta description mentions a price, check it: ${doc.metaDescription}`)

    if (!apply) continue
    if (doc) {
      const excluded = doc.excluded ?? []
      const extraExcluded =
        slug === 'bedroom-cleaning-chennai' && !excluded.some((e) => /wardrobe/i.test(e.item ?? ''))
          ? [...excluded.map(({ item }) => ({ item })), { item: 'Inside of wardrobes and dressing cupboards' }]
          : undefined
      await payload.update({
        collection: 'services',
        id: doc.id,
        data: { conditions, published, seoTitle, ...(extraExcluded ? { excluded: extraExcluded } : {}) },
        overrideAccess: true,
      })
    } else if (slug === officeChairService.slug) {
      await payload.create({ collection: 'services', data: { ...officeChairService, conditions, published, seoTitle }, overrideAccess: true })
    } else {
      console.log('   ! service not found, skipped')
    }
  }
  console.log('')
  await applyCatalogueAddons(payload, apply)
  console.log(apply ? '\nApplied.' : '\nDry run only. Run with APPLY=1 to save.')
  process.exit(0)
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
