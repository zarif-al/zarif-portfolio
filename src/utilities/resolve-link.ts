import { getURLPrefix } from '@/lib/relative-url'
import type { Link } from '@/payload-types'

export interface ResolvedLink {
  label?: string
  href: string
}

export function resolveLink(raw: Link | null | undefined): ResolvedLink | null {
  if (!raw?.type) {
    return null
  }

  let href = ''

  if (raw.type === 'external') {
    href = raw.url ?? ''
  } else {
    const reference = raw.reference
    if (reference && typeof reference.value === 'object' && reference.value) {
      if (!reference.relationTo || !reference.value.slug) {
        return null
      }
      const prefix = getURLPrefix(reference.relationTo)
      href = prefix + reference.value.slug
    }
  }

  if (!href) {
    return null
  }

  return {
    label: raw.label ?? undefined,
    href,
  }
}

/**
 * Resolves an array of link items, returning only those that resolve
 * to a valid href. Uses a single-pass reduce to resolve and filter.
 */
export function resolveLinks(
  items: { link?: Link | null; id?: string | null }[] | null | undefined,
): ResolvedLink[] {
  if (!items) {
    return []
  }

  return items.reduce<ResolvedLink[]>((acc, item) => {
    const resolved = resolveLink(item.link)

    if (resolved) {
      acc.push(resolved)
    }

    return acc
  }, [])
}
