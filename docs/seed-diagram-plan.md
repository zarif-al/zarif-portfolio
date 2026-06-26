# Diagram Seed Data Plan

Resolutions from the grilling session.

## Decided

| Decision              | Resolution                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Scope                 | All 3 projects + all 3 blog posts                                                                                                   |
| Pipeline              | Confirmed: markdown fenced ` ```mermaid ` code blocks survive `convertMarkdownToLexical` → `language: 'mermaid'` → `MermaidDiagram` |
| Diagram role vs prose | If prose has details beyond the flow, diagram **supplements**. If prose is just describing steps, diagram **replaces** the steps.   |

## brightonseo — Resolved

**3 diagrams, plus a reflective section in the prose:**

1. **High-level architecture (system topology)**
   - Content Editors (Sanity Studio) → Sanity CMS → GROQ Query Layer → Next.js
   - Stops at Next.js — does not enumerate individual frontend features.

2. **Entity Relationship Diagram (ERD)**
   - 9 documents: `event`, `session`, `talk`, `course`, `person`, `sponsor`, `eventVenue`, `majorActivity`, `minorActivity`
   - Key unorthodox relationships to highlight:
     - `talk.event` direct reference — shortcut to query "all talks for event X" without walking schedule tree
     - `session.venue` separate from `event.venue` — sub-rooms vs. whole venue (poorly named)
     - `minorActivity.sponsors` — subset of sponsors shown inline in schedule table

3. **Schedule table data composition diagram**
   - Conceptual view of which entity levels contribute data to a single schedule table row.
   - A row draws from: Event (date), TimeSlot (startTime), Session (title), Venue (room name), Talk (title, isKeynote), Person (fullName, image), MinorActivity (title, sponsors), MajorActivity (event-specific content, venue, sponsors).

**Reflective section (prose):**

- Suggested improvements to the schema design with hindsight. Not a feature list.

## boutique-gym-site — Resolved

**2 diagrams:**

1. **High-level architecture (system topology)**
   - Mariana Tek GMS → NestJS synchronizer → Sanity (content enrichment)
   - Next.js front-end → talks directly to Mariana Tek for bookings (no gateway)
   - Flutter mobile app (parallel frontend)

2. **Pick-A-Spot (PAS) enrichment flow**
   - The integration story: how custom spot layouts were enabled between Mariana Tek and the Headless CMS.
   - NestJS sync pulls PAS layouts + raw spot positions from Mariana Tek → pushes to Sanity
   - Client in Sanity uploads custom transparent layout image, drags spots to correct x/y positions
   - Sanity serves enriched layout (image underlay + positioned spots) to Next.js

## sauna-gms-integration — Both Diagrams

1. Walk me through the full anonymous group booking flow: 3 friends walk into a sauna, want to book 4 spots in a session. What is the step-by-step from browser → NestJS → Mariana Tek?
2. How does the NestJS layer translate "one anonymous group booking" into "N individual authenticated bookings" on the Mariana Tek side?
3. What's the high-level topology? Client → Next.js → NestJS → Mariana Tek API? Where does Sanity fit in this project?
4. Does the NestJS layer fake user accounts, hold a pool of accounts, or use a single service account?

## Blog diagrams — Mermaid syntax

These are straightforward once diagram types are chosen. No domain questions needed — the prose already contains the logic. I will draft Mermaid syntax and present for review, or user can specify the flow.
