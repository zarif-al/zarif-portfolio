import type { Block } from 'payload'

export const CardGrid: Block = {
  slug: 'card-grid',
  interfaceName: 'CardGridBlock',
  fields: [
    {
      name: 'numberedCards',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        {
          name: 'cards',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'cells',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'span',
          type: 'select',
          options: [
            { label: 'Half', value: 'half' },
            { label: 'Full', value: 'full' },
          ],
          defaultValue: 'half',
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Stack', value: 'stack' },
          ],
          defaultValue: 'text',
        },
        {
          name: 'content',
          type: 'richText',
          admin: { condition: (_, siblingData) => siblingData?.['type'] === 'text' },
        },
        {
          name: 'stackItems',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.['type'] === 'stack' },
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        {
          name: 'stackFootnote',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.['type'] === 'stack' },
        },
      ],
    },
  ],
}
