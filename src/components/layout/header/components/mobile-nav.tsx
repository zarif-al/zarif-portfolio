'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/utilities/cn'

export function MobileNav({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav
        className={cn(
          'sm:hidden',
          'flex-col absolute top-full left-0 right-0',
          'bg-surface border border-border z-50',
          'transition-all duration-200 ease-out',
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none',
        )}
      >
        {children}
      </nav>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="sm:hidden border border-border px-[0.65rem] py-[0.35rem] font-mono text-sm text-fg cursor-pointer"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>
    </>
  )
}
