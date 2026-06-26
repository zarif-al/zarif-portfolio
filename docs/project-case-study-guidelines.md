# Project Case Study Guidelines

How to write compelling project case studies for this portfolio.

---

## Structure

Every case study follows the same narrative flow at the **h2** level:

```
## The Problem
## The Architecture
## Feature Breakdown
## Reflections
## Outcome
```

The page template already provides the `<h1>` (project title), role/stack/outcome
summary, and tech stack tags.  The body content starts at `##`.

---

## Section-by-section

### The Problem (h2)

2–3 paragraphs.  Answer: _why did this need to exist?_  Describe the situation,
the stakes, and what was broken before you arrived.  Do not list features here —
write a problem statement that makes the reader understand the client's pain.

**Good:** "Every new conference meant hiring 15–20 freelancers to manually wipe
site content and re-enter everything from scratch. Old events simply disappeared
— there was no archive."

**Bad:** "The client needed a website with a schedule table and speaker bios."

### The Architecture (h2)

Describe the high-level technology choices and the reasoning behind them.
Include a Mermaid diagram if it helps explain the system.  This section answers:
_what stack did you choose and why?_

Include a brief paragraph connecting the architecture to the problem — don't
just list technologies.

### Feature Breakdown (h2)

The meat of the case study.  Each major feature or decision gets its own **h3**
subsection.  Within each h3, use **h4** headings sparingly for the deepest
level of detail (e.g., entity descriptions in a data model).

Keep h3 titles descriptive and concrete:

- `Schedule Table: Six Levels of Data in One Query` — tells me what and why
- `Page Builder: Sections That Work Anywhere` — tells me the value
- `My-Schedule: Personalized Event Planning` — tells me the outcome

**Do not use h4/h5/h6 for narrative section headings.**  The global heading
styles treat h4–h6 as tiny mono uppercase labels (designed for site chrome,
not prose content).  If you need a sub-heading inside an h3, use bold text
or just continue the paragraph.

### Reflections (h2)

What would you do differently with hindsight?  Be specific and honest.
Bulleted list works well — each item a concrete lesson.

### Outcome (h2)

Quantified results.  Bulleted list of measurable changes.  Avoid vague
statements like "the client was happy."

---

## Heading levels reference

| Markdown | Rendered tag | Use for |
|---|---|---|
| `##` | h2 | Top-level sections (Problem, Architecture, etc.) |
| `###` | h3 | Feature sub-sections |
| `####` | h4 | **Avoid** — renders as mono 0.7rem uppercase label |
| `#####` | h5 | **Avoid** — renders as mono 0.65rem uppercase label |
| `######` | h6 | **Avoid** — same as h5 |

If you find yourself reaching for h4, reconsider whether the content
should be restructured or use bold text instead.

---

## General principles

- **Problem → Process → Result** is the narrative arc.  Every section should
  connect back to the problem.
- **Show your thinking**, not just the output.  Explain trade-offs and
  decisions that were considered and rejected.
- **One h2 section = one screen's worth of reading.**  If a section runs
  longer than ~4 paragraphs, break it into h3 subsections.
- **Diagrams clarify, they don't replace.**  Every Mermaid diagram needs a
  paragraph that explains what the reader should take away from it.
- **Numbers over adjectives.**  "Reduced maintainers from 15–20 to 2–3" beats
  "greatly improved efficiency."
