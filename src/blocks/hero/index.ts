import type { Block } from 'payload'
import { customLexicalEditor } from '@/lib/lexical-editor'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'kicker', type: 'text' },
    {
      name: 'size',
      type: 'select',
      options: [
        { label: 'Large', value: 'large' },
        { label: 'Default', value: 'default' },
      ],
      defaultValue: 'default',
      required: true,
    },
    {
      name: 'heading',
      type: 'richText',
      required: true,
      editor: customLexicalEditor({
        headingsConfig: { allowedSizes: ['h1'] },
        allowParagraph: false,
      }),
    },
  ],
}
