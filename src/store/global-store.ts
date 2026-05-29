import { create } from 'zustand'
import { createThemeSlice } from './slices/theme'
import type { AppStore } from './store.types'

export const useStore = create<AppStore>()((...args) => ({
  ...createThemeSlice(...args),
}))
