import React from 'react'

import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome'
import { getServices, getSettings } from '@/lib/site'

/** Public pages: full header, footer and (per page) the mobile action bar. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  return (
    <>
      <SiteHeader settings={settings} services={services} />
      <main>{children}</main>
      <SiteFooter settings={settings} services={services} />
    </>
  )
}
