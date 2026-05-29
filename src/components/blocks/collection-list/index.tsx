import type { CollectionListBlock as CollectionListBlockType } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'
import { draftMode } from 'next/headers'
import { getPayloadInstance } from '@/lib/payload'
import { getTagLabel } from './utils'
import { ProjectListView } from './components/project-list'
import { BlogListView } from './components/blog-list'

export async function CollectionListBlockComponent({
  className,
  ...props
}: BlockComponentProps<CollectionListBlockType>) {
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayloadInstance()

  switch (props.source) {
    case 'projects': {
      const { docs: projects } = await payload.find({
        collection: 'projects',
        pagination: false,
        sort: '-createdAt',
        draft: isDraftMode,
        select: { id: true, slug: true, title: true, meta: true },
      })

      const allTags: string[] = []

      for (const project of projects) {
        if (project.meta?.tags) {
          for (const tag of project.meta.tags) {
            const label = getTagLabel(tag)
            if (label && !allTags.includes(label)) {
              allTags.push(label)
            }
          }
        }
      }

      return <ProjectListView projects={projects} allTags={allTags} className={className} />
    }

    case 'blogs': {
      const { docs: posts } = await payload.find({
        collection: 'blogs',
        pagination: false,
        sort: '-publishedDate',
        draft: isDraftMode,
        select: { id: true, slug: true, title: true, meta: true },
      })

      const allTags: string[] = []

      for (const post of posts) {
        if (post.meta?.tags) {
          for (const tag of post.meta.tags) {
            const label = getTagLabel(tag)
            if (label && !allTags.includes(label)) {
              allTags.push(label)
            }
          }
        }
      }

      return <BlogListView posts={posts} allTags={allTags} className={className} />
    }

    default:
      return null
  }
}
