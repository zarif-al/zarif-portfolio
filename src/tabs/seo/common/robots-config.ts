import type { Field } from 'payload'

export function createRobotsConfigurationField(context: 'global' | 'page'): Field {
  return {
    label: 'Robots Configuration',
    name: 'robotsConfig',
    type: 'group',
    admin: {
      hideGutter: true,
      description:
        context == 'page'
          ? 'Configure how search engines interact with this page.'
          : 'Override robot configuration for all pages on the site.',
    },
    fields: [
      {
        name: 'disableIndex',
        type: 'checkbox',
        label: 'Disable Search Indexing',
        admin: {
          description: 'Turn ON to prevent this page from showing up in search engine results.',
        },
        required: true,
        defaultValue: context == 'global' ? true : false,
      },
      {
        name: 'disableFollow',
        type: 'checkbox',
        label: 'Disable Link Follow',
        admin: {
          description: 'Turn ON to prevent search engines from following links on this page.',
        },
        required: true,
        defaultValue: context == 'global' ? true : false,
      },
      {
        name: 'disableImageIndex',
        type: 'checkbox',
        label: 'Disable Image Indexing',
        admin: {
          description: 'Turn ON to prevent search engines from indexing images on this page.',
        },
        required: true,
        defaultValue: context == 'global' ? true : false,
      },
      {
        name: 'disableSnippet',
        type: 'checkbox',
        label: 'Disable Snippet',
        admin: {
          description:
            'Turn ON to prevent search engines from displaying a snippet of this page in search results.',
        },
        required: true,
        defaultValue: context == 'global' ? true : false,
      },
    ],
  }
}
