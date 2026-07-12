import type { Block } from 'payload'
import { CodeBlock } from '@payloadcms/richtext-lexical'

/**
 * Languages available in the code block language picker.
 * Kept to a focused set rather than all ~60 Monaco languages.
 */
const LANGUAGES: Record<string, string> = {
  ts: 'TypeScript',
  js: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  bash: 'Bash',
  sql: 'SQL',
  graphql: 'GraphQL',
  yaml: 'YAML',
  markdown: 'Markdown',
  mermaid: 'Mermaid',
  text: 'Plain Text',
}

/**
 * Code block for the Lexical editor.
 *
 * Built on Payload's premade {@link CodeBlock} with a curated language set
 * and project defaults. Passed directly to {@link BlocksFeature}.
 */
export const CodeBlockBlock: Block = CodeBlock({
  defaultLanguage: 'ts',
  languages: LANGUAGES,
  slug: 'Code',
})
