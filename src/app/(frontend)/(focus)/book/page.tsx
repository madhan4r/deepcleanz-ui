import Link from 'next/link'
import type { Metadata } from 'next'

import { BookingFlow } from '@/components/booking/BookingFlow'
import { loadSelection } from '@/lib/booking'
import { inr, whatsappHref } from '@/lib/format'
import { addonPriceFor } from '@/lib/pricing'
import { getPayloadClient, getSettings } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Book your clean', robots: { index: false, follow: false } }

type Props = { searchParams: Promise<{ service?: string; option?: string; addons?: string }> }

export default async function BookPage({ searchParams }: Props) {
  const q = await searchParams
  const [payload, settings] = await Promise.all([getPayloadClient(), getSettings()])

  let selection: Awaited<ReturnType<typeof loadSelection>> | null = null
  try {
    selection = await loadSelection(payload, { service: q.service, option: q.option, addons: (q.addons ?? '').split(',').filter(Boolean) })
  } catch {
    selection = null
  }

  if (!selection) {
    return (
      <div className="wrap section stack" style={{ maxWidth: 560 }}>
        <h1 className="book-h1">Let&apos;s plan your clean first</h1>
        <p className="lede">Pick your home size and extras to see the price, then come back here to choose a date.</p>
        <div className="pills">
          <Link className="btn btn-book" href="/#plan">
            Plan my clean
          </Link>
          <a className="btn btn-wa" href={whatsappHref(settings.whatsapp, 'Hi DeepCleanz, I would like to book a deep clean.')} data-place="book-empty">
            WhatsApp us
          </a>
        </div>
      </div>
    )
  }

  const condition = (selection.service.conditions ?? []).find((c) => c.key === selection.conditionKey)
  const addonDocs = await Promise.all(
    selection.addonIds.map((id) => payload.findByID({ collection: 'addons', id, depth: 0, overrideAccess: true })),
  )
  const meta = [
    condition?.crewSize ? `Crew of ${condition.crewSize}` : null,
    condition?.durationHrs ? `about ${condition.durationHrs} hours` : null,
    'they bring their own machines',
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <BookingFlow
      whatsapp={settings.whatsapp}
      summary={{
        service: selection.service.slug,
        option: selection.conditionKey,
        addons: selection.addonIds,
        itemLabel: `${selection.service.name} · ${selection.conditionLabel}`,
        addonLabels: addonDocs.map((a) => `${a.name} (${inr(addonPriceFor(a, selection.conditionKey) ?? a.price)})`),
        total: selection.total,
        meta,
      }}
    />
  )
}
