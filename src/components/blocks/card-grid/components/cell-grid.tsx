import { Richtext } from '@/components/primitives/richtext'
import type { CellGridBlock } from '@/payload-types'

export function CellGrid({ swap, items }: CellGridBlock) {
  const ordered = swap ? [items?.[1], items?.[0]] : [items?.[0], items?.[1]]

  return (
    <>
      {ordered.map((item, i) => {
        if (!item) {
          return null
        }

        if (!item.heading && !hasContent(item)) {
          return null
        }

        return (
          <div key={i} className="bg-surface p-6">
            {item.heading && (
              <h3 className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-3 font-medium">
                {item.heading}
              </h3>
            )}
            {item.type === 'stack' ? (
              <>
                {item.stackItems && item.stackItems.length > 0 && (
                  <ul className="flex flex-wrap gap-[0.4rem] list-none">
                    {item.stackItems.map((stackItem, j) => (
                      <li
                        key={j}
                        className="font-mono text-[0.7rem] text-fg bg-accent-soft px-[0.55rem] py-[0.2rem] border border-border"
                      >
                        {stackItem.label}
                      </li>
                    ))}
                  </ul>
                )}
                {item.footnote && (
                  <p className="text-[0.72rem] text-muted mt-3">
                    <span className="text-accent">Currently grinding:</span> {item.footnote}
                  </p>
                )}
              </>
            ) : (
              <div className="text-[0.9rem] text-muted leading-[1.6]">
                {item.content ? <Richtext data={item.content} /> : null}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

function hasContent(item: NonNullable<CellGridBlock['items']>[number]): boolean {
  if (item.type === 'text') {
    return !!item.content
  }
  return !!(item.stackItems && item.stackItems.length > 0)
}
