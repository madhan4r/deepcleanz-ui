import type { Faq, Job, Service, SiteSetting } from '@/payload-types'
import { mediaUrl } from '@/lib/site'

/** Spec S4 v2 §2 — occasions people actually search for. Links go to pages that exist in the sitemap. */
const MOMENTS = [
  { title: 'Moving into a new home', text: 'Every cabinet, tile and fitting, before your things arrive.', href: '/move-in-move-out-cleaning-chennai', tone: 'tone-sky' },
  { title: 'Handing back a rental', text: 'Empty-home clean, every corner — for a smooth handover.', href: '/move-in-move-out-cleaning-chennai', tone: 'tone-sun' },
  { title: 'Pongal & Diwali ready', text: 'Ceiling to floor before guests arrive. Book early — weekends go first.', href: '/festival-deep-cleaning-chennai', tone: 'tone-sun' },
  { title: 'Just renovated', text: 'Paint drops, cement marks and fine dust removed.', href: '/post-renovation-cleaning-chennai', tone: 'tone-sky' },
  { title: 'Baby or elders at home', text: 'Tell us when you book — we brief your crew before they arrive.', href: '#plan', tone: 'tone-sky' },
  { title: 'After the monsoon', text: 'Damp corners, stained tiles, musty sofas and mattresses.', href: '#plan', tone: 'tone-sun' },
] as const

