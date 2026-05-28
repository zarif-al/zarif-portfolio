// ---- Discriminated union per media type ----
//
// All media (images, videos, files) live in a single `media` collection.
// These types let consumers switch on `.type` to render the correct component
// (e.g. `<Image>` for images, `<video>` for video, a download link for files).

interface ResolvedMediaBase {
  url: string
  mimeType: string
}

export interface ResolvedImage extends ResolvedMediaBase {
  type: 'image'
  alt: string
  width: number
  height: number
  /** Low-res base64 blur placeholder */
  dataURL?: string
}

export interface ResolvedVideo extends ResolvedMediaBase {
  type: 'video'
  width: number | null
  height: number | null
}

export interface ResolvedFile extends ResolvedMediaBase {
  type: 'file'
  filename: string | null
}

export type ResolvedMedia = ResolvedImage | ResolvedVideo | ResolvedFile
