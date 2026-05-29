import type { CollectionConfig } from 'payload'
import { createSlugField } from '../fields/slug'
import { createLocalSeoTab } from '../tabs/seo/local'
import { draftModeAccess } from '../access/draft-mode-access'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  labels: {
    plural: 'Blog Posts',
    singular: 'Blog Post',
  },
  versions: {
    drafts: { autosave: true, validate: false },
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
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
        position: 'sidebar',
      },
    },
    createSlugField,
    {
      type: 'tabs',
      tabs: [
        createLocalSeoTab(),
        {
          name: 'meta',
          label: 'Meta',
          fields: [
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
            {
              name: 'trackNumber',
              type: 'number',
            },
            {
              name: 'publishedDate',
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayOnly' } },
            },
            {
              name: 'excerpt',
              type: 'text',
              required: true,
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
