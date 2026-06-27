import type { DetailRibbonProps } from './interfaces'

/**
 * Context ribbon for detail pages — displays role, duration, and team info
 * in a centered mono bar beneath the content header.
 *
 * Returns `null` when `involvement` is empty (all fields undefined/null).
 */
export function DetailRibbon({ involvement }: DetailRibbonProps) {
  if (!involvement || (!involvement.role && !involvement.duration && !involvement.team)) {
    return null
  }

  const { role, duration, team } = involvement

  return (
    <div className="mt-6 py-3.5 px-6 border border-border bg-surface text-center font-mono text-xs text-fg tracking-[0.02em] leading-relaxed">
      {role && (
        <>
          <span className="text-accent uppercase text-[0.65rem] tracking-[0.06em]">Role</span>{' '}
          {role}
        </>
      )}
      {role && duration && (
        <span className="text-border mx-[0.65rem]" aria-hidden="true">
          ·
        </span>
      )}
      {duration && (
        <>
          <span className="text-accent uppercase text-[0.65rem] tracking-[0.06em]">Duration</span>{' '}
          {duration}
        </>
      )}
      {(role || duration) && team && (
        <span className="text-border mx-[0.65rem]" aria-hidden="true">
          ·
        </span>
      )}
      {team && (
        <>
          <span className="text-accent uppercase text-[0.65rem] tracking-[0.06em]">Team</span>{' '}
          {team}
        </>
      )}
    </div>
  )
}
