import 'dotenv/config'
import { getPayload } from 'payload'
import type { SanitizedServerEditorConfig } from '@payloadcms/richtext-lexical'
import configPromise from '@payload-config'
import {
  buildHeader,
  buildFooter,
  buildHeroBlock,
  buildEqualizerBlock,
  buildTerminalBlock,
  buildRichtextBlock,
  buildCardGridBlock,
  buildCollectionListBlock,
  buildContactBlock,
  buildEntryListBlock,
} from './data'
import { upsertPage, readMd, mdToLexical, getEditorConfig } from './helpers'

/** Builds a full Payload-shaped project data object from flat source data. */
function buildProjectData(
  p: (typeof PROJECTS)[number],
  tagMap: Record<string, string>,
  editorConfig: SanitizedServerEditorConfig,
) {
  return {
    title: p.title,
    slug: p.slug,
    meta: {
      description: p.description,
      body: mdToLexical(editorConfig, readMd(`projects/${p.bodyFile}`)),
      tags: p.tags.map((t) => tagMap[t]).filter((id): id is string => id !== undefined),
      techStack: p.techStack.map((s) => ({ label: s })),
      outcomeStats: p.outcomeStats,
      kicker: p.kicker,
    },
    localSeoTab: {
      title: p.title,
      description: p.description,
      robotsConfig: {
        disableIndex: true,
        disableFollow: true,
        disableImageIndex: true,
        disableSnippet: true,
      },
    },
  }
}

/** Builds a full Payload-shaped blog data object from flat source data. */
function buildBlogData(
  b: (typeof BLOGS)[number],
  tagMap: Record<string, string>,
  editorConfig: SanitizedServerEditorConfig,
) {
  return {
    title: b.title,
    slug: b.slug,
    meta: {
      trackNumber: b.trackNumber,
      publishedDate: b.publishedDate,
      excerpt: b.excerpt,
      body: mdToLexical(editorConfig, readMd(`blogs/${b.bodyFile}`)),
      tags: b.tags.map((t) => tagMap[t]).filter((id): id is string => id !== undefined),
    },
    localSeoTab: {
      title: b.title,
      description: b.excerpt,
      robotsConfig: {
        disableIndex: true,
        disableFollow: true,
        disableImageIndex: true,
        disableSnippet: true,
      },
    },
  }
}

