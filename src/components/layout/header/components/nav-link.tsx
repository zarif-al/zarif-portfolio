'use client'

import { usePathname } from 'next/navigation'
import { PrimitiveLink } from '@/components/primitives/link'
import { cn } from '@/utilities/cn'
import type { ResolvedLink } from '@/utilities/resolve-link'

export function NavLink({ link, index }: { link: ResolvedLink; index: number }) {
  const pathname = usePathname()
  const isActive = pathname === link.href

  return (
    <PrimitiveLink
      href={link.href}
      className={cn(
        'block px-4 py-[0.45rem] font-mono text-[0.7rem] uppercase tracking-[0.08em]',
        'sm:border-r sm:border-border sm:last:border-r-0',
        'max-sm:border-b max-sm:border-border max-sm:last:border-b-0',
        isActive ? 'text-fg bg-accent/12' : 'text-muted hover:bg-accent/12 hover:text-fg',
      )}
    >
      <span className="text-accent mr-[0.3em] font-medium">
        {(index + 1).toString().padStart(2, '0')}
      </span>
      {link.label}
    </PrimitiveLink>
  )
}
