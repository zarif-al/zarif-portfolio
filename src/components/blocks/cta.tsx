import React from 'react'
import type { CtaBlock } from '@/payload-types'

export function CtaBlockComponent({ title, description, ctas }: CtaBlock) {
  return (
    <section className="py-16 md:py-24 text-center">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        {title && (
          <h2 className="font-display text-3xl md:text-5xl font-normal leading-tight text-fg">
            {title}
          </h2>
        )}
        {description && <p className="mt-4 text-muted max-w-xl mx-auto">{description}</p>}
        {ctas && ctas.length > 0 && (
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            {ctas.map((cta, i) => (
              <a
                key={i}
                href={cta.link?.url ?? '#'}
                className="inline-block border border-fg px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-fg transition-colors hover:bg-fg hover:text-bg"
              >
                {cta.link?.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
