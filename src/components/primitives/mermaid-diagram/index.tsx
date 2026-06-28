'use client'

import { useState } from 'react'
import { Maximize2Icon } from 'lucide-react'
import { ContentViewer } from '@/components/ui/content-viewer'
import { useStore } from '@/store/global-store'
import { useMermaidRender } from './use-mermaid-render'
import { MAX_MERMAID_UPSCALE } from './use-mermaid-render/constants'

/** Props for {@link MermaidDiagram}. */
interface MermaidDiagramProps {
  /** Mermaid syntax string to render. */
  code: string
}

/**
 * Inline diagram rendered from Mermaid syntax.
 *
 * - Renders via {@link useMermaidRender} with lazy `mermaid` import.
 * - Displays parse errors or a loading skeleton.
 * - Click the diagram to open a fullscreen dialog.
 */
export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const theme = useStore((s) => s.theme)
  const isDark = theme === 'dark'
  const { svg, error, naturalWidth } = useMermaidRender(code, isDark)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // ── error state ──

  if (error) {
    return (
      <div className="my-6 border border-red-500/30 bg-red-500/5 rounded-md overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border-b border-red-500/20">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-red-400">
            Diagram Error
          </span>
        </div>
        <pre className="overflow-x-auto bg-bg p-4 m-0 text-[0.8rem] leading-[1.6] font-mono text-muted whitespace-pre-wrap [word-break:break-word]">
          <code>{error}</code>
        </pre>
      </div>
    )
  }

  // ── loading state ──

  if (!svg) {
    return (
      <div className="my-6 border border-border bg-surface rounded-md overflow-hidden animate-pulse">
        <div className="h-48 bg-bg" />
      </div>
    )
  }

  // ── diagram ──

  return (
    <>
      <div className="my-6 border border-border rounded-md bg-bg overflow-hidden">
        <div className="flex items-center justify-end px-3 py-1.5 border-b border-border bg-surface">
          <button
            onClick={() => setIsFullscreen(true)}
            className="font-mono text-[0.65rem] text-muted hover:text-fg transition-colors"
          >
            <Maximize2Icon className="size-4" />
            <span className="sr-only">View diagram fullscreen</span>
          </button>
        </div>
        {/* Click target for fullscreen */}
        <div
          className="flex justify-center items-center p-4 cursor-pointer min-h-[160px]"
          onClick={() => setIsFullscreen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsFullscreen(true)
            }
          }}
        >
          {/* max-w-none! tears down Mermaid's inline cap so the SVG can grow.
              width is set via min(100%, viewBox × MAX_UPSCALE) so small diagrams
              are capped without using max-width which can conflict in flex layouts. */}
          <div
            className="[&>svg]:h-auto [&>svg]:max-w-none!"
            style={{
              width:
                naturalWidth > 0 ? `min(100%, ${naturalWidth * MAX_MERMAID_UPSCALE}px)` : '100%',
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>

      <ContentViewer open={isFullscreen} onOpenChange={setIsFullscreen}>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </ContentViewer>
    </>
  )
}
