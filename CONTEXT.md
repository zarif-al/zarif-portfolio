# Zarif's Portfolio

A developer portfolio built with Payload CMS and Next.js — showcasing projects, writing, and experience through composable blocks.

## Language

### Infrastructure

**Page**:
A publicly routable, generic web page built with blocks. Managed in the `pages` collection.
_Avoid_: Route, CMS page, content page

**Block**:
A composable content building block used on Pages and in the Layout. Each **Buildable Block** has both a **Block Schema** (the Payload schema definition in `src/blocks/`) and a **Block Component** (the React renderer in `src/components/blocks/buildable/`). The schema defines what data the block stores; the component defines how it renders. **Non-Buildable Blocks** (in `src/components/blocks/non-buildable/`) are frontend-only — they render block-like UI but are not CMS-managed and have no Payload schema.
_Avoid_: Component, section, module

**Buildable Block**:
A CMS-composable **Block** registered in `ALL_PAGE_BLOCKS`. Has a **Block Schema** in `src/blocks/` and a **Block Component** in `src/components/blocks/buildable/`. Editable via the Payload admin.
_Avoid_: CMS block, page block, admin block

**Non-Buildable Block**:
A frontend-only **Block** that shares the visual language of blocks but has no Payload schema — not CMS-managed, not in `ALL_PAGE_BLOCKS`. Lives in `src/components/blocks/non-buildable/` and is rendered by pages that need it (e.g., the **RelatedItems** block on detail pages). Self-fetching or accepts pre-fetched data.
_Avoid_: Static block, hardcoded block, inline block

**Block Schema**:
A Payload block schema — defines the fields, validation, and admin UI for a single **Buildable Block** type. Lives in `src/blocks/`.
_Avoid_: Block definition, block config

**Block Component**:
A React component that renders a single block type on the frontend. Receives the block's data as props. Lives in `src/components/blocks/buildable/`.

**Layout**:
The site-wide chrome — Header and Footer. The **Global** (`src/globals/layout/`) configures them; the **React components** (`src/components/layout/`) render them. Same split as blocks.
_Avoid_: Shell, chrome, navigation

**Site Config**:
Site-wide metadata — SEO defaults, analytics IDs. A Payload Global consumed by the frontend at render time (e.g., `<head>` injection). A singleton.
_Avoid_: Settings, site settings, global config

**Field Group**:
A reusable, composable group of Payload fields with validation, hooks, and conditions. Dropped into any collection, block, or global. Lives in `src/fields/`.
_Avoid_: Custom field, shared field

**Tab**:
A reusable admin UI tab configuration for Payload's `tabs` field. Lives in `src/tabs/`. Factory functions return `Tab` objects that can be used across collections and globals.
_Avoid_: Admin tab, tab group

### Portfolio Domain

**Hero**:
A universal page header block — a kicker and a heading. Used at the top of every page.
_Avoid_: Home hero, page header, banner

**Equalizer**:
A decorative **Buildable Block** with pulsing bar animation and a "Now Playing" widget that cycles through a **Track** array. Each **Track** has a `title` and `author`. The displayed track changes every 3 minutes based on wall-clock time — all visitors see the same track at the same time. Sits between the hero and the terminal block on the home page. Has tighter vertical spacing than other blocks.
_Avoid_: EQ, audio bars, visualizer, now-playing

**TerminalBlock**:
A terminal-styled card block with command and output lines, and a system node diagram.
_Avoid_: Terminal, CLI block, command block

**RichText**:
A standalone rich text block for prose — paragraphs, links, basic formatting.
_Avoid_: Body, content, text block

**CardGrid**:
A bordered-container block composed of reorderable sub-blocks — **NumberedGrid** (full-span capability cards with auto-incremented numbers) and **CellGrid** (a pair of cells rendered side-by-side, each with a heading and either rich text or a stack list with footnote). Sub-blocks can appear in any order, any number of times.
_Avoid_: About grid, feature grid, capability grid

