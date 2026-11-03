import type { Payload, PayloadRequest } from 'payload'

export type Half = 'am' | 'pm'

export type ItemInput = {
  service: string | { id: string }
  conditionKey: string
  addons?: (string | { id: string })[] | null
}

export type PricedItem = {
  service: string
  conditionKey: string
  conditionLabel: string
  addons: string[]
  linePrice: number
  wholeDay: boolean
}

const idOf = (v: string | { id: string }) => (typeof v === 'string' ? v : v.id)

/**
 * Prices are always computed on the server from the catalogue.
 * The number shown in the browser is display-only.
 */
export async function priceItems(
  payload: Payload,
  items: ItemInput[],
  req?: PayloadRequest,
): Promise<{ items: PricedItem[]; total: number; wholeDay: boolean }> {
  const priced: PricedItem[] = []

  for (const item of items) {
    const service = await payload.findByID({
      collection: 'services',
      id: idOf(item.service),
      depth: 0,
      req,
      overrideAccess: true,
    })
    const condition = (service.conditions ?? []).find((c) => c.key === item.conditionKey)
    if (!condition) {
      throw new Error(`Unknown option "${item.conditionKey}" for ${service.name}`)
    }

    const addonIds = (item.addons ?? []).map(idOf)
    let addonTotal = 0
    let addonMakesWholeDay = false
    for (const addonId of addonIds) {
      const addon = await payload.findByID({ collection: 'addons', id: addonId, depth: 0, req, overrideAccess: true })
      if (!addon.active) throw new Error(`Add-on "${addon.name}" is not available`)
      addonTotal += addon.price
      if (addon.makesWholeDay) addonMakesWholeDay = true
    }

    priced.push({
      service: service.id,
      conditionKey: condition.key,
      conditionLabel: `${service.name} · ${condition.label}`,
      addons: addonIds,
      linePrice: condition.price + addonTotal,
      wholeDay: condition.units === 'whole' || addonMakesWholeDay,
    })
  }

  const total = priced.reduce((sum, i) => sum + i.linePrice, 0)
  // Rule (spec §9): any whole-day item, or two or more half-day items, takes the whole day.
  const wholeDay = priced.some((i) => i.wholeDay) || priced.length > 1
  return { items: priced, total, wholeDay }
}

/** Which half-days a booking needs, from its start time and whether it is a whole-day job. */
export function halvesFor(startTimeHalf: Half, wholeDay: boolean): Half[] {
  return wholeDay ? ['am', 'pm'] : [startTimeHalf]
}

/** Commission split for a paid booking. Rates are percentages, e.g. 25 = 25%. */
export function splitCommission(paidAmount: number, commissionRate: number) {
  const commissionAmount = Math.round((paidAmount * commissionRate) / 100)
  return { commissionAmount, partnerPayout: paidAmount - commissionAmount }
}
