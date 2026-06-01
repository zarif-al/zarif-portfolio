'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

interface ContactFormInput {
  name: string
  email: string
  message: string
}

export async function submitContact(data: ContactFormInput) {
  const payload = await getPayload({ config })

  const formData = [
    { fieldName: 'name', fieldValue: data.name.trim() },
    { fieldName: 'email', fieldValue: data.email.trim() },
    { fieldName: 'message', fieldValue: data.message.trim() },
  ]

  await payload.create({
    collection: 'form-submissions',
    data: { formData },
    overrideAccess: true,
  })

  return { success: true as const }
}
