import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { OccasionView } from '@/components/occasion/OccasionView'
import { PageView } from '@/components/pages/InfoPages'
import { ServiceView } from '@/components/service/ServiceView'
import { istDay } from '@/lib/booking'
import { inr } from '@/lib/format'
import {
  currentSeason,
  FULL_HOME_SLUG,
  fromPrice,
  getOccasionBySlug,
  getPageBySlug,
  getRecentJobs,
  getServiceBySlug,
  getSettings,
  istDate,
  seasonSlotMeter,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<{ option?: string }> }

/**
 * One URL space for three kinds of page (spec S2): services (/kitchen-cleaning-chennai),
 * occasions (/festival-deep-cleaning-chennai) and admin-written pages (/privacy-policy).
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params

  const service = await getServiceBySlug(slug)
  if (service) {
    const from = fromPrice(service)
    // Spec S13: "{Service} in Chennai from ₹{price} | DeepCleanz" (≤ 60 chars), admin can override.
    const fallback = `${service.h1}${from ? ` from ${inr(from)}` : ''} | DeepCleanz`
    const title = service.seoTitle || (fallback.length <= 60 ? fallback : `${service.h1} | DeepCleanz`)
    const description =
      service.metaDescription ||
      `${service.h1}${from ? ` from ${inr(from)}` : ''}. Pick your option and see the price now. Verified cleaning partners, ₹0 advance — pay after you inspect.`
    return {
      title: { absolute: title },
      description: description.slice(0, 155),
      alternates: { canonical: `/${service.slug}` },
      openGraph: { title, description, url: `/${service.slug}` },
    }
  }

  const occasion = await getOccasionBySlug(slug)
  if (occasion) {
    const cur = currentSeason(occasion, istDay())
    const h1 = cur?.season.h1 || `${occasion.name} in Chennai`
    const title = `${h1} | DeepCleanz`.length <= 60 ? `${h1} | DeepCleanz` : h1
    const description = (
      cur?.season.subline || `${occasion.name} in Chennai by verified cleaning partners. See your price, book early, pay after you inspect.`
    ).slice(0, 155)
    return { title: { absolute: title }, description, alternates: { canonical: `/${occasion.slug}` }, openGraph: { title, description, url: `/${occasion.slug}` } }
  }

  const page = await getPageBySlug(slug)
  if (page) {
    return {
      title: page.title,
      description: page.metaDescription ?? undefined,
      alternates: { canonical: `/${page.slug}` },
    }
  }
  return {}
}

export default async function SlugPage({ params, searchParams }: Params) {
  const { slug } = await params
  const settings = await getSettings()

  const service = await getServiceBySlug(slug)
  if (service) {
    const { option } = await searchParams
    const jobs = await getRecentJobs(6, service.id)
    return <ServiceView service={service} settings={settings} jobs={jobs} option={option} />
  }

  const occasion = await getOccasionBySlug(slug)
  if (occasion) {
    const today = istDay()
    const cur = currentSeason(occasion, today)
    const season = cur?.season ?? null
    const opensOn = istDate(season?.bookingOpensOn ?? season?.activeFrom)
    const canBook = Boolean(cur?.live || (opensOn && opensOn <= today))
    const meter = season ? await seasonSlotMeter(istDate(season.rushFrom), istDate(season.rushTo), today) : null
    const fullHome = await getServiceBySlug(FULL_HOME_SLUG)
    return <OccasionView occasion={occasion} season={season} canBook={canBook} meter={meter} fullHome={fullHome} settings={settings} />
  }

  const page = await getPageBySlug(slug)
  if (page) return <PageView page={page} settings={settings} />

  notFound()
}
