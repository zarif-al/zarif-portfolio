import type { Project } from '@/payload-types'

/**
 * Props for the OutcomeStats component.
 */
export interface OutcomeStatsProps {
  stats: Project['meta']['outcomeStats']
}
