'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { HeroBlock } from '@/payload-types'
import { jsxConverters } from './converter'

/**
 * Shared RichText renderer with custom text converter.
 * Handles Lexical format flags and TextStateFeature accent color.
 */
export function Richtext({ data, className }: { data: HeroBlock['heading']; className?: string }) {
  return <RichText data={data} className={className} converters={jsxConverters} />
}
