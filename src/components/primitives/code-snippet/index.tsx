'use client'

import { Highlight, type PrismTheme } from 'prism-react-renderer'
import { cn } from '@/utilities/cn'

interface CodeSnippetProps {
  /** The source code to highlight. */
  code: string
  /** Prism language key.  Falls back to plain text when absent. */
  language?: string
}

/**
 * Syntax-highlighted code block with line numbers and a language label.
 *
 * Renders a bordered container with a header showing the language name
 * and a `<pre>` block with Prism token highlighting.  Theme colors
 * delegate to CSS custom properties so light / dark mode works without
 * JavaScript.
 */
export function CodeSnippet({ code, language }: CodeSnippetProps) {
  const lang = language || 'text'
  const label = LANGUAGE_LABELS[lang] ?? lang
  const trimmed = code.trimEnd()

  return (
    <div className="my-6 overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-surface px-4 py-2 border-b border-border">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
          {label}
        </span>
      </div>
      <Highlight theme={theme} code={trimmed} language={lang}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="overflow-x-auto bg-bg p-4 m-0 text-[0.8rem] leading-[1.6] font-mono">
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line })
                return (
                  <div key={i} {...lineProps} className={cn('table-row', lineProps.className)}>
                    <span className="table-cell text-right pr-4 select-none text-muted/40 w-8">
                      {i + 1}
                    </span>
                    <span className="table-cell pl-2">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}

// ── constants ──

/**
 * Custom Prism theme that delegates to CSS custom properties.
 *
 * Uses `var(--color-*)` values so the theme automatically follows
 * the site's light / dark mode without JavaScript.
 */
const theme: PrismTheme = {
  plain: {
    color: 'var(--color-fg)',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--color-muted)', fontStyle: 'italic' },
    },
    { types: ['punctuation'], style: { color: 'var(--color-muted)' } },
    {
      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol', 'deleted'],
      style: { color: 'var(--color-accent)' },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: { color: 'var(--color-accent)' },
    },
    { types: ['operator', 'entity', 'url'], style: { color: 'var(--color-fg)' } },
    { types: ['atrule', 'attr-value', 'keyword'], style: { color: 'var(--color-accent)' } },
    { types: ['function', 'class-name'], style: { color: 'var(--color-fg)' } },
    { types: ['regex', 'important', 'variable'], style: { color: 'var(--color-accent)' } },
  ],
}

/** Maps common Prism language keys to display labels. */
const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  graphql: 'GraphQL',
  html: 'HTML',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  markdown: 'Markdown',
  sql: 'SQL',
  text: 'Plain Text',
  ts: 'TypeScript',
  tsx: 'TSX',
  yaml: 'YAML',
}
