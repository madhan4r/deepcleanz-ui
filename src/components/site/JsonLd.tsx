import type { Faq, Service, SiteSetting } from '@/payload-types'
import { fromPrice } from '@/lib/site'
import { inr } from '@/lib/format'

/** Renders one JSON-LD block. Content is our own data, serialised safely. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/**
 * LocalBusiness schema (spec S13). Deliberately NO AggregateRating/Review markup:
 * self-serving review markup is not eligible for stars and can be treated as spam.
 */
export function localBusinessSchema(settings: SiteSetting, services: Service[], siteUrl: string) {
  const prices = services.map(fromPrice).filter((p): p is number => typeof p === 'number')
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: settings.businessName,
    url: siteUrl || undefined,
    telephone: settings.phone,
    email: settings.email ?? undefined,
    image: `${siteUrl}/icon.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'City', name: 'Chennai' },
    priceRange: prices.length ? `${inr(Math.min(...prices))}–${inr(Math.max(...prices))}` : undefined,
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.h1, url: `${siteUrl}/${s.slug}` },
      ...(fromPrice(s) ? { price: fromPrice(s), priceCurrency: 'INR' } : {}),
    })),
  }
}

export function faqSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  }
}

/** Service + lowest-price Offer, provided by the LocalBusiness (spec S5, S13). */
export function serviceSchema(service: Service, siteUrl: string) {
  const from = fromPrice(service)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.h1,
    serviceType: service.name,
    description: service.metaDescription || service.subline || undefined,
    url: `${siteUrl}/${service.slug}`,
    areaServed: { '@type': 'City', name: 'Chennai' },
    provider: { '@id': `${siteUrl}/#business` },
    ...(from
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: from,
            highPrice: Math.max(...(service.conditions ?? []).map((c) => c.price)),
            offerCount: (service.conditions ?? []).length,
          },
        }
      : {}),
  }
}

/** All published prices as one catalogue (pricing page). */
export function offerCatalogSchema(services: Service[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'DeepCleanz deep cleaning prices in Chennai',
    url: `${siteUrl}/pricing`,
    itemListElement: services.flatMap((s) =>
      (s.conditions ?? []).map((c) => ({
        '@type': 'Offer',
        price: c.price,
        priceCurrency: 'INR',
        itemOffered: { '@type': 'Service', name: `${s.name} — ${c.label}`, url: `${siteUrl}/${s.slug}` },
      })),
    ),
  }
}
