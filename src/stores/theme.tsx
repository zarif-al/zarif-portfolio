'use client'

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react'

const THEME_ATTRIBUTE = 'data-theme'
const THEME_COOKIE = 'theme'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Subscriber list for `useSyncExternalStore` — notified on toggle. */
let _listeners: (() => void)[] = []
let _cached: Theme | null = null

function subscribeToTheme(cb: () => void) {
  _listeners = [..._listeners, cb]
  return () => {
    _listeners = _listeners.filter((l) => l !== cb)
  }
}

function getSnapshot(): Theme {
  if (typeof document === 'undefined') {
    return 'light'
  }
  const attr = document.documentElement.getAttribute(THEME_ATTRIBUTE)
  _cached = attr === 'dark' ? 'dark' : 'light'
  return _cached
}

function setTheme(next: Theme) {
  _cached = next
  document.documentElement.setAttribute(THEME_ATTRIBUTE, next)
  document.cookie = `${THEME_COOKIE}=${next};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
  _listeners.forEach((l) => l())
}

/**
 * Provides the current theme and a toggle function to the component tree.
 * Uses `useSyncExternalStore` so React always reads the correct theme from
 * the DOM attribute — even during hydration, even when an inline script
 * mutated the attribute before React mounted.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getSnapshot, getSnapshotServer)

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme])

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

function getSnapshotServer(): Theme {
  return 'light'
}

/**
 * Access the current theme and toggle function. Must be used within a
 * `<ThemeProvider>`.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
