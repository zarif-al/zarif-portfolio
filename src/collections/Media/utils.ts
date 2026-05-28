import type { Media } from '@/payload-types'
import type { Condition } from 'payload'

export const dataURLFieldCondition: Condition<Media, unknown> = (data) => {
  // Only show for images
  return data.mimeType?.startsWith('image/') ?? false
}
