import type { ResolvedFile, ResolvedImage, ResolvedMedia, ResolvedVideo } from './types'

export function isImage(media: ResolvedMedia | null | undefined): media is ResolvedImage {
  return media?.type === 'image'
}

export function isVideo(media: ResolvedMedia | null | undefined): media is ResolvedVideo {
  return media?.type === 'video'
}

export function isFile(media: ResolvedMedia | null | undefined): media is ResolvedFile {
  return media?.type === 'file'
}
