'use client'

import { useEffect, useId, useState } from 'react'
import type { UseMermaidRenderResult } from './interface'

/**
 * Renders a Mermaid diagram string to SVG with security defaults and
 * theme-aware re-rendering.  The `mermaid` library is lazy-imported
 * so it never lands in the initial page bundle.
 *
 * @param code  - Mermaid syntax string to render.
 * @param isDark - When `true`, uses the `dark` theme.
 * @returns The rendered SVG and any error that occurred.
 */
export function useMermaidRender(code: string, isDark: boolean): UseMermaidRenderResult {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [naturalWidth, setNaturalWidth] = useState(0)

  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  useEffect(() => {
    const controller = new AbortController()

    /**
     * Lazy-loads mermaid, initializes it, and renders the diagram.
     * Resets error and SVG state before each render attempt.
     */
    async function render(): Promise<void> {
      setError(null)
      setSvg(null)
      setNaturalWidth(0)

      try {
        const mermaid = await import('mermaid')

        if (controller.signal.aborted) {
          return
        }

        mermaid.default.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'strict',
          suppressErrorRendering: true,
          logLevel: 'error',
        })

        if (controller.signal.aborted) {
          return
        }

        const result = await mermaid.default.render(id, code)
        if (controller.signal.aborted) {
          return
        }

        const vb = result.svg.match(/viewBox="(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)"/)

        if (vb && vb[3]) {
          setNaturalWidth(parseFloat(vb[3]))
        }

        setSvg(result.svg)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
        }
      }
    }

    void render()

    return () => controller.abort()
  }, [code, isDark, id])

  return { svg, error, naturalWidth }
}
