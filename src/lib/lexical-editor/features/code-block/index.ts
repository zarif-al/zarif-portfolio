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
 * Premade code block feature for the Lexical editor.
 *
 * Wraps {@link CodeBlock} from `@payloadcms/richtext-lexical` with a
 * focused language set and project defaults.
 *
 * @returns A Payload Block to be passed to {@link BlocksFeature}.
 */
export function createCodeBlock() {
  return CodeBlock({
    defaultLanguage: 'ts',
    languages: LANGUAGES,
    slug: 'Code',
  })
}
