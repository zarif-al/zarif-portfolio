import React from 'react'
import { cn } from '@/utilities/cn'
import type { TerminalBlockBlock } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'

export function TerminalBlockComponent({
  lines,
  systemNodes,
  className,
}: BlockComponentProps<TerminalBlockBlock>) {
  return (
    <section className={cn(className)}>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="relative overflow-hidden bg-surface border border-border p-7 md:p-8 font-mono text-[0.825rem] leading-[1.8] text-muted">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />

          {lines?.map((line, i) =>
            line.type === 'command' ? (
              <div key={i} className="flex gap-2 items-baseline">
                <span className="text-accent select-none shrink-0">$</span>
                <span className="text-fg font-medium">{line.command}</span>
              </div>
            ) : (
              <div
                key={i}
                className={`flex gap-2 items-baseline mt-[0.15rem] ${line.indent ? 'pl-6' : ''}`}
              >
                <span className="text-muted">
                  {line.output}
                  {i === (lines?.length ?? 0) - 1 && lines?.[i]?.type === 'output' && (
                    <span className="inline-block w-[0.55em] h-[1em] bg-accent animate-blink align-text-bottom ml-[0.15em]" />
                  )}
                </span>
              </div>
            ),
          )}

          {systemNodes && systemNodes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-dashed border-border flex gap-6 flex-wrap items-start">
              {systemNodes.map((node, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className="font-mono text-border text-[0.65rem] select-none mx-[0.15rem]">
                      ⸻
                    </span>
                  )}
                  <div className="flex items-center gap-[0.4rem] text-[0.72rem] text-muted">
                    <span className="w-1.5 h-1.5 bg-accent shrink-0" />
                    {node.label}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
