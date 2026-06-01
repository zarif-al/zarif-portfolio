import type { NumberedGridBlock } from '@/payload-types'

export function NumberedGrid({ heading, cards }: NumberedGridBlock) {
  return (
    <div className="col-span-full bg-surface p-6">
      {heading && (
        <h3 className="font-mono text-[0.65rem] uppercase tracking-widest text-accent mb-3 font-medium">
          {heading}
        </h3>
      )}
      {cards && cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-surface py-5 px-4 hover:bg-bg transition-colors duration-200"
            >
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-accent mb-2">
                {(i + 1).toString().padStart(2, '0')}
              </div>
              <div className="font-display text-base font-normal text-fg leading-tight mb-[0.35rem]">
                {card.title}
              </div>
              <div className="text-[0.8rem] text-muted leading-normal">{card.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
