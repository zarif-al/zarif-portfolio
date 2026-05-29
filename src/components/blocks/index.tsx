import { HeroBlockComponent } from './hero'
import { RichtextBlockComponent } from './richtext'
import { TerminalBlockComponent } from './terminal-block'
import { CardGridBlockComponent } from './card-grid'
import { CollectionListBlockComponent } from './collection-list'
import { ContactBlockComponent } from './contact'
import { EntryListBlockComponent } from './entry-list'
import { EqualizerBlockComponent } from './equalizer'
import type { Config } from '@/payload-types'

type PageBlock = Config['blocks'][keyof Config['blocks']]

interface RenderBlocksProps {
  blocks?: PageBlock[] | null
}

const BLOCK_SPACING = 'mb-[clamp(2rem,6vh,5rem)]'
const BLOCK_SPACING_TOP = 'pt-[clamp(2rem,6vh,5rem)]'
const EQUALIZER_SPACING = 'mb-4 max-sm:mb-3'

/**
 * Renders an ordered list of page blocks.
 *
 * Spacing is centralized here — each block receives a `className` applied
 * to its outermost `<section>`. Standard blocks get bottom margin only
 * (`BLOCK_SPACING`); the Equalizer uses tighter bottom margin.
 * The first block additionally receives top padding (`BLOCK_SPACING_TOP`)
 * so the page opens with breathing room.
 */
export function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, i) => {
        const base = block.blockType === 'equalizer' ? EQUALIZER_SPACING : BLOCK_SPACING

        const spacing = i === 0 ? `${base} ${BLOCK_SPACING_TOP}` : base

        switch (block.blockType) {
          case 'hero':
            return <HeroBlockComponent {...block} key={block.id} className={spacing} />
          case 'richtext':
            return <RichtextBlockComponent {...block} key={block.id} className={spacing} />
          case 'terminal-block':
            return <TerminalBlockComponent {...block} key={block.id} className={spacing} />
          case 'card-grid':
            return <CardGridBlockComponent {...block} key={block.id} className={spacing} />
          case 'collection-list':
            return <CollectionListBlockComponent {...block} key={block.id} className={spacing} />
          case 'contact':
            return <ContactBlockComponent {...block} key={block.id} className={spacing} />
          case 'entry-list':
            return <EntryListBlockComponent {...block} key={block.id} className={spacing} />
          case 'equalizer':
            return <EqualizerBlockComponent {...block} key={block.id} className={spacing} />
          default:
            return null
        }
      })}
    </>
  )
}
