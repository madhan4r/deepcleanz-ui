import { ChatFaq } from '@/components/home/Sections'
import { breadcrumbSchema, faqSchema, JsonLd, offerCatalogSchema } from '@/components/site/JsonLd'
import { ActionBar } from '@/components/site/SiteChrome'
import { inr, whatsappHref } from '@/lib/format'
import { plannerAddons, siteUrl } from '@/lib/site'
import type { Faq, Service, SiteSetting } from '@/payload-types'

/** The only four things that move a price (spec S7 §3) — all chosen by the customer. */
const FACTORS = [
  { t: 'Size', d: 'BHK, number of bathrooms, sofa seats or mattress size.' },
  { t: 'Condition', d: 'Light, regular or heavy — you pick from real photos.' },
  { t: 'Empty or lived-in', d: 'Empty homes take longer inside cabinets, less time on furniture.' },
  { t: 'Add-ons', d: 'Only what you tick, like a sofa or a mattress.' },
]

export function PricingView({ settings, services, faqs }: { settings: SiteSetting; services: Service[]; faqs: Faq[] }) {
  const updated = settings.pricesUpdatedAt
    ? new Date(settings.pricesUpdatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
    : null
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Prices', path: '/pricing' },
  ]
  const neverExtra = [
    'Machines and chemicals — the crew brings them',
    'Fixing anything you point out at the walk-through',
    ...(settings.gstNote ? [settings.gstNote] : []),
  ]

  return (
    <>
      <JsonLd data={offerCatalogSchema(services, siteUrl)} />
      <JsonLd data={breadcrumbSchema(crumbs, siteUrl)} />
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}

      <section className="section" style={{ paddingBottom: 16 }}>
        <div className="wrap stack">
          {updated ? <span className="eyebrow">Updated {updated}</span> : null}
          <h1 style={{ fontSize: 'clamp(29px, 5vw, 44px)' }}>Deep Cleaning Prices in Chennai</h1>
          <p className="lede">Every price we charge, on one page. What you see here is what you pay — after you&apos;ve checked the work.</p>
        </div>
      </section>

      <nav className="price-tabs" aria-label="Jump to a service">
        <div className="wrap">
          {services.map((s) => (
            <a key={s.id} href={`#${s.slug}`}>
              {s.menuLabel || s.name}
            </a>
          ))}
        </div>
      </nav>

      <div className="section">
        <div className="wrap stack-lg">
          {services.map((s) => {
            const addons = plannerAddons(s)
            return (
              <section key={s.id} id={s.slug} className="price-block stack" aria-labelledby={`${s.slug}-h`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <h2 id={`${s.slug}-h`} style={{ fontSize: 22 }}>
                    {s.name}
                  </h2>
                  <a href={`/${s.slug}`} style={{ fontWeight: 700, fontSize: 14 }}>
                    What&apos;s included →
                  </a>
                </div>
                <div className="price-table">
                  {(s.conditions ?? []).map((c) => (
                    <div key={c.key} className="price-row">
                      <div className="price-row-text">
                        <strong>{c.label}</strong>
                        <small>
                          {[c.crewSize ? `Crew of ${c.crewSize}` : null, c.durationHrs ? `about ${c.durationHrs} hrs` : null, c.description]
                            .filter(Boolean)
                            .join(' · ')}
                        </small>
                      </div>
                      <div className="price-row-end">
                        <strong>{inr(c.price)}</strong>
                        <a className="btn btn-book btn-sm" href={`/${s.slug}?option=${encodeURIComponent(c.key)}#plan`}>
                          Plan this
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {addons.length ? (
                  <p className="note-box">
                    <strong>Add-ons:</strong>{' '}
                    {addons
                      .map((a) =>
                        a.optionPrices
                          ? `${a.name} ${(s.conditions ?? [])
                              .filter((c) => a.optionPrices?.[c.key])
                              .map((c) => `+${inr(a.optionPrices![c.key])} (${c.label})`)
                              .join(', ')}`
                          : `${a.name} ${inr(a.price)}${a.unit ? ` ${a.unit}` : ''}`,
                      )
                      .join(' · ')}
                  </p>
                ) : null}
              </section>
            )
          })}
        </div>
      </div>

      <section className="section band-soft" aria-labelledby="factors-h">
        <div className="wrap stack-lg">
          <div className="stack">
            <h2 id="factors-h" className="h2">
              Why two 2BHKs can cost differently
            </h2>
            <p className="lede">Only four things move a price, and you choose all four in the planner — nothing is decided at your door.</p>
          </div>
          <div className="factors">
            {FACTORS.map((f, i) => (
              <div key={f.t} className="factor">
                <b>{i + 1}</b>
                <div>
                  <strong>{f.t}</strong>
                  <br />
                  <span>{f.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="never-h">
        <div className="wrap split" style={{ alignItems: 'flex-start' }}>
          <div className="stack">
            <h2 id="never-h" className="h2">
              Never charged extra
            </h2>
            <ul className="checks">
              {neverExtra.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <p className="promise">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
              Our price promise
            </span>
            If your home is very different from what you booked, we tell you before work starts — and you can say no. The price never
            changes after the work is done.
          </p>
        </div>
      </section>

      <ChatFaq faqs={faqs} title="Price questions" />

      <section className="cta-band">
        <div className="wrap">
          <p>Not sure which option fits? Send 3 photos — we&apos;ll tell you the exact price.</p>
          <a
            className="btn btn-wa"
            href={whatsappHref(settings.whatsapp, 'Hi DeepCleanz, here are photos of my home — what would the price be?')}
            data-place="pricing-photos"
          >
            Send photos on WhatsApp
          </a>
        </div>
      </section>

      <ActionBar settings={settings} whatsappText="Hi DeepCleanz, I have a question about your prices." />
    </>
  )
}
