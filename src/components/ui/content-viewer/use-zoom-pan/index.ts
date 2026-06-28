'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ZOOM_MAX, FIT_MAX_UPSCALE, SCROLL_ZOOM_FACTOR, BUTTON_ZOOM_FACTOR } from './constants'
import type { UseZoomPanOptions, UseZoomPanResult } from './interface'

/**
 * Manages zoom, pan, and cross-platform gestures for a content viewer.
 *
 * Transforms are applied via `translate` + `scale` on the wrapper element
 * with `transform-origin: center center`.  All coordinates measure from
 * the container center.
 */
export function useZoomPan({
  containerRef,
  wrapperRef,
  zoomable,
  pannable,
}: UseZoomPanOptions): UseZoomPanResult {
  const [zoom, setZoom] = useState(1)
  const [baseZoom, setBaseZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  // Mirrors so native handlers see current state without re-attaching.
  const zoomRef = useRef(zoom)
  const panRef = useRef(pan)
  const baseZoomRef = useRef(baseZoom)

  useLayoutEffect(() => {
    zoomRef.current = zoom
  })
  useLayoutEffect(() => {
    panRef.current = pan
  })
  useLayoutEffect(() => {
    baseZoomRef.current = baseZoom
  })

  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const pinchRef = useRef({ distance: 0, zoomStart: 1 })

  // ── helpers ──────────────────────────────────────────────────────────

  /** Clamp absolute zoom so it never drops below the fit level. */
  function clampZoom(z: number): number {
    return Math.max(baseZoomRef.current, Math.min(ZOOM_MAX, z))
  }

  /** Returns (x, y) measured from the center of the container. */
  const toContainerCenter = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const c = containerRef.current
      if (!c) {
        return null
      }
      const r = c.getBoundingClientRect()
      return { x: clientX - (r.left + r.width / 2), y: clientY - (r.top + r.height / 2) }
    },
    [containerRef],
  )

  // ── zoom toward a point ──────────────────────────────────────────────

  const zoomToward = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const p = toContainerCenter(clientX, clientY)
      if (!p) {
        return
      }
      const z = zoomRef.current
      const newZoom = clampZoom(z * factor)
      setPan({
        x: p.x - (p.x - panRef.current.x) * (newZoom / z),
        y: p.y - (p.y - panRef.current.y) * (newZoom / z),
      })
      setZoom(newZoom)
    },
    [toContainerCenter],
  )

  // ── button zoom (toward container center) ────────────────────────────

  const zoomIn = useCallback(() => {
    const c = containerRef.current
    if (!c) {
      return
    }
    const r = c.getBoundingClientRect()
    zoomToward(r.left + r.width / 2, r.top + r.height / 2, BUTTON_ZOOM_FACTOR)
  }, [containerRef, zoomToward])

  const zoomOut = useCallback(() => {
    const c = containerRef.current
    if (!c) {
      return
    }
    const r = c.getBoundingClientRect()
    zoomToward(r.left + r.width / 2, r.top + r.height / 2, 1 / BUTTON_ZOOM_FACTOR)
  }, [containerRef, zoomToward])

  // ── fit to container ─────────────────────────────────────────────────

  /**
   * Measures the wrapper's first child via `scrollWidth` / `scrollHeight`
   * and calculates a zoom level that fits the content inside the container
   * (padding-aware).  Works for SVG, `<img>`, and any HTML element.
   */
  const fitToViewport = useCallback(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    if (!container || !wrapper) {
      return
    }

    const content = wrapper.firstElementChild
    if (!(content instanceof HTMLElement)) {
      return
    }

    const naturalW = content.scrollWidth
    const naturalH = content.scrollHeight
    if (naturalW === 0 || naturalH === 0) {
      return
    }

    const rect = container.getBoundingClientRect()
    const FIT_PADDING = 40
    const vw = rect.width - FIT_PADDING * 2
    const vh = rect.height - FIT_PADDING * 2
    const fitZoom = Math.min(vw / naturalW, vh / naturalH, FIT_MAX_UPSCALE)

    setBaseZoom(fitZoom)
    setZoom(fitZoom)
    setPan({ x: 0, y: 0 })
  }, [containerRef, wrapperRef])

  // ── Ctrl / Cmd + wheel zoom ──────────────────────────────────────────
  //
  // Listener is attached to `window` (not the container ref) because the
  // container lives inside a portal and its ref may not be populated when
  // the effect runs.  The `zoomable` flag gates behaviour.

  useEffect(() => {
    if (!zoomable) {
      return
    }

    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        return
      }
      e.preventDefault()
      const factor = e.deltaY < 0 ? SCROLL_ZOOM_FACTOR : 1 / SCROLL_ZOOM_FACTOR
      zoomToward(e.clientX, e.clientY, factor)
    }

    window.addEventListener('wheel', handler, { passive: false })
    return () => window.removeEventListener('wheel', handler)
  }, [zoomable, zoomToward])

  // ── mouse drag pan ───────────────────────────────────────────────────

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || !pannable) {
        return
      }
      e.preventDefault()
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      }
    },
    [pannable],
  )

  useEffect(() => {
    if (!isDragging) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const d = dragStartRef.current
      setPan({
        x: d.panX + (e.clientX - d.x),
        y: d.panY + (e.clientY - d.y),
      })
    }

    const handleMouseUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // ── touch drag + pinch ───────────────────────────────────────────────
  //
  // Attached to `window` for the same portal timing reason as the wheel
  // listener.  Coordinates are measured from the container ref at event
  // time (guaranteed populated by then).

  useEffect(() => {
    if (!zoomable && !pannable) {
      return
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        if (!pannable) {
          return
        }
        const t = e.touches.item(0)
        if (!t) {
          return
        }
        dragStartRef.current = {
          x: t.clientX,
          y: t.clientY,
          panX: panRef.current.x,
          panY: panRef.current.y,
        }
      } else if (e.touches.length === 2) {
        if (!zoomable) {
          return
        }
        const t0 = e.touches.item(0)
        const t1 = e.touches.item(1)
        if (!t0 || !t1) {
          return
        }
        pinchRef.current = {
          distance: Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY),
          zoomStart: zoomRef.current,
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 1) {
        if (!pannable) {
          return
        }
        const t = e.touches.item(0)
        if (!t) {
          return
        }
        const d = dragStartRef.current
        setPan({
          x: d.panX + (t.clientX - d.x),
          y: d.panY + (t.clientY - d.y),
        })
      } else if (e.touches.length === 2) {
        if (!zoomable) {
          return
        }
        const t0 = e.touches.item(0)
        const t1 = e.touches.item(1)
        if (!t0 || !t1) {
          return
        }

        const newDistance = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY)
        const p = pinchRef.current
        const newZoom = clampZoom(p.zoomStart * (newDistance / p.distance))

        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) {
          return
        }
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const mx = (t0.clientX + t1.clientX) / 2 - cx
        const my = (t0.clientY + t1.clientY) / 2 - cy
        setPan({
          x: mx - (mx - panRef.current.x) * (newZoom / zoomRef.current),
          y: my - (my - panRef.current.y) * (newZoom / zoomRef.current),
        })
        setZoom(newZoom)
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [zoomable, pannable, containerRef])

  // ── cursor ───────────────────────────────────────────────────────────

  const cursor = isDragging
    ? ('grabbing' as const)
    : zoom > 1
      ? ('grab' as const)
      : ('default' as const)

  const displayZoom = baseZoom > 0 ? (zoom - baseZoom) / baseZoom : 0

  return {
    zoom,
    displayZoom,
    pan,
    zoomIn,
    zoomOut,
    fitToViewport,
    panAreaProps: {
      onMouseDown: handleMouseDown,
      style: { cursor },
    },
  }
}
