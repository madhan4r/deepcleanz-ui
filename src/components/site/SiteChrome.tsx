import type { Service, SiteSetting } from '@/payload-types'
import { inr, telHref, whatsappHref } from '@/lib/format'
import { fromPrice } from '@/lib/site'

import { Logo } from './Logo'

type Props = { settings: SiteSetting; services: Service[] }

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

const priceLabel = (s: Service) => {
  const p = fromPrice(s)
  return p ? `from ${inr(p)}` : ''
}

/** Sticky header (spec S3 / S3b). Desktop: menu + phone + Plan my clean. Mobile: logo, call, menu sheet. */
export function SiteHeader({ settings, services }: Props) {
  return (
    <header className="site-header">
      <div className="wrap">
        <Logo />
        <nav className="nav-desktop" aria-label="Main">
          <details className="dropdown">
            <summary>Services ▾</summary>
            <div className="dropdown-panel">
              {services.map((s) => (
                <a key={s.id} href={`/${s.slug}`}>
                  {s.menuLabel || s.name} <small>{priceLabel(s)}</small>
                </a>
              ))}
            </div>
          </details>
          <a href="/festival-deep-cleaning-chennai">Pongal &amp; Diwali</a>
          <a href="/pricing">Prices</a>
          <a href="/about">Who comes</a>
          <a href="/faq">Questions</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={telHref(settings.phone)} data-place="header">
            {settings.phone}
          </a>
          <a className="btn btn-book header-book" href="/#plan">
            Plan my clean
          </a>
          <a className="icon-btn header-call" href={telHref(settings.phone)} aria-label={`Call ${settings.businessName}`} data-place="header">
            <PhoneIcon />
          </a>
          <details className="menu-mobile">
            <summary className="icon-btn" aria-label="Open menu">
              <MenuIcon />
            </summary>
            <nav className="menu-sheet" aria-label="Mobile">
              <span className="menu-label">Services</span>
              {services.map((s) => (
                <a key={s.id} href={`/${s.slug}`}>
                  {s.menuLabel || s.name} <small>{priceLabel(s)}</small>
                </a>
              ))}
              <span className="menu-label">More</span>
              <a href="/festival-deep-cleaning-chennai">Pongal &amp; Diwali cleaning</a>
              <a href="/pricing">Prices</a>
              <a href="/about">Who comes to your home</a>
              <a href="/faq">Questions</a>
              <a href="/contact">Contact</a>
              <div className="pills" style={{ marginTop: 16 }}>
                <a className="btn btn-soft" href={telHref(settings.phone)} data-place="menu">
                  Call
                </a>
                <a className="btn btn-wa" href={whatsappHref(settings.whatsapp, 'Hi DeepCleanz, I need a deep clean.')} data-place="menu">
                  WhatsApp
                </a>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

/** Mobile-only action bar: Call · WhatsApp · Plan my clean (spec S3). */
export function ActionBar({
  settings,
  whatsappText,
  bookLabel = 'Plan my clean',
  bookHref = '/#plan',
}: {
  settings: SiteSetting
  whatsappText: string
  bookLabel?: string
  bookHref?: string
}) {
  return (
    <nav className="action-bar" aria-label="Quick actions">
      <a className="btn btn-soft" href={telHref(settings.phone)} data-place="action-bar">
        Call
      </a>
      <a className="btn btn-wa" href={whatsappHref(settings.whatsapp, whatsappText)} data-place="action-bar">
        WhatsApp
      </a>
      <a className="btn btn-book" href={bookHref}>
        {bookLabel}
      </a>
    </nav>
  )
}

/** Footer: business details exactly as on Google Business Profile + keyword links (spec S3). */
export function SiteFooter({ settings, services }: Props) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <p className="footer-brand">
            Deep<span>Cleanz</span>
          </p>
          <p>{settings.address}</p>
          <p>
            <a href={telHref(settings.phone)} data-place="footer">
              {settings.phone}
            </a>
            {settings.email ? (
              <>
                {' · '}
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </>
            ) : null}
          </p>
          {(settings.hours ?? []).map((h) => (
            <p key={h.id ?? h.days}>
              {h.days} {h.open}–{h.close}
            </p>
          ))}
        </div>
        <div>
          <h2>Services</h2>
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <a href={`/${s.slug}`}>{s.h1}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Occasions</h2>
          <ul>
            <li>
              <a href="/festival-deep-cleaning-chennai">Pongal &amp; Diwali deep cleaning</a>
            </li>
            <li>
              <a href="/move-in-move-out-cleaning-chennai">Move-in &amp; rental handover</a>
            </li>
            <li>
              <a href="/post-renovation-cleaning-chennai">After renovation</a>
            </li>
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            <li>
              <a href="/pricing">Prices</a>
            </li>
            <li>
              <a href="/about">Who comes to your home</a>
            </li>
            <li>
              <a href="/faq">Questions</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy</a> · <a href="/terms">Terms</a> ·{' '}
              <a href="/cancellation-policy">Cancellation</a> · <a href="/damage-policy">Damage</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
