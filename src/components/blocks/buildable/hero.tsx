'use client'

import React from 'react'
import { Richtext } from '@/components/primitives/richtext'
import { cn } from '@/utilities/cn'
import type { HeroBlock } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'

export function HeroBlockComponent({
  size = 'large',
  kicker,
  heading,
  className,
}: BlockComponentProps<HeroBlock>) {
  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        {kicker && (
          <p className="font-mono text-[0.725rem] uppercase tracking-[0.12em] text-accent mb-4">
            {kicker}
          </p>
        )}
        {heading && (
          <div
            className={cn(
              size === 'default' &&
                '[&_h1]:text-[clamp(1.75rem,4vw,2.5rem)] [&_h1]:leading-[1.2] [&_h1]:tracking-[-0.015em]',
            )}
          >
            <Richtext data={heading} disableProse />
          </div>
        )}
      </div>
    </section>
  )
}
