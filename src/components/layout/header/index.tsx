import Link from 'next/link'
import type { IPayloadHeader } from '@/payload-types'
import { resolveLink } from '@/utilities/resolve-link'
import { ThemeToggle } from './theme-toggle'

export function HeaderComponent({ title, links }: IPayloadHeader) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-(--max-width) px-(--gutter) flex items-center justify-between py-5">
        {title && (
          <Link
            href="/"
            className="font-mono font-semibold text-fg text-sm no-underline tracking-tight"
          >
            {title}
          </Link>
        )}
        {links && links.length > 0 && (
          <nav className="flex items-center gap-0 border border-border">
            {links.map((item, i) => {
              const resolved = resolveLink(item.link)

              if (!resolved) {
                return null
              }

              const className =
                'block border-r border-border px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted no-underline transition-colors last:border-r-0 hover:bg-accent/12 hover:text-fg'

              if (item.link?.type === 'internal') {
                return (
                  <Link key={item.id ?? i} href={resolved.href} className={className}>
                    {resolved.label}
                  </Link>
                )
              }

              return (
                <a key={item.id ?? i} href={resolved.href} className={className}>
                  {resolved.label}
                </a>
              )
            })}
          </nav>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
