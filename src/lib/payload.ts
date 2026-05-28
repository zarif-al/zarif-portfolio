import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

/**
 * Returns a Payload client for the current request context.
 *
 * This is the single entry point for Payload initialization — all consumers
 * (pages, API routes, tests) go through this one function.
 */
export async function getPayloadInstance(): Promise<Payload> {
  return getPayload({ config: configPromise })
}
