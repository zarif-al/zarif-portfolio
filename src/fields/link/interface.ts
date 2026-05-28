import type { GroupField } from 'payload'

export interface LinkFieldConfig {
  name?: string
  label?: string
  admin?: GroupField['admin']
}
