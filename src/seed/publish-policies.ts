/**
 * Saves the policy pages from ./policies.ts and publishes them; also sets the reschedule window to match.
 *   npm run policies           → dry run
 *   APPLY=1 npm run policies   → save + publish   (Windows: set APPLY=1 && npm run policies)
 */
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { getPayload } from 'payload'

import config from '../payload.config'
import { policies } from './policies'

// `payload run` does not pass CLI flags through, so the switch is an env var.
const apply = process.env.APPLY === '1'
const RESCHEDULE_HOURS = 3

async function run() {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  for (const p of policies) {
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: p.slug } }, limit: 1, depth: 0, overrideAccess: true })
    const doc = found.docs[0]
    const brackets = p.markdown.match(/\[[^\]]*\](?!\()/g)
    console.log(`${doc ? 'update' : 'create'} /${p.slug}  published: ${doc?.published ?? '-'} → true${brackets ? `  ! unfilled: ${brackets.join(' ')}` : ''}`)
    if (!apply || brackets) continue
    const data = {
      title: p.title,
      slug: p.slug,
      metaDescription: p.metaDescription,
      body: convertMarkdownToLexical({ editorConfig, markdown: p.markdown }),
      published: true,
    }
    if (doc) await payload.update({ collection: 'pages', id: doc.id, data, overrideAccess: true })
    else await payload.create({ collection: 'pages', data, overrideAccess: true })
  }
  const bs = await payload.findGlobal({ slug: 'booking-settings', overrideAccess: true })
  console.log(`booking settings: reschedule window ${bs.rescheduleHours ?? '-'}h → ${RESCHEDULE_HOURS}h`)
  if (apply) await payload.updateGlobal({ slug: 'booking-settings', data: { rescheduleHours: RESCHEDULE_HOURS }, overrideAccess: true })
  console.log(apply ? '\nApplied.' : '\nDry run only. Run with APPLY=1 to save.')
  process.exit(0)
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
