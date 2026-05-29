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
        'bg-transparent border-0 border-r border-border px-4 py-[0.45rem] font-mono text-[0.68rem] uppercase tracking-[0.08em] cursor-pointer transition-colors duration-150 whitespace-nowrap last:border-r-0',
        active ? 'bg-accent/15 text-fg' : 'text-muted hover:bg-accent/15 hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
