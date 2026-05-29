import { Richtext } from '@/components/primitives/richtext'
import { cn } from '@/utilities/cn'
import type { ContactBlock } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'
import { ContactForm } from './components/contact-form'

export function ContactBlockComponent({
  infoHeading,
  infoDescription,
  email,
  className,
}: BlockComponentProps<ContactBlock>) {
  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
          <div className="bg-surface p-7">
            {infoHeading && (
              <h3 className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-4 font-medium">
                {infoHeading}
              </h3>
            )}
            {infoDescription && (
              <div className="text-[0.875rem] text-muted leading-[1.6] mb-4">
                <Richtext data={infoDescription} />
              </div>
            )}
            {email && (
              <p>
                <a
                  href={`mailto:${email}`}
                  className="font-mono text-[0.8rem] text-accent no-underline border-b border-dotted border-accent"
                >
                  {email}
                </a>
              </p>
            )}
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}
