import type { Block } from 'payload'

export const Richtext: Block = {
  slug: 'richtext',
  interfaceName: 'RichtextBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'content', type: 'richText' },
  ],
}
