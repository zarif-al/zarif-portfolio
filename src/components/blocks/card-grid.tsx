'use client'

import React from 'react'
import { Richtext } from '@/components/primitives/richtext'
import type { CardGridBlock } from '@/payload-types'

export function CardGridBlockComponent({ numberedCards, cells }: CardGridBlock) {
  return (
    <section>
      <div className="mx-auto max-w-(--max-width) px-(--gutter)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-border border border-border mb-8">
          {numberedCards && numberedCards.cards && numberedCards.cards.length > 0 && (
            <div className="col-span-full bg-surface p-6">
              {numberedCards.heading && (
                <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent mb-3 font-medium">
                  {numberedCards.heading}
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1px] bg-border">
                {numberedCards.cards.map((card, i) => (
                  <div
                    key={i}
                    className="bg-surface py-5 px-4 hover:bg-bg transition-colors duration-200"
                  >
                    <div className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-accent mb-2">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="font-display text-base font-normal text-fg leading-[1.25] mb-[0.35rem]">
                      {card.title}
                    </div>
                    <div className="text-[0.8rem] text-muted leading-[1.5]">{card.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cells &&
            cells.length > 0 &&
            cells.map((cell, i) => (
              <div
                key={i}
                className={`bg-surface p-6 ${cell.span === 'full' ? 'col-span-full' : ''}`}
              >
                <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent mb-3 font-medium">
                  {cell.heading}
                </h3>
                {cell.type === 'stack' ? (
                  <>
                    {cell.stackItems && cell.stackItems.length > 0 && (
                      <ul className="flex flex-wrap gap-[0.4rem] list-none">
                        {cell.stackItems.map((item, j) => (
                          <li
                            key={j}
                            className="font-mono text-[0.7rem] text-fg bg-accent-soft px-[0.55rem] py-[0.2rem] border border-border"
                          >
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    )}
                    {cell.stackFootnote && (
                      <p className="text-[0.72rem] text-muted mt-3">
                        <span className="text-accent">Currently grinding:</span>{' '}
                        {cell.stackFootnote}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-[0.9rem] text-muted leading-[1.6]">
                    {cell.content ? <Richtext data={cell.content} /> : null}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
