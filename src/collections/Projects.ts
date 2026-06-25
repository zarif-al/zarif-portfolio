import type { CollectionConfig } from 'payload'
import { createSlugField } from '../fields/slug'
import { createLocalSeoTab } from '../tabs/seo/local'
import { draftModeAccess } from '../access/draft-mode-access'
import { customLexicalEditor } from '../lib/lexical-editor'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    plural: 'Projects',
    singular: 'Project',
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
              name: 'techStack',
              type: 'text',
              hasMany: true,
            },
            {
              name: 'description',
              type: 'text',
              required: true,
            },
            {
              name: 'kicker',
              type: 'text',
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
              editor: customLexicalEditor({ codeBlock: true }),
            },
            {
              name: 'outcomeStats',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
