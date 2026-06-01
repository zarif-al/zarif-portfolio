import { cn } from '@/utilities/cn'

interface FilterButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-transparent border-0 border-r border-border px-4 py-[0.45rem] max-sm:px-3 font-mono text-[0.68rem] max-sm:text-[0.62rem] uppercase tracking-[0.08em] max-sm:tracking-[0.06em] leading-none cursor-pointer transition-colors duration-150 whitespace-nowrap last:border-r-0',
        active ? 'bg-accent/15 text-fg' : 'text-muted hover:bg-accent/15 hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
