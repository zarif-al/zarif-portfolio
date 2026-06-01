import { FilterButton } from './filter-button'

interface FilterBarProps {
  allTags: string[]
  activeFilter: string
  onFilterChange: (tag: string) => void
}

export function FilterBar({ allTags, activeFilter, onFilterChange }: FilterBarProps) {
  if (allTags.length === 0) {
    return null
  }

  return (
    <div className="flex gap-0 mb-6 border border-border w-fit max-w-full flex-wrap max-sm:flex-nowrap max-sm:w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
      <FilterButton active={activeFilter === 'all'} onClick={() => onFilterChange('all')}>
        All
      </FilterButton>
      {allTags.map((tag) => (
        <FilterButton key={tag} active={activeFilter === tag} onClick={() => onFilterChange(tag)}>
          {tag}
        </FilterButton>
      ))}
    </div>
  )
}
