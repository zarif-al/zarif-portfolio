import type { BlocksField, BlockSlug, Tab } from 'payload'
import { ALL_PAGE_BLOCKS } from '../blocks'

type CreateBlocksTabConfig = {
  admin?: BlocksField['admin']
  /**
   * Block slugs to hide from the admin UI only.
   * They remain available in the GraphQL schema.
   */
  excludeBlockSlugs?: BlockSlug[]
}

export const createBlocksTab = (config: CreateBlocksTabConfig = {}): Tab => ({
  label: 'Blocks',
  name: 'blocksTab',
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      admin: {
        isSortable: true,
        description: 'Add and arrange content blocks to build the page.',
        ...config.admin,
      },
      // Payload's `BlockSlug` is a branded string — the cast is required.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      blockReferences: ALL_PAGE_BLOCKS.map((b) => b.slug as BlockSlug).sort(),
      filterOptions: () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const allowedSlugs = ALL_PAGE_BLOCKS.map((b) => b.slug as BlockSlug).filter(
          (slug) => !config.excludeBlockSlugs?.includes(slug),
        )

        return allowedSlugs
      },
      blocks: [],
    },
  ],
})
