'use client'

import { useEffect } from 'react'

import { track } from './track'

const COOKIE = 'dc_attr'
const NINETY_DAYS = 60 * 60 * 24 * 90

/**
 * Keeps the Google Ads click id and UTM tags from the first landing for 90 days,
 * so a booking made days later is still credited to the ad (spec §9, S14).
 * Also turns every Call / WhatsApp link click into a tracked event.
 */
export function Tracking() {
  useEffect(() => {
    const url = new URL(window.location.href)
    const fresh = {
      gclid: url.searchParams.get('gclid'),
      utmSource: url.searchParams.get('utm_source'),
      utmMedium: url.searchParams.get('utm_medium'),
      utmCampaign: url.searchParams.get('utm_campaign'),
    }
    if (Object.values(fresh).some(Boolean)) {
      const value = encodeURIComponent(JSON.stringify({ ...fresh, landingPage: url.pathname, at: Date.now() }))
      document.cookie = `${COOKIE}=${value}; Max-Age=${NINETY_DAYS}; Path=/; SameSite=Lax; Secure`
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest('a')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      const place = a.dataset.place ?? 'page'
      if (href.startsWith('tel:')) track('call_click', { place, page: window.location.pathname })
      else if (href.startsWith('https://wa.me/')) track('whatsapp_click', { place, page: window.location.pathname })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