async function seed() {
  const payload = await getPayload({ config: configPromise })
  const editorConfig = await getEditorConfig(await configPromise)

  // ── Pass 0: seed tags, projects, and blog posts ──

  console.log('Seeding Tags…')
  const tagLabels = ['CMS', 'Architecture', 'Integration', 'Full-stack']
  const tagMap: Record<string, string> = {}
  for (const label of tagLabels) {
    const existing = await payload.find({
      collection: 'tags',
      where: { label: { equals: label } },
      limit: 1,
    })
    const doc = existing.docs[0]
    const tag = doc
      ? await payload.update({ collection: 'tags', id: doc.id, data: { label } })
      : await payload.create({ collection: 'tags', data: { label }, draft: false })
    tagMap[label] = tag.id
  }

  console.log('Seeding Projects…')
  for (const p of PROJECTS) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })
    const doc = existing.docs[0]
    const data = buildProjectData(p, tagMap, editorConfig)

    if (doc) {
      await payload.update({ collection: 'projects', id: doc.id, data })
    } else {
      await payload.create({ collection: 'projects', data, draft: false })
    }
  }

  console.log('Seeding Blog Posts…')
  for (const b of BLOGS) {
    const existing = await payload.find({
      collection: 'blogs',
      where: { slug: { equals: b.slug } },
      limit: 1,
    })
    const doc = existing.docs[0]
    const data = buildBlogData(b, tagMap, editorConfig)

    if (doc) {
      await payload.update({ collection: 'blogs', id: doc.id, data })
    } else {
      await payload.create({ collection: 'blogs', data, draft: false })
    }
  }

  // Pass 1: seed pages
  console.log('Seeding Home page…')
  const homePage = await upsertPage(payload, '/', 'Home', [
    buildHeroBlock({}),
    buildEqualizerBlock(),
    buildTerminalBlock(),
    buildRichtextBlock(),
  ])

  console.log('Seeding About page…')
  const aboutPage = await upsertPage(payload, '/about', 'About', [
    buildHeroBlock({
      kicker: '01 / About',
      size: 'default',
      heading: mdToLexical(editorConfig, readMd('headings/about.md')),
    }),
    buildCardGridBlock(),
  ])

  console.log('Seeding Projects page…')
  const projectsPage = await upsertPage(payload, '/projects', 'Projects', [
    buildHeroBlock({
      kicker: 'Quests completed: 05',
      size: 'default',
      heading: mdToLexical(editorConfig, readMd('headings/projects.md')),
    }),
    buildCollectionListBlock({ source: 'projects' }),
  ])

  console.log('Seeding Blog page…')
  const blogPage = await upsertPage(payload, '/blog', 'Blog', [
    buildHeroBlock({
      kicker: 'Side A — Mixtape',
      size: 'default',
      heading: mdToLexical(editorConfig, readMd('headings/blog.md')),
    }),
    buildCollectionListBlock({ source: 'blogs' }),
  ])

  console.log('Seeding Contact page…')
  const contactPage = await upsertPage(payload, '/contact', 'Contact', [
    buildHeroBlock({
      kicker: null,
      size: 'default',
      heading: mdToLexical(editorConfig, readMd('headings/contact.md')),
    }),
    buildContactBlock(),
  ])

  console.log('Seeding Now page…')
  const nowPage = await upsertPage(payload, '/now', 'Now', [
    buildHeroBlock({
      kicker: 'Updated May 2026',
      size: 'default',
      heading: mdToLexical(editorConfig, readMd('headings/now.md')),
    }),
    buildEntryListBlock(),
  ])

  // Pass 2: update Layout with resolved internal references
  console.log('Seeding Layout…')
  await payload.updateGlobal({
    slug: 'layout',
    data: {
      header: buildHeader({
        '/': homePage,
        '/about': aboutPage,
        '/projects': projectsPage,
        '/blog': blogPage,
        '/contact': contactPage,
        '/now': nowPage,
      }),
      footer: buildFooter({
        '/': homePage,
        '/about': aboutPage,
        '/projects': projectsPage,
        '/blog': blogPage,
        '/contact': contactPage,
        '/now': nowPage,
      }),
    },
  })

  console.log('Seed complete.')
}

seed()
  .then(() => {
    process.exit(0)
  })
  .catch((error: unknown) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })

// ── Seed data ──

