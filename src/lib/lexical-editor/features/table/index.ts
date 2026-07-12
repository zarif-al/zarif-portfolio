import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

/**
 * Table block for the Lexical rich text editor.
 *
 * Renders as a semantic `<table>` with `<thead>` / `<tbody>`,
 * mono headers, and horizontal-rule rows.
 * Markdown syntax: standard GFM pipe tables.
 */
export const TableBlock: Block = {
  slug: 'table',
  interfaceName: 'TableBlock',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    {
      name: 'columnHeaders',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'cells',
          type: 'array',
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: () => [
                  ParagraphFeature(),
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  LinkFeature({}),
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
  jsx: {
    customStartRegex: /^\|.+\|\s*$/,
    customEndRegex: { optional: true, regExp: /^(?!\|)/ },
    import: ({ children, openMatch, markdownToLexical }) => {
      const rowRe = /^\|.+\|\s*$/
      const sepRe = /^\|[-: |]+\|\s*$/
      const headerCells = (openMatch?.[0] ?? '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
      const columnHeaders = headerCells.map((s) => ({ label: s }))

      const rows = children
        .trim()
        .split('\n')
        .filter((line) => line.trim() && !sepRe.test(line) && rowRe.test(line))
        .map((line) => {
          const cellTexts = line
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean)
          return {
            cells: cellTexts.map((c) => ({
              content: markdownToLexical({ markdown: c }),
            })),
          }
        })

      return { columnHeaders, rows }
    },
    export: () => false,
  },
}
