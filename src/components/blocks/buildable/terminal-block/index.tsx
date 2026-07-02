import React from 'react'
import { cn } from '@/utilities/cn'
import type { TerminalBlockBlock } from '@/payload-types'
import type { BlockComponentProps } from '@/components/blocks/types'
import styles from './terminal-block.module.css'

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
                    <span className={styles['cursor']} />
                  )}
                </span>
              </div>
            ),
          )}

          {systemNodes && systemNodes.length > 0 && (
            <div className={styles['diagram']}>
              {systemNodes.map((node, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className={styles['edge']} aria-hidden="true">
                      ⸻
                    </span>
                  )}
                  <div className={styles['node']}>{node.label}</div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
