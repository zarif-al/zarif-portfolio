import Link from 'next/link'
import type { IPayloadHeader } from '@/payload-types'
import { resolveLinks } from '@/utilities/resolve-link'
import { ThemeToggle } from './components/theme-toggle'
import { NavLink } from './components/nav-link'

export function HeaderComponent({ title, links }: IPayloadHeader) {
  const resolvedLinks = resolveLinks(links)

  return (
    <header>
      <div className="mx-auto max-w-(--max-width) px-(--gutter) flex items-center justify-between py-5">
        {title && (
          <Link
            href="/"
            className="font-mono font-semibold text-fg text-[0.95rem] no-underline tracking-[-0.02em]"
          >
            <span className="text-muted font-normal">~/</span>
            {title}
          </Link>
        )}
        {resolvedLinks && resolvedLinks.length > 0 && (
          <nav className="flex items-center gap-0 border border-border">
            {resolvedLinks.map((item, i) => (
              <NavLink index={i} link={item} key={i} />
            ))}
          </nav>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
