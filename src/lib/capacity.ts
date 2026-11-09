import type { MongooseAdapter } from '@payloadcms/db-mongodb'
import type { Payload } from 'payload'

import type { Half } from './pricing'

class SlotFullError extends Error {}

/**
 * Atomically reserve half-day units for a booking.
 * Capacity per half = bookingSettings.crewsPerDay (partner crews ops expects that day),
 * unless a capacity record for that day overrides it.
 * Whole-day jobs reserve AM and PM together — both or neither (MongoDB transaction,
 * so the database must be a replica set: MongoDB Atlas works out of the box).
 *
 * Returns true if reserved, false if the slot is full or blocked.
 */
export async function reserveHalves(payload: Payload, day: string, halves: Half[]): Promise<boolean> {
  const db = payload.db as unknown as MongooseAdapter
  const Capacity = db.collections['capacity']
  const settings = await payload.findGlobal({ slug: 'booking-settings', overrideAccess: true })
  const defaultCapacity = settings.crewsPerDay ?? 3

  const session = await db.connection.startSession()
  try {
    await session.withTransaction(async () => {
      for (const half of halves) {
        // Create the day's record from the default if it doesn't exist yet.
        // Timestamps are left to Mongoose (Payload models use `timestamps: true`); setting
        // updatedAt here too makes MongoDB reject the update with a path conflict.
        await Capacity.updateOne(
          { day, half },
          { $setOnInsert: { day, half, capacity: defaultCapacity, booked: 0, blocked: false } },
          { upsert: true, session },
        )
        // Take one unit only if one is free and the half isn't blocked.
        const taken = await Capacity.findOneAndUpdate(
          { day, half, blocked: { $ne: true }, $expr: { $lt: ['$booked', '$capacity'] } },
          { $inc: { booked: 1 } },
          { new: true, session },
        )
        if (!taken) throw new SlotFullError(`${day} ${half} is full`)
      }
    })
    return true
  } catch (err) {
    if (err instanceof SlotFullError) return false
    throw err
  } finally {
    await session.endSession()
  }
}

/** Give units back when a booking is cancelled or moved. Never goes below zero. */
export async function releaseHalves(payload: Payload, day: string, halves: Half[]): Promise<void> {
  const db = payload.db as unknown as MongooseAdapter
  const Capacity = db.collections['capacity']
  for (const half of halves) {
    await Capacity.updateOne(
      { day, half, booked: { $gt: 0 } },
      { $inc: { booked: -1 } },
    )
  }
}
