import { notFound } from 'next/navigation'

export function getURLPrefix(collectionSlug: string) {
  switch (collectionSlug) {
    case 'pages': {
      return ''
    }

    case 'projects': {
      return '/projects'
    }

    case 'blogs': {
      return '/blog'
    }

    default: {
      notFound()
    }
  }
}
