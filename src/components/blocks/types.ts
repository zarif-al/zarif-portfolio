import type { Config } from '@/payload-types'

export type PageBlock = Config['blocks'][keyof Config['blocks']]

export interface RenderBlocksProps {
  blocks?: PageBlock[] | null
}

/** Payload block props extended with an optional `className` for spacing. */
export type BlockComponentProps<T extends PageBlock = PageBlock> = T & {
  className?: string
}
