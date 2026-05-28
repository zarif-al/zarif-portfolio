import { createLinkField } from '../../fields/link'
import type { Block } from 'payload'

export const Cta: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'ctas',
      type: 'array',
      labels: { singular: 'CTA', plural: 'CTAs' },
      fields: [createLinkField()],
    },
  ],
}
