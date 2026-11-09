import { RichText } from '@payloadcms/richtext-lexical/react'

import { WhoComes } from '@/components/home/Sections'
import { faqSchema, JsonLd, localBusinessSchema } from '@/components/site/JsonLd'
import { ActionBar } from '@/components/site/SiteChrome'
import { telHref, whatsappHref } from '@/lib/format'
import { istDate, siteUrl } from '@/lib/site'
import type { Faq, Page, Service, SiteSetting } from '@/payload-types'

/** Text page written in admin (policies etc.). */
export function PageView({ page, settings }: { page: Page; settings: SiteSetting }) {
  const updated = istDate(page.updatedAt)
  return (
    <>
      <article className="section">
        <div className="wrap prose">
          <h1>{page.title}</h1>
          {updated ? <p className="muted">Last updated {new Date(page.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}</p> : null}
          <RichText data={page.body} />
        </div>
      </article>
      <ActionBar settings={settings} whatsappText="Hi DeepCleanz, I have a question." />
    </>
  )
}

const HOW = [
  { t: 'You plan and book', d: 'Pick your home and extras, see the price, choose a date. ₹0 to book.' },
  { t: 'We assign a verified partner', d: 'A DeepCleanz cleaning partner — ID and address checked — takes your job. We call to confirm.' },
  { t: 'The crew cleans', d: 'They arrive with their own machines and chemicals and work to the DeepCleanz checklist.' },
  { t: 'You inspect, then pay', d: 'Walk through every room. Anything missed is fixed on the spot. Then you pay DeepCleanz.' },
]

export function AboutView({
  settings,
  crew,
}: {
  settings: SiteSetting
  crew: { name: string; photo: unknown; rating?: number | null; jobsDone?: number | null }[]
}) {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-copy" style={{ maxWidth: 760 }}>
            <span className="hero-tag">About DeepCleanz</span>
            <h1>Deep cleaning you can check before you pay</h1>
            <p className="hero-sub">
              DeepCleanz takes your booking, sends it to a verified cleaning partner near you, and stays responsible for the result
              — you pay us only after you&apos;ve inspected the work.
            </p>
            <div className="hero-chips">
              {settings.googleRating && settings.googleReviewCount ? (
                <span className="chip">
                  ★ {settings.googleRating} · {settings.googleReviewCount} Google reviews
                </span>
              ) : null}
              {settings.homesCleanedDisplay ? <span className="chip">{settings.homesCleanedDisplay} Chennai homes</span> : null}
            </div>
          </div>
        </div>
      </section>

      {settings.founderNote ? (
        <section className="section">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <blockquote className="founder">{settings.founderNote}</blockquote>
          </div>
        </section>
      ) : null}

      <section className="section band-soft" aria-labelledby="how-h">
        <div className="wrap stack-lg">
          <h2 id="how-h" className="h2">
            How DeepCleanz works
          </h2>
          <ol className="next-steps" style={{ background: '#fff', maxWidth: 760 }}>
            {HOW.map((h) => (
              <li key={h.t}>
                <strong>{h.t}</strong>
                <span>{h.d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <WhoComes crew={crew} />

      <ActionBar settings={settings} whatsappText="Hi DeepCleanz, I'd like to know more about your service." />
    </>
  )
}

export function ContactView({ settings, services }: { settings: SiteSetting; services: Service[] }) {
  return (
    <>
      <JsonLd data={localBusinessSchema(settings, services, siteUrl)} />
      <section className="section">
        <div className="wrap split" style={{ alignItems: 'flex-start' }}>
          <div className="stack-lg">
            <div className="stack">
              <h1 style={{ fontSize: 'clamp(29px, 5vw, 44px)' }}>Contact DeepCleanz</h1>
              <p className="lede">The fastest way to a price is the planner — or send us photos on WhatsApp.</p>
            </div>
            <div className="pills">
              <a className="btn btn-wa" href={whatsappHref(settings.whatsapp, 'Hi DeepCleanz, I have a question.')} data-place="contact">
                WhatsApp us
              </a>
              <a className="btn btn-soft" href={telHref(settings.phone)} data-place="contact">
                Call {settings.phone}
              </a>
              <a className="btn btn-book" href="/#plan">
                See your price
              </a>
            </div>
          </div>
          <address className="contact-card">
            <strong>{settings.businessName}</strong>
            <span>{settings.address}</span>
            <a href={telHref(settings.phone)} data-place="contact-card">
              {settings.phone}
            </a>
            {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
            {(settings.hours ?? []).map((h) => (
              <span key={h.id ?? h.days}>
                {h.days}: {h.open} – {h.close}
              </span>
            ))}
            {settings.mapsLink ? (
              <a className="btn btn-soft" href={settings.mapsLink} target="_blank" rel="noopener" style={{ marginTop: 8 }}>
                Open in Google Maps
              </a>
            ) : null}
          </address>
        </div>
      </section>
      <ActionBar settings={settings} whatsappText="Hi DeepCleanz, I have a question." />
    </>
  )
}

const TOPICS: { key: Faq['topic']; title: string }[] = [
  { key: 'booking', title: 'Booking' },
  { key: 'payment', title: 'Price & payment' },
  { key: 'day', title: 'On the day' },
  { key: 'safety', title: 'Safety & who comes' },
  { key: 'after', title: 'After the clean' },
]

export function FaqView({ faqs, settings }: { faqs: Faq[]; settings: SiteSetting }) {
  return (
    <>
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}
      <section className="section">
        <div className="wrap stack-lg" style={{ maxWidth: 820 }}>
          <h1 style={{ fontSize: 'clamp(29px, 5vw, 44px)' }}>Questions people ask</h1>
          {TOPICS.map((t) => {
            const list = faqs.filter((f) => f.topic === t.key)
            if (!list.length) return null
            return (
              <section key={t.key} className="stack" aria-labelledby={`t-${t.key}`}>
                <h2 id={`t-${t.key}`} style={{ fontSize: 20 }}>
                  {t.title}
                </h2>
                <div className="faq-list">
                  {list.map((f) => (
                    <details key={f.id}>
                      <summary>{f.question}</summary>
                      <p>{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )
          })}
          <p className="note-box">
            Didn&apos;t find it?{' '}
            <a href={whatsappHref(settings.whatsapp, 'Hi DeepCleanz, I have a question.')} data-place="faq">
              Ask us on WhatsApp
            </a>
            .
          </p>
        </div>
      </section>
      <ActionBar settings={settings} whatsappText="Hi DeepCleanz, I have a question." />
    </>
  )
}
