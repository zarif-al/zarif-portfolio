import type {
  HeroBlock,
  RichtextBlock,
  TerminalBlockBlock,
  CardGridBlock,
  CollectionListBlock,
  ContactBlock,
  EntryListBlock,
  IPayloadHeader,
  IPayloadFooter,
  Page,
} from '@/payload-types'

// ── Layout ──

/**
 * Builds the header for the Layout global.
 */
export function buildHeader(pages: {
  '/': Page
  '/about': Page
  '/projects': Page
  '/blog': Page
  '/contact': Page
  '/now': Page
}): IPayloadHeader {
  return {
    title: 'zarif',
    links: [
      {
        link: {
          type: 'internal',
          label: 'About',
          reference: { relationTo: 'pages', value: pages['/about'].id },
        },
      },
      {
        link: {
          type: 'internal',
          label: 'Projects',
          reference: { relationTo: 'pages', value: pages['/projects'].id },
        },
      },
      {
        link: {
          type: 'internal',
          label: 'Blog',
          reference: { relationTo: 'pages', value: pages['/blog'].id },
        },
      },
      {
        link: {
          type: 'internal',
          label: 'Contact',
          reference: { relationTo: 'pages', value: pages['/contact'].id },
        },
      },
      {
        link: {
          type: 'internal',
          label: 'Now',
          reference: { relationTo: 'pages', value: pages['/now'].id },
        },
      },
    ],
  }
}

/**
 * Builds the footer for the Layout global.
 */
export function buildFooter(_pages: {
  '/': Page
  '/about': Page
  '/projects': Page
  '/blog': Page
  '/contact': Page
  '/now': Page
}): IPayloadFooter {
  return {
    copyright: `~/zarif $`,
    links: [
      { link: { type: 'external', label: 'GitHub', url: 'https://github.com/zarif' } },
      {
        link: { type: 'external', label: 'LinkedIn', url: 'https://linkedin.com/in/zarif' },
      },
      { link: { type: 'external', label: 'hi@zarif.dev', url: 'mailto:hi@zarif.dev' } },
    ],
  }
}

// ── Blocks ──

export function buildHeroBlock(override: Partial<HeroBlock> = {}): HeroBlock {
  return {
    blockType: 'hero',
    kicker: 'Systems Engineer · Integration Specialist',
    heading: createHeroHeading(),
    showEqualizer: true,
    ...override,
  }
}

export function buildTerminalBlock(override: Partial<TerminalBlockBlock> = {}): TerminalBlockBlock {
  return {
    blockType: 'terminal-block',
    lines: [
      { type: 'command', command: 'whoami', indent: false },
      {
        type: 'output',
        output: 'zarif — systems engineer. code, games, music. in that order, or all at once.',
        indent: true,
      },
      { type: 'command', command: 'cat ~/stack.txt', indent: false },
      {
        type: 'output',
        output:
          'TypeScript · Node.js · Next.js · NestJS · Payload CMS · Sanity · PostgreSQL · Redis · Docker',
        indent: true,
      },
      { type: 'command', command: 'cat ~/.focus', indent: false },
      {
        type: 'output',
        output:
          'Building resilient integration layers. Making systems talk to each other. Keeping it simple',
        indent: true,
      },
    ],
    systemNodes: [
      { label: 'NestJS' },
      { label: 'Payload CMS' },
      { label: 'Sanity' },
      { label: 'Next.js' },
      { label: 'TypeScript' },
    ],
    nowPlaying: { track: 'Bonobo — Black Sands' },
    ...override,
  }
}

export function buildRichtextBlock(override: Partial<RichtextBlock> = {}): RichtextBlock {
  return {
    blockType: 'richtext',
    content: createRichText(
      "I build the connective tissue between platforms — APIs that talk to each other, CMS backends that editors actually enjoy using, and TypeScript architectures that stay maintainable as they grow. When I'm not in an editor, I'm probably deep in a game world or rebuilding my music library. My work lives where a clear data model meets a real business need — and I bring the same obsessive attention to both.",
    ),
    ...override,
  }
}

