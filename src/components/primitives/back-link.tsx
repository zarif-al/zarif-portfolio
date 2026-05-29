import { PrimitiveLink } from '@/components/primitives/link'

interface BackLinkProps {
  href: string
  label: string
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <PrimitiveLink
      href={href}
      className="inline-flex items-center gap-[0.4rem] font-mono text-xs uppercase tracking-[0.08em] text-muted border border-border px-[0.85rem] py-[0.45rem] mb-8 hover:border-accent hover:text-accent"
    >
      <span className="text-[0.9rem] leading-none">←</span>
      {label}
    </PrimitiveLink>
  )
}
