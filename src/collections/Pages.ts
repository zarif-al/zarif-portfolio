import type { CollectionConfig } from 'payload'
import { createSlugField } from '../fields/slug'
import { createBlocksTab } from '../tabs/blocks'
import { createLocalSeoTab } from '../tabs/seo/local'
import { draftModeAccess } from '../access/draft-mode-access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  folders: true,
  labels: {
    plural: 'Pages',
    singular: 'Page',
  },
  versions: {
    drafts: { autosave: true, validate: false },
  },
  admin: {
    enableRichTextRelationship: false,
    useAsTitle: 'title',
    group: 'Site',
  },
  access: {
    read: draftModeAccess,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The name of the page',
        position: 'sidebar',
      },
    },
    createSlugField,
    {
      type: 'tabs',
      tabs: [createBlocksTab({ excludeBlockSlugs: [] }), createLocalSeoTab()],
    },
  ],
}
