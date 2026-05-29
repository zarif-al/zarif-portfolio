import { getPayload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import type { SanitizedServerEditorConfig } from '@payloadcms/richtext-lexical'
import type { SanitizedConfig } from 'payload'
import type {
  HeroBlock,
  RichtextBlock,
  TerminalBlockBlock,
  CardGridBlock,
  CollectionListBlock,
  ContactBlock,
  EntryListBlock,
  EqualizerBlock,
  Page,
} from '@/payload-types'

type AnyBlock =
  | HeroBlock
  | RichtextBlock
  | TerminalBlockBlock
  | CardGridBlock
  | CollectionListBlock
  | ContactBlock
  | EntryListBlock
  | EqualizerBlock

/**
 * Creates or updates a Page document in the CMS.
 * If a page with the given slug already exists it is updated in place;
 * otherwise a new published page is created.
 */
export async function upsertPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  title: string,
  blocks: AnyBlock[],
): Promise<Page> {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (existing.totalDocs > 0 && existing.docs[0]) {
    return payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: { title, slug, blocksTab: { blocks } },
    })
  }

  return payload.create({
    collection: 'pages',
    data: {
      title,
      slug,
      blocksTab: { blocks },
      localSeoTab: {
        robotsConfig: {
          disableIndex: false,
          disableFollow: false,
          disableImageIndex: false,
          disableSnippet: false,
        },
      },
      _status: 'published',
    },
    draft: false,
  })
}

/**
 * Reads a markdown file from the seed content directory.
 * Returns a function that accepts an editor config and converts to lexical.
 */
export function readMd(filename: string): string {
  return readFileSync(resolve(import.meta.dirname, 'content', filename), 'utf-8')
}

/**
 * Converts a markdown string to Payload-compatible lexical rich text.
 */
export function mdToLexical(editorConfig: SanitizedServerEditorConfig, md: string) {
  return convertMarkdownToLexical({ editorConfig, markdown: md })
}

/** Resolves the sanitized server editor config from the default lexical editor. */
export async function getEditorConfig(config: SanitizedConfig) {
  return editorConfigFactory.default({ config })
}
