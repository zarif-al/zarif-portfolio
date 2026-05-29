/** Extracts a tag label from a Payload relationship — may be a string ID or a populated object. */
export function getTagLabel(tag: unknown): string {
  if (typeof tag === 'string') {
    return ''
  }

  if (typeof tag === 'object' && tag !== null && 'label' in tag) {
    const label = tag.label
    return typeof label === 'string' ? label : ''
  }

  return ''
}
