import type { Metadata } from 'next'

import { ThankYou } from '@/components/booking/ThankYou'
import { getSettings } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Booking confirmed', robots: { index: false, follow: false } }

export default async function ThankYouPage() {
  const settings = await getSettings()
  return <ThankYou whatsapp={settings.whatsapp} />
}
