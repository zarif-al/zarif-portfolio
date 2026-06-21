'use client'

import { useEffect, useId, useState } from 'react'

/** Return value of {@link useMermaidRender}. */
interface UseMermaidRenderResult {
  /** Rendered SVG markup, or `null` while loading / on error. */
  svg: string | null
  /** Parse or render error message, or `null` on success. */
  error: string | null
}

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

  return { svg, error }
}
