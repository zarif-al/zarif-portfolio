import type { TextFieldValidation } from 'payload'
import { text } from 'payload/shared'

export const validateSlug: TextFieldValidation = (value, args) => {
  if (!value) {
    return text(value, args)
  }

  if (!value.startsWith('/')) {
    return 'Slug must start with a leading slash (e.g., /paris)'
  }

  if (/[A-Z\s&\\,]/.test(value)) {
    return 'Slug contains invalid characters: capital letters, spaces, &, \\, or commas'
  }

  return text(value, args)
}
