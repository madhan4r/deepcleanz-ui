'use client'

import { useEffect, useState } from 'react'

import { track } from '@/components/site/track'
import { inr, whatsappHref } from '@/lib/format'

type Last = { bookingNo: string; total: number; day: string; startLabel: string; item: string; service: string; name: string; addonLabels?: string[] }

const niceDay = (day: string) => {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
}

/** Builds a tiny .ics file so the customer can add the visit to their phone calendar. */
function calendarHref(b: Last) {
  const [h, rest] = b.startLabel.split(':')
  const pm = /pm/i.test(rest ?? '')
  const hour = ((Number(h) % 12) + (pm ? 12 : 0)).toString().padStart(2, '0')
  const minute = (rest ?? '00').slice(0, 2)
  const start = `${b.day.replace(/-/g, '')}T${hour}${minute}00`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DeepCleanz//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${b.bookingNo}@deepcleanz`,
    `DTSTART;TZID=Asia/Kolkata:${start}`,
    `SUMMARY:DeepCleanz — ${b.item}`,
    `DESCRIPTION:Booking ${b.bookingNo}. Pay after you inspect the work.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}

/**
 * /thank-you — fires the main Google Ads + GA4 conversion exactly once per booking (spec S8, S14).
 * Booking details come from this browser's session only, so the page never exposes anyone else's booking.
 */
export function ThankYou({ whatsapp }: { whatsapp: string }) {
  const [b, setB] = useState<Last | null | undefined>(undefined)

  useEffect(() => {
    let last: Last | null = null
    try {
      last = JSON.parse(sessionStorage.getItem('dc_last_booking') ?? 'null')
    } catch {
      last = null
    }
    setB(last)
    if (!last) return
    const flag = `dc_conv_${last.bookingNo}`
    try {
      if (sessionStorage.getItem(flag)) return
      sessionStorage.setItem(flag, '1')
    } catch {
      /* ignore */
    }
    track('booking_confirmed', {
      transaction_id: last.bookingNo,
      value: last.total,
      currency: 'INR',
      service: last.service,
    })
  }, [])

  if (b === undefined) return <div className="wrap section" />

  const steps = [
    { t: 'Next', d: 'We assign a verified cleaning partner and call you to confirm. Nothing to pay.' },
    { t: 'Before the day', d: "We WhatsApp you your crew's details." },
    { t: 'On the day', d: 'The crew arrives with their own machines and chemicals.' },
    { t: 'Walk-through, then pay', d: 'Tick the checklist room by room, then pay DeepCleanz by UPI or cash.' },
  ]

  return (
    <div className="wrap section stack-lg" style={{ maxWidth: 620 }}>
      <div className="stack" style={{ alignItems: 'center', textAlign: 'center' }}>
        <span className="done-badge" aria-hidden="true">
          ✓
        </span>
        <h1 className="book-h1">{b ? `You're booked, ${b.name.split(' ')[0]}!` : 'Thank you — your booking is in.'}</h1>
        {b ? (
          <p className="lede">
            {niceDay(b.day)} · {b.startLabel} · Booking {b.bookingNo}
          </p>
        ) : null}
      </div>

      {b ? (
        <div className="book-card">
          <div className="book-card-row">
            <span>{b.item}</span>
            <strong>{inr(b.total)}</strong>
          </div>
          {b.addonLabels?.length ? <span className="muted">+ {b.addonLabels.join(', ')}</span> : null}
          <div className="book-card-row" style={{ color: 'var(--sky-deep)', fontWeight: 800 }}>
            <span>Paid now</span>
            <span>₹0</span>
          </div>
        </div>
      ) : null}

      <ol className="next-steps">
        {steps.map((s) => (
          <li key={s.t}>
            <strong>{s.t}</strong>
            <span>{s.d}</span>
          </li>
        ))}
      </ol>

      <div className="pills">
        {b ? (
          <a className="btn btn-soft" href={calendarHref(b)} download={`deepcleanz-${b.bookingNo}.ics`}>
            Add to calendar
          </a>
        ) : null}
        <a
          className="btn btn-wa"
          href={whatsappHref(whatsapp, b ? `Hi DeepCleanz, about my booking ${b.bookingNo}…` : 'Hi DeepCleanz, about my booking…')}
          data-place="thank-you"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  )
}
