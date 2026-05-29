import type { ResolvedFile, ResolvedImage, ResolvedMedia, ResolvedVideo } from './types'
import type { Media } from '@/payload-types'

/**
 * Resolve a Payload CMS media document into a typed, frontend-safe object.
 *
 * All media (images, videos, files) live in a single `media` collection.
 * This resolver inspects `mimeType` and returns a discriminated union so
 * consumers can handle each type with its own guard and render the correct
 * component (e.g. `<Image>` for images, `<video>` for video, a download link
 * for files).
 */
export function resolveMedia(raw?: string | Media | null): ResolvedMedia | null {
  if (typeof raw == 'string' || !raw?.url || !raw?.mimeType) {
    return null
  }

  const cmsUrl = process.env['NEXT_PUBLIC_URL']
  if (!cmsUrl) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_CMS_URL')
  }

  const url = cmsUrl + raw.url
  const mimetype = raw.mimeType

  // --- Image ---
  if (mimetype.startsWith('image/')) {
    // Guard: an image without dimensions is malformed
    if (raw.width == null || raw.height == null) {
      return null
    }

    return {
      type: 'image',
      url,
      mimeType: mimetype,
      alt: raw.alt ?? '',
      width: raw.width,
      height: raw.height,
      dataURL: raw.dataURL ?? undefined,
    } satisfies ResolvedImage
  }

  // --- Video ---
  if (mimetype.startsWith('video/')) {
    return {
      type: 'video',
      url,
      mimeType: mimetype,
      width: raw.width ?? null,
      height: raw.height ?? null,
    } satisfies ResolvedVideo
  }

  // --- File (everything else: PDF, SVG, audio, ZIP, etc.) ---
  return {
    type: 'file',
    url,
    mimeType: mimetype,
    filename: raw.filename ?? null,
  } satisfies ResolvedFile
}
