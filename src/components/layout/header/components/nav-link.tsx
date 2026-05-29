import { PrimitiveLink } from '@/components/primitives/link'
import { cn } from '@/utilities/cn'
import type { ResolvedLink } from '@/utilities/resolve-link'

export function NavLink({
  link,
  index,
  mobile,
}: {
  link: ResolvedLink
  index: number
  mobile?: boolean
}) {
  return (
    <PrimitiveLink
      href={link.href}
      className={cn(
        'block px-4 py-[0.45rem] font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted',
        'hover:bg-accent/12 hover:text-fg',
        mobile
          ? 'border-b border-border last:border-b-0'
          : 'border-r border-border last:border-r-0',
      )}
    >
      <span className="text-accent mr-[0.3em] font-medium">
        {(index + 1).toString().padStart(2, '0')}
      </span>
      {link.label}
    </PrimitiveLink>
  )
}
