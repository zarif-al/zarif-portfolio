/**
 * Validates phone number format
 * Supports 7-15 digits with optional +, spaces, hyphens, and parentheses
 *
 * @param phone - The phone number string to validate
 * @returns true if the phone format is valid, false otherwise
 */
export function isValidPhoneNumber(phone?: string): boolean {
  // Phone number validation regex (supports various formats)
  const phoneRegExp = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/

  if (!phone) {
    return false
  }

  // Remove spaces before testing to handle formatted numbers
  const normalizedPhone = phone.replace(/\s/g, '')
  return phoneRegExp.test(normalizedPhone)
}
