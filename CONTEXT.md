# Payload Next.js Template

A starter template for building websites with Payload CMS and Next.js. It provides the skeleton — collections, globals, blocks, field groups, tabs — that every Payload project needs.

## Language

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

## Example dialogue

**Dev**: "I need to add a testimonials section to every page."

**Lead**: "So you're adding a new **Block**. You'll need a **Block Config** in `src/blocks/` for the data — author name, quote, avatar — and a **Block Component** in `src/components/blocks/` to render it. Then register both in the blocks index and the renderer."

**Dev**: "Got it. And the block shows up automatically in the Pages editor?"

**Lead**: "Yes. Any block registered in `ALL_PAGE_BLOCKS` appears in the **Blocks Tab** on every **Page**."

**Dev**: "What about the footer — I need social links in it."

**Lead**: "Footer is part of the **Layout**. Add the field to the Footer **Block Config** in `src/globals/layout/footer/`, then update the **Block Component** in `src/components/layout/` to render them."

**Dev**: "And the Google Analytics ID?"

**Lead**: "That's **Site Config** — not a collection. It's a singleton Global. Add the tracking field there and read it in your layout to inject the script."
