import React from 'react'
import type { HeroBlock } from '@/payload-types'

export function HeroBlockComponent({ overline, title, description, ctas }: HeroBlock) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        {overline && (
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">{overline}</p>
        )}
        {title && (
          <h1 className="font-display text-4xl md:text-6xl font-normal leading-tight tracking-tight text-fg">
            {title}
          </h1>
        )}
        {description && <p className="mt-6 max-w-2xl text-muted leading-relaxed">{description}</p>}
        {ctas && ctas.length > 0 && (
          <div className="mt-8 flex gap-3 flex-wrap">
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
