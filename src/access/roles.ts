import type { Access, FieldAccess, Where } from 'payload'

export type Role = 'owner' | 'ops'

type MaybeUser = { role?: Role | null } | null | undefined

export const roleOf = (user: unknown): Role | undefined => (user as MaybeUser)?.role ?? undefined

/** Anyone, including the public website. */
export const anyone: Access = () => true

/** Any logged-in admin user (owner or ops). */
export const isStaff: Access = ({ req: { user } }) => Boolean(user)

/** Owner only — prices, settings, partners' money details, payouts. */
export const isOwner: Access = ({ req: { user } }) => roleOf(user) === 'owner'

/** Field-level: owner only. */
export const ownerOnlyField: FieldAccess = ({ req: { user } }) => roleOf(user) === 'owner'

/** Public sees only published records; staff see everything. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user) return true
  const where: Where = { published: { equals: true } }
  return where
}
