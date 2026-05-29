import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { Blogs } from './collections/Blogs'
import { Tags } from './collections/Tags'
import { SiteConfig } from './globals/site-config'
import { Layout } from './globals/layout'
import { ALL_PAGE_BLOCKS } from './blocks'
import { getURLPrefix } from '@/lib/relative-url'
import { customLexicalEditor } from './lib/lexical-editor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env['PAYLOAD_SECRET'] || '',
  db: mongooseAdapter({
    url: process.env['DATABASE_URL'] || '',
  }),
  editor: customLexicalEditor(),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    livePreview: {
      collections: ['pages'],
      globals: ['layout'],
      url: ({ data, collectionConfig }) => {
        const serverURL = process.env['NEXT_PUBLIC_SERVER_URL'] || 'http://localhost:3000'
        const secret = process.env['PREVIEW_SECRET']

        const rawSlug = getSlug(data, '/')
        const configSlug = getSlug(collectionConfig, 'pages')

        const prefix = getURLPrefix(configSlug)
        const slug = prefix + rawSlug

        return `${serverURL}/api/draft?secret=${secret}&slug=${slug}`
      },
    },
  },
  collections: [Users, Media, Pages, Projects, Blogs, Tags],
  globals: [SiteConfig, Layout],
  blocks: ALL_PAGE_BLOCKS,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [],
})

// Safely extract a `slug` string property from a Payload live preview callback argument.
function getSlug(obj: unknown, fallback: string): string {
  if (typeof obj !== 'object' || obj === null) {
    return fallback
  }

  if (!('slug' in obj)) {
    return fallback
  }

  const slug = obj['slug']

  if (typeof slug !== 'string') {
    return fallback
  }

  return slug
}
