import { create } from 'zustand'
import { createThemeSlice } from './theme.slice'
import type { AppStore } from './store.types'

export const useStore = create<AppStore>()((...args) => ({
  ...createThemeSlice(...args),
}))
