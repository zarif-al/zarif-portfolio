import React from 'react'
import { draftMode } from 'next/headers'
import { getPayloadInstance } from '@/lib/payload'
import { HeaderComponent } from './header'
import { FooterComponent } from './footer'

interface RenderLayoutProps {
  children: React.ReactNode
}

export async function RenderLayout({ children }: RenderLayoutProps) {
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayloadInstance()

  const layout = await payload.findGlobal({
    slug: 'layout',
    draft: isDraftMode,
    depth: 1,
  })

  return (
    <>
      {layout.header && <HeaderComponent {...layout.header} />}
      <main className="min-h-[60vh]">{children}</main>
      {layout.footer && <FooterComponent {...layout.footer} />}
    </>
  )
}
