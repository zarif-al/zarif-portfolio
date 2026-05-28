import type { Block } from 'payload'

export const Richtext: Block = {
  slug: 'richtext',
  interfaceName: 'RichtextBlock',
  fields: [{ name: 'content', type: 'richText', required: true }],
}
