'use client'

import { useStore } from '@/store/global-store'

const ICON_DARK = '☀'
const ICON_LIGHT = '☽'

/**
 * Toggles between light and dark mode. Reads the current theme from
 * the global Zustand store — no provider, no local state, no DOM reads.
 */
export function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)

  return (
    <button
      onClick={toggleTheme}
      className="border border-border px-[0.65rem] py-[0.35rem] font-mono text-xs text-muted hover:border-fg hover:text-fg transition-colors"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {theme === 'dark' ? ICON_DARK : ICON_LIGHT}
    </button>
  )
}
