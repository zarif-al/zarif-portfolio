import type { Project } from '@/payload-types'

/**
 * Props for the DetailRibbon component.
 */
export interface DetailRibbonProps {
  involvement: Project['meta']['involvement']
}
