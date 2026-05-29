import type { Block } from 'payload'

export const EntryList: Block = {
  slug: 'entry-list',
  interfaceName: 'EntryListBlock',
  fields: [
    {
      name: 'entries',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
  ],
}
