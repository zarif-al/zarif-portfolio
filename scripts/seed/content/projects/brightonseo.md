## Overview

Led the rebuild of brightonSEO's website — the world's largest search marketing conference. Migrated from a rigid legacy system to a modern Sanity + Next.js stack with a flexible page builder, custom schedule table, and event management workflows.

## Architecture Decisions

- **Sanity as the CMS:** Chose Sanity for its flexibility in content modeling. The client needed to manage complex event data — schedules, speakers, sponsors, courses, pricing — all within a single editorial interface.
- **GROQ for queries:** Embraced Sanity's GROQ query language despite no prior team experience. The learning curve was steep but unlocked the full potential of Sanity's content relationships, particularly for the schedule table feature.
- **Flexible page builder:** Built a block-based page builder in Sanity so the client could compose landing pages, event pages, and course pages without developer intervention.
- **Navigation management:** The client could manage site navigation entirely from the CMS — adding, removing, and reordering links without touching code.

## Challenges

The schedule table was the hardest feature. It required an intuitive CMS input experience while optimizing the frontend rendering. The client also wanted to embed the schedule anywhere on the site, which meant the heavy lifting had to happen in the GROQ query itself. At the time, Sanity was relatively new and we were early adopters — writing an efficient, complex GROQ query involved extensive trial and error.

In hindsight, the initial content architecture was too rigid for brightonSEO's dynamic nature. If rebuilding, I'd design schemas to be more flexible from the start.

## Outcome

- **Site maintainers reduced from 10-11 to 2-3** — content editors could manage the site directly in Sanity without developer help
- **New events could be set up in one week** instead of two to three weeks
- **Complete creative freedom** for the client to craft rich, visually expressive content
