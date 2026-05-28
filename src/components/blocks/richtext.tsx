import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { RichtextBlock } from '@/payload-types'

export function RichtextBlockComponent({ heading, content }: RichtextBlock) {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        {heading && <h2 className="font-display text-3xl font-normal text-fg mb-8">{heading}</h2>}
        {content && (
          <div className="prose max-w-none">
            <RichText data={content} />
          </div>
        )}
      </div>
    </section>
  )
}
