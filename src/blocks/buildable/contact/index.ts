import type { Block } from 'payload'
import { customLexicalEditor } from '@/lib/lexical-editor'

export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  fields: [
    { name: 'infoHeading', type: 'text' },
    {
      name: 'infoDescription',
      type: 'richText',
      required: true,
      editor: customLexicalEditor({ headingsConfig: { enabled: false } }),
    },
    { name: 'email', type: 'text', required: true },
  ],
}
