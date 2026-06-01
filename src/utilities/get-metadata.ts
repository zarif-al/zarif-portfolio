import 'server-only'

import type { Metadata } from 'next'
import { notFound, redirect, RedirectType } from 'next/navigation'
import { getPayloadInstance } from '@/lib/payload'
import type { CollectionSlug } from 'payload'
import { resolveMedia } from './resolve-media'
import { getURLPrefix } from '@/lib/relative-url'

interface IGetMetadataArgs {
  collectionSlug: Extract<CollectionSlug, 'pages' | 'projects' | 'blogs'>
  pageSlug: string
  draft: boolean
}

export async function getMetadata({
  collectionSlug,
  pageSlug,
  draft,
}: IGetMetadataArgs): Promise<Metadata> {
  const serverURL = process.env['NEXT_PUBLIC_URL']

  if (!serverURL) {
    throw new Error('Invalid configuration: Missing NEXT_PUBLIC_SERVER_URL')
  }

  const payload = await getPayloadInstance()

  const pageResults = await payload.find({
    collection: collectionSlug,
    where: draft
      ? { slug: { equals: pageSlug } }
      : { and: [{ slug: { equals: pageSlug } }, { _status: { not_equals: 'draft' } }] },
    select: {
      localSeoTab: true,
    },
    limit: 1,
    draft,
  })

  const pageData = pageResults.docs[0]

  if (!pageData) {
    notFound()
  }

  const siteConfig = await payload.findGlobal({
    slug: 'siteConfig',
    select: {
      globalSeoTab: true,
    },
    draft,
  })

  const globalSEO = siteConfig.globalSeoTab

  const { localSeoTab } = pageData

  if (!localSeoTab) {
    notFound()
  }

  const {
    title,
    description,
    cannoical,
    redirect: redirectURL,
    image: pageImage,
    robotsConfig: pageRobotsConfig,
    keywords,
  } = localSeoTab

  if (redirectURL) {
    return redirect(redirectURL, RedirectType.replace)
  }

  const globalRobotsConfig = globalSEO?.robotsConfig

  const disableIndexing = globalRobotsConfig?.disableIndex ?? pageRobotsConfig?.disableIndex
  const disableFollow = globalRobotsConfig?.disableFollow ?? pageRobotsConfig?.disableFollow
  const disableImageIndexing =
    globalRobotsConfig?.disableImageIndex ?? pageRobotsConfig?.disableImageIndex
  const disableSnippet = globalRobotsConfig?.disableSnippet ?? pageRobotsConfig?.disableSnippet

  const openGraphImages: { url: string; alt: string }[] = []

  const extractedPageImage = resolveMedia(pageImage)
  const extractedGlobalImage = resolveMedia(globalSEO?.image)

  if (extractedPageImage && extractedPageImage.type == 'image') {
    openGraphImages.push({
      alt: extractedPageImage.alt || title || '',
      url: extractedPageImage.url,
    })
  }

  if (extractedGlobalImage && extractedGlobalImage.type == 'image') {
    openGraphImages.push({ alt: extractedGlobalImage.alt, url: extractedGlobalImage.url })
  }

  const pageURL = getURLPrefix(collectionSlug) + pageSlug

  return {
    metadataBase: new URL(serverURL),
    title: title,
    description: description || '',
    openGraph: {
      title: title || '',
      description: description || '',
      images: openGraphImages,
      url: pageURL,
    },
    alternates: { canonical: cannoical || pageURL },
    robots: {
      index: !disableIndexing,
      follow: !disableFollow,
      noimageindex: disableImageIndexing ?? undefined,
      nosnippet: disableSnippet ?? undefined,
    },
    keywords: keywords || '',
  }
}
