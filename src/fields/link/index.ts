import type { GroupField } from 'payload'
import {
  showRelationshipField,
  showURLField,
  validateReferenceField,
  validateURLField,
} from './utils'
import type { LinkFieldConfig } from './interface'

export const createLinkField = (config: LinkFieldConfig = {}): GroupField => {
  return {
    name: config.name ?? 'link',
    ...(config.label ? { label: config.label } : {}),
    type: 'group',
    interfaceName: 'Link',
    admin: {
      hideGutter: true,
      ...config.admin,
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          // Content
          {
            label: 'Content',
            fields: [
              { name: 'label', type: 'text' },
              {
                name: 'type',
                type: 'radio',
                options: [
                  { label: 'External', value: 'external' },
                  { label: 'Internal', value: 'internal' },
                ],
                defaultValue: 'external',
                required: true,
              },
              {
                name: 'url',
                type: 'text',
                validate: validateURLField,
                admin: { condition: showURLField },
              },
              {
                name: 'reference',
                type: 'relationship',
                relationTo: ['pages'],
                validate: validateReferenceField,
                admin: { condition: showRelationshipField },
              },
            ],
          },
        ],
      },
    ],
  }
}
