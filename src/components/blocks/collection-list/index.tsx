import type { CollectionListBlock as CollectionListBlockType } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'
import { getPayloadInstance } from '@/lib/payload'
import { getTagLabel } from './utils'
import { ProjectListView } from './components/project-list'
import { BlogListView } from './components/blog-list'

export async function CollectionListBlockComponent({
  className,
  ...props
}: BlockComponentProps<CollectionListBlockType>) {
  const payload = await getPayloadInstance()

  switch (props.source) {
    case 'projects': {
      const { docs: projects } = await payload.find({
        collection: 'projects',
        pagination: false,
        sort: '-createdAt',
      })

      const allTags: string[] = []

      for (const project of projects) {
        if (project.tags) {
          for (const tag of project.tags) {
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
      })

      return <BlogListView posts={posts} className={className} />
    }

    default:
      return null
  }
}
