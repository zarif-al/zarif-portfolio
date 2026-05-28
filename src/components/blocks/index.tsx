import { HeroBlockComponent } from './hero'
import { RichtextBlockComponent } from './richtext'
import { TerminalBlockComponent } from './terminal-block'
import { CardGridBlockComponent } from './card-grid'
import { CollectionListBlockComponent } from './collection-list'
import { ContactBlockComponent } from './contact'
import { EntryListBlockComponent } from './entry-list'
import type { Config } from '@/payload-types'

type PageBlock = Config['blocks'][keyof Config['blocks']]

interface RenderBlocksProps {
  blocks?: PageBlock[] | null
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlockComponent {...block} key={block.id} />
          case 'richtext':
            return <RichtextBlockComponent {...block} key={block.id} />
          case 'terminal-block':
            return <TerminalBlockComponent {...block} key={block.id} />
          case 'card-grid':
            return <CardGridBlockComponent {...block} key={block.id} />
          case 'collection-list':
            return <CollectionListBlockComponent {...block} key={block.id} />
          case 'contact':
            return <ContactBlockComponent {...block} key={block.id} />
          case 'entry-list':
            return <EntryListBlockComponent {...block} key={block.id} />
          default:
            return null
        }
      })}
    </>
  )
}
