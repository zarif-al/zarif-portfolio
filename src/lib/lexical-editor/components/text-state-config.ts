import type { TextStateFeatureProps } from 'node_modules/@payloadcms/richtext-lexical/dist/features/textState/feature.server'

export type TextStateConfig = TextStateFeatureProps['state']

export const textStateConfig: TextStateConfig = {
  color: {
    accent: {
      label: 'Accent',
      css: { color: 'var(--color-accent)' },
    },
  },
}
