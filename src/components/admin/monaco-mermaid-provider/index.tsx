'use client'

import loader from '@monaco-editor/loader'
import initMermaid from 'monaco-mermaid'

interface MonacoMermaidProviderProps {
  children: React.ReactNode
}

/**
 * Admin provider that registers Mermaid syntax support in Monaco before
 * any CodeBlock renders.
 *
 * ## Why a Provider component?
 *
 * Payload's admin config exposes no `scripts` or `init` hooks — the
 * `providers` array is the only slot that guarantees client-side
 * execution before the admin UI mounts.  A `useEffect` would fire too
 * late: React runs child effects before parent effects, so a CodeBlock's
 * editor would initialize before this provider's effect could register
 * the language.  Running the registration in the component body queues
 * it on the `loader.init()` singleton before any child is created.
 *
 * This file cannot be imported from `payload.config.ts` (server-only),
 * nor from the lexical editor feature config (also server-evaluated).
 * The `'use client'` directive ensures the component runs only in the
 * browser, where `loader.init()` can access `window` and `document`.
 */
export function MonacoMermaidProvider({ children }: MonacoMermaidProviderProps) {
  if (typeof window === 'undefined') {
    return <>{children}</>
  }

  const init = async () => {
    try {
      initMermaid(await loader.init())
    } catch (err) {
      console.error('Failed to register Mermaid language for Monaco:', err)
    }
  }

  void init()

  return <>{children}</>
}
