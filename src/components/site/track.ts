'use client'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * Push an event to Google Tag Manager (spec S14). GTM forwards these to GA4,
 * and the ones marked as conversions to Google Ads.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}
