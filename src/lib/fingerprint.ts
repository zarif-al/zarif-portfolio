import crypto from 'crypto'
import { Jimp } from 'jimp'

/**
 * Generates a content-based fingerprint for any file type
 * (images, PDFs, DOCX, audio, etc.). Uses SHA-256 over the raw
 * bytes, so identical files produce identical fingerprints.
 *
 * @param buffer - File buffer to fingerprint
 * @returns SHA-256 hex fingerprint string
 */
export function fingerprint(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * Generates a perceptual fingerprint for images based on normalized
 * pixel data. This fingerprint remains the same even if the image
 * format, compression, or metadata changes — only visual content matters.
 *
 * Throws if given a non-image MIME type.
 *
 * @param buffer - Image file buffer to fingerprint
 * @param mimeType - MIME type (must start with "image/")
 * @returns Perceptual SHA-256 hex fingerprint string
 */
export async function fingerprintPerceptual(buffer: Buffer, mimeType: string): Promise<string> {
  if (!mimeType.startsWith('image/')) {
    throw new Error('Perceptual fingerprint can only be generated for image files')
  }

  const image = await Jimp.read(buffer)
  const pixelBuffer = image.bitmap.data

  return crypto.createHash('sha256').update(pixelBuffer).digest('hex')
}
