# Centralized inter-block spacing

Blocks must not own their outer vertical spacing. Instead, `RenderBlocks` defines a `BLOCK_SPACING` constant and passes it to every block as a `className` prop. Each block applies the class to its outermost `<section>` element.

**Chosen over:** a `space-y-[…]` parent container (ADR 0003 original). Uniform sibling gaps were too rigid — some blocks like an Equalizer need tighter spacing than others. Passing a `className` keeps spacing centralized in `RenderBlocks` while allowing per-block overrides in the switch statement.

**Chosen over:** per-block `mt-*`/`mb-*` margins. The per-block approach led to inconsistent spacing — the hero's bottom gap depended on whether the equalizer rendered, and the card-grid had its own `mb-8` that didn't match the rhythm of other blocks.

**Consequence:** every block component must accept an optional `className` prop and apply it to its outermost element. New blocks added without this prop will silently ignore the spacing class.
