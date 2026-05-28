import { isValidEmail } from './is-valid-email'
import { isValidPhoneNumber } from './is-valid-phone-number'

/**
 * Validates URL format based on allowed protocols
 *
 * @param url - The URL string to validate
 * @param protocols - Array of allowed protocols (e.g., ['https'], ['https', 'mailto', 'tel'])
 * @returns true if the URL matches one of the allowed protocols and is valid, false otherwise
 *
 * @example
 * // Only allow https URLs (for form inputs)
 * isValidUrl('https://example.com', ['https'])
 *
 * // Allow https, mailto, and tel URLs (for link fields)
 * isValidUrl('mailto:user@example.com', ['https', 'mailto', 'tel'])
 */
type UrlProtocol = 'https' | 'mailto' | 'tel'
export function isValidUrl(url: string, protocols: UrlProtocol[]): boolean {
  if (!url || protocols.length === 0) {
    return false
  }

  // Determine which protocol the URL is using and validate accordingly
  if (protocols.includes('mailto') && url.startsWith('mailto:')) {
    const email = url.substring(7).split('?')[0]
    return isValidEmail(email)
  }

  if (protocols.includes('tel') && url.startsWith('tel:')) {
    const phone = url.substring(4).replace(/[\s()-]/g, '')
    return isValidPhoneNumber(phone)
  }

  if (protocols.includes('https') && url.startsWith('https://')) {
    try {
      const parsedUrl = new URL(url)
      return parsedUrl.protocol === 'https:'
    } catch {
      return false
    }
  }

  // URL doesn't match any supported protocol format
  return false
}
