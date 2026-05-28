import { getPayload } from 'payload'
import type {
  HeroBlock,
  RichtextBlock,
  TerminalBlockBlock,
  CardGridBlock,
  CollectionListBlock,
  ContactBlock,
  EntryListBlock,
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
