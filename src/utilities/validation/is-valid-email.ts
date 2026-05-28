/**
 * Validates email format
 *
 * @param email - The email string to validate
 * @returns true if the email format is valid, false otherwise
 */
export function isValidEmail(email?: string): boolean {
  // Email validation regex
  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return false
  }

  return emailRegExp.test(email)
}
