'use client'

import React from 'react'
import { Richtext } from '@/components/primitives/richtext'
import { cn } from '@/utilities/cn'
import type { HeroBlock } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'

export function HeroBlockComponent({ kicker, heading, className }: BlockComponentProps<HeroBlock>) {
  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        {kicker && (
          <p className="font-mono text-[0.725rem] uppercase tracking-[0.12em] text-accent mb-4">
            {kicker}
          </p>
        )}
        {heading && (
          <div className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-normal leading-[1.1] tracking-[-0.02em] text-fg max-w-[20em]">
            <Richtext data={heading} />
          </div>
        )}
      </div>
    </section>
  )
}
