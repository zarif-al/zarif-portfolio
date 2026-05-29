import {
  DEFAULT_THEME,
  THEME_ATTRIBUTE,
  THEME_COOKIE,
  COOKIE_MAX_AGE,
  type Theme,
} from '../../theme.constants'

/**
 * Reads the initial theme from the persisted cookie on the client.
 * Returns `DEFAULT_THEME` on the server where `document` is unavailable.
 */
export function getInitialTheme(): Theme {
  if (typeof document === 'undefined') {
    return DEFAULT_THEME
  }
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=([^;]*)`))
  const cookieValue = match?.[1]
  return cookieValue === 'dark' || cookieValue === 'light' ? cookieValue : DEFAULT_THEME
}

/**
 * Writes the theme to the DOM attribute and persists it via cookie.
 */
export function setDocumentTheme(next: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, next)
  document.cookie = `${THEME_COOKIE}=${next};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
}