export function Moments() {
  return (
    <section className="section" aria-labelledby="moments-h">
      <div className="wrap stack-lg">
        <div className="stack">
          <span className="eyebrow">Clean for the moment</span>
          <h2 id="moments-h" className="h2">
            What&apos;s happening at home?
          </h2>
          <p className="lede">Every situation needs a different clean. Pick yours — we&apos;ve planned what matters most.</p>
        </div>
        <div className="grid-cards">
          {MOMENTS.map((m) => (
            <a key={m.title} className={`moment ${m.tone}`} href={m.href}>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <span className="more">Plan this clean →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Spec S4 v2 §3 — "pay after service" as a visible ritual. Items come from the full-home service's handover list. */
export function InspectThenPay({ items, examplePrice }: { items: string[]; examplePrice: string }) {
  const list = items.length
    ? items
    : ['Kitchen — tiles, stove, chimney', 'Bathrooms — tiles, fittings, toilet', 'Bedrooms — fans, windows, floor', 'Living room & balcony']
  return (
    <section className="section band-sun" aria-labelledby="promise-h">
      <div className="wrap split">
        <div className="stack">
          <span className="eyebrow">Our promise</span>
          <h2 id="promise-h" className="h2">
            You inspect. You tick. Then you pay.
          </h2>
          <p className="lede">
            Before the crew leaves, you walk through your home with the crew lead and tick each room off. Anything missed gets
            fixed on the spot. Only then do you pay DeepCleanz — by UPI or cash.
          </p>
        </div>
        <div>
          <ul className="checklist" aria-label="Handover checklist">
            {list.map((item) => (
              <li key={item}>
                <span className="tick" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="checklist-foot" style={{ maxWidth: 480, padding: '12px 20px 0' }}>
            <span>All done? Pay {examplePrice}</span>
            <span style={{ color: 'var(--sky-deep)' }}>UPI · Cash</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/** Spec S4 v2 §4 — real before/after from recent jobs. Hidden entirely until real, consented jobs exist. */
export function FieldJobs({
  jobs,
  settings,
  title = 'Homes we cleaned recently',
}: {
  jobs: Job[]
  settings: SiteSetting
  title?: string
}) {
  if (!jobs.length) return null
  return (
    <section className="section" aria-labelledby="field-h">
      <div className="wrap stack-lg">
        <div className="stack">
          <span className="eyebrow">Fresh from the field</span>
          <h2 id="field-h" className="h2">
            {title}
          </h2>
          <p className="lede">Uploaded from the job by our cleaning partners — not a photoshoot.</p>
        </div>
        <div className="grid-cards">
          {jobs.map((j) => {
            const service = typeof j.service === 'object' ? (j.service as Service) : null
            const date = new Date(j.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
            return (
              <article key={j.id} className="job">
                <div className="job-pics">
                  <figure>
                    <img src={mediaUrl(j.beforeImage, 'card') ?? ''} alt={(j.beforeImage as { alt?: string })?.alt ?? `Before — ${j.title}`} loading="lazy" />
                    <figcaption>Before</figcaption>
                  </figure>
                  <figure>
                    <img src={mediaUrl(j.afterImage, 'card') ?? ''} alt={(j.afterImage as { alt?: string })?.alt ?? `After — ${j.title}`} loading="lazy" />
                    <figcaption>After</figcaption>
                  </figure>
                </div>
                <div className="job-body">
                  <strong>{j.title}</strong>
                  <span>
                    {j.area} · {date}
                    {j.durationHrs ? ` · ${j.durationHrs} hrs` : ''}
                    {service ? ` · ${service.menuLabel || service.name}` : ''}
                  </span>
                  {j.customerQuote ? <span>“{j.customerQuote}”</span> : null}
                </div>
              </article>
            )
          })}
        </div>
        {settings.googleRating && settings.googleReviewCount ? (
          <p className="rating-line">
            <span className="star">★</span> Rated {settings.googleRating} by {settings.googleReviewCount} customers on Google
            {settings.googleReviewLink ? (
              <>
                {' · '}
                <a href={settings.googleReviewLink} rel="noopener" target="_blank">
                  read the reviews
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </section>
  )
}

const DEEP_SPOTS = [
  'Fan blades & lights',
  'Tile grout & corners',
  'Chimney & exhaust',
  'Behind fridge & washer',
  'Window tracks & grills',
  'Bathroom hard-water stains',
  'Top of wardrobes',
]

/** Spec S4 v2 §5 — justifies the price and adds unique, useful content for Google. */
export function DeepVsRegular() {
  return (
    <section className="section band-soft" aria-labelledby="deep-h">
      <div className="wrap split" style={{ alignItems: 'flex-start' }}>
        <div className="stack">
          <span className="eyebrow">Deep vs regular</span>
          <h2 id="deep-h" className="h2">
            What &ldquo;deep&rdquo; actually means
          </h2>
          <p className="lede">Daily sweeping keeps floors tidy. A deep clean reaches the places dirt hides for months.</p>
        </div>
        <table className="compare">
          <caption className="visually-hidden">Spots a daily clean misses compared with a DeepCleanz deep clean</caption>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'left' }}>
                Spot
              </th>
              <th scope="col">Daily help</th>
              <th scope="col">DeepCleanz</th>
            </tr>
          </thead>
          <tbody>
            {DEEP_SPOTS.map((s) => (
              <tr key={s}>
                <th scope="row">{s}</th>
                <td className="no">
                  <span aria-hidden="true">—</span>
                  <span className="visually-hidden">Usually not</span>
                </td>
                <td className="yes">
                  <span aria-hidden="true">✓</span>
                  <span className="visually-hidden">Included</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/** Spec S4 v2 §6 — partner model (D19/D20): only claims that are true. Crew photos only with consent. */
export function WhoComes({ crew }: { crew: { name: string; photo: unknown; rating?: number | null; jobsDone?: number | null }[] }) {
  return (
    <section className="section" aria-labelledby="who-h">
      <div className="wrap split" style={{ alignItems: 'flex-start' }}>
        <div className="stack">
          <span className="eyebrow">Who comes to your home</span>
          <h2 id="who-h" className="h2">
            Verified cleaning partners — no strangers at the door
          </h2>
          <p className="lede">Every job goes to a verified DeepCleanz cleaning partner. We tell you who is coming before the day.</p>
          <ul className="checks">
            <li>ID and address checked before joining</li>
            <li>Works to the DeepCleanz checklist on every job</li>
            <li>Rated by every customer — low-rated partners stop getting jobs</li>
          </ul>
        </div>
        {crew.length > 0 ? (
          <div className="crew">
            {crew.map((c) => (
              <div key={c.name} className="crew-card">
                <img src={mediaUrl(c.photo, 'card') ?? ''} alt={c.name} loading="lazy" />
                <strong>{c.name}</strong>
                <span>
                  {c.rating ? `★ ${c.rating}` : 'Partner'}
                  {c.jobsDone ? ` · ${c.jobsDone} jobs` : ''}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/** Spec S4 v2 §7 — FAQs as chat bubbles; FAQPage schema is added by the page. */
export function ChatFaq({ faqs, title = 'You asked, we answered' }: { faqs: Faq[]; title?: string }) {
  if (!faqs.length) return null
  return (
    <section className="section band-soft" aria-labelledby="faq-h">
      <div className="wrap stack-lg">
        <h2 id="faq-h" className="h2">
          {title}
        </h2>
        <dl className="chat">
          {faqs.map((f) => (
            <div key={f.id} className="chat" style={{ gap: 6 }}>
              <dt className="chat-q">{f.question}</dt>
              <dd className="chat-a" style={{ margin: 0 }}>
                {f.answer}
              </dd>
            </div>
          ))}
        </dl>
        <a href="/faq" style={{ fontWeight: 700 }}>
          More questions →
        </a>
      </div>
    </section>
  )
}

/** Spec S4 v2 §8 — internal links to every service page. */
export function ServiceLinks({ services }: { services: Service[] }) {
  return (
    <section className="section" aria-labelledby="links-h">
      <div className="wrap stack">
        <h2 id="links-h" style={{ fontSize: 20 }}>
          Deep cleaning services in Chennai
        </h2>
        <nav className="links" aria-label="Services">
          {services.map((s) => (
            <a key={s.id} href={`/${s.slug}`}>
              {s.h1.replace(' in Chennai', '')}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}

export function CtaBand({ text = "Your price in 30 seconds. ₹0 until you're happy." }: { text?: string }) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <p>{text}</p>
        <a className="btn btn-book" href="#plan">
          Plan my clean
        </a>
      </div>
    </section>
  )
}
