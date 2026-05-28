import type { CollectionSlug, DataFromCollectionSlug, FieldHook } from 'payload'

/**
 * Handler map for SEO fallback resolution.
 *
 * The mapped type covers every collection except internal/admin ones
 * (`payload-*`, `media`, `users`). Adding a new content collection to
 * Payload forces a TypeScript error here until you add a handler entry.
 */
const seoFallbackHandlers: {
  [S in Exclude<
    CollectionSlug,
    | 'media'
    | 'users'
    | 'payload-kv'
    | 'payload-folders'
    | 'payload-locked-documents'
    | 'payload-preferences'
    | 'payload-migrations'
  >]: (data: Partial<DataFromCollectionSlug<S>>, field: 'description' | 'title') => string
} = {
  pages: (data, field) => (field === 'title' ? (data.title ?? '') : ''),
  projects: (data, field) => (field === 'title' ? (data.title ?? '') : ''),
  blogs: (data, field) => (field === 'title' ? (data.title ?? '') : ''),
  tags: (data, field) => (field === 'title' ? (data.label ?? '') : ''),
}

/**
 * Returns an `afterRead` hook that resolves SEO fallback values.
 *
 * @param field - Which SEO field this hook is bound to.
 */
export function createAfterReadHook(
  field: 'description' | 'title',
): FieldHook<DataFromCollectionSlug<CollectionSlug>, string> {
  return ({ value, data, collection, req: { user } }) => {
    if (user || value) {
      return value ?? ''
    }

    if (!data) {
      return ''
    }

    const slug = collection?.slug

    if (slug === 'pages') {
      return seoFallbackHandlers[slug](data, field)
    }

    return value ?? ''
  }
}
