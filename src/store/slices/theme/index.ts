'use client'

import type { StateCreator } from 'zustand'

import type { AppStore, ThemeSlice } from '../../store.types'
import { getInitialTheme, setDocumentTheme } from './utils'

export const createThemeSlice: StateCreator<AppStore, [], [], ThemeSlice> = (set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      setDocumentTheme(next)
      return { theme: next }
    }),
})
