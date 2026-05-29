Moving 10,000+ documents from WordPress to Sanity without a maintenance page. Here's the playbook.

## Phase 1: Content modeling

Don't port the WordPress structure 1:1. Audit what's actually there — taxonomies, custom fields, ACF flexible content blocks — and design a cleaner model in Sanity. You're not rebuilding WordPress; you're building what the editorial team actually needs. Two weeks of modeling before writing a single migration script saved months of rework.

## Phase 2: Redirects

A Python script crawled the old site's sitemap, extracted every slug, matched it to the new Sanity document structure, and generated a 10,000-line Vercel redirects config. Every old URL mapped to its new home. Zero 404s on launch day.

## Phase 3: Parallel run

Both backends ran side by side for a week. The editorial team wrote new content in Sanity. Live traffic still hit WordPress. A final sync script caught any WordPress edits made during the parallel run. When DNS flipped, there was nothing left to migrate.

## Phase 4: ISR for the frontend

The Next.js frontend used Incremental Static Regeneration with a 60-second revalidation window. Editorial changes propagated automatically — no full rebuilds, no deploy pipelines. Page loads went from 2.8s (WordPress with caching) to 0.8s (static HTML from the CDN).
