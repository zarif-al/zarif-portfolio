import type { Access } from 'payload'

/**
 * Access control for draft-enabled collections and globals.
 *
 * Rules (first match wins):
 * 1. Authenticated admin users are allowed full access.
 * 2. Frontend draft mode (via `context.isDraftMode`) is allowed full access.
 * 3. Public visitors see published documents only.
 */
export const draftModeAccess: Access = ({ req: { user, context } }) => {
  if (user) {
    return true
  }

  if (context?.['isDraftMode']) {
    return true
  }

  return {
    _status: { equals: 'published' },
  }
}
