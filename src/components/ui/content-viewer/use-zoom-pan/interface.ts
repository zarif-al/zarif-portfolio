import type React from 'react'

/** Options for {@link useZoomPan}. */
export interface UseZoomPanOptions {
  /** Element whose bounding rect is used as the coordinate origin. */
  containerRef: React.RefObject<HTMLElement | null>
  /** Element that receives the CSS transform. */
  wrapperRef: React.RefObject<HTMLElement | null>
  /** When `false`, zoom input is ignored (wheel, pinch, buttons). */
  zoomable: boolean
  /** When `false`, pan input is ignored (mouse drag, touch drag). */
  pannable: boolean
}

/** Return value of {@link useZoomPan}. */
export interface UseZoomPanResult {
  /** Absolute zoom level (1 = natural size). */
  zoom: number
  /** Zoom relative to the fit level (1 = fits container). */
  displayZoom: number
  /** Pan offset in pixels. */
  pan: { x: number; y: number }
  zoomIn: () => void
  zoomOut: () => void
  /** Reset zoom and pan so content fits the container. */
  fitToViewport: () => void
  /** Props to spread on the pan / zoom interaction area. */
  panAreaProps: {
    onMouseDown: (e: React.MouseEvent) => void
    style: { cursor: 'grab' | 'grabbing' | 'default' }
  }
}
