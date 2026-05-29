import type { Tag } from '@/payload-types'
import { getTagLabel } from '../utils'

interface TagsProps {
  tags: (string | Tag)[]
}

export function Tags({ tags }: TagsProps) {
  return (
    <div className="flex gap-[0.4rem] flex-wrap">
      {tags.map((tag, i) => {
        const label = getTagLabel(tag)
        if (!label) {
          return null
        }
        return (
          <span
            key={i}
            className="font-mono text-[0.62rem] uppercase tracking-widest text-accent border border-border px-2 py-[0.15rem]"
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}
