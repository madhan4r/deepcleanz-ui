import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

import { bustCache, CAPACITY_TAG, SITE_TAG } from '../lib/cache'

/** Public pages read cached data (src/lib/cache.ts). These hooks clear it the moment admin saves. */
export const bustSiteOnChange: CollectionAfterChangeHook = ({ doc }) => {
  bustCache(SITE_TAG)
  return doc
}
export const bustSiteOnDelete: CollectionAfterDeleteHook = ({ doc }) => {
  bustCache(SITE_TAG)
  return doc
}
export const bustSiteGlobal: GlobalAfterChangeHook = ({ doc }) => {
  bustCache(SITE_TAG)
  bustCache(CAPACITY_TAG) // crews per day changes availability
  return doc
}
export const bustCapacityOnChange: CollectionAfterChangeHook = ({ doc }) => {
  bustCache(CAPACITY_TAG)
  return doc
}

export const siteCacheHooks = { afterChange: [bustSiteOnChange], afterDelete: [bustSiteOnDelete] }
