import '@fontsource-variable/plus-jakarta-sans'
import './globals.css'

import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import React from 'react'

import { Tracking } from '@/components/site/Tracking'
import { getSettings } from '@/lib/site'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'DeepCleanz', template: '%s | DeepCleanz' },
  description: 'Home deep cleaning in Chennai. See your price in 30 seconds and pay only after you inspect the work.',
  openGraph: { siteName: 'DeepCleanz', locale: 'en_IN', type: 'website' },
}

export const viewport: Viewport = { themeColor: '#0B6FAE' }

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const gtmId = settings.tracking?.gtmId

  return (
    <html lang="en-IN">
      <body>
        {gtmId ? (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
                title="Google Tag Manager"
              />
            </noscript>
          </>
        ) : null}
        <Tracking />
        {children}
      </body>
    </html>
  )
}
