'use client'

import React from 'react'
import { Richtext } from '@/components/primitives/richtext'
import type { HeroBlock } from '@/payload-types'

export function HeroBlockComponent({ kicker, heading, showEqualizer }: HeroBlock) {
  return (
    <section className="pt-[clamp(3.5rem,calc(6vh+1.5rem),6.5rem)]">
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
        {showEqualizer && (
          <div className="flex items-end gap-0.75 mt-10 mb-4 h-6" aria-hidden="true">
            <span className="w-0.5 bg-accent opacity-50 animate-eq1" />
            <span className="w-0.5 bg-accent opacity-50 animate-eq2" />
            <span className="w-0.5 bg-accent opacity-50 animate-eq3" />
            <span className="w-0.5 bg-accent opacity-50 animate-eq4" />
            <span className="w-0.5 bg-accent opacity-50 animate-eq5" />
          </div>
        )}
      </div>
    </section>
  )
}
