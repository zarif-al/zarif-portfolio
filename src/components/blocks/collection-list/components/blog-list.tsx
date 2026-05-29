import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { Blog } from '@/payload-types'
import { Tags } from './tags'

interface BlogListViewProps {
  posts: Blog[]
  className?: string
}

export function BlogListView({ posts, className }: BlogListViewProps) {
  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="flex flex-col">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block no-underline text-inherit border border-border border-b-0 last:border-b p-5 md:p-6 bg-surface transition-colors duration-200 hover:bg-bg"
            >
              {post.trackNumber != null && (
                <div className="font-mono text-[0.6rem] uppercase tracking-widest text-accent mb-[0.3rem]">
                  Track {String(post.trackNumber).padStart(2, '0')}
                </div>
              )}
              <Tags tags={post.tags} />
              <div className="font-display text-[1.1rem] font-normal text-fg mb-1">
                {post.title}
              </div>
              {post.publishedDate && (
                <div className="font-mono text-[0.68rem] text-muted mb-1">
                  {new Date(post.publishedDate).toISOString().split('T')[0]}
                </div>
              )}
              {post.excerpt && (
                <div className="text-[0.85rem] text-muted leading-[1.6]">{post.excerpt}</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
