import type { Block } from 'payload'

export const Equalizer: Block = {
  slug: 'equalizer',
  interfaceName: 'EqualizerBlock',
  fields: [{ name: 'track', type: 'text' }],
}
