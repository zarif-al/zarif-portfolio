import type { Field } from 'payload'
import { validateSlug } from './utils'

export const createSlugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  label: 'Slug',
  index: true,
  validate: validateSlug,
  hooks: {
    beforeValidate: [
      ({ value }) => {
        if (!value || typeof value !== 'string') {
          return ''
        }

        let cleaned = value
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/[\\,]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-{2,}/g, '-')

        if (!cleaned.startsWith('/')) {
          cleaned = '/' + cleaned
        }

        return cleaned
      },
    ],
  },
  admin: {
    position: 'sidebar',
    description:
      "The slug is used in the URL for this page. It's recommended to keep it short and descriptive.",
  },
}
