import type { Link } from '@/payload-types'
import type { Condition, RelationshipField, RelationshipValue, TextField, Validate } from 'payload'

export const showURLField: Condition<{ id: string }, Link> = (_, siblingData) => {
  if (siblingData.type == 'external') {
    return true
  }

  return false
}

export const validateURLField: Validate<string, unknown, Link, TextField> = (
  val,
  { siblingData },
) => {
  const { type } = siblingData

  if (!val) {
    if (type === 'external') {
      return 'Required'
    }

    return true
  }

  if (/^mailto:.+@.+\..+/i.test(val)) {
    return true
  }
  if (/^tel:[+\d][\d\s().-]*$/i.test(val)) {
    return true
  }

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/

  return urlPattern.test(val) ? true : 'Please enter a valid URL'
}

export const showRelationshipField: Condition<{ id: string }, Link> = (_, siblingData) => {
  if (siblingData.type == 'internal') {
    return true
  }

  return false
}

export const validateReferenceField: Validate<
  RelationshipValue,
  unknown,
  Link,
  RelationshipField
> = (val, { siblingData }) => {
  const { type } = siblingData

  if (!val) {
    if (type === 'internal') {
      return 'Required'
    }
  }

  return true
}
