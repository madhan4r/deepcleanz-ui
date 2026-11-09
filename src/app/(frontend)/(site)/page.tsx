import type { Metadata } from 'next'

import { Planner } from '@/components/home/Planner'
import {
  ChatFaq,
  CtaBand,
  DeepVsRegular,
  FieldJobs,
  InspectThenPay,
  Moments,
  ServiceLinks,
  WhoComes,
} from '@/components/home/Sections'
import { faqSchema, JsonLd, localBusinessSchema } from '@/components/site/JsonLd'
import { ActionBar } from '@/components/site/SiteChrome'
import { inr } from '@/lib/format'
import {
  FULL_HOME_SLUG,
  fromPrice,
  getHomeFaqs,
  getRecentJobs,
  getServices,
  getSettings,
  getVisibleCrew,
  plannerAddons,
  siteUrl,
} from '@/lib/site'

// Prices, jobs and numbers change from admin — always render fresh.
export const dynamic = 'force-dynamic'


export async function generateMetadata(): Promise<Metadata> {
  const services = await getServices()
  const fullHome = services.find((s) => s.slug === FULL_HOME_SLUG)
  const from = fullHome ? fromPrice(fullHome) : null
  // ≤ 60 chars (spec S13): "Home Deep Cleaning in Chennai from ₹2,499 | DeepCleanz"
  const title = from ? `Home Deep Cleaning in Chennai from ${inr(from)} | DeepCleanz` : 'Home Deep Cleaning in Chennai | DeepCleanz'
  return {
    title: { absolute: title },
    description:
      'See your deep cleaning price in 30 seconds. Verified cleaning partners across Chennai, ₹0 advance — pay only after you inspect the work.',
    alternates: { canonical: '/' },
    openGraph: { title, url: '/' },
  }
}

export default async function HomePage() {
  const [settings, services, faqs, jobs, crew] = await Promise.all([
    getSettings(),
    getServices(),
    getHomeFaqs(),
    getRecentJobs(3),
    getVisibleCrew(4),
  ])

  const fullHome = services.find((s) => s.slug === FULL_HOME_SLUG)
  const options = (fullHome?.conditions ?? []).map((c) => ({
    key: c.key,
    label: c.label,
    price: c.price,
    durationHrs: c.durationHrs,
    crewSize: c.crewSize,
  }))
  const middle = options[Math.floor(options.length / 2)]
  const handover = (fullHome?.handover ?? []).map((h) => h.item)

  return (
    <>
      <JsonLd data={localBusinessSchema(settings, services, siteUrl)} />
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}

      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <span className="hero-tag">Home deep cleaning · Chennai</span>
            <h1>Tell us about your home. See your price now.</h1>
            <p className="hero-sub">
              No calls, no &ldquo;price on request&rdquo;. Build your clean in 30 seconds and pay only after you inspect it.
            </p>
            <div className="hero-chips">
              <span className="chip">✓ ₹0 advance</span>
              {settings.googleRating && settings.googleReviewCount ? (
                <span className="chip">
                  ★ {settings.googleRating} · {settings.googleReviewCount} Google reviews
                </span>
              ) : null}
              {settings.homesCleanedDisplay ? <span className="chip">{settings.homesCleanedDisplay} Chennai homes</span> : null}
            </div>
          </div>

          {fullHome && options.length ? (
            <Planner
              serviceSlug={fullHome.slug}
              serviceName="full home"
              options={options}
              addons={plannerAddons(fullHome)}
              defaultKey={middle?.key}
            />
          ) : (
            <div className="planner" id="plan">
              <p>Prices are being updated. Message us on WhatsApp for today&apos;s price.</p>
            </div>
          )}
        </div>
      </section>

      <Moments />
      <InspectThenPay items={handover} examplePrice={middle ? inr(middle.price) : 'after the walk-through'} />
      <FieldJobs jobs={jobs} settings={settings} />
      <DeepVsRegular />
      <WhoComes crew={crew} />
      <ChatFaq faqs={faqs} />
      <ServiceLinks services={services} />
      <CtaBand />
      <ActionBar settings={settings} whatsappText="Hi DeepCleanz, I'd like a price for a deep clean." />
    </>
  )
}
