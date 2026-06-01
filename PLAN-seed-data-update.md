# Plan: Replace placeholder seed data with real content

## Summary

Replace all synthetic/placeholder content in `scripts/seed/` with real portfolio data sourced from zarif.dev and interview clarifications.

## Files to modify

1. **`scripts/seed/index.ts`** — Replace `PROJECTS` and `BLOGS` arrays; update tag labels; mark Sauna as draft
2. **`scripts/seed/data.ts`** — Update hero kicker, about CardGrid (4 cards, no loadout footnote), contact email, now page entries, footer social links
3. **`scripts/seed/content/projects/`** — Replace 5 fake markdowns with 3 real ones
4. **`scripts/seed/content/blogs/`** — Replace 5 fake markdowns with 3 real ones
5. **`scripts/seed/content/headings/`** — Update projects kicker to "Quests completed: 02"
6. **`scripts/seed/content/page-content/`** — Update bio, contact-info as needed

## Detailed changes

### Tags (new taxonomy)
- **Sanity** — brightonSEO, Boutique Gym
- **NextJS** — brightonSEO, Boutique Gym
- **Payload** — Payload 2FA blog
- **Architecture** — Both projects, Payload 2FA blog
- **Integration** — Boutique Gym, Sauna GMS
- **Concept** — Conceptual Truncation, Client vs Server Fetching blogs

### Projects

| # | Title | Status | Stack | Stats |
|---|-------|--------|-------|-------|
| 1 | brightonSEO | Published | Sanity, Next.js, GROQ, TypeScript | 10-11→2-3 maintainers, event setup 2-3 wks→1 wk |
| 2 | Boutique Gym Site | Published | Sanity, Next.js, Flutter, NestJS | Improved spot booking UX with visual layout positioning |
| 3 | Sauna GMS Integration | Draft | NestJS, Mariana Tek, Next.js, Sanity | Anonymous group booking for GMS |

### Blogs (all dated Feb 23, 2025)

| # | Title | Tags |
|---|-------|------|
| 1 | Payload CMS 2FA Implementation | Payload, Architecture |
| 2 | Conceptual Truncation | Concept |
| 3 | Client Side vs Server Side Fetching | Concept |

### Personal details updated
- GitHub: `github.com/zarif-al`
- LinkedIn: `linkedin.com/in/abdullah-al-zarif/`
- Email: `zarif_al96@outlook.com`
- 4+ years experience

### About page
- 4 capability cards (drop Developer Tooling)
- Remove "Rust, Kafka, edge compute" footnote from Loadout
- Same background/approach text

### Now page
- Work: Sauna GMS integration (anonymous group booking)
- Learning: Harnessing AI Agents
- Side Project: AI-powered code review GitHub Action
- Playing: Path of Exile 2 — Monk Martial Artist ascendancy

### What stays unchanged
- Hero heading, terminal block, equalizer, home bio, background/approach text, contact description, page headings
