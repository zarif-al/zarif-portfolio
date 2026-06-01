import { ViewTransition } from 'react'

/**
 * Wraps every route segment in a `<ViewTransition>` so page content
 * gets enter/exit animations on navigation. Unlike `layout.tsx`,
 * a template remounts on each route change — which is required for
 * the exit/enter snapshots to fire.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition name="page" enter="page-enter" exit="page-exit" default="none" share="none">
      {children}
    </ViewTransition>
  )
}
