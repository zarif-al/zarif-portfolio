import type { Tab } from 'payload'
import { createRobotsConfigurationField } from '../common/robots-config'
import { createSchemaMarkupField } from '../common/schema-markup'

export const createGlobalSeoTab: Tab = {
  name: 'globalSeoTab',
  label: 'SEO',
  interfaceName: 'GlobalSeoTab',
  fields: [
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: {
        description: 'Default Open Graph image for the site.',
      },
    },
    createRobotsConfigurationField('global'),
    createSchemaMarkupField('global'),
  ],
}
