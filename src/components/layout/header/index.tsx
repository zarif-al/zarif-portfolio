import Link from 'next/link'
import type { IPayloadHeader } from '@/payload-types'
import { resolveLinks } from '@/utilities/resolve-link'
import { NavLink } from './components/nav-link'
import { MobileNav } from './components/mobile-nav'
import { ThemeToggle } from './components/theme-toggle'

export function HeaderComponent({ title, links }: IPayloadHeader) {
  const resolvedLinks = resolveLinks(links)

  const navLinkChildren =
    resolvedLinks.length > 0
      ? resolvedLinks.map((item, i) => <NavLink index={i} link={item} key={i} />)
      : null

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

        {navLinkChildren && (
          <nav className="hidden sm:flex sm:flex-row sm:border sm:border-border">
            {navLinkChildren}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {navLinkChildren && <MobileNav>{navLinkChildren}</MobileNav>}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
