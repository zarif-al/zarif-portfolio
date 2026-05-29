'use client'

import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { textStateConfig } from '@/lib/lexical-editor/components/text-state-config'
import type { TextStateConfig } from '@/lib/lexical-editor/components/text-state-config'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

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

export const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
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
