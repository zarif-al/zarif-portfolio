# Zarif's Portfolio

A developer portfolio built with Payload CMS and Next.js — showcasing projects, writing, and experience through composable blocks.

## Language

### Infrastructure

**Page**:
A publicly routable, generic web page built with blocks. Managed in the `pages` collection.
_Avoid_: Route, CMS page, content page

**Block**:
A composable content building block used on Pages and in the Layout. Each block has a **Block Config** (the Payload schema definition in `src/blocks/`) and a **Block Component** (the React renderer in `src/components/blocks/`). The config defines what data the block stores; the component defines how it renders.
_Avoid_: Component, section, module

**Block Config**:
A Payload block schema — defines the fields, validation, and admin UI for a single content block type. Lives in `src/blocks/`.
_Avoid_: Block definition, block schema

**Block Component**:
A React component that renders a single block type on the frontend. Receives the block's data as props. Lives in `src/components/blocks/`.

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
A universal page header block — a kicker and a heading with an optional equalizer animation. Used at the top of every page.
_Avoid_: Home hero, page header, banner

**TerminalBlock**:
A terminal-styled card block with command and output lines, a system diagram, and a now-playing widget.
_Avoid_: Terminal, CLI block, command block

**RichText**:
A standalone rich text block for prose — paragraphs, links, basic formatting.
_Avoid_: Body, content, text block

**CardGrid**:
A single bordered-container block with an optional section of numbered cards (title + description, auto-incremented numbers) followed by optional content cells. Each cell has a heading and either rich text content or a stack list (tag pills + footnote). Cells can span half or full width of the 2-column grid.
_Avoid_: About grid, feature grid, capability grid

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

**Equalizer**:
A decorative CSS animation of pulsing bars rendered below a **Hero** heading when `showEqualizer` is enabled. Pure decoration — no CMS fields.
_Avoid_: EQ, audio bars, visualizer

**FilterBar**:
A frontend component inside **CollectionList** (Projects variant) that renders filter buttons auto-derived from the unique set of **Tags** across all Projects. Not a CMS block — generated at render time.
_Avoid_: Filter, category bar, tag filter

**Outcome Stats**:
Key metrics displayed on a **Project** detail page — an array of value + label pairs. E.g. `{ value: "40+", label: "Tenants" }`.
_Avoid_: Metrics, stats, KPI, numbers

**Tech Stack**:
An array of technology labels displayed as pills on a **Project** detail page and as a monospaced line on **Project** cards in the list.
_Avoid_: Tools, technologies, stack tags

## Example dialogue

**Dev**: "I need to add a testimonials section to every page."

**Lead**: "So you're adding a new **Block**. You'll need a **Block Config** in `src/blocks/` for the data — author name, quote, avatar — and a **Block Component** in `src/components/blocks/` to render it. Then register both in the blocks index and the renderer."

**Dev**: "Got it. And the block shows up automatically in the Pages editor?"

**Lead**: "Yes. Any block registered in `ALL_PAGE_BLOCKS` appears in the **Blocks Tab** on every **Page**."

**Dev**: "What about the footer — I need social links in it."

**Lead**: "Footer is part of the **Layout**. Add the field to the Footer **Block Config** in `src/globals/layout/footer/`, then update the **Block Component** in `src/components/layout/` to render them."

**Dev**: "And the Google Analytics ID?"

**Lead**: "That's **Site Config** — not a collection. It's a singleton Global. Add the tracking field there and read it in your layout to inject the script."
