import type { TableBlock as TableBlockType } from '@/payload-types'
import { Richtext } from '@/components/primitives/richtext'

/**
 * Renders a Table block from the Lexical rich text editor.
 *
 * A semantic `<table>` with `<thead>` / `<tbody>`, mono-font headers,
 * horizontal-rule rows, and hover highlighting.
 * Maps to the `detail-table` design from the landing page.
 */
export function Table({ columnHeaders, rows }: TableBlockType) {
  if (!columnHeaders?.length || !rows?.length) {
    return null
  }

  return (
    <div className="not-prose my-8 overflow-x-auto border border-border">
      <table className="w-full border-collapse text-[0.95rem] min-w-[36rem]">
        <thead>
          <tr>
            {columnHeaders.map((header, i) => (
              <th
                key={i}
                className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-muted font-semibold px-4 py-[0.85rem] text-left border-b border-muted align-bottom"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="group">
              {row.cells?.map((cell, ci) => (
                <td
                  key={ci}
                  className="text-muted px-4 py-[0.85rem] leading-[1.6] align-top border-b border-border group-hover:bg-surface"
                >
                  {cell.content && <Richtext data={cell.content} disableProse />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
