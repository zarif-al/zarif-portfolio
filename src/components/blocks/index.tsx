import { HeroBlockComponent } from './hero'
import { CtaBlockComponent } from './cta'
import { RichtextBlockComponent } from './richtext'
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
          case 'cta':
            return <CtaBlockComponent {...block} key={block.id} />
          case 'richtext':
            return <RichtextBlockComponent {...block} key={block.id} />
          default:
            return null
        }
      })}
    </>
  )
}
