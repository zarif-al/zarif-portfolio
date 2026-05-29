'use client'

import { useCallback, useState } from 'react'

const THEME_ATTRIBUTE = 'data-theme'
const THEME_COOKIE = 'theme'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const ICON_DARK = '☀'
const ICON_LIGHT = '☽'

type Theme = 'dark' | 'light'

/**
 * Toggles between light and dark mode. Reads the initial theme from the
 * `data-theme` attribute (set server-side via cookie) and persists changes
 * to both the DOM attribute and a cookie.
 *
 * TODO: This is not initializing correctly
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute(THEME_ATTRIBUTE, next)
      document.cookie = `${THEME_COOKIE}=${next};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
      return next
    })
  }, [])

  return (
    <button
      onClick={toggle}
      className="border border-border px-[0.65rem] py-[0.35rem] font-mono text-xs text-muted hover:border-fg hover:text-fg transition-colors"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {theme === 'dark' ? ICON_DARK : ICON_LIGHT}
    </button>
  )
}

/**
 * Reads the current theme from the `data-theme` attribute on `<html>`.
 * Falls back to the system `prefers-color-scheme` media query when
 * no explicit theme has been set.
 *
 * Must only be called on the client (during `useState` lazy initialization).
 */
function readInitialTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light'
  }

  const stored = document.documentElement.getAttribute(THEME_ATTRIBUTE)

  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
