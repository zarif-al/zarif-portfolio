'use client'

import { useState } from 'react'

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') {
    return 'light'
  }

  const stored = document.cookie
    .split('; ')
    .find((row) => row.startsWith('theme='))
    ?.split('=')[1]

  if (stored === 'dark') {
    return 'dark'
  }

  if (stored === 'light') {
    return 'light'
  }

  return getSystemTheme()
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme)

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      document.cookie = `theme=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`

      return next
    })
  }

  return (
    <button
      onClick={toggle}
      className="border border-border px-2 py-1 font-mono text-xs text-muted hover:border-fg hover:text-fg transition-colors"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {theme === 'dark' ? '☀' : '☽'}
    </button>
  )
}
