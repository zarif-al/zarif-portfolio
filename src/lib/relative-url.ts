import { notFound } from 'next/navigation'

export function getURLPrefix(collectionSlug: string) {
  switch (collectionSlug) {
    case 'pages': {
      return ''
    }

    default: {
      notFound()
    }
  }
}
