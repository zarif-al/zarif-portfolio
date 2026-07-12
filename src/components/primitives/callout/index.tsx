import type { CalloutBlock as CalloutBlockType } from '@/payload-types'
import { Richtext } from '@/components/primitives/richtext'

const LABELS: Record<string, string> = {
  info: 'Info',
  caution: 'Caution',
  warning: 'Warning',
}

/**
 * Renders a Callout block from the Lexical rich text editor.
 *
 * An accent-left-border callout with a mono label and rich text body.
 * Maps to the `detail-callout-bar` design from the landing page.
 */
export function Callout({ type, body }: CalloutBlockType) {
  const label = LABELS[type]

  return (
    <div
      className="not-prose my-7 border-l-[3px] border-accent py-[0.3rem] pl-5"
      role="region"
      aria-label={label}
    >
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent">
        {label}
      </span>
      <div className="mt-[0.4rem] text-[0.95rem] leading-[1.65] text-fg">
        <Richtext data={body} disableProse />
      </div>
    </div>
  )
}
