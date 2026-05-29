import type { Block } from 'payload'
import { customLexicalEditor } from '@/lib/lexical-editor'

const NumberedGrid: Block = {
  slug: 'numbered-grid',
  interfaceName: 'NumberedGridBlock',
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
}

const CellGrid: Block = {
  slug: 'cell-grid',
  interfaceName: 'CellGridBlock',
  fields: [
    { name: 'swap', type: 'checkbox', defaultValue: false },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Stack', value: 'stack' },
          ],
          defaultValue: 'text',
          required: true,
        },
        { name: 'heading', type: 'text' },
        {
          name: 'content',
          type: 'richText',
          editor: customLexicalEditor({ headingsConfig: { enabled: false } }),
          admin: { condition: (_, siblingData) => siblingData?.['type'] === 'text' },
        },
        {
          name: 'stackItems',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.['type'] === 'stack' },
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        { name: 'footnote', type: 'text' },
      ],
    },
  ],
}

export const CardGrid: Block = {
  slug: 'card-grid',
  interfaceName: 'CardGridBlock',
  fields: [
    {
      name: 'content',
      type: 'blocks',
      blocks: [NumberedGrid, CellGrid],
    },
  ],
}
