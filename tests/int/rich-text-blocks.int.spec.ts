import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { SanitizedServerEditorConfig } from '@payloadcms/richtext-lexical'
import { customLexicalEditor } from '@/lib/lexical-editor'
import config from '@/payload.config'
import { describe, it, expect, beforeAll } from 'vitest'

let editorConfig: SanitizedServerEditorConfig

beforeAll(async () => {
  const payloadConfig = await config
  const editor = customLexicalEditor()
  editorConfig = await editorConfigFactory.fromEditor({ config: payloadConfig, editor })
})

function findBlock(
  root: { children?: { type?: string; fields?: Record<string, unknown> }[] },
  blockType: string,
): Record<string, unknown> | undefined {
  for (const child of root.children ?? []) {
    if (
      child.type === 'block' &&
      child.fields !== undefined &&
      child.fields['blockType'] === blockType
    ) {
      return child.fields
    }
  }
  return undefined
}

/** Narrows a possibly-undefined value and throws if it's missing. */
function mustExist<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message)
  }
  return value
}

function narrowArray(value: unknown, message: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(message)
  }
  return value
}

describe('callout block markdown → lexical', () => {
  it('converts > [!NOTE] to a callout block', () => {
    const md = '> [!NOTE]\n> Row-level security enforces tenant isolation.\n> No leaks possible.'
    const result = convertMarkdownToLexical({ editorConfig, markdown: md })
    const block = mustExist(findBlock(result.root, 'callout'), 'Expected a callout block')

    expect(block['type']).toBe('info')
    expect(block['blockType']).toBe('callout')
  })

  it('captures the type from the bracket text', () => {
    const md = '> [!WARNING]\n> This is a warning.'
    const result = convertMarkdownToLexical({ editorConfig, markdown: md })
    const block = mustExist(findBlock(result.root, 'callout'), 'Expected a callout block')

    expect(block['type']).toBe('warning')
  })
})

describe('table block markdown → lexical', () => {
  it('converts a GFM table to a table block', () => {
    const md =
      '| Tenant | Features |\n|--------|----------|\n| Enterprise | Custom UI |\n| Starter | Standard |'
    const result = convertMarkdownToLexical({ editorConfig, markdown: md })
    const block = mustExist(findBlock(result.root, 'table'), 'Expected a table block')

    const headers = narrowArray(block['columnHeaders'], 'Expected columnHeaders to be an array')
    const rows = narrowArray(block['rows'], 'Expected rows to be an array')

    expect(headers).toHaveLength(2)
    expect(rows).toHaveLength(2)
  })

  it('skips the separator row', () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |'
    const result = convertMarkdownToLexical({ editorConfig, markdown: md })
    const block = mustExist(findBlock(result.root, 'table'), 'Expected a table block')

    const headers = narrowArray(block['columnHeaders'], 'Expected columnHeaders to be an array')
    const rows = narrowArray(block['rows'], 'Expected rows to be an array')

    expect(rows).toHaveLength(1)
    expect(headers).toHaveLength(2)
    expect(headers[0]).toMatchObject({ label: 'A' })
  })
})
