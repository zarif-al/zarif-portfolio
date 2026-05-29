'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { Blog } from '@/payload-types'
import { Tags } from './tags'
import { FilterBar } from './filter'

interface BlogListViewProps {
  posts: Blog[]
  allTags: string[]
  className?: string
}

export function BlogListView({ posts, allTags, className }: BlogListViewProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered =
    activeFilter === 'all'
      ? posts
      : posts.filter((p) => p.meta?.tags?.some((t) => typeof t !== 'string' && t.label === activeFilter))

  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <FilterBar allTags={allTags} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <div className="flex flex-col">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block no-underline text-inherit border border-border border-b-0 last:border-b p-5 md:p-6 bg-surface transition-colors duration-200 hover:bg-bg"
            >
              {post.meta?.trackNumber != null && (
                <div className="font-mono text-[0.6rem] uppercase tracking-widest text-accent mb-[0.3rem]">
                  Track {String(post.meta.trackNumber).padStart(2, '0')}
                </div>
              )}
              {post.meta?.tags && <Tags tags={post.meta.tags} />}
              <div className="font-display text-[1.1rem] font-normal text-fg mb-1">
                {post.title}
              </div>
              {post.meta?.publishedDate && (
                <div className="font-mono text-[0.68rem] text-muted mb-1">
                  {new Date(post.meta.publishedDate).toISOString().split('T')[0]}
                </div>
              )}
              {post.meta?.excerpt && (
                <div className="text-[0.85rem] text-muted leading-[1.6]">{post.meta.excerpt}</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
