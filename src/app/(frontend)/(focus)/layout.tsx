import type { Metadata } from 'next'
import React from 'react'

import { Logo } from '@/components/site/Logo'
import { telHref } from '@/lib/format'
import { getSettings } from '@/lib/site'

// Booking and confirmation pages are never indexed (spec S2, S13).
export const metadata: Metadata = { robots: { index: false, follow: false } }

/** Focused pages (booking flow): logo + call only, no menu, no footer links to wander off to (spec S3). */
export default async function FocusLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <Logo />
          <div className="header-actions">
            <a className="btn btn-soft" style={{ minHeight: 44 }} href={telHref(settings.phone)} data-place="focus-header">
              Call {settings.phone}
            </a>
          </div>
        </div>
      </header>
      <main className="focus-main">{children}</main>
    </>
  )
}
