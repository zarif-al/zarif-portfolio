'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { Project } from '@/payload-types'
import { getTagLabel } from '../utils'
import { FilterButton } from './filter-button'

interface ProjectListViewProps {
  projects: Project[]
  allTags: string[]
  className?: string
}

export function ProjectListView({ projects, allTags, className }: ProjectListViewProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.tags?.some((t) => getTagLabel(t) === activeFilter))

  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        {allTags.length > 0 && (
          <div className="flex gap-0 mb-6 border border-border w-fit max-w-full flex-wrap overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
              All
            </FilterButton>
            {allTags.map((tag) => (
              <FilterButton
                key={tag}
                active={activeFilter === tag}
                onClick={() => setActiveFilter(tag)}
              >
                {tag}
              </FilterButton>
            ))}
          </div>
        )}

        <div className="flex flex-col">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="grid grid-cols-1 border border-border border-b-0 last:border-b p-6 bg-surface transition-colors duration-200 hover:bg-bg no-underline text-inherit"
            >
              <div className="flex gap-3 items-center mb-2 flex-wrap">
                {project.tags?.map((tag, j) => (
                  <span
                    key={j}
                    className="font-mono text-[0.62rem] uppercase tracking-widest text-accent border border-border px-2 py-[0.15rem]"
                  >
                    {getTagLabel(tag)}
                  </span>
                ))}
                <span className="font-mono text-[0.55rem] text-accent tracking-[0.08em] uppercase">
                  ✦ Quest Complete
                </span>
              </div>
              <h3 className="font-display text-[1.2rem] font-normal text-fg mb-[0.35rem] tracking-[-0.01em]">
                {project.title}
              </h3>
              <p className="text-[0.875rem] text-muted leading-[1.6] mb-2">{project.description}</p>
              {project.techStack && project.techStack.length > 0 && (
                <p className="font-mono text-[0.65rem] text-border tracking-wider">
                  {project.techStack.map((s) => s.label).join(' · ')}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
