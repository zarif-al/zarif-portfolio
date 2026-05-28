import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayloadInstance } from '@/lib/payload'
import { RenderBlocks } from '@/components/blocks'

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayloadInstance()

  const pageSlug = slug?.length ? `/${slug.join('/')}` : '/'

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: pageSlug } },
    limit: 1,
    draft: isDraftMode,
  })

  const page = pages.docs[0]

  if (!page || pages.totalDocs === 0) {
    notFound()
  }

  return <RenderBlocks blocks={page.blocksTab?.blocks} />
}
