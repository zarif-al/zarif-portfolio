import Link from 'next/link'
import type { IPayloadHeader } from '@/payload-types'
import { resolveLinks } from '@/utilities/resolve-link'
import { MobileNav } from './components/mobile-nav'

export function HeaderComponent({ title, links }: IPayloadHeader) {
  const resolvedLinks = resolveLinks(links)

  return (
    <header>
      <div className="relative mx-auto max-w-(--max-width) px-(--gutter) flex items-center justify-between py-5">
        {title && (
          <Link
            href="/"
            className="font-mono font-semibold text-fg text-[0.95rem] no-underline tracking-[-0.02em]"
          >
            <span className="text-muted font-normal">~/</span>
            {title}
          </Link>
        )}
        {resolvedLinks && resolvedLinks.length > 0 && <MobileNav links={resolvedLinks} />}
      </div>
    </header>
  )
}
