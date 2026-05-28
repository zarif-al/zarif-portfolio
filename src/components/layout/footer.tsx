import Link from 'next/link'
import type { IPayloadFooter } from '@/payload-types'
import { resolveLink } from '@/utilities/resolve-link'

export function FooterComponent({ copyright, columns }: IPayloadFooter) {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        {columns && columns.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
            {columns.map((col, i) => (
              <div key={col.id ?? i}>
                {col.heading && (
                  <h4 className="font-mono text-[0.65rem] uppercase tracking-wider text-accent mb-3 font-medium">
                    {col.heading}
                  </h4>
                )}
                {col.links && col.links.length > 0 && (
                  <ul className="flex flex-col gap-1.5 list-none">
                    {col.links.map((linkItem, j) => {
                      const resolved = resolveLink(linkItem.link)

                      if (!resolved) {
                        return null
                      }

                      const className =
                        'text-sm text-muted no-underline transition-colors hover:text-fg'

                      if (linkItem.link?.type === 'internal') {
                        return (
                          <li key={linkItem.id ?? j}>
                            <Link href={resolved.href} className={className}>
                              {resolved.label}
                            </Link>
                          </li>
                        )
                      }

                      return (
                        <li key={linkItem.id ?? j}>
                          <a href={resolved.href} className={className}>
                            {resolved.label}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {copyright && <p className="text-xs text-muted pb-6">{copyright}</p>}
      </div>
    </footer>
  )
}
