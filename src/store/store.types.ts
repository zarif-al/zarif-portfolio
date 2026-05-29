import type { Theme } from './theme.constants'

export interface ThemeSlice {
  theme: Theme
  toggleTheme: () => void
}

export type AppStore = ThemeSlice
