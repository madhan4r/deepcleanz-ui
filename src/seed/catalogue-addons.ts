import type { Payload } from 'payload'

import { catalogueAddons } from './catalogue'

/**
 * Creates/updates the add-ons listed in ./catalogue.ts (matched by name), makes them active
 * and attaches them to their service. Other add-ons are left as they are.
 */
export async function applyCatalogueAddons(payload: Payload, apply: boolean, log: (line: string) => void = console.log) {
  for (const [slug, addons] of Object.entries(catalogueAddons)) {
    const svc = (await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (!svc) {
      log(`! add-ons: service ${slug} not found`)
      continue
    }
    const attached = (svc.addons ?? []).map((a) => (typeof a === 'string' ? a : a.id))
    for (const a of addons) {
      const found = (await payload.find({ collection: 'addons', where: { name: { equals: a.name } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
      const optionPrices = Object.entries(a.optionPrices ?? {}).map(([conditionKey, price]) => ({ conditionKey, price }))
      const per = optionPrices.map((o) => `${o.conditionKey} +₹${o.price}`).join(', ')
      log(`${found ? 'update' : 'create'} add-on "${a.name}" on ${slug}: ${per || `₹${a.price}`}${attached.includes(found?.id ?? '') ? '' : ' (attach)'}`)
      if (!apply) continue
      const data = { name: a.name, price: a.price, unit: a.unit ?? '', optionPrices, active: true }
      const doc = found
        ? await payload.update({ collection: 'addons', id: found.id, data, overrideAccess: true })
        : await payload.create({ collection: 'addons', data, overrideAccess: true })
      if (!attached.includes(doc.id)) {
        attached.push(doc.id)
        await payload.update({ collection: 'services', id: svc.id, data: { addons: attached }, overrideAccess: true })
      }
    }
  }
}
