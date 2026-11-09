'use client'

import { useMemo, useRef, useState } from 'react'

import { track } from '@/components/site/track'
import { inr } from '@/lib/format'

export type PlannerOption = {
  key: string
  label: string
  price: number
  durationHrs?: string | null
  crewSize?: number | null
  description?: string | null
  photoUrl?: string | null
}
export type PlannerAddon = { id: string; name: string; price: number; unit: string }

type Props = {
  serviceSlug: string
  serviceName: string
  options: PlannerOption[]
  addons: PlannerAddon[]
  defaultKey?: string
  /** Heading for step 1. */
  optionsLegend?: string
  /** 'grid' = compact buttons (BHK); 'rows' = photo + description cards (condition picker on service pages). */
  variant?: 'grid' | 'rows'
}

/**
 * The "Clean Planner" (spec S4 v2 §1, S5 §2). Live price in the browser for display only —
 * the booking API recomputes it on the server from the same catalogue.
 */
export function Planner({
  serviceSlug,
  serviceName,
  options,
  addons,
  defaultKey,
  optionsLegend = '1 · Your home',
  variant = 'grid',
}: Props) {
  const initial = options.find((o) => o.key === defaultKey) ?? options[Math.floor(options.length / 2)] ?? options[0]
  const [key, setKey] = useState(initial?.key)
  const [picked, setPicked] = useState<string[]>([])
  const started = useRef(false)

  const option = options.find((o) => o.key === key) ?? initial
  const chosen = addons.filter((a) => picked.includes(a.id))
  const total = useMemo(() => (option?.price ?? 0) + chosen.reduce((s, a) => s + a.price, 0), [option, chosen])

  if (!option) return null

  const firstTouch = () => {
    if (started.current) return
    started.current = true
    track('planner_start', { service: serviceSlug })
  }

  const choose = (o: PlannerOption) => {
    firstTouch()
    setKey(o.key)
    track('condition_selected', { service: serviceSlug, option: o.key, value: o.price })
  }

  const toggle = (a: PlannerAddon) => {
    firstTouch()
    setPicked((cur) => {
      const on = cur.includes(a.id)
      if (!on) track('addon_added', { service: serviceSlug, addon: a.name, value: a.price })
      return on ? cur.filter((x) => x !== a.id) : [...cur, a.id]
    })
  }

  const params = new URLSearchParams({ service: serviceSlug, option: option.key })
  if (picked.length) params.set('addons', picked.join(','))
  const meta = [
    option.crewSize ? `Crew of ${option.crewSize}` : null,
    option.durationHrs ? `about ${option.durationHrs} hours` : null,
    'they bring their own machines',
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="planner" id="plan">
      <fieldset>
        <legend>{optionsLegend}</legend>
        {variant === 'grid' ? (
          <div className="option-grid">
            {options.map((o) => (
              <button key={o.key} type="button" className="option" aria-pressed={o.key === option.key} onClick={() => choose(o)}>
                <strong>{o.label}</strong>
                <small>{inr(o.price)}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className="option-rows">
            {options.map((o) => (
              <button key={o.key} type="button" className="option-row" aria-pressed={o.key === option.key} onClick={() => choose(o)}>
                {o.photoUrl ? <img src={o.photoUrl} alt="" loading="lazy" /> : null}
                <span className="option-row-text">
                  <strong>{o.label}</strong>
                  {o.description ? <small>{o.description}</small> : null}
                </span>
                <span className="option-row-price">{inr(o.price)}</span>
              </button>
            ))}
          </div>
        )}
      </fieldset>

      {addons.length > 0 && (
        <fieldset>
          <legend>2 · Anything extra?</legend>
          <div className="pills">
            {addons.map((a) => {
              const on = picked.includes(a.id)
              return (
                <button key={a.id} type="button" className="pill" aria-pressed={on} onClick={() => toggle(a)}>
                  {on ? '✓' : '+'} {a.name} <span className="visually-hidden">{inr(a.price)}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      <div className="quote" aria-live="polite">
        <div className="quote-meta">
          <strong>
            {option.label} {serviceName}
            {chosen.length ? ` + ${chosen.map((a) => a.name.toLowerCase()).join(', ')}` : ''}
          </strong>
          <span>{meta}</span>
        </div>
        <span className="quote-price">{inr(total)}</span>
      </div>

      <a
        className="btn btn-book btn-block"
        href={`/book?${params.toString()}`}
        onClick={() => track('book_start', { service: serviceSlug, option: option.key, value: total })}
      >
        Pick a date →
      </a>
      <p className="fine">₹0 now · pay DeepCleanz after you inspect the work</p>
    </div>
  )
}
