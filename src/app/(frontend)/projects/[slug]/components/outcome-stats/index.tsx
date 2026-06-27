import type { OutcomeStatsProps } from './interfaces'

/**
 * Reusable outcomes stats grid with a prose-styled heading.
 *
 * Renders a grid of stat cards (value + label) behind a unified border
 * frame. Returns `null` when `stats` is empty or undefined so consumers
 * can call it unconditionally.
 */
export function OutcomeStats({ stats }: OutcomeStatsProps) {
  if (!stats || stats.length === 0) {
    return null
  }

  return (
    <div>
      <div className="prose">
        <h2>Outcomes</h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-px bg-border border border-border my-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface px-4 py-5 text-center">
            <div className="font-display text-2xl text-fg">{stat.value}</div>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted mt-[0.3rem]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
