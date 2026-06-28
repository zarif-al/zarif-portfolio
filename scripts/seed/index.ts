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
import {
  upsertPage,
  readMd,
  mdToLexical,
  getEditorConfig,
  getEditorConfigWithCodeBlock,
} from './helpers'

/** Builds a full Payload-shaped project data object from flat source data. */
function buildProjectData(
  p: (typeof PROJECTS)[number],
  tagMap: Record<string, string>,
  bodyEditorConfig: SanitizedServerEditorConfig,
) {
  return {
    title: p.title,
    slug: p.slug,
    meta: {
      description: p.description,
      body: mdToLexical(bodyEditorConfig, readMd(`projects/${p.bodyFile}`)),
      tags: p.tags.map((t) => tagMap[t]).filter((id): id is string => id !== undefined),
      techStack: p.techStack,
      outcomeStats: p.outcomeStats,
      involvement: p.involvement,
      kicker: p.kicker,
    },
    localSeoTab: {
      title: `${p.title} — Zarif`,
      description: p.description,
      keywords: p.keywords,
      robotsConfig: {
        disableIndex: false,
        disableFollow: false,
        disableImageIndex: false,
        disableSnippet: false,
      },
    },
  }
}

/** Builds a full Payload-shaped blog data object from flat source data. */
function buildBlogData(
  b: (typeof BLOGS)[number],
  tagMap: Record<string, string>,
  bodyEditorConfig: SanitizedServerEditorConfig,
) {
  return {
    title: b.title,
    slug: b.slug,
    meta: {
      trackNumber: b.trackNumber,
      publishedDate: b.publishedDate,
      excerpt: b.excerpt,
      body: mdToLexical(bodyEditorConfig, readMd(`blogs/${b.bodyFile}`)),
      tags: b.tags.map((t) => tagMap[t]).filter((id): id is string => id !== undefined),
    },
    localSeoTab: {
      title: `${b.title} — Zarif`,
      description: b.excerpt,
      keywords: b.keywords,
      robotsConfig: {
        disableIndex: false,
        disableFollow: false,
        disableImageIndex: false,
        disableSnippet: false,
      },
    },
  }
}

