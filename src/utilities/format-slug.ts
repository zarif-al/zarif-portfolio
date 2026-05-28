export function formatSlug(val: string): string {
  return val
    .trim()
    .replace(/[^A-Za-z0-9&/\s-]/g, '')
    .replace(/&/g, 'and')
    .replace(/\//g, 'or')
    .replace(/\s+/g, '-')
    .slice(0, 200)
    .toLowerCase()
}
