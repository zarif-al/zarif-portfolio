import type { CollectionConfig } from 'payload'
import { draftModeAccess } from '../access/draft-mode-access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    plural: 'Tags',
    singular: 'Tag',
  },
  admin: {
    useAsTitle: 'label',
    group: 'Content',
  },
  access: {
    read: draftModeAccess,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
  ],
}
