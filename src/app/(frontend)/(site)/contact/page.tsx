import type { Metadata } from 'next'

import { ContactView } from '@/components/pages/InfoPages'
import { getServices, getSettings } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Contact DeepCleanz — Chennai',
  description: 'Call or WhatsApp DeepCleanz for home deep cleaning in Chennai. Address, phone and opening hours.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  return <ContactView settings={settings} services={services} />
}