async function seed() {
  const payload = await getPayload({ config: configPromise })
  const sanitizedConfig = await configPromise
  const editorConfig = await getEditorConfig(sanitizedConfig)
  const editorConfigWithCodeBlock = await getEditorConfigWithCodeBlock(sanitizedConfig)

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
    const data = buildProjectData(p, tagMap, editorConfigWithCodeBlock)

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
    const data = buildBlogData(b, tagMap, editorConfigWithCodeBlock)

    if (doc) {
      await payload.update({ collection: 'blogs', id: doc.id, data })
    } else {
      await payload.create({ collection: 'blogs', data, draft: false })
    }
  }

  // Pass 1: seed pages
  console.log('Seeding Home page…')
  const homePage = await upsertPage(
    payload,
    '/',
    'Home',
    [buildHeroBlock({}), buildEqualizerBlock(), buildTerminalBlock(), buildRichtextBlock()],
    {
      title: 'Zarif — Systems Engineer & Integration Specialist',
      description:
        'Portfolio of Zarif, a software engineer specializing in API design, CMS architecture, and system integration.',
    },
  )

  console.log('Seeding About page…')
  const aboutPage = await upsertPage(
    payload,
    '/about',
    'About',
    [
      buildHeroBlock({
        kicker: '01 / About',
        size: 'default',
        heading: mdToLexical(editorConfig, readMd('headings/about.md')),
      }),
      buildCardGridBlock(),
    ],
    {
      title: 'About Zarif',
      description:
        'Background, approach, and technical loadout of Zarif, a systems engineer focused on backend architecture and integrations.',
    },
  )

  console.log('Seeding Projects page…')
  const projectsPage = await upsertPage(
    payload,
    '/projects',
    'Projects',
    [
      buildHeroBlock({
        kicker: 'Quests completed: 02',
        size: 'default',
        heading: mdToLexical(editorConfig, readMd('headings/projects.md')),
      }),
      buildCollectionListBlock({ source: 'projects' }),
    ],
    {
      title: 'Projects — Zarif',
      description:
        'Systems designed and integrations built: Sanity CMS migrations, GMS integrations, and TypeScript architectures.',
    },
  )

  console.log('Seeding Blog page…')
  const blogPage = await upsertPage(
    payload,
    '/blog',
    'Blog',
    [
      buildHeroBlock({
        kicker: 'Side A: Mixtape',
        size: 'default',
        heading: mdToLexical(editorConfig, readMd('headings/blog.md')),
      }),
      buildCollectionListBlock({ source: 'blogs' }),
    ],
    {
      title: 'Blog — Zarif',
      description:
        'Notes on architecture, TypeScript patterns, integration design, and lessons from building with modern CMS platforms.',
    },
  )

  console.log('Seeding Contact page…')
  const contactPage = await upsertPage(
    payload,
    '/contact',
    'Contact',
    [
      buildHeroBlock({
        kicker: null,
        size: 'default',
        heading: mdToLexical(editorConfig, readMd('headings/contact.md')),
      }),
      buildContactBlock(),
    ],
    {
      title: 'Contact Zarif',
      description:
        'Get in touch for consulting, systems architecture engagements, and integration work.',
    },
  )

  console.log('Seeding Now page…')
  const nowPage = await upsertPage(
    payload,
    '/now',
    'Now',
    [
      buildHeroBlock({
        kicker: 'Updated June 2025',
        size: 'default',
        heading: mdToLexical(editorConfig, readMd('headings/now.md')),
      }),
      buildEntryListBlock(),
    ],
    {
      title: 'Now — Zarif',
      description: 'What Zarif is working on, learning, building, and playing right now.',
    },
  )

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
      "Rebuilt the world's largest search marketing conference website. Replaced a loose WordPress setup with a Sanity + Next.js stack featuring a flexible page builder, a complex schedule table assembled from six levels of related data, and a personalized attendee agenda.",
    bodyFile: 'brightonseo.md',
    tags: ['Sanity', 'NextJS', 'Architecture'],
    techStack: ['Sanity', 'Next.js', 'TypeScript', 'Vercel', 'GROQ', 'Supabase'],
    outcomeStats: [
      { value: '15-20→2-3', label: 'Site Maintainers' },
      { value: '1 wk', label: 'Event Setup' },
    ],
    involvement: {
      role: 'Lead Developer & Architect',
      duration: '6 months',
      team: '5-person team',
    },
    keywords:
      'brightonSEO, conference website, Sanity CMS, Next.js, page builder, schedule table, GROQ, Supabase, event management',
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
    outcomeStats: [
      { value: 'Custom seat-picker', label: 'Booking UX' },
      { value: 'Self-serve', label: 'Content Updates' },
      { value: 'Cross-platform', label: 'Delivery' },
    ],
    involvement: {},
    keywords:
      'gym management system, GMS migration, Sanity CMS, Next.js, Flutter, NestJS, spot booking, class scheduling',
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
    involvement: {},
    draft: true,
    keywords: 'Mariana Tek, GMS integration, anonymous group booking, sauna, NestJS, Sanity CMS',
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
    keywords: 'Payload CMS, two-factor authentication, 2FA, OTP, auth system, TypeScript, security',
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
    keywords:
      'conceptual truncation, DRY principle, software principles, code duplication, software engineering philosophy',
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
    keywords:
      'client-side fetching, server-side fetching, SSR, Next.js, data fetching, performance, security',
  },
  {
    slug: 'building-schedule-table-groq-query',
    title: 'Building a Conference Schedule Table with One GROQ Query',
    trackNumber: 4,
    publishedDate: '2025-06-28',
    excerpt:
      'How a single GROQ query resolves six entity levels — Event, Day Schedule, Time Slot, Session, Talk, and Person — to build a conference schedule table, using conditional projection, dereferencing, and scope traversal.',
    bodyFile: 'building-schedule-table-groq-query.md',
    tags: ['Sanity', 'Architecture'],
    keywords:
      'GROQ, Sanity, schedule table, nested query, conditional projection, scope traversal, conference CMS',
  },
]
