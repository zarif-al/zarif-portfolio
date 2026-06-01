import type { Block } from 'payload'

export const Equalizer: Block = {
  slug: 'equalizer',
  interfaceName: 'EqualizerBlock',
  fields: [
    {
      name: 'tracks',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'author', type: 'text' },
      ],
    },
  ],
}
