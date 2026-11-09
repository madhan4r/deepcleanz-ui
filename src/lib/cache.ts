import { revalidateTag, unstable_cache } from 'next/cache'
import { cache } from 'react'

/** Everything shown on public pages (catalogue, content, settings). */
export const SITE_TAG = 'site'
/** Live slot data (capacity), refreshed more often and whenever a booking changes. */
export const CAPACITY_TAG = 'capacity'

/**
 * Cache a read across requests (Next.js data cache) and within a request (React cache).
 * Public pages then render without a database round-trip; admin edits clear the cache
 * immediately through `bustCache` hooks, and it expires on its own after `revalidate` seconds.
 */
export function cachedQuery<A extends unknown[], R>(
  name: string,
  fn: (...args: A) => Promise<R>,
  { tags = [SITE_TAG], revalidate = 300 }: { tags?: string[]; revalidate?: number } = {},
) {
  return cache(unstable_cache(fn, [name], { tags, revalidate }))
}

/** Expire cached public data now. Safe to call outside Next.js (seed script): it then does nothing. */
export function bustCache(tag: string = SITE_TAG) {
  try {
    revalidateTag(tag, { expire: 0 })
  } catch {
    /* not inside a Next.js request (e.g. `npm run seed`) */
  }
}
