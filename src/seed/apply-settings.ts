/**
 * Saves ./site-info.ts to Site settings (phone, hours, rating, links, UPI…) and Booking settings (start times,
 * reschedule window). Other settings fields are left alone.
 *   npm run settings           → dry run
 *   APPLY=1 npm run settings   → save   (Windows: set APPLY=1 && npm run settings)
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { bookingInfo, siteInfo } from './site-info'

// `payload run` does not pass CLI flags through, so the switch is an env var.
const apply = process.env.APPLY === '1'

async function run() {
  const payload = await getPayload({ config })
  const current = (await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as unknown as Record<string, unknown>
  for (const [k, v] of Object.entries(siteInfo)) {
    const was = JSON.stringify(k === 'hours' ? ((current[k] as { days: string; open: string; close: string }[]) ?? []).map(({ days, open, close }) => ({ days, open, close })) : current[k])
    const now = JSON.stringify(v)
    console.log(`${was === now ? '=' : '~'} ${k}: ${was === now ? now : `${was ?? '-'} → ${now}`}`)
  }
  const bs = await payload.findGlobal({ slug: 'booking-settings', depth: 0, overrideAccess: true })
  const fmt = (t: { label: string; days?: string[] | null }[]) => t.map((x) => `${x.label} [${(x.days ?? []).join(',')}]`).join(' · ')
  console.log(`booking start times: ${fmt(bs.startTimes ?? [])}\n                  → ${fmt(bookingInfo.startTimes)}`)
  console.log(`reschedule window: ${bs.rescheduleHours ?? '-'}h → ${bookingInfo.rescheduleHours}h`)
  if (apply) {
    await payload.updateGlobal({ slug: 'site-settings', data: siteInfo, overrideAccess: true })
    await payload.updateGlobal({ slug: 'booking-settings', data: bookingInfo, overrideAccess: true })
  }
  console.log(apply ? '\nApplied.' : '\nDry run only. Run with APPLY=1 to save.')
  process.exit(0)
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