export function buildCardGridBlock(override: Partial<CardGridBlock> = {}): CardGridBlock {
  return {
    blockType: 'card-grid',
    numberedCards: {
      heading: 'What I build',
      cards: [
        {
          title: 'API Design & Architecture',
          description:
            'REST, GraphQL, event-driven systems — contracts that survive the first production deploy.',
        },
        {
          title: 'CMS Integration',
          description:
            'Payload, Sanity, structured content pipelines — turning editorial workflows into type-safe APIs.',
        },
        {
          title: 'Data Modeling',
          description:
            'PostgreSQL, Prisma, migration strategy — schema that reflects the domain, not the ORM.',
        },
        {
          title: 'System Interop',
          description:
            "Webhooks, message queues, reconciliation — making systems that weren't meant to talk actually communicate.",
        },
      ],
    },
    cells: [
      {
        heading: 'Background',
        content: createRichText(
          "I'm Zarif — a software engineer focused on high-level systems design and integrations. I work across the full stack but my gravity is on the backend: API design, data modeling, CMS architecture, and making disparate systems interoperate. Outside of code, I'm deep into video games (strategy, RPGs, anything with good systems) and music (Bonobo, Four Tet, Floating Points — the kind of stuff you can code to for hours).",
        ),
        span: 'half',
        type: 'text',
      },
      {
        heading: 'Approach',
        content: createRichText(
          'I start with the business problem, not the technology. What data needs to move? Who needs to edit it? What breaks if this goes down? From there I work backward to architecture — choosing the right abstractions, keeping the surface area small, and writing code that the next engineer can understand in ten minutes. Same philosophy I bring to games: understand the system, then optimize.',
        ),
        span: 'half',
        type: 'text',
      },
      {
        heading: 'Loadout',
        span: 'half',
        type: 'stack',
        stackItems: [
          { label: 'TypeScript' },
          { label: 'Node.js' },
          { label: 'Next.js' },
          { label: 'NestJS' },
          { label: 'Payload CMS' },
          { label: 'Sanity' },
          { label: 'PostgreSQL' },
          { label: 'Redis' },
          { label: 'Docker' },
          { label: 'REST / GraphQL' },
          { label: 'Tailwind' },
          { label: 'Prisma' },
        ],
        stackFootnote: 'Rust, Kafka, edge compute',
      },
    ],
    ...override,
  }
}

export function buildCollectionListBlock(
  override: Partial<CollectionListBlock> = {},
): CollectionListBlock {
  return {
    blockType: 'collection-list',
    source: 'projects',
    ...override,
  }
}

export function buildContactBlock(override: Partial<ContactBlock> = {}): ContactBlock {
  return {
    blockType: 'contact',
    infoHeading: 'Contact',
    infoDescription: createRichText(
      "I'm available for consulting, systems architecture engagements, and integration work. If you have a business problem that needs a technical system designed around it — or if you just want to talk about TypeScript architecture — reach out.",
    ),
    email: 'hi@zarif.dev',
    ...override,
  }
}

export function buildEntryListBlock(override: Partial<EntryListBlock> = {}): EntryListBlock {
  return {
    blockType: 'entry-list',
    entries: [
      {
        label: 'Work',
        title: 'Designing a multi-region CMS deployment for a SaaS client',
        description:
          'Scoping edge-cached content delivery across three regions with Payload CMS, making sure editorial workflows stay fast regardless of where editors are located.',
      },
      {
        label: 'Learning',
        title: 'Rust for systems-level tooling',
        description:
          'Building small CLI utilities in Rust to sharpen my understanding of memory management and concurrency — skills that feed back into how I design Node.js services.',
      },
      {
        label: 'Side Project',
        title: 'An open-source TypeScript event bus',
        description:
          'A lightweight, type-safe event bus for Node.js with first-class TypeScript inference. Mostly scratching my own itch around typed event patterns in NestJS.',
      },
      {
        label: 'Reading',
        title: 'Designing Data-Intensive Applications (re-read)',
        description:
          'Every time I re-read Kleppmann I find something new. This time: the chapter on replication is directly informing the multi-region CMS work.',
      },
    ],
    ...override,
  }
}

// ── Lexical ──

export function createRichText(text: string) {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph' as const,
          children: [
            {
              type: 'text' as const,
              text,
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

/**
 * Creates the hero heading Lexical state with italic and accent-colored text.
 * Renders: "I design systems\nthat <em>solve business problems.</em>"
 */
export function createHeroHeading() {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph' as const,
          children: [
            {
              type: 'text' as const,
              text: 'I design systems',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            } as const,
            { type: 'linebreak', version: 1 },
            {
              type: 'text' as const,
              text: 'that ',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            } as const,
            {
              type: 'text' as const,
              text: 'solve business problems.',
              format: 2,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
              $: { color: 'accent' },
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
