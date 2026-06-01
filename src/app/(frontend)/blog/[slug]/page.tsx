import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { BackLink } from '@/components/primitives/back-link'
import { Tags } from '@/components/primitives/tags'
import { Richtext } from '@/components/primitives/richtext'
import { RelatedItems } from '@/components/blocks/non-buildable/related-items'
import { BlogKicker } from './kicker'
import { getPayloadInstance } from '@/lib/payload'
import type { Metadata } from 'next'
import { extractCollectionId } from '@/utilities/extract-collection-id'
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

  const tagIds = (post.meta?.tags ?? []).map((t) => extractCollectionId(t))

  return (
    <section className="py-[clamp(2rem,6vh,4rem)]">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <BackLink href="/blog" label="Back to Blog" />

        <div className="mb-10">
          <BlogKicker
            trackNumber={post.meta?.trackNumber}
            publishedDate={post.meta?.publishedDate}
          />

          <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.18] tracking-[-0.015em] text-fg">
            {post.title}
          </h1>

          {post.meta?.tags && post.meta.tags.length > 0 && (
            <div className="mt-4">
              <Tags tags={post.meta.tags} />
            </div>
          )}
        </div>

        {post.meta?.body && (
          <div>
            <Richtext data={post.meta.body} />
          </div>
        )}

        <RelatedItems
          collection="blogs"
          currentId={post.id}
          tagIds={tagIds}
          sort="-meta.publishedDate"
          draft={isDraftMode}
        />
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

export async function generateStaticParams() {
  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection: 'blogs',
    pagination: false,
    select: { slug: true },
  })

  return docs.map((doc) => ({ slug: doc.slug.replace(/^\//, '') }))
}
