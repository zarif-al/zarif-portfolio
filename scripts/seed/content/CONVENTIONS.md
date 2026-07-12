# Seed Markdown Conventions

## Callouts

Use GitHub-style blockquote callouts with one of three types:

```md
> [!INFO]
> Callout body text here. Supports **bold**, *italic*, and [links](https://example.com).

> [!CAUTION]
> Warning-level callout. Same syntax, different label.

> [!WARNING]
> Highest severity. Use sparingly.
```

**Rules:**
- Type must be one of `INFO`, `CAUTION`, or `WARNING` (case-insensitive).
- Each body line must start with `>`.
- The callout ends at the first line that does not start with `>`.

## Tables

Use standard GFM pipe tables:

```md
| Header A | Header B | Header C |
|----------|----------|---------:|
| Cell 1   | Cell 2   | 42       |
| Cell 3   | Cell 4   | 7        |
```

**Rules:**
- Header row, separator row, then data rows.
- The separator must be exactly one row of `|---` per column.
- Cells support inline markdown: **bold**, *italic*, `code`, [links](https://example.com).
- To right-align a column, add `:` before the trailing `|` in the separator (see third column above).
- The table ends at the first blank line or non-table line.
