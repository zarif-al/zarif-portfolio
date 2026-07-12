'use client'

import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { textStateConfig } from '@/lib/lexical-editor/components/text-state-config'
import type { TextStateConfig } from '@/lib/lexical-editor/components/text-state-config'
import type { CalloutBlock, TableBlock } from '@/payload-types'
import { CodeSnippet } from '@/components/primitives/code-snippet'
import { MermaidDiagram } from '@/components/primitives/mermaid-diagram'
import { Callout } from '@/components/primitives/callout'
import { Table } from '@/components/primitives/table'

interface CodeBlockFields {
  blockType: 'Code'
  code?: string
  language?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CodeBlockFields>
  | SerializedBlockNode<CalloutBlock>
  | SerializedBlockNode<TableBlock>

/** Returns the state group if `key` is a valid top-level key in the config. */
function getStateGroup(key: string) {
  if (key in textStateConfig) {
    return textStateConfig[key]
  }
  return undefined
}

/** Returns the state entry if `value` is a valid key in the given group. */
function getStateEntry(group: TextStateConfig[string], value: string) {
  if (typeof group === 'object' && group !== null && value in group) {
    return group[value]
  }
  return undefined
}

// Lexical serializes node state under the "$" key.
const NODE_STATE_KEY = '$'

/**
 * Custom text node converter for Lexical rich text.
 * Handles format flags (bold, italic, underline, strikethrough, code, sub, sup)
 * and {@link TextStateConfig} CSS styles.
 */

export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    ...defaultConverters.blocks,
    Code: ({ node }) => {
      if (!node.fields.code) {
        return null
      }

      if (node.fields.language === 'mermaid') {
        return <MermaidDiagram code={node.fields.code} />
      }

      return <CodeSnippet code={node.fields.code} language={node.fields.language} />
    },
    callout: ({ node }) => <Callout {...node.fields} />,
    table: ({ node }) => <Table {...node.fields} />,
  },
  text: (args) => {
    const { node } = args

    // Render standard formatting (bold, italic, etc.) using the default converter
    let text =
      typeof defaultConverters.text === 'function' ? defaultConverters.text(args) : node.text

    // Apply TextStateFeature styles from the "$" key in the serialized node
    const raw = node[NODE_STATE_KEY]

    if (isRecord(raw)) {
      for (const stateKey of Object.keys(raw)) {
        const group = getStateGroup(stateKey)
        if (!group) {
          continue
        }

        const stateValue = raw[stateKey]
        if (typeof stateValue !== 'string') {
          continue
        }

        const entry = getStateEntry(group, stateValue)
        if (!entry) {
          continue
        }

        // StyleObject and React.CSSProperties are structurally incompatible at the type level
        // due to csstype version mismatch, but identical at runtime.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        text = <span style={entry.css as React.CSSProperties}>{text}</span>
      }
    }

    return text
  },
})
