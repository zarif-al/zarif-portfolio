import React from 'react'
import { Crimson_Pro, Inter, JetBrains_Mono } from 'next/font/google'
import './styles.css'
import type { Metadata } from 'next'
import { DEFAULT_THEME } from '@/store/theme.constants'
import { RenderLayout } from '@/components/layout'

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-display-next',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-next',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-next',
})

export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-theme={DEFAULT_THEME}
      className={`${crimsonPro.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <RenderLayout>{children}</RenderLayout>
      </body>
    </html>
  )
}
