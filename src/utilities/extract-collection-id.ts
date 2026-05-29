/**
 * Extract the ID from a Payload relationship value — either a raw string ID
 * or a populated document object with an `id` field.
 */
export function extractCollectionId<T extends { id: string }>(item: string | T): string {
  if (typeof item === 'string') {
    return item
  }
  return item.id
}
