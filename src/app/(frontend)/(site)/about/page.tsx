import type { Metadata } from 'next'

import { AboutView } from '@/components/pages/InfoPages'
import { getSettings, getVisibleCrew } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'About DeepCleanz — verified cleaning partners in Chennai',
  description: 'How DeepCleanz works: you book, a verified cleaning partner does the job, and you pay only after you inspect the work.',
  alternates: { canonical: '/about' },
}

export default async function AboutPage() {
  const [settings, crew] = await Promise.all([getSettings(), getVisibleCrew(8)])
  return <AboutView settings={settings} crew={crew} />
}
