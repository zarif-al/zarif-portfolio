import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  buildHeader,
  buildFooter,
  buildHeroBlock,
  buildTerminalBlock,
  buildRichtextBlock,
  buildCardGridBlock,
  buildCollectionListBlock,
  buildContactBlock,
  buildEntryListBlock,
} from './data'
import { upsertPage } from './helpers'

async function seed() {
  const payload = await getPayload({ config: configPromise })

  // Pass 1: seed pages
  console.log('Seeding Home page…')
  const homePage = await upsertPage(payload, '/', 'Home', [
    buildHeroBlock({ showEqualizer: true }),
    buildTerminalBlock(),
    buildRichtextBlock(),
  ])

  console.log('Seeding About page…')
  const aboutPage = await upsertPage(payload, '/about', 'About', [
    buildHeroBlock({
      kicker: '01 / About',
      heading: createAboutHeading(),
      showEqualizer: false,
    }),
    buildCardGridBlock(),
  ])

  console.log('Seeding Projects page…')
  const projectsPage = await upsertPage(payload, '/projects', 'Projects', [
    buildHeroBlock({
      kicker: 'Quests completed: 05',
      heading: createProjectsHeading(),
      showEqualizer: false,
    }),
    buildCollectionListBlock({ source: 'projects' }),
  ])

  console.log('Seeding Blog page…')
  const blogPage = await upsertPage(payload, '/blog', 'Blog', [
    buildHeroBlock({
      kicker: 'Side A — Mixtape',
      heading: createBlogHeading(),
      showEqualizer: false,
    }),
    buildCollectionListBlock({ source: 'blogs' }),
  ])

  console.log('Seeding Contact page…')
  const contactPage = await upsertPage(payload, '/contact', 'Contact', [
    buildHeroBlock({
      kicker: null,
      heading: createContactHeading(),
      showEqualizer: false,
    }),
    buildContactBlock(),
  ])

  console.log('Seeding Now page…')
  const nowPage = await upsertPage(payload, '/now', 'Now', [
    buildHeroBlock({
      kicker: 'Updated May 2026',
      heading: createNowHeading(),
      showEqualizer: false,
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

// ── Rich text helpers ──

function createAboutHeading() {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'heading' as const,
          tag: 'h2' as const,
          children: [
            {
              type: 'text' as const,
              text: 'Engineer at the intersection of systems and business.',
              version: 1,
            } as const,
          ],
          direction: null,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: null,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function createProjectsHeading() {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'heading' as const,
          tag: 'h2' as const,
          children: [
            {
              type: 'text' as const,
              text: "Systems I've designed, integrations I've built.",
              version: 1,
            } as const,
          ],
          direction: null,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: null,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function createBlogHeading() {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'heading' as const,
          tag: 'h2' as const,
          children: [
            {
              type: 'text' as const,
              text: 'Notes on architecture, TypeScript patterns, and integration design.',
              version: 1,
            } as const,
          ],
          direction: null,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: null,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function createContactHeading() {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'heading' as const,
          tag: 'h2' as const,
          children: [
            {
              type: 'text' as const,
              text: 'Get in touch.',
              version: 1,
            } as const,
          ],
          direction: null,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: null,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function createNowHeading() {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'heading' as const,
          tag: 'h2' as const,
          children: [
            {
              type: 'text' as const,
              text: "What I'm focused on right now.",
              version: 1,
            } as const,
          ],
          direction: null,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: null,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}
