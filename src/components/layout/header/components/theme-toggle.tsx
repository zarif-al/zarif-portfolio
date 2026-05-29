'use client'

import { useTheme } from '@/stores/theme'

const ICON_DARK = '☀'
const ICON_LIGHT = '☽'

/**
 * Toggles between light and dark mode. Reads the current theme from
 * the nearest `<ThemeProvider>` context — no local state, no DOM reads.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()

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
