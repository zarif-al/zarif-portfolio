import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayloadInstance } from '@/lib/payload'
import { RenderBlocks } from '@/components/blocks'
import type { Metadata } from 'next'
import { getMetadata } from '@/utilities/get-metadata'

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
    select: { blocksTab: true },
  })

  const page = pages.docs[0]

  if (!page || pages.totalDocs === 0) {
    notFound()
  }

  return <RenderBlocks blocks={page.blocksTab?.blocks} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()

  const { slug } = await params

  const pageSlug = slug?.length ? `/${slug.join('/')}` : '/'

  return await getMetadata({
    collectionSlug: 'pages',
    draft,
    pageSlug,
  })
}

export async function generateStaticParams() {
  const payload = await getPayloadInstance()

  const { docs } = await payload.find({
    collection: 'pages',
    pagination: false,
    select: { slug: true },
  })

  return docs.map((doc) => {
    const segments = doc.slug === '/' ? [] : doc.slug.replace(/^\//, '').split('/')
    return { slug: segments }
  })
}
