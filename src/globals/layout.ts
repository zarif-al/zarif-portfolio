import type { GlobalConfig } from 'payload'
import { createLinkField } from '../fields/link'
import { draftModeAccess } from '../access/draft-mode-access'

export const Layout: GlobalConfig = {
  slug: 'layout',
  versions: {
    drafts: {
      autosave: true,
      validate: false,
    },
  },
  admin: {
    group: 'Site',
  },
  access: {
    read: draftModeAccess,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'header',
          label: 'Header',
          interfaceName: 'IPayloadHeader',
          fields: [
            { name: 'title', type: 'text' },
            {
              name: 'links',
              type: 'array',
              labels: { singular: 'Nav Link', plural: 'Nav Links' },
              fields: [createLinkField()],
            },
          ],
        },
        {
          name: 'footer',
          label: 'Footer',
          interfaceName: 'IPayloadFooter',
          fields: [
            { name: 'copyright', type: 'text' },
            {
              name: 'links',
              type: 'array',
              labels: { singular: 'Link', plural: 'Links' },
              fields: [createLinkField()],
            },
          ],
        },
      ],
    },
  ],
}
