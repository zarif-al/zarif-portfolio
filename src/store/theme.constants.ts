const THEME_ATTRIBUTE = 'data-theme'
const THEME_COOKIE = 'theme'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export type Theme = 'dark' | 'light'

export const DEFAULT_THEME: Theme = 'dark'

export { THEME_ATTRIBUTE, THEME_COOKIE, COOKIE_MAX_AGE }
