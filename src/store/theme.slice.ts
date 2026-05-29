'use client'

import type { StateCreator } from 'zustand'
import type { AppStore, ThemeSlice } from './store.types'
import {
  DEFAULT_THEME,
  THEME_ATTRIBUTE,
  THEME_COOKIE,
  COOKIE_MAX_AGE,
  type Theme,
} from './theme.constants'

export const createThemeSlice: StateCreator<AppStore, [], [], ThemeSlice> = (set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      setDocumentTheme(next)
      return { theme: next }
    }),
})

/**
 * Reads the initial theme from the `data-theme` attribute on `<html>`.
 * Returns `DEFAULT_THEME` on the server where `document` is unavailable.
 */
function getInitialTheme(): Theme {
  if (typeof document === 'undefined') {
    return DEFAULT_THEME
  }
  const attr = document.documentElement.getAttribute(THEME_ATTRIBUTE)
  return attr === 'dark' ? 'dark' : 'light'
}

/**
 * Writes the theme to the DOM attribute and persists it via cookie.
 */
function setDocumentTheme(next: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, next)
  document.cookie = `${THEME_COOKIE}=${next};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
}
