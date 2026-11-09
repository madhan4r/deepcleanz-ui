import type { Metadata } from 'next'

import { PricingView } from '@/components/pricing/PricingView'
import { getPricingFaqs, getServices, getSettings } from '@/lib/site'

export const dynamic = 'force-dynamic'

const year = () => new Date().getFullYear()

export async function generateMetadata(): Promise<Metadata> {
  const title = `Deep Cleaning Prices in Chennai (${year()}) | DeepCleanz`
  return {
    title: { absolute: title },
    description:
      'Every DeepCleanz price on one page — full home, kitchen, bathroom, sofa and more. Pick your option, see the price, pay only after you inspect.',
    alternates: { canonical: '/pricing' },
    openGraph: { title, url: '/pricing' },
  }
}

export default async function PricingPage() {
  const [settings, services, faqs] = await Promise.all([getSettings(), getServices(), getPricingFaqs()])
  return <PricingView settings={settings} services={services} faqs={faqs} />
}
