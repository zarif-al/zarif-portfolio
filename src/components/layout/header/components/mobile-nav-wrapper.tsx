'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { MobileNav } from './mobile-nav'

export function MobileNavWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return <MobileNav key={pathname}>{children}</MobileNav>
}
