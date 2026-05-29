import React from 'react'
import './styles.css'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { RenderLayout } from '@/components/layout'

export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value ?? ''

  return (
    <html lang="en" data-theme={theme} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <RenderLayout>{children}</RenderLayout>
      </body>
    </html>
  )
}
