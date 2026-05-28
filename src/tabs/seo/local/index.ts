import type { Tab, TextField, ValidateOptions } from 'payload'
import { text } from 'payload/shared'
import { AutoGenerateLabelComponent } from '../../../components/admin/auto-generate-label'
import { createRobotsConfigurationField } from '../common/robots-config'
import { createSchemaMarkupField } from '../common/schema-markup'
import { isValidUrl } from '@/utilities/validation/is-valid-url'
import { createAfterReadHook } from './utils'

/**
 * This function returns a tab object with SEO fields. The title and description fields have
 * auto generate functionalities based on source paths.
 *
 * The `title` field will fallback to the document's `title` field if nothing is provided.
 * The `description` field does not have a fallback.
 *
 * If there is not data in the source paths the auto generate button will not be displayed.
 *
 * Fallback Logic:
 * We are using the `afterRead` hook to return fallback values for `title` and `description` fields.
 * But we have to be careful not to override the database. So we use a `user` check to
 * see if the request is coming from the admin panel or the front end.
 *
 * @param descriptionSourcePath: string
 * @param titleSourcePathOverride: string (optional) fallback `title`
 */
export function createLocalSeoTab(
  descriptionSourcePath?: string,
  titleSourcePathOverride?: string,
): Tab {
  return {
    name: 'localSeoTab',
    label: 'SEO',
    interfaceName: 'LocalSeoTab',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',

        admin: {
          description:
            'SEO title for this page. If not provided, it will fall back to a suitable document property (e.g., the page title)',
          components: {
            Label: AutoGenerateLabelComponent({
              type: 'text',
              sourcePath: titleSourcePathOverride || 'title',
              contentType: 'text',
            }),
          },
        },
        hooks: {
          afterRead: [createAfterReadHook('title')],
        },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',

        admin: {
          description: 'SEO description for this page.',
          components: {
            Label: AutoGenerateLabelComponent({
              type: 'textarea',
              ...(descriptionSourcePath ? { sourcePath: descriptionSourcePath } : {}),
              contentType: 'text',
            }),
          },
        },
        hooks: {
          afterRead: [createAfterReadHook('description')],
        },
      },
      {
        name: 'image',
        label: 'Image',
        type: 'upload',
        relationTo: 'media',
        filterOptions: { mimeType: { contains: 'image/' } },
        admin: {
          description: "Open Graph image for this page's URL.",
        },
      },
      {
        name: 'cannoical',
        type: 'text',
        label: 'Canonical URL',
        admin: {
          description: 'If not provided it will be a self-referencing URL.',
        },
      },
      {
        name: 'redirect',
        type: 'text',
        label: 'Redirect',
        admin: {
          description: 'Redirect URL for this page. Please start with https://',
        },
        validate: (
          value: string | null | undefined,
          ctx: ValidateOptions<unknown, unknown, TextField, string>,
        ) => {
          if (value) {
            if (!isValidUrl(value, ['https'])) {
              return 'Invalid URL'
            } else {
              return text(value, ctx)
            }
          } else {
            return text(value, ctx)
          }
        },
      },
      {
        label: 'Keywords',
        name: 'keywords',
        type: 'text',
      },
      createRobotsConfigurationField('page'),
      createSchemaMarkupField('page'),
    ],
  }
}
