'use client'

import React from 'react'
import { Richtext } from '@/components/primitives/richtext'
import type { RichtextBlock } from '@/payload-types'

export function RichtextBlockComponent({ content }: RichtextBlock) {
  return (
    <section className="mt-6">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="max-w-xl">
          {content && (
            <div className="text-muted leading-[1.75] prose-p:text-muted">
              <Richtext data={content} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
