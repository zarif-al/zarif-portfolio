interface FeatureWithKey {
  key: string
}

export function hasKey(value: unknown): value is FeatureWithKey {
  return typeof value === 'object' && value !== null && 'key' in value
}
