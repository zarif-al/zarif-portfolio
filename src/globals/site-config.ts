import type { GlobalConfig } from 'payload'
import { createGlobalSeoTab } from '../tabs/seo/global'

export const SiteConfig: GlobalConfig = {
  label: 'Site Config',
  slug: 'siteConfig',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        createGlobalSeoTab,
        {
          name: 'tracking',
          label: 'Tracking',
          fields: [
            {
              name: 'googleTagManagerID',
              label: 'Google Tag Manager ID',
              type: 'text',
              required: false,
              validate: (value: string | null | undefined) => {
                // Allow empty since not required
                if (!value) {
                  return true
                }

                const gtmPattern = /^GTM-[A-Z0-9]+$/

                if (!gtmPattern.test(value)) {
                  return 'Invalid Google Tag Manager ID format. Expected format: GTM-XXXXXXX (e.g., GTM-XXXXXX7)'
                }

                return true
              },
            },
          ],
        },
      ],
    },
  ],
}
