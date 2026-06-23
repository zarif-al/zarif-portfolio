import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { BackLink } from '@/components/primitives/back-link'
import { Tags } from '@/components/primitives/tags'
import { Richtext } from '@/components/primitives/richtext'
import { RelatedItems } from '@/components/blocks/non-buildable/related-items'
import { getPayloadInstance } from '@/lib/payload'
import type { Metadata } from 'next'
import { extractCollectionId } from '@/utilities/extract-collection-id'
import { getMetadata } from '@/utilities/get-metadata'

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection: 'projects',
    where: isDraftMode
      ? { slug: { equals: '/' + slug } }
      : { and: [{ slug: { equals: '/' + slug } }, { _status: { not_equals: 'draft' } }] },
    limit: 1,
    draft: isDraftMode,
    select: {
      title: true,
      meta: true,
    },
  })

  const project = docs[0]

  if (!project) {
    notFound()
  }

  const tagIds = (project.meta?.tags ?? []).map((t) => extractCollectionId(t))

  return (
    <section className="py-[clamp(2rem,6vh,4rem)]">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <BackLink href="/projects" label="Back to Projects" />

        <div className="mb-10">
          {project.meta?.kicker && (
            <p className="font-mono text-[0.72rem] uppercase tracking-widest text-accent mb-3">
              {project.meta.kicker}
            </p>
          )}
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.18] tracking-[-0.015em] text-fg">
            {project.title}
          </h1>

          {project.meta?.tags && project.meta.tags.length > 0 && (
            <div className="mt-4">
              <Tags tags={project.meta.tags} />
            </div>
          )}
        </div>

        {project.meta?.body && (
          <div className="max-w-2xl">
            <Richtext data={project.meta.body} />
          </div>
        )}

        {project.meta?.techStack && project.meta.techStack.length > 0 && (
          <div className="flex flex-wrap gap-[0.4rem] mt-8 pt-6 border-t border-border">
            {project.meta.techStack.map((s) => (
              <span
                key={s}
                className="font-mono text-[0.68rem] text-muted border border-border px-[0.6rem] py-1 bg-surface"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <RelatedItems
          collection="projects"
          currentId={project.id}
          tagIds={tagIds}
          sort="-createdAt"
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
    collectionSlug: 'projects',
    draft,
    pageSlug: '/' + slug,
  })
}

export async function generateStaticParams() {
  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection: 'projects',
    pagination: false,
    where: { _status: { not_equals: 'draft' } },
    select: { slug: true },
  })

  return docs.map((doc) => ({ slug: doc.slug.replace(/^\//, '') }))
}
