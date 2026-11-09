import { createRequire } from 'module'
import type SharpType from 'sharp'

/**
 * sharp (image resizing) needs an x86-64-v2 CPU (SSE4.2). Our VPS exposes a basic QEMU CPU without it,
 * and loading sharp there throws — which would take down every page. So it is loaded only if it works;
 * without it, uploaded photos are stored as-is (no card/hero sizes). Set DISABLE_SHARP=1 to force it off.
 */
function load(): typeof SharpType | undefined {
  if (process.env.DISABLE_SHARP === '1') return undefined
  try {
    const req = createRequire(`${process.cwd()}/`)
    const s = req('sharp') as typeof SharpType
    return s
  } catch (err) {
    console.warn('[images] sharp unavailable, uploads are stored without resizing:', String((err as Error).message).split('\n')[0])
    return undefined
  }
}

export const sharp = load()