const PROJECTS = [
  {
    slug: 'multi-tenant-cms-platform',
    title: 'Multi-tenant CMS Platform',
    kicker: 'Project',
    description:
      'Designed and built a Payload CMS deployment serving 40+ tenants from a single codebase. Custom access control layer, per-tenant schema extensions, and a shared media pipeline with tenant-scoped storage. Reduced infrastructure costs by 60% vs. per-tenant instances.',
    bodyFile: 'multi-tenant-cms-platform.md',
    tags: ['CMS', 'Architecture'],
    techStack: ['Payload CMS', 'Next.js', 'PostgreSQL', 'S3', 'Docker', 'Redis'],
    outcomeStats: [
      { value: '40+', label: 'Tenants' },
      { value: '60%', label: 'Cost Reduction' },
      { value: '1', label: 'Codebase' },
      { value: '0', label: 'Data Leaks' },
    ],
  },
  {
    slug: 'real-time-data-pipeline',
    title: 'Real-time Data Pipeline for e-Commerce',
    kicker: 'Project',
    description:
      'Built a NestJS event-driven pipeline syncing product catalog, inventory, and order data between a legacy ERP and a modern Sanity + Next.js storefront. Handles 50k+ events/day with idempotent processing and a dead-letter queue for failed syncs.',
    bodyFile: 'real-time-data-pipeline.md',
    tags: ['Integration', 'Architecture'],
    techStack: ['NestJS', 'Sanity', 'PostgreSQL', 'Redis Streams', 'BullMQ'],
    outcomeStats: [
      { value: '50k+', label: 'Events / Day' },
      { value: '99.9%', label: 'Delivery Rate' },
      { value: '<5s', label: 'Sync Latency' },
      { value: '0', label: 'Silent Drops' },
    ],
  },
  {
    slug: 'editorial-platform-migration',
    title: 'Editorial Platform Migration',
    kicker: 'Project',
    description:
      'Migrated a 10k+ document editorial backend from WordPress to Sanity with custom content modeling, automated redirect mapping, and zero-downtime cutover. Built a Next.js frontend with ISR that cut page load times by 70%.',
    bodyFile: 'editorial-platform-migration.md',
    tags: ['Full-stack', 'CMS'],
    techStack: ['Sanity', 'Next.js', 'TypeScript', 'Vercel', 'GROQ'],
    outcomeStats: [
      { value: '10k+', label: 'Documents Migrated' },
      { value: '70%', label: 'Faster Page Loads' },
      { value: '0', label: 'Downtime' },
      { value: '100%', label: 'SEO Retention' },
    ],
  },
  {
    slug: 'payment-system-consolidation',
    title: 'Payment System Consolidation',
    kicker: 'Project',
    description:
      'Consolidated three payment providers (Stripe, local gateway, manual invoicing) behind a unified NestJS API layer. Built reconciliation tooling, webhook normalization, and an admin dashboard for finance operations. Processed $2M+ in the first quarter post-launch.',
    bodyFile: 'payment-system-consolidation.md',
    tags: ['Integration', 'Full-stack'],
    techStack: ['NestJS', 'Stripe', 'Next.js', 'PostgreSQL', 'Temporal'],
    outcomeStats: [
      { value: '$2M+', label: 'Q1 Volume' },
      { value: '3→1', label: 'Provider Surface' },
      { value: '0', label: 'Double Charges' },
      { value: '100%', label: 'Reconciliation' },
    ],
  },
  {
    slug: 'internal-api-gateway',
    title: 'Internal API Gateway',
    kicker: 'Project',
    description:
      "Designed a centralized API gateway for a microservices ecosystem — rate limiting, auth, request tracing, and schema validation at the edge. Reduced inter-service coupling and gave the platform team observability they didn't have before.",
    bodyFile: 'internal-api-gateway.md',
    tags: ['Architecture'],
    techStack: ['NestJS', 'Redis', 'OpenTelemetry', 'Docker', 'Kong'],
    outcomeStats: [
      { value: '1', label: 'Entry Point' },
      { value: '100%', label: 'Trace Coverage' },
      { value: '<10ms', label: 'Gateway Overhead' },
      { value: '0', label: 'Auth Bypasses' },
    ],
  },
]

const BLOGS = [
  {
    slug: 'multi-tenant-cms-architectures',
    title: 'Designing Multi-Tenant CMS Architectures with Payload',
    trackNumber: 1,
    publishedDate: '2026-04-12',
    excerpt:
      'Patterns for database isolation, tenant-aware media storage, and keeping the developer experience sane when one codebase serves forty clients.',
    bodyFile: 'multi-tenant-cms-architectures.md',
    tags: ['CMS', 'Architecture'],
  },
  {
    slug: 'event-driven-sync',
    title: 'Event-Driven Sync: When CRUD Is not Enough',
    trackNumber: 2,
    publishedDate: '2026-03-03',
    excerpt:
      'Lessons from building an idempotent event pipeline between a legacy ERP and a modern headless storefront. Idempotency keys, dead-letter queues, and why you need both.',
    bodyFile: 'event-driven-sync.md',
    tags: ['Integration'],
  },
  {
    slug: 'typescript-patterns',
    title: 'TypeScript Patterns for Resilient API Layers',
    trackNumber: 3,
    publishedDate: '2026-01-18',
    excerpt:
      'Branded types, Zod at the boundary, and why your DTO layer is the most important code in a NestJS service.',
    bodyFile: 'typescript-patterns.md',
    tags: ['Architecture'],
  },
  {
    slug: 'cms-migration-without-downtime',
    title: 'CMS Migration Without Downtime',
    trackNumber: 4,
    publishedDate: '2025-11-07',
    excerpt:
      'The playbook I used to move 10,000+ documents from WordPress to Sanity — content modeling, redirect mapping, and a zero-cutover strategy.',
    bodyFile: 'cms-migration-without-downtime.md',
    tags: ['CMS', 'Full-stack'],
  },
  {
    slug: 'why-nestjs',
    title: 'Why I Reach for NestJS',
    trackNumber: 5,
    publishedDate: '2025-09-22',
    excerpt:
      'Modules, decorators, and dependency injection — but the real reason is that NestJS forces a structure that survives team turnover.',
    bodyFile: 'why-nestjs.md',
    tags: ['Architecture'],
  },
]
