import type { Field } from 'payload'

export function createSchemaMarkupField(context: 'global' | 'page'): Field {
  return {
    name: 'schemaMarkup',
    type: 'array',
    label: 'Schema Markup',
    interfaceName: 'SchemaMarkup',
    admin: {
      description:
        context == 'page'
          ? 'Add structured data to help search engines understand the content of your page.'
          : 'Add structured data to help search engines understand the content of your site. These will be applied to all pages.',
    },
    fields: [
      {
        type: 'json',
        name: 'jsonLD',
        label: 'JSON-LD',
        required: true,
      },
    ],
  }
}
