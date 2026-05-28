import { createLinkField } from '../../fields/link'
import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'overline', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'ctas',
      type: 'array',
      labels: { singular: 'CTA', plural: 'CTAs' },
      fields: [createLinkField()],
    },
  ],
}
