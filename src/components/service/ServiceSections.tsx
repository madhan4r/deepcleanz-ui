import type { Service, SiteSetting } from '@/payload-types'
import { inr, whatsappHref } from '@/lib/format'
import { fromPrice, mediaUrl, shortName } from '@/lib/site'

export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.name}>
            {it.path && i < items.length - 1 ? <a href={it.path}>{it.name}</a> : <span aria-current="page">{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Spec S5 v2 §3 — what we clean, zone by zone. Map only when a real zone image exists. */
export function ZoneMap({ service }: { service: Service }) {
  const zones = service.zones ?? []
  const excluded = (service.excluded ?? []).map((e) => e.item)
  if (!zones.length && !excluded.length) return null
  const img = mediaUrl(service.zoneImage, 'hero')
  return (
    <section className="section" aria-labelledby="zones-h">
      <div className="wrap split" style={{ alignItems: 'flex-start' }}>
        <div className="stack-lg">
          <div className="stack">
            <span className="eyebrow">Zone by zone</span>
            <h2 id="zones-h" className="h2">
              Every surface we clean in your {shortName(service)}
            </h2>
          </div>
          {img ? (
            <div className="zone-map">
              <img src={img} alt={(service.zoneImage as { alt?: string })?.alt ?? `${service.name} zones`} loading="lazy" />
              {zones.map((z, i) =>
                typeof z.pinX === 'number' && typeof z.pinY === 'number' ? (
                  <span key={z.id ?? i} className="pin" style={{ left: `${z.pinX}%`, top: `${z.pinY}%` }} aria-hidden="true">
                    {i + 1}
                  </span>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
        <div className="stack-lg">
          {zones.length ? (
            <ol className="zones">
              {zones.map((z, i) => (
                <li key={z.id ?? i}>
                  <div>
                    <strong>{z.title}</strong>
                    {z.description ? <span>{z.description}</span> : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
          {excluded.length ? (
            <p className="note-box">
              <strong>Not included:</strong> {excluded.join(', ')}.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/** Spec S5 v2 §4 — the checks the customer makes before paying. */
export function HandoverChecklist({ service }: { service: Service }) {
  const items = (service.handover ?? []).map((h) => h.item)
  if (!items.length) return null
  return (
    <section className="section band-sun" aria-labelledby="handover-h">
      <div className="wrap split">
        <div className="stack">
          <span className="eyebrow">Before you pay</span>
          <h2 id="handover-h" className="h2">
            Your {shortName(service)} handover checklist
          </h2>
          <p className="lede">
            Walk through with the crew lead and tick each one. Anything that isn&apos;t right gets redone before they leave — then
            you pay DeepCleanz.
          </p>
        </div>
        <ul className="checklist" aria-label="Handover checklist">
          {items.map((item) => (
            <li key={item}>
              <span className="tick" aria-hidden="true">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Spec S5 v2 §6 — care tips + a WhatsApp reminder opt-in (repeat bookings). */
export function CareTips({ service, settings }: { service: Service; settings: SiteSetting }) {
  const tips = (service.tips ?? []).map((t) => t.item)
  if (!tips.length) return null
  const months = service.reminderMonths ?? 3
  const name = shortName(service)
  return (
    <section className="section band-soft" aria-labelledby="tips-h">
      <div className="wrap stack-lg" style={{ maxWidth: 820 }}>
        <div className="stack">
          <span className="eyebrow">After the clean</span>
          <h2 id="tips-h" className="h2">
            Keep your {name} this clean for {months} months
          </h2>
        </div>
        <ol className="tips">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <a
          className="remind"
          href={whatsappHref(settings.whatsapp, `Hi DeepCleanz, please remind me in ${months} months to book ${name} deep cleaning.`)}
          data-place="remind"
        >
          <span>
            <strong>Remind me in {months} months</strong>
            <small>One WhatsApp message when it&apos;s time. No spam.</small>
          </span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}

/** Spec S5 v2 §8 — "Make it a full home" / related services, with real prices only. */
export function Upgrade({ service }: { service: Service }) {
  const related = (service.related ?? []).filter((r): r is Service => typeof r === 'object' && r !== null && Boolean(r.published))
  if (!related.length) return null
  return (
    <section className="section">
      <div className="wrap grid-cards">
        {related.map((r) => {
          const from = fromPrice(r)
          return (
            <a key={r.id} className="upgrade" href={`/${r.slug}`} style={{ textDecoration: 'none', color: 'var(--ink)' }}>
              <span className="eyebrow">Also popular</span>
              <strong style={{ fontSize: 18 }}>{r.h1}</strong>
              {r.subline ? <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{r.subline}</span> : null}
              <span style={{ fontWeight: 800, color: 'var(--sky-deep)' }}>{from ? `From ${inr(from)} →` : 'See prices →'}</span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
