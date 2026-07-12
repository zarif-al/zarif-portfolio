import {
  lexicalEditor,
  TextStateFeature,
  HeadingFeature,
  BlocksFeature,
} from '@payloadcms/richtext-lexical'
import { textStateConfig } from './components/text-state-config'
import type { CustomLexicalOptions } from './types'
import { hasKey } from './utils'
import { CodeBlockBlock } from './features/code-block'
import { CalloutBlock } from './features/callout'
import { TableBlock } from './features/table'

export function customLexicalEditor(options: CustomLexicalOptions = {}) {
  return lexicalEditor({
    features: ({ defaultFeatures }) => {
      // Start with all default features (bold, italic, link, etc.).
      let features = [...defaultFeatures]

      // Remove the paragraph feature when only headings are needed
      // (e.g. hero blocks that should only accept h1).
      if (options.allowParagraph === false) {
        features = features.filter((f) => !hasKey(f) || f.key !== 'paragraph')
      }

      // Remove the heading feature entirely when headings are disabled
      // (e.g. contact or card-grid blocks that should only accept paragraphs).
      if (options.headingsConfig?.enabled === false) {
        features = features.filter((f) => !hasKey(f) || f.key !== 'heading')
      }

      // Replace the default heading feature with one scoped to the
      // requested sizes (e.g. ['h1'] limits the toolbar to h1 only).
      if (options.headingsConfig?.enabled && options.headingsConfig?.allowedSizes) {
        features = features.filter((f) => !hasKey(f) || f.key !== 'heading')
        features.push(
          HeadingFeature({
            enabledHeadingSizes: options.headingsConfig.allowedSizes,
          }),
        )
      }

      // Always include callout and table blocks.
      const richTextBlocks = [CalloutBlock, TableBlock]

      // Code block is optional — only for long-form content editors.
      if (options.codeBlock) {
        richTextBlocks.push(CodeBlockBlock)
      }

      features.push(BlocksFeature({ blocks: richTextBlocks }))

      // Always append the custom text-state feature (accent colors, etc.).
      features.push(TextStateFeature({ state: textStateConfig }))
      return features
    },
  })
}
