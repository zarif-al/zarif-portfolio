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
      techStack: p.techStack,
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
  const tagLabels = ['Sanity', 'NextJS', 'Architecture', 'Integration', 'Payload', 'Concept']
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
      where: { slug: { equals: `/${p.slug}` } },
      limit: 1,
    })
    const doc = existing.docs[0]
    const data = buildProjectData(p, tagMap, editorConfig)

    if (doc) {
      await payload.update({ collection: 'projects', id: doc.id, data })
    } else {
      await payload.create({ collection: 'projects', data, draft: p.draft ?? false })
    }
  }

  console.log('Seeding Blog Posts…')
  for (const b of BLOGS) {
    const existing = await payload.find({
      collection: 'blogs',
      where: { slug: { equals: `/${b.slug}` } },
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
      kicker: 'Quests completed: 02',
      size: 'default',
      heading: mdToLexical(editorConfig, readMd('headings/projects.md')),
    }),
    buildCollectionListBlock({ source: 'projects' }),
  ])

  console.log('Seeding Blog page…')
  const blogPage = await upsertPage(payload, '/blog', 'Blog', [
    buildHeroBlock({
      kicker: 'Side A: Mixtape',
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
      kicker: 'Updated June 2025',
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
    slug: 'brightonseo',
    title: 'brightonSEO',
    kicker: 'Project',
    description:
      "Led the rebuild of the world's largest search marketing conference website. Migrated from a rigid legacy system to a flexible Sanity + Next.js stack with a custom page builder, schedule table, and event management workflows.",
    bodyFile: 'brightonseo.md',
    tags: ['Sanity', 'NextJS', 'Architecture'],
    techStack: ['Sanity', 'Next.js', 'TypeScript', 'Vercel', 'GROQ'],
    outcomeStats: [
      { value: '10-11→2-3', label: 'Site Maintainers' },
      { value: '1 wk', label: 'Event Setup' },
    ],
  },
  {
    slug: 'boutique-gym-site',
    title: 'Boutique Gym Site',
    kicker: 'Project',
    description:
      'Led the migration of a premium gym from a restrictive legacy GMS to Sanity + Next.js + Flutter. Built a NestJS sync service, custom spot booking with visual layout positioning, and a reusable class list component with React Suspense.',
    bodyFile: 'boutique-gym-site.md',
    tags: ['Sanity', 'NextJS', 'Architecture', 'Integration'],
    techStack: ['Sanity', 'Next.js', 'NestJS', 'Flutter', 'PostgreSQL'],
    outcomeStats: [],
  },
  {
    slug: 'sauna-gms-integration',
    title: 'Sauna GMS Integration',
    kicker: 'Project',
    description:
      'Building a custom integration layer on top of Mariana Tek GMS for a sauna business. The GMS only supports single-spot authenticated booking; we are building anonymous group booking where customers can reserve multiple spots without logging in.',
    bodyFile: 'sauna-gms-integration.md',
    tags: ['Integration'],
    techStack: ['NestJS', 'Mariana Tek', 'Next.js', 'Sanity'],
    outcomeStats: [],
    draft: true,
  },
]

const BLOGS = [
  {
    slug: 'payload-cms-2fa-implementation',
    title: 'Payload CMS: 2FA Implementation',
    trackNumber: 1,
    publishedDate: '2025-02-23',
    excerpt:
      "An approach to implementing two-factor authentication in Payload CMS without replacing the default auth system: layering OTP verification on top of Payload's existing login flow.",
    bodyFile: 'payload-cms-2fa.md',
    tags: ['Payload', 'Architecture'],
  },
  {
    slug: 'conceptual-truncation',
    title: 'Conceptual Truncation',
    trackNumber: 2,
    publishedDate: '2025-02-23',
    excerpt:
      'Much like "the customer is always right" was never about tolerating bad behavior, the DRY principle was never about eliminating code duplication; it\'s about eliminating duplication of knowledge. How conceptual truncation distorts software principles.',
    bodyFile: 'conceptual-truncation.md',
    tags: ['Concept'],
  },
  {
    slug: 'client-vs-server-fetching',
    title: 'Client Side vs Server Side Fetching',
    trackNumber: 3,
    publishedDate: '2025-02-23',
    excerpt:
      'Where should data queries be processed? The trade-off between cost, performance, and security when deciding between server-side and client-side data fetching.',
    bodyFile: 'client-vs-server-fetching.md',
    tags: ['Concept'],
  },
]
