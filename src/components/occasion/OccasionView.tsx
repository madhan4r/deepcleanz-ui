import Link from 'next/link'
import { Planner } from '@/components/home/Planner'
import { ChatFaq } from '@/components/home/Sections'
import { breadcrumbSchema, faqSchema, JsonLd } from '@/components/site/JsonLd'
import { ActionBar } from '@/components/site/SiteChrome'
import { inr, whatsappHref } from '@/lib/format'
import { addonOptionPrices, fromPrice, istDate, plannerAddons, siteUrl } from '@/lib/site'
import type { Addon, Faq, Occasion, Service, SiteSetting } from '@/payload-types'

type Season = NonNullable<Occasion['seasons']>[number]

const niceDate = (day: string | null) => {
  if (!day) return null
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

/**
 * Occasion page (spec S6b): one URL per occasion kept all year; the season decides the content.
 * Bookable when the season is live or its booking window has opened; otherwise it shows the
 * opening date and a reminder instead of the planner.
 */
export function OccasionView({
  occasion,
  season,
  canBook,
  meter,
  fullHome,
  settings,
}: {
  occasion: Occasion
  season: Season | null
  canBook: boolean
  meter: number | null
  fullHome: Service | null
  settings: SiteSetting
}) {
  const h1 = season?.h1 || `${occasion.name} in Chennai`
  const label = season?.label || occasion.name
  const opens = niceDate(istDate(season?.bookingOpensOn ?? season?.activeFrom))
  const faqs = (season?.faqs ?? []).filter((f): f is Faq => typeof f === 'object' && f !== null)
  const focus = season?.focus ?? []
  const timeline = season?.timeline ?? []
  const prep = (season?.prepList ?? []).map((p) => p.item)

  // Extras must also be add-ons of the Full Home service, or the booking would drop them.
  const offered = new Set(fullHome ? plannerAddons(fullHome).map((a) => a.id) : [])
  const extras = (season?.extras ?? [])
    .filter((a): a is Addon => typeof a === 'object' && a !== null)
    .filter((a) => offered.has(a.id))
    .map((a) => ({ id: a.id, name: a.name, price: a.price, unit: a.unit ?? '', optionPrices: addonOptionPrices(a) }))
  const options = (fullHome?.conditions ?? []).map((c) => ({ key: c.key, label: c.label, price: c.price, durationHrs: c.durationHrs, crewSize: c.crewSize }))
  const from = fullHome ? fromPrice(fullHome) : null
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: occasion.name, path: `/${occasion.slug}` },
  ]

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: h1,
          serviceType: occasion.name,
          url: `${siteUrl}/${occasion.slug}`,
          areaServed: { '@type': 'City', name: 'Chennai' },
          provider: { '@id': `${siteUrl}/#business` },
          ...(from ? { offers: { '@type': 'Offer', price: from, priceCurrency: 'INR' } } : {}),
        }}
      />
      <JsonLd data={breadcrumbSchema(crumbs, siteUrl)} />
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}

      <section className="hero hero-sun">
        <div className="wrap">
          <div className="hero-copy">
            {season?.badge ? <span className="hero-tag">{season.badge}</span> : null}
            <h1>{h1}</h1>
            {season?.subline ? <p className="hero-sub">{season.subline}</p> : null}
            {canBook && meter !== null && meter >= 25 ? (
              <div className="meter" role="img" aria-label={`${label} peak week ${meter}% booked`}>
                <div className="meter-row">
                  <strong>{label} peak week</strong>
                  <strong>{meter}% booked</strong>
                </div>
                <div className="meter-bar">
                  <span style={{ width: `${meter}%` }} />
                </div>
                <small>Live from our partner calendar · weekends go first</small>
              </div>
            ) : null}
          </div>

          {canBook && fullHome && options.length ? (
            <Planner
              serviceSlug={fullHome.slug}
              serviceName={`${label} clean`}
              options={options}
              addons={extras}
              defaultKey={options[Math.floor(options.length / 2)]?.key}
              optionsLegend="Build your clean · your home"
            />
          ) : (
            <div className="planner" id="plan">
              <strong style={{ fontSize: 20 }}>{opens ? `${label} bookings open on ${opens}` : `${label} bookings open soon`}</strong>
              <p className="muted">{occasion.offSeasonMessage || 'Get a WhatsApp reminder the day bookings open — or book a regular deep clean now.'}</p>
              <a
                className="btn btn-wa btn-block"
                href={whatsappHref(settings.whatsapp, `Hi DeepCleanz, please remind me when ${label} cleaning bookings open.`)}
                data-place="occasion-remind"
              >
                Remind me on WhatsApp
              </a>
              <Link className="btn btn-soft btn-block" href="/#plan">
                Book a deep clean now{from ? ` · from ${inr(from)}` : ''}
              </Link>
            </div>
          )}
        </div>
      </section>

      {focus.length ? (
        <section className="section band-soft" aria-labelledby="focus-h">
          <div className="wrap stack-lg">
            <div className="stack">
              <span className="eyebrow">Festival focus</span>
              <h2 id="focus-h" className="h2">
                What a {label} clean puts first
              </h2>
              <p className="lede">The same full deep clean — with extra time where the festival happens.</p>
            </div>
            <div className="grid-cards">
              {focus.map((f) => (
                <div key={f.id ?? f.title} className="moment tone-sky" style={{ minHeight: 0, background: '#fff' }}>
                  <h3>{f.title}</h3>
                  {f.text ? <p>{f.text}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {timeline.length ? (
        <section className="section" aria-labelledby="timing-h">
          <div className="wrap stack-lg" style={{ maxWidth: 820 }}>
            <div className="stack">
              <span className="eyebrow">Timing</span>
              <h2 id="timing-h" className="h2">
                When to book, when to clean
              </h2>
            </div>
            <ol className="timeline">
              {timeline.map((t) => (
                <li key={t.id ?? t.title}>
                  <small>{t.when}</small>
                  <strong>{t.title}</strong>
                  {t.text ? <span>{t.text}</span> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {prep.length ? (
        <section className="section band-sun" aria-labelledby="prep-h">
          <div className="wrap split">
            <div className="stack">
              <span className="eyebrow">Before we arrive</span>
              <h2 id="prep-h" className="h2">
                Clear these first
              </h2>
              <p className="lede">Clearing clutter first means the crew cleans every surface, not around boxes.</p>
            </div>
            <ul className="checklist">
              {prep.map((p) => (
                <li key={p}>
                  <span className="tick" aria-hidden="true" style={{ background: '#fff', border: '2px solid #b45309' }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ChatFaq faqs={faqs} title={`${label} booking questions`} />

      <ActionBar
        settings={settings}
        whatsappText={`Hi DeepCleanz, I'd like to book a ${label} deep clean.`}
        bookLabel={canBook ? `Book ${label} clean` : 'Plan my clean'}
        bookHref={canBook ? '#plan' : '/#plan'}
      />
    </>
  )
}
