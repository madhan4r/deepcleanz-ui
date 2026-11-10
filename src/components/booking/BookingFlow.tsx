'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { track } from '@/components/site/track'
import { inr, whatsappHref } from '@/lib/format'

type StartTime = { key: string; label: string; available: boolean }
type Day = { day: string; weekday: string; date: string; status: 'open' | 'few' | 'full'; startTimes: StartTime[] }

export type BookingSummary = {
  service: string
  option: string
  addons: string[]
  itemLabel: string
  addonLabels: string[]
  total: number
  meta: string
}

const NOTES = [
  { key: 'pets', label: 'Pets at home' },
  { key: 'kids_elders', label: 'Baby / elders' },
  { key: 'limited_water', label: 'Limited water' },
  { key: 'watchman_key', label: 'Watchman has key' },
] as const

const STEPS = ['Your clean', 'Date & time', 'Address', 'Your details'] as const
const CTA = ['Choose a date →', 'Add address →', 'Almost done →', 'Confirm booking · pay later'] as const

const digits = (s: string) => s.replace(/\D/g, '').slice(-10)
const validPhone = (s: string) => /^[6-9]\d{9}$/.test(digits(s))

/** Spec S8: 4 steps + confirmation. Price and capacity are enforced again by the server. */
export function BookingFlow({ summary, whatsapp }: { summary: BookingSummary; whatsapp: string }) {
  const [step, setStep] = useState(0)
  const [notes, setNotes] = useState<string[]>([])
  const [instructions, setInstructions] = useState('')
  const [days, setDays] = useState<Day[] | null>(null)
  const [day, setDay] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [area, setArea] = useState('')
  const [areaServed, setAreaServed] = useState<boolean | null>(null)
  const [line, setLine] = useState('')
  const [landmark, setLandmark] = useState('')
  const [lift, setLift] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('') // honeypot — real people never see or fill this
  // A "please fill…" message belongs to the field values it was raised for: it disappears as soon as
  // the customer changes one of them (derived here instead of being cleared from an effect).
  const fieldsKey = [day, startTime, area, line, name, phone].join('|')
  const [errorState, setErrorState] = useState<{ msg: string; key: string }>({ msg: '', key: '' })
  const setError = (msg: string) => setErrorState({ msg, key: fieldsKey })
  const [loadError, setLoadError] = useState('') // dates failed to load — stays until they load
  const error = (errorState.key === fieldsKey ? errorState.msg : '') || loadError
  const [noticeMsg, setNotice] = useState('') // "slot just taken" — shown until a new time is picked
  const notice = startTime ? '' : noticeMsg
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const leadSent = useRef('')
  const headingRef = useRef<HTMLHeadingElement>(null)

  const addonsKey = summary.addons.join(',')


  useEffect(() => {
    track('book_step_1', { service: summary.service, value: summary.total })
  }, [summary.service, summary.total])

  // Load dates when step 2 opens; callers reset `days` to null to reload (e.g. after a 409).
  useEffect(() => {
    if (step !== 1 || days !== null) return
    let cancelled = false
    const query = new URLSearchParams({ service: summary.service, option: summary.option, addons: addonsKey })
    fetch(`/api/bookings/availability?${query.toString()}`, { cache: 'no-store' })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok) {
          setLoadError(json.error ?? 'Could not load dates. Please call or WhatsApp us.')
          setDays([])
          return
        }
        setLoadError('')
        setDays(json.days as Day[])
      })
      .catch(() => {
        if (cancelled) return
        setLoadError('Could not load dates. Please call or WhatsApp us.')
        setDays([])
      })
    return () => {
      cancelled = true
    }
  }, [step, days, summary.service, summary.option, addonsKey])

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  const selectedDay = days?.find((d) => d.day === day)
  const startLabel = selectedDay?.startTimes.find((s) => s.key === startTime)?.label

  const checkArea = async () => {
    if (area.trim().length < 3) return setAreaServed(null)
    const res = await fetch(`/api/bookings/area-check?q=${encodeURIComponent(area)}`)
    const json = await res.json().catch(() => ({}))
    setAreaServed(typeof json.served === 'boolean' ? json.served : null)
  }

  const sendLead = async () => {
    const d = digits(phone)
    if (!validPhone(phone) || leadSent.current === d) return
    leadSent.current = d
    track('lead_phone_entered', { service: summary.service, value: summary.total })
    await fetch('/api/bookings/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: d,
        name,
        website,
        plan: { service: summary.service, option: summary.option, addons: summary.addons, total: summary.total, day, startTime },
      }),
    }).catch(() => undefined)
  }

  const canContinue = [
    true,
    Boolean(day && startTime),
    area.trim().length >= 3 && line.trim().length >= 3 && areaServed !== false,
    name.trim().length >= 2 && validPhone(phone),
  ][step]

  const next = async () => {
    setError('')
    if (!canContinue) {
      setError(
        [
          '',
          'Pick a date and a start time.',
          areaServed === false ? '' : 'Add your area and flat / street.',
          'Add your name and a 10-digit mobile number.',
        ][step],
      )
      return
    }
    if (step < 3) {
      track(`book_step_${step + 2}`, { service: summary.service })
      setStep(step + 1)
      return
    }
    // Submit
    setBusy(true)
    await sendLead()
    const res = await fetch('/api/bookings/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: summary.service,
        option: summary.option,
        addons: summary.addons,
        day,
        startTime,
        notes,
        instructions,
        address: { area, line, landmark, lift },
        customer: { name, phone: digits(phone) },
        website,
      }),
    })
    const json = await res.json().catch(() => ({}))
    setBusy(false)
    if (res.status === 409) {
      setNotice('That slot was just taken. Please pick another time.')
      setStartTime('')
      setDays(null) // the effect reloads dates for step 2
      setStep(1)
      return
    }
    if (!res.ok) {
      setError(json.error ?? 'Something went wrong. Please call or WhatsApp us.')
      return
    }
    try {
      sessionStorage.setItem('dc_last_booking', JSON.stringify({ ...json, addonLabels: summary.addonLabels }))
    } catch {
      /* private mode — thank-you page falls back to a generic message */
    }
    router.push('/thank-you')
  }

  return (
    <div className="book">
      <div className="book-progress" aria-label={`Step ${step + 1} of 4`}>
        <div className="book-progress-row">
          {step > 0 ? (
            <button type="button" className="book-back" onClick={() => setStep(step - 1)} aria-label="Back">
              ← Back
            </button>
          ) : (
            <a className="book-back" href={`/${summary.service}?option=${encodeURIComponent(summary.option)}#plan`}>
              ← Change
            </a>
          )}
          <span>
            Step {step + 1} of 4 · {STEPS[step]}
          </span>
        </div>
        <div className="book-bar">
          <span style={{ width: `${(step + 1) * 25}%` }} />
        </div>
      </div>

      <div className="book-body">
        <h1 ref={headingRef} tabIndex={-1} className="book-h1">
          {['Your clean', 'When should we come?', 'Where is your home?', 'Last step — your details'][step]}
        </h1>

        {step === 0 && (
          <div className="stack-lg">
            <div className="book-card">
              <div className="book-card-row">
                <strong>{summary.itemLabel}</strong>
                <strong>{inr(summary.total)}</strong>
              </div>
              {summary.addonLabels.length ? <span className="muted">+ {summary.addonLabels.join(', ')}</span> : null}
              {summary.meta ? <span className="muted">{summary.meta}</span> : null}
            </div>
            <fieldset className="book-fieldset">
              <legend>Anything we should know?</legend>
              <div className="pills">
                {NOTES.map((n) => {
                  const on = notes.includes(n.key)
                  return (
                    <button
                      key={n.key}
                      type="button"
                      className="pill"
                      aria-pressed={on}
                      onClick={() => setNotes(on ? notes.filter((x) => x !== n.key) : [...notes, n.key])}
                    >
                      {on ? '✓' : '+'} {n.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
            <label className="field">
              <span>Anything else? (optional)</span>
              <textarea rows={2} maxLength={500} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </label>
            <p className="note-box">
              The price is fixed for what you picked. If your home is very different on the day, we tell you <strong>before</strong>{' '}
              starting — never after.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="stack-lg">
            {days === null ? <p className="muted">Loading dates…</p> : null}
            {days && days.length > 0 ? (
              <>
                <div className="day-strip" role="listbox" aria-label="Date">
                  {days.map((d) => {
                    const full = d.status === 'full'
                    return (
                      <button
                        key={d.day}
                        type="button"
                        role="option"
                        aria-selected={d.day === day}
                        disabled={full}
                        className="day-chip"
                        onClick={() => {
                          setDay(d.day)
                          setStartTime('')
                        }}
                      >
                        <small>{d.weekday}</small>
                        <strong>{d.date.split(' ')[0]}</strong>
                        <small>{d.date.split(' ')[1]}</small>
                        <em className={`day-status ${d.status}`}>{full ? 'Full' : d.status === 'few' ? 'Few left' : 'Open'}</em>
                      </button>
                    )
                  })}
                </div>
                {selectedDay ? (
                  <fieldset className="book-fieldset">
                    <legend>Start time</legend>
                    <div className="time-grid">
                      {selectedDay.startTimes.map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          className="option"
                          aria-pressed={s.key === startTime}
                          disabled={!s.available}
                          onClick={() => setStartTime(s.key)}
                        >
                          <strong>{s.label}</strong>
                          <small>{s.available ? 'Available' : 'Full'}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : (
                  <p className="muted">Pick a date to see start times.</p>
                )}
              </>
            ) : null}
            {days && days.length === 0 ? (
              <p className="note-box">
                No online slots right now.{' '}
                <a href={whatsappHref(whatsapp, `Hi DeepCleanz, I'd like to book ${summary.itemLabel}. When are you free?`)} data-place="book-noslots">
                  WhatsApp us
                </a>{' '}
                and we&apos;ll find a time.
              </p>
            ) : null}
          </div>
        )}

        {step === 2 && (
          <div className="stack-lg">
            <label className="field">
              <span>Area or apartment name</span>
              <input
                value={area}
                onChange={(e) => {
                  setArea(e.target.value)
                  setAreaServed(null)
                }}
                onBlur={checkArea}
                placeholder="e.g. Velachery, or your apartment name"
                autoComplete="address-level3"
              />
            </label>
            {areaServed === true ? <p className="ok-box">✓ We serve this area</p> : null}
            {areaServed === false ? (
              <p className="note-box">
                We don&apos;t cover this area online yet.{' '}
                <a href={whatsappHref(whatsapp, `Hi DeepCleanz, do you cover ${area}? I'd like ${summary.itemLabel}.`)} data-place="book-area">
                  WhatsApp us
                </a>{' '}
                and we&apos;ll check for you.
              </p>
            ) : null}
            <label className="field">
              <span>Flat / house no. and street</span>
              <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="e.g. B-402, 3rd Main Road" autoComplete="street-address" />
            </label>
            <label className="field">
              <span>Landmark (optional)</span>
              <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. opposite the bus stop" />
            </label>
            <fieldset className="book-fieldset">
              <legend>Is there a lift?</legend>
              <div className="pills">
                <button type="button" className="pill" aria-pressed={lift} onClick={() => setLift(true)}>
                  Yes / ground floor
                </button>
                <button type="button" className="pill" aria-pressed={!lift} onClick={() => setLift(false)}>
                  No lift
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="stack-lg">
            <label className="field">
              <span>Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="field">
              <span>WhatsApp number</span>
              <span className="phone-row">
                <span className="phone-cc">+91</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={sendLead}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                />
              </span>
            </label>
            <label className="hp" aria-hidden="true">
              Website
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
            <div className="book-card">
              <div className="book-card-row">
                <span>{summary.itemLabel}</span>
                <strong>{inr(summary.total)}</strong>
              </div>
              <div className="book-card-row muted">
                <span>
                  {selectedDay ? `${selectedDay.weekday} ${selectedDay.date}` : ''} · {startLabel}
                </span>
                <span>{area}</span>
              </div>
              <div className="book-card-row" style={{ color: 'var(--sky-deep)', fontWeight: 800 }}>
                <span>Pay now</span>
                <span>₹0</span>
              </div>
            </div>
            <p className="muted" style={{ fontSize: 13 }}>
              We use your number only for this booking. By booking you agree to our <Link href="/terms">terms</Link> and{' '}
              <Link href="/privacy-policy">privacy policy</Link>.
            </p>
          </div>
        )}

        {notice ? (
          <p className="error-box" role="alert">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="error-box" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="book-foot">
        <div className="book-total">
          <strong>{inr(summary.total)}</strong>
          <small>₹0 now · pay after</small>
        </div>
        <button type="button" className="btn btn-book" onClick={next} disabled={busy}>
          {busy ? 'Booking…' : CTA[step]}
        </button>
      </div>
    </div>
  )
}
