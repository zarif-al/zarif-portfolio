import Link from 'next/link'
import { getPayloadInstance } from '@/lib/payload'
import { getURLPrefix } from '@/lib/relative-url'

interface RelatedItemsProps {
  collection: 'projects' | 'blogs'
  currentId: string
  tagIds: string[]
  sort: string
  draft: boolean
}

const LIMIT = 3

export async function RelatedItems({
  collection,
  currentId,
  tagIds,
  sort,
  draft,
}: RelatedItemsProps) {
  if (tagIds.length === 0) {
    return null
  }

  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection,
    overrideAccess: false,
    where: {
      and: [{ id: { not_equals: currentId } }, { 'meta.tags': { in: tagIds } }],
    },
    limit: LIMIT,
    sort,
    draft,
    select: {
      title: true,
      slug: true,
    },
  })

  if (docs.length === 0) {
    return null
  }

  const urlPrefix = getURLPrefix(collection)

  return (
    <div className="mt-12 p-6 bg-surface border border-border">
      <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-accent mb-[0.85rem]">
        Related
      </h4>
      <div className="flex flex-wrap gap-2">
        {docs.map((doc) => (
          <Link
            key={doc.id}
            href={`${urlPrefix}${doc.slug}`}
            className="inline-block font-mono text-[0.8rem] text-fg no-underline border border-border px-[0.9rem] py-[0.6rem] transition-colors duration-200 hover:border-accent hover:bg-accent-soft"
          >
            <span className="text-accent font-medium">→ </span>
            {doc.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
