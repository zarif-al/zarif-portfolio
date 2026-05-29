import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Richtext } from '@/components/primitives/richtext'
import { getPayloadInstance } from '@/lib/payload'
import type { Metadata } from 'next'
import type { Blog } from '@/payload-types'
import { getMetadata } from '@/utilities/get-metadata'

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: '/' + slug } },
    limit: 1,
    draft: isDraftMode,
    select: {
      title: true,
      meta: true,
    },
  })

  const post = docs[0]

  if (!post) {
    notFound()
  }

  const tagIds = extractTagIds(post.meta?.tags)

  const relatedPosts =
    tagIds.length > 0
      ? await fetchRelatedPosts({ payload, currentPostId: post.id, tagIds, draft: isDraftMode })
      : []

  return (
    <section className="py-[clamp(2rem,6vh,4rem)]">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <Link
          href="/blog"
          className="inline-flex items-center gap-[0.4rem] font-mono text-xs uppercase tracking-[0.08em] text-muted no-underline border border-border px-[0.85rem] py-[0.45rem] mb-8 transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          <span className="text-[0.9rem] leading-none">←</span>
          Back to Blog
        </Link>

        <div className="mb-10">
          {renderKicker(post.meta?.trackNumber, post.meta?.publishedDate)}

          <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.18] tracking-[-0.015em] text-fg">
            {post.title}
          </h1>

          {renderTags(post.meta?.tags)}
        </div>

        {post.meta?.body && (
          <div>
            <Richtext data={post.meta.body} />
          </div>
        )}

        {renderRelated(relatedPosts)}
      </div>
    </section>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  return await getMetadata({
    collectionSlug: 'blogs',
    draft,
    pageSlug: '/' + slug,
  })
}

/** Extract tag IDs from populated or raw relationship data */
function extractTagIds(tags: Blog['meta']['tags']): string[] {
  if (!tags) {
    return []
  }
  return tags.map((t) => (typeof t === 'string' ? t : t.id)).filter(Boolean)
}

/** Render the kicker: track number + date, or date only */
function renderKicker(
  trackNumber: number | null | undefined,
  publishedDate: string | null | undefined,
) {
  if (!publishedDate) {
    return null
  }
  const formattedDate = new Date(publishedDate).toISOString().split('T')[0]
  const text =
    trackNumber != null
      ? `Track ${String(trackNumber).padStart(2, '0')} · ${formattedDate}`
      : formattedDate

  return (
    <p className="font-mono text-[0.72rem] uppercase tracking-widest text-accent mb-3">{text}</p>
  )
}

/** Render tag pills, same pattern as project detail */
function renderTags(tags: Blog['meta']['tags']) {
  if (!tags || tags.length === 0) {
    return null
  }
  return (
    <div className="flex flex-wrap gap-2 mt-4 font-mono text-[0.7rem] text-muted">
      {tags.map((tag) => {
        const label = typeof tag === 'string' ? '' : tag.label
        if (!label) {
          return null
        }
        return (
          <span
            key={label}
            className="border border-border px-[0.55rem] py-[0.2rem] uppercase tracking-[0.06em]"
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}

/** Render the "Related" section with up to 3 linked posts */
function renderRelated(posts: Array<{ id: string; title: string; slug: string }>) {
  if (posts.length === 0) {
    return null
  }
  return (
    <div className="mt-12 p-6 bg-surface border border-border">
      <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-accent mb-[0.85rem]">
        Related
      </h4>
      <div className="flex flex-wrap gap-2">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="inline-block font-mono text-[0.8rem] text-fg no-underline border border-border px-[0.9rem] py-[0.6rem] transition-colors duration-200 hover:border-accent hover:bg-accent-soft"
          >
            <span className="text-accent font-medium">→ </span>
            {p.title}
          </Link>
        ))}
      </div>
    </div>
  )
}

/** Query for up to 3 related blog posts that share at least one tag */
async function fetchRelatedPosts({
  payload,
  currentPostId,
  tagIds,
  draft,
}: {
  payload: Awaited<ReturnType<typeof getPayloadInstance>>
  currentPostId: string
  tagIds: string[]
  draft: boolean
}): Promise<Array<{ id: string; title: string; slug: string }>> {
  const { docs } = await payload.find({
    collection: 'blogs',
    where: {
      and: [{ id: { not_equals: currentPostId } }, { 'meta.tags': { in: tagIds } }],
    },
    limit: 3,
    sort: '-meta.publishedDate',
    draft,
    select: {
      title: true,
      slug: true,
    },
  })

  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
  }))
}
