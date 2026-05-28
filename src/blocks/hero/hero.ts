import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'kicker', type: 'text' },
    { name: 'heading', type: 'richText', required: true },
    { name: 'showEqualizer', type: 'checkbox', defaultValue: false },
  ],
}
