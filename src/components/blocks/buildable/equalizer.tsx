'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/utilities/cn'
import type { EqualizerBlock } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'
import styles from './equalizer.module.css'

const SLOT_MS = 3 * 60 * 1000
const FADE_MS = 500
const POLL_MS = 1000

/**
 * Maps wall-clock time to a deterministic track index for the given slot duration.
 */
function getSlotIndex(tracksLength: number): number {
  return Math.floor(Date.now() / SLOT_MS) % tracksLength
}

/**
 * Renders the equalizer pulsing bars — pure decoration.
 */
function EqualizerBars() {
  return (
    <div className="flex items-end gap-[3px] h-6 shrink-0" aria-hidden="true">
      <span className={`w-0.5 bg-accent opacity-50 ${styles['bar-1']}`} />
      <span className={`w-0.5 bg-accent opacity-50 ${styles['bar-2']}`} />
      <span className={`w-0.5 bg-accent opacity-50 ${styles['bar-3']}`} />
      <span className={`w-0.5 bg-accent opacity-50 ${styles['bar-4']}`} />
      <span className={`w-0.5 bg-accent opacity-50 ${styles['bar-5']}`} />
    </div>
  )
}

/**
 * Renders the "Now Playing" widget — spinning dot, label, and track display.
 *
 * When `animateOpacity` is true, the track text crossfades via CSS transition.
 */
function NowPlaying({
  track,
  visible,
}: {
  track: { title?: string | null; author?: string | null }
  visible: boolean
}) {
  return (
    <div className="inline-flex items-center gap-2.5 font-mono text-[0.66rem] text-muted tracking-[0.03em] shrink-0 max-sm:text-[0.62rem]">
      <span className="relative w-2 h-2 border-[1.5px] border-accent shrink-0">
        <span className={styles['dot']} />
      </span>
      <span className="text-accent uppercase tracking-widest text-[0.6rem]">Now Playing</span>
      <span
        className="text-fg font-medium transition-opacity"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: `${FADE_MS}ms`,
        }}
      >
        &ldquo;{track.title}&rdquo; by {track.author}
      </span>
    </div>
  )
}

export function EqualizerBlockComponent({
  tracks,
  className,
}: BlockComponentProps<EqualizerBlock>) {
  if (!tracks || tracks.length === 0) {
    return null
  }

  // Single track: no cycling logic needed
  if (tracks.length === 1) {
    const singleTrack = tracks[0]
    if (!singleTrack) {
      return null
    }

    return (
      <section className={cn(className)}>
        <div className="mx-auto max-w-(--max-width) px-(--gutter)">
          <div className="flex items-center justify-between gap-6 flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-2.5">
            <EqualizerBars />
            <NowPlaying track={singleTrack} visible />
          </div>
        </div>
      </section>
    )
  }

  return <EqualizerCycling tracks={tracks} className={className} />
}

function EqualizerCycling({
  tracks,
  className,
}: {
  tracks: NonNullable<EqualizerBlock['tracks']>
  className?: string
}) {
  const tracksLength = tracks.length
  const [displayIndex, setDisplayIndex] = useState(() => getSlotIndex(tracksLength))
  const [visible, setVisible] = useState(true)
  const targetRef = useRef(getSlotIndex(tracksLength))
  const transitioningRef = useRef(false)

  useEffect(() => {
    const check = setInterval(() => {
      if (transitioningRef.current) {
        return
      }

      const target = getSlotIndex(tracksLength)
      if (target !== targetRef.current) {
        targetRef.current = target
        transitioningRef.current = true
        setVisible(false)

        setTimeout(() => {
          setDisplayIndex(target)
          setVisible(true)
          transitioningRef.current = false
        }, FADE_MS)
      }
    }, POLL_MS)

    return () => clearInterval(check)
  }, [tracksLength])

  const track = tracks[displayIndex]
  if (!track) {
    return null
  }

  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="flex items-center justify-between gap-6 flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-2.5">
          <EqualizerBars />
          <NowPlaying track={track} visible={visible} />
        </div>
      </div>
    </section>
  )
}
