'use client'

import React from 'react'
import { cn } from '@/utilities/cn'
import type { CardGridBlock } from '@/payload-types'
import { NumberedGrid } from './components/numbered-grid'
import { CellGrid } from './components/cell-grid'

export function CardGridBlockComponent({
  content,
  className,
}: CardGridBlock & { className?: string }) {
  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
          {content?.map((block, i) => {
            if (block.blockType === 'numbered-grid') {
              return <NumberedGrid key={i} {...block} />
            }
            if (block.blockType === 'cell-grid') {
              return <CellGrid key={i} {...block} />
            }
            return null
          })}
        </div>
      </div>
    </section>
  )
}