**NumberedGrid**:
A sub-block inside **CardGrid**. A full-width cell containing an optional heading and a grid of numbered cards (title + description). Always spans both columns of the parent 2-column grid.
_Avoid_: Capability grid, feature cards

**CellGrid**:
A sub-block inside **CardGrid**. Always renders two cells side-by-side in the parent 2-column grid. Each cell can be `text` (rich text) or `stack` (tag pills + optional footnote). A `swap` boolean flips the visual order. An item with no content renders as a grayed-out placeholder.
_Avoid_: Content cell, about cell

**CollectionList**:
A block that renders a list of items from a chosen collection — Projects or Blogs. The Projects variant auto-generates a **FilterBar** from the union of all **Tags** assigned to projects. Cards link to collection detail routes (`projects/[slug]`, `blog/[slug]`).
_Avoid_: Project list, blog list, post list

**Contact**:
A two-column bordered block — contact info on the left, a hardcoded form (Name, Email, Message) on the right. The form handler is a frontend concern, not CMS-editable.
_Avoid_: Contact form, contact section, contact layout

**EntryList**:
A block of labeled entries — each entry has a label, title, and description. Used on the Now page.
_Avoid_: Now list, entry grid, status list

**Project**:
A collection item representing a piece of work — title, slug, **Tags**, description, kicker, body (rich text), **Outcome Stats**, and **Tech Stack**. Detail page is served at `projects/[slug]`.
_Avoid_: Portfolio item, case study, work sample

**Blog Post**:
A collection item representing a blog post — title, slug, track number, published date, excerpt, body (rich text), and **Tags**. Detail page is served at `blog/[slug]`.
_Avoid_: Article, post

**Tag**:
A collection used to categorize **Projects** and **Blog Posts**. Tags appear on project/blog cards and power the **FilterBar** in the **CollectionList** block.
_Avoid_: Category, label, topic

**Kicker**:
A small mono-styled label above a heading — used in the **Hero** block, Project detail headers, and Blog Post detail headers.
_Avoid_: Eyebrow, label, subtitle, overline

**FilterBar**:
A frontend component inside **CollectionList** (Projects variant) that renders filter buttons auto-derived from the unique set of **Tags** across all Projects. Not a CMS block — generated at render time.
_Avoid_: Filter, category bar, tag filter

**Outcome Stats**:
Key metrics displayed on a **Project** detail page — an array of value + label pairs. E.g. `{ value: "40+", label: "Tenants" }`.
_Avoid_: Metrics, stats, KPI, numbers

**Tech Stack**:
An array of technology labels displayed as pills on a **Project** detail page and as a monospaced line on **Project** cards in the list.
_Avoid_: Tools, technologies, stack tags

**RelatedItems**:
A **Non-Buildable Block** rendered on **Blog Post** and **Project** detail pages. Auto-generates up to 3 related items from the same collection that share at least one **Tag** with the current item. Self-fetching — pages just configure collection, sort, and tag IDs.
_Avoid_: Related posts, related projects, cross-links

## Example dialogue

**Dev**: "I need to add a testimonials section to every page."

**Lead**: "So you're adding a new **Buildable Block**. You'll need a **Block Schema** in `src/blocks/` for the data — author name, quote, avatar — and a **Block Component** in `src/components/blocks/buildable/` to render it. Then register both in the blocks index and the renderer."

**Dev**: "Got it. And the block shows up automatically in the Pages editor?"

**Lead**: "Yes. Any block registered in `ALL_PAGE_BLOCKS` appears in the **Blocks Tab** on every **Page**."

**Dev**: "What about the footer — I need social links in it."

**Lead**: "Footer is part of the **Layout**. Add the field to the Footer **Block Schema** in `src/globals/layout/footer/`, then update the **Block Component** in `src/components/layout/` to render them."

**Dev**: "And the Google Analytics ID?"

**Lead**: "That's **Site Config** — not a collection. It's a singleton Global. Add the tracking field there and read it in your layout to inject the script."
