import type { Block } from 'payload'

export const CollectionList: Block = {
  slug: 'collection-list',
  interfaceName: 'CollectionListBlock',
  fields: [
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Projects', value: 'projects' },
        { label: 'Blogs', value: 'blogs' },
      ],
      required: true,
      defaultValue: 'projects',
    },
  ],
}
