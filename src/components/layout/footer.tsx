import type { IPayloadFooter } from '@/payload-types'
import { resolveLinks } from '@/utilities/resolve-link'
import { PrimitiveLink } from '@/components/primitives/link'

export function FooterComponent({ copyright, links }: IPayloadFooter) {
  const resolvedLinks = resolveLinks(links)

  return (
    <footer className="mx-auto max-w-(--max-width) px-(--gutter) mt-[clamp(2rem,6vh,4rem)] pt-8 pb-10 border-t border-border">
      <div className="flex justify-between items-center gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-3 flex-wrap text-[0.775rem] text-muted">
        {copyright && (
          <span className="font-mono text-[0.68rem]">
            {copyright} <span className="text-accent">█</span>
          </span>
        )}
        {resolvedLinks.length > 0 && (
          <ul className="flex gap-6 list-none font-mono text-[0.68rem]">
            {resolvedLinks.map((link, i) => (
              <li key={i}>
                <PrimitiveLink
                  href={link.href}
                  label={link.label}
                  className="text-muted hover:text-fg"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}
