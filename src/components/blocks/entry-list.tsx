import React from 'react'
import { cn } from '@/utilities/cn'
import type { EntryListBlock } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'

export function EntryListBlockComponent({
  entries,
  className,
}: BlockComponentProps<EntryListBlock>) {
  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="flex flex-col">
          {entries?.map((entry, i) => (
            <div
              key={i}
              className="border border-border border-b-0 last:border-b bg-surface px-6 py-5 max-sm:py-4 max-sm:px-[1.125rem]"
            >
              <div className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-accent mb-[0.3rem]">
                {entry.label}
              </div>
              <div className="font-display text-[1.05rem] max-sm:text-[0.95rem] font-normal text-fg mb-[0.25rem]">
                {entry.title}
              </div>
              <div className="text-[0.85rem] max-sm:text-[0.78rem] text-muted leading-[1.6]">
                {entry.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
