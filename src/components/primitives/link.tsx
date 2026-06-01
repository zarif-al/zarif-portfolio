import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { ReactNode } from 'react'

interface PrimitiveLinkProps {
  href: string
  label?: string
  children?: ReactNode
  className?: string
}

/**
 * A link primitive that handles internal (Next.js Link) and external (anchor)
 * routing automatically.
 *
 * Element selection:
 * - `href` starts with `/` → Next.js `<Link>` for client-side navigation
 * - `href` starts with `http` → `<a>` with `target="_blank"` and `rel="noopener noreferrer"`
 * - Other protocols (`mailto:`, `tel:`, etc.) → plain `<a>` without target attributes
 */
export function PrimitiveLink({ href, label, children, className }: PrimitiveLinkProps) {
  const isInternal = href.startsWith('/')
  const isWebUrl = href.startsWith('http')
  const Element = isInternal ? Link : 'a'
  const content = children ?? label
  const externalProps = isWebUrl
    ? { target: '_blank' as const, rel: 'noopener noreferrer' as const }
    : {}

  return (
    <Element
      href={href}
      className={cn('no-underline transition-colors', className)}
      {...externalProps}
    >
      {content}
    </Element>
  )
}
