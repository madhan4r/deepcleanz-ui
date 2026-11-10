/**
 * Saves ./site-info.ts to Site settings (phone, hours, rating, links, UPI…). Other settings fields are left alone.
 *   npm run settings           → dry run
 *   APPLY=1 npm run settings   → save   (Windows: set APPLY=1 && npm run settings)
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { siteInfo } from './site-info'

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
  if (apply) await payload.updateGlobal({ slug: 'site-settings', data: siteInfo, overrideAccess: true })
  console.log(apply ? '\nApplied.' : '\nDry run only. Run with APPLY=1 to save.')
  process.exit(0)
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
