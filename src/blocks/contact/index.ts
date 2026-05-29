import type { Block } from 'payload'

export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  fields: [
    { name: 'infoHeading', type: 'text' },
    { name: 'infoDescription', type: 'richText', required: true },
    { name: 'email', type: 'text', required: true },
  ],
}
