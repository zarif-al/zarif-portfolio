'use client'

import { useEffect, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { MinusIcon, PlusIcon, RotateCcwIcon, XIcon } from 'lucide-react'
import { useZoomPan } from './use-zoom-pan'

interface ContentViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const TOOLBAR_BTN =
  'p-1 rounded hover:bg-muted text-muted hover:text-fg transition-colors disabled:opacity-30 disabled:cursor-not-allowed'

/**
 * Fullscreen content viewer with zoom and pan controls.
 *
 * Built on Shadcn's {@link Dialog} and {@link DialogContent}.  The
 * inner container owns its dimensions — the Popup sizes to fit.
 * Accepts arbitrary children: diagrams, images, code, etc.
 */
export function ContentViewer({ open, onOpenChange, children }: ContentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { zoom, displayZoom, pan, zoomIn, zoomOut, fitToViewport, panAreaProps } = useZoomPan({
    containerRef,
    wrapperRef,
    zoomable: open,
    pannable: open,
  })

  // Auto-fit content when the dialog opens.
  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => fitToViewport())
      return () => cancelAnimationFrame(raf)
    }
  }, [open, fitToViewport])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] sm:max-w-[90vw] p-0 gap-0"
        showCloseButton={false}
      >
        <div className="h-[85vh] relative overflow-hidden bg-bg rounded-xl">
          {/* Toolbar */}
          <div
            className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md border border-border bg-surface/90 px-2 py-1.5 backdrop-blur-sm shadow-sm"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={zoomOut}
              disabled={displayZoom <= 0}
              className={TOOLBAR_BTN}
              aria-label="Zoom out"
            >
              <MinusIcon className="size-4" />
            </button>
            <span className="font-mono text-[0.65rem] text-muted tabular-nums w-10 text-center select-none">
              {Math.round(displayZoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 10}
              className={TOOLBAR_BTN}
              aria-label="Zoom in"
            >
              <PlusIcon className="size-4" />
            </button>
            <button onClick={fitToViewport} className={TOOLBAR_BTN} aria-label="Reset zoom">
              <RotateCcwIcon className="size-4" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button onClick={() => onOpenChange(false)} className={TOOLBAR_BTN} aria-label="Close">
              <XIcon className="size-4" />
            </button>
          </div>

          {/* Content area */}
          <div ref={containerRef} className="absolute inset-0" {...panAreaProps}>
            <div
              ref={wrapperRef}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
