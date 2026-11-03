import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

export const dynamic = 'force-dynamic'

/** Day 1 placeholder. Day 2 replaces this with the "Plan your clean" home page from the canvas. */
export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const services = await payload.find({ collection: 'services', limit: 20, sort: 'order', depth: 0 })

  return (
    <main className="home">
      <h1>{settings.businessName ?? 'DeepCleanz'}</h1>
      <p>
        Data model is live. {services.totalDocs} services published
        {settings.googleRating ? ` · ${settings.googleRating}★ from ${settings.googleReviewCount} Google reviews` : ''}.
      </p>
      <ul>
        {services.docs.map((s) => (
          <li key={s.id}>
            {s.name} — from ₹{Math.min(...(s.conditions ?? []).map((c) => c.price)).toLocaleString('en-IN')}
          </li>
        ))}
      </ul>
      <p>
        <a href="/admin">Open admin</a>
      </p>
    </main>
  )
}
