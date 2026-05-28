import { APIError, type CollectionConfig } from 'payload'
import { fingerprint, fingerprintPerceptual } from '@/lib/fingerprint'
import { generateImagePlaceholder } from '@/lib/image-placeholder'
import { dataURLFieldCondition } from './utils'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Admin',
  },
  access: {
    read: () => true,
  },
  defaultPopulate: {
    alt: true,
    url: true,
    dataURL: true,
    width: true,
    height: true,
    filename: true,
    mimeType: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'hash',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'dataURL',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
        condition: dataURLFieldCondition,
      },
    },
  ],
  upload: true,
  hooks: {
    beforeChange: [
      // Remove `url` from data before saving
      ({ data }) => {
        delete data?.['url']

        return data
      },
    ],
    beforeValidate: [
      // Generate File Hash
      async ({ data, req, operation }) => {
        const payload = req.payload

        if (req.file) {
          let hash: string

          try {
            if (req.file.mimetype?.startsWith('image/')) {
              hash = await fingerprintPerceptual(req.file.data, req.file.mimetype)
            } else {
              hash = fingerprint(req.file.data)
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown Error'
            req.payload.logger.error(
              `[Media Hooks] Failed to generate hash for file. Error: ${message}`,
            )

            throw new APIError('Faied to validate hash', 400)
          }

          const queryResults = await payload.find({
            collection: 'media',
            where: {
              hash: {
                equals: hash,
              },
            },
            limit: 1,
            depth: 0,
          })

          // Prevent creation of new file if hash already exists
          if (queryResults.totalDocs > 0 && operation === 'create') {
            throw new APIError(`Media already exists. ID: ${queryResults.docs[0]?.id}`, 400)
          }

          return {
            ...data,
            hash,
          }
        }
      },
      // Generate a data URL for images and store it in the dataURL field
      async ({ data, req }) => {
        if (req.file && req.file.mimetype?.startsWith('image/')) {
          const dataURL = await generateImagePlaceholder(req.file.data)

          if (dataURL) {
            return {
              ...data,
              dataURL,
            }
          }
        }
      },
    ],
  },
}
