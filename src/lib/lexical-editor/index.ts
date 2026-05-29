import { lexicalEditor, TextStateFeature } from '@payloadcms/richtext-lexical'
import { textStateConfig } from './components/text-state-config'

export const customLexicalEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    TextStateFeature({ state: textStateConfig }),
  ],
})
