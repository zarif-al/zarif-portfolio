import { lexicalEditor, TextStateFeature, HeadingFeature } from '@payloadcms/richtext-lexical'
import { textStateConfig } from './components/text-state-config'
import type { CustomLexicalOptions } from './types'
import { hasKey } from './utils'

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

      // Replace the default heading feature with one scoped to the
      // requested sizes (e.g. ['h1'] limits the toolbar to h1 only).
      if (options.enabledHeadingSizes) {
        features = features.filter((f) => !hasKey(f) || f.key !== 'heading')
        features.push(
          HeadingFeature({
            enabledHeadingSizes: options.enabledHeadingSizes,
          }),
        )
      }

      // Always append the custom text-state feature (accent colors, etc.).
      features.push(TextStateFeature({ state: textStateConfig }))
      return features
    },
  })
}
