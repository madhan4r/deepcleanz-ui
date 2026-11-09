import { Planner } from '@/components/home/Planner'
import { ChatFaq, FieldJobs } from '@/components/home/Sections'
import { Breadcrumbs, CareTips, HandoverChecklist, Upgrade, ZoneMap } from '@/components/service/ServiceSections'
import { breadcrumbSchema, faqSchema, JsonLd, serviceSchema } from '@/components/site/JsonLd'
import { ActionBar } from '@/components/site/SiteChrome'
import { inr } from '@/lib/format'
import { fromPrice, mediaUrl, plannerAddons, shortName, siteUrl } from '@/lib/site'
import type { Faq, Job, Service, SiteSetting } from '@/payload-types'

export function ServiceView({
  service,
  settings,
  jobs,
  option,
}: {
  service: Service
  settings: SiteSetting
  jobs: Job[]
  option?: string
}) {
  const faqs = (service.faqs ?? []).filter((f): f is Faq => typeof f === 'object' && f !== null)
  const options = (service.conditions ?? []).map((c) => ({
    key: c.key,
    label: c.label,
    price: c.price,
    durationHrs: c.durationHrs,
    crewSize: c.crewSize,
    description: c.description,
    photoUrl: mediaUrl(c.photo, 'card'),
  }))
  // Few, short options (BHK) read best as buttons; descriptive conditions as photo rows.
  const variant = options.some((o) => o.description || o.photoUrl) ? 'rows' : 'grid'
  const name = shortName(service)
  const from = fromPrice(service)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/pricing' },
    { name: service.menuLabel || service.name, path: `/${service.slug}` },
  ]

  return (
    <>
      <JsonLd data={serviceSchema(service, siteUrl)} />
      <JsonLd data={breadcrumbSchema(crumbs, siteUrl)} />
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}

      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <Breadcrumbs items={crumbs} />
            <h1>{service.h1}</h1>
            {service.subline ? <p className="hero-sub">{service.subline}</p> : null}
            <div className="hero-chips">
              <span className="chip">✓ ₹0 advance — pay after you inspect</span>
              {settings.googleRating && settings.googleReviewCount ? (
                <span className="chip">
                  ★ {settings.googleRating} · {settings.googleReviewCount} Google reviews
                </span>
              ) : null}
              {from ? <span className="chip">From {inr(from)}</span> : null}
            </div>
          </div>
          <Planner
            serviceSlug={service.slug}
            serviceName={name}
            options={options}
            addons={plannerAddons(service)}
            defaultKey={option}
            variant={variant}
            optionsLegend={variant === 'rows' ? `Which looks most like your ${name}?` : '1 · Pick your size'}
          />
        </div>
      </section>

      <ZoneMap service={service} />
      <HandoverChecklist service={service} />
      <FieldJobs jobs={jobs} settings={settings} title={`${service.menuLabel || service.name} jobs we did recently`} />
      <CareTips service={service} settings={settings} />
      <ChatFaq faqs={faqs} title={`${service.menuLabel || service.name} cleaning questions`} />
      <Upgrade service={service} />

      <ActionBar
        settings={settings}
        whatsappText={`Hi DeepCleanz, I need ${name} cleaning. Can you share today's price?`}
        bookLabel={from ? `Book · from ${inr(from)}` : 'Book now'}
        bookHref="#plan"
      />
    </>
  )
}
