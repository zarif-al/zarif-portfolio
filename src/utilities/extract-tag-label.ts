import type { Tag } from '@/payload-types'

/**
 * Extract the display label from a Payload relationship value.
 * Returns the label for populated Tag objects; returns an empty string
 * for raw string IDs (which carry no label data).
 */
export function extractTagLabel(tag: string | Tag): string {
  if (typeof tag === 'string') {
    return ''
  }
  return tag.label
}
