import { getTagLabel } from '../utils'

interface TagsProps {
  tags?:
    | (
        | string
        | {
            id?: string | null
            label?: string | null
          }
      )[]
    | null
}

export function Tags({ tags }: TagsProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <>
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
    </>
  )
}
