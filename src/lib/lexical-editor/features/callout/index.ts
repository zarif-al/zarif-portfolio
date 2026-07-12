import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

/**
 * Blockquote-style callout block for the Lexical rich text editor.
 *
 * Renders as an accent-left-border callout with a type label and rich text body.
 * Markdown syntax: `> [!NOTE]` / `> [!WARNING]` followed by `>`-prefixed body lines.
 */
export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Caution', value: 'caution' },
        { label: 'Warning', value: 'warning' },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({}),
          UnorderedListFeature(),
          OrderedListFeature(),
        ],
      }),
    },
  ],
  jsx: {
    customStartRegex: /^>\s*\[!(\w+)\]/,
    customEndRegex: { optional: true, regExp: /^(?!>)/ },
    import: ({ children, openMatch, markdownToLexical }) => {
      const raw = (openMatch?.[1] ?? 'info').toLowerCase()
      const type = ['info', 'caution', 'warning'].includes(raw) ? raw : 'info'
      const body = markdownToLexical({
        markdown: children.replace(/^>\s?/gm, '').trim(),
      })

      return { type, body }
    },
    export: () => false,
  },
}
