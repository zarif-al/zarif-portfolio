import { cn } from '@/utilities/cn'
import type { EqualizerBlock } from '@/payload-types'

export function EqualizerBlockComponent({
  track,
  className,
}: EqualizerBlock & { className?: string }) {
  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="flex items-center justify-between gap-6 flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-2.5">
          <div className="flex items-end gap-[3px] h-6 shrink-0" aria-hidden="true">
            <span className="w-0.5 bg-accent opacity-50 animate-eq1" />
            <span className="w-0.5 bg-accent opacity-50 animate-eq2" />
            <span className="w-0.5 bg-accent opacity-50 animate-eq3" />
            <span className="w-0.5 bg-accent opacity-50 animate-eq4" />
            <span className="w-0.5 bg-accent opacity-50 animate-eq5" />
          </div>

          {track && (
            <div className="inline-flex items-center gap-2.5 font-mono text-[0.66rem] text-muted tracking-[0.03em] shrink-0 max-sm:text-[0.62rem]">
              <span className="relative w-2 h-2 border-[1.5px] border-accent shrink-0">
                <span className="absolute inset-[2px] bg-accent animate-spin-slow" />
              </span>
              <span className="text-accent uppercase tracking-[0.1em] text-[0.6rem]">
                Now Playing
              </span>
              <span className="text-fg font-medium">{track}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
