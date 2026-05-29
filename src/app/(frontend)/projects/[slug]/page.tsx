import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Richtext } from '@/components/primitives/richtext'
import { getPayloadInstance } from '@/lib/payload'
import type { Metadata } from 'next'
import { getMetadata } from '@/utilities/get-metadata'

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: '/' + slug } },
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

  return (
    <section className="py-[clamp(2rem,6vh,4rem)]">
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <Link
          href={'/projects'}
          className="inline-flex items-center gap-[0.4rem] font-mono text-xs uppercase tracking-[0.08em] text-muted no-underline border border-border px-[0.85rem] py-[0.45rem] mb-8 transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          <span className="text-[0.9rem] leading-none">←</span>
          Back to Projects
        </Link>

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
            <div className="flex flex-wrap gap-2 mt-4 font-mono text-[0.7rem] text-muted">
              {project.meta.tags.map((tag) => {
                const label = typeof tag === 'string' ? '' : (tag.label ?? '')
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
          )}
        </div>

        {project.meta?.body && (
          <div className="max-w-2xl">
            <Richtext data={project.meta.body} />
          </div>
        )}

        {project.meta?.outcomeStats && project.meta.outcomeStats.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-px bg-border border border-border my-8">
            {project.meta.outcomeStats.map((stat, i) => (
              <div key={i} className="bg-surface px-4 py-5 text-center">
                <div className="font-display text-2xl text-fg">{stat.value}</div>
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted mt-[0.3rem]">
                  {stat.label}
                </div>
              </div>
            ))}
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
