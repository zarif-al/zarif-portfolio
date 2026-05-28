import type {
  HeroBlock,
  CtaBlock,
  RichtextBlock,
  IPayloadHeader,
  IPayloadFooter,
  Page,
} from '@/payload-types'

// ── Layout ──

/**
 * Builds the header for the Layout global.
 * Internal links reference seeded pages by ID; external links use full URLs.
 */
export function buildHeader(pages: { '/': Page; '/about': Page }): IPayloadHeader {
  return {
    title: 'Payload Template',
    links: [
      {
        link: {
          type: 'internal',
          label: 'Home',
          reference: { relationTo: 'pages', value: pages['/'].id },
        },
      },
      {
        link: {
          type: 'internal',
          label: 'About',
          reference: { relationTo: 'pages', value: pages['/about'].id },
        },
      },
      { link: { type: 'external', label: 'Contact', url: 'https://example.com/contact' } },
    ],
  }
}

/**
 * Builds the footer for the Layout global.
 * Internal links reference seeded pages by ID; external links use full URLs.
 */
export function buildFooter(pages: { '/': Page; '/about': Page }): IPayloadFooter {
  return {
    copyright: `© ${new Date().getFullYear()} Payload Template. All rights reserved.`,
    columns: [
      {
        heading: 'Product',
        links: [
          { link: { type: 'external', label: 'Features', url: 'https://example.com/features' } },
          { link: { type: 'external', label: 'Pricing', url: 'https://example.com/pricing' } },
          { link: { type: 'external', label: 'Docs', url: 'https://example.com/docs' } },
        ],
      },
      {
        heading: 'Company',
        links: [
          {
            link: {
              type: 'internal',
              label: 'About',
              reference: { relationTo: 'pages', value: pages['/about'].id },
            },
          },
          { link: { type: 'external', label: 'Blog', url: 'https://example.com/blog' } },
          { link: { type: 'external', label: 'Contact', url: 'https://example.com/contact' } },
        ],
      },
    ],
  }
}

// ── Blocks ──

/**
 * Builds a Hero block with lorem ipsum content.
 * Accepts a partial override to customize any field (e.g., overline, title).
 */
export function buildHeroBlock(override: Partial<HeroBlock> = {}): HeroBlock {
  return {
    blockType: 'hero',
    overline: 'Overline text',
    title: 'Lorem ipsum dolor sit amet consectetur',
    description:
      'Adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.',
    ctas: [
      { link: { type: 'external', label: 'Get started', url: 'https://example.com' } },
      { link: { type: 'external', label: 'Learn more', url: 'https://example.com' } },
    ],
    ...override,
  }
}

/**
 * Builds a CTA (call-to-action) block with lorem ipsum content.
 * Accepts a partial override to customize any field (e.g., title, description).
 */
export function buildCtaBlock(override: Partial<CtaBlock> = {}): CtaBlock {
  return {
    blockType: 'cta',
    title: 'Ready to get started?',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    ctas: [{ link: { type: 'external', label: 'Contact us', url: 'https://example.com' } }],
    ...override,
  }
}

/**
 * Builds a Richtext block with lorem ipsum body text.
 * Accepts a partial override to customize any field (e.g., heading, content).
 * The content is generated as a valid Lexical serialized state with a single paragraph.
 */
export function buildRichtextBlock(override: Partial<RichtextBlock> = {}): RichtextBlock {
  return {
    blockType: 'richtext',
    heading: 'About this project',
    content: createRichText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ),
    ...override,
  }
}

// ── Lexical ──

/**
 * Creates a minimal valid Lexical serialized editor state containing a single paragraph.
 * Used to seed rich text fields with plain text content.
 */
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
