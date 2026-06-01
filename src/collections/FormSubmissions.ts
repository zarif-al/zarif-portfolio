import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    plural: 'Form Submissions',
    singular: 'Form Submission',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Inbox',
    defaultColumns: ['id', 'createdAt'],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // TODO: Uncomment once the `forms` collection is created
    // {
    //   name: 'form',
    //   type: 'relationship',
    //   relationTo: 'forms',
    // },
    {
      name: 'formData',
      type: 'array',
      required: true,
      fields: [
        { name: 'fieldName', type: 'text', required: true },
        { name: 'fieldValue', type: 'text', required: true },
      ],
    },
  ],
}
