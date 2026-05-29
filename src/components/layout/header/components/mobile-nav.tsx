'use client'

import { useState } from 'react'
import { cn } from '@/utilities/cn'
import { NavLink } from './nav-link'
import { ThemeToggle } from './theme-toggle'
import type { ResolvedLink } from '@/utilities/resolve-link'

export function MobileNav({ links }: { links: ResolvedLink[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav
        className={cn(
          // Desktop: horizontal row, static, bordered
          'sm:flex sm:static sm:flex-row sm:border sm:border-border',
          // Mobile base: column, absolute, full-width within gutter
          'max-sm:flex-col max-sm:absolute max-sm:top-full max-sm:left-0 max-sm:right-0',
          'max-sm:bg-surface max-sm:border max-sm:border-border max-sm:z-50',
          // Transition on mobile only
          'max-sm:transition-all max-sm:duration-200 max-sm:ease-out',
          isOpen
            ? 'max-sm:opacity-100 max-sm:translate-y-0 max-sm:visible'
            : 'max-sm:opacity-0 max-sm:-translate-y-2 max-sm:invisible max-sm:pointer-events-none',
        )}
      >
        {links.map((item, i) => (
          <NavLink index={i} link={item} key={i} mobile={isOpen} />
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="sm:hidden border border-border px-[0.65rem] py-[0.35rem] font-mono text-sm text-fg cursor-pointer"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>
    </>
  )
}
