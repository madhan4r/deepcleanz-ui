'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * The header menus are <details> elements. With client-side navigation the header stays mounted,
 * so close any open menu whenever the page changes.
 */
export function MenuCloser() {
  const pathname = usePathname()
  useEffect(() => {
    document.querySelectorAll('header details[open]').forEach((d) => d.removeAttribute('open'))
  }, [pathname])
  return null
}
