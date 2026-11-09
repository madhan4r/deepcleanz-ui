import type { Metadata } from 'next'

import { FaqView } from '@/components/pages/InfoPages'
import { getAllFaqs, getSettings } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Deep Cleaning Questions — Booking, Price & Payment',
  description: 'Answers about booking, prices, payment, the day of the clean and who comes to your home.',
  alternates: { canonical: '/faq' },
}

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getAllFaqs(), getSettings()])
  return <FaqView faqs={faqs} settings={settings} />
}
