'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/utilities/cn'
import type { RichtextBlock } from '@/payload-types'
import { jsxConverters } from './converter'

/**
 * Shared RichText renderer with custom text converter and default prose styling.
 * Handles Lexical format flags and TextStateFeature accent color.
 */
export function Richtext({
  data,
  className,
  disableProse = false,
}: {
  data: RichtextBlock['content']
  className?: string
  disableProse?: boolean
}) {
  return (
    <RichText
      data={data}
      className={cn(!disableProse && 'prose', className)}
      converters={jsxConverters}
    />
  )
}
