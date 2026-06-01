# AGENTS.md

Instructions for AI coding agents working in this codebase.

---

## Plan → Confirm → Modify

Always present a plan first. Only modify files after the user confirms. Plans must list impacted files.

## Type Safety

Follow this project's type-safety conventions. Look up how the codebase handles type narrowing, assertions, unknown values, and error propagation. Never suppress type errors—fix the root cause.

## Linting

Code must pass the project's linter. Find the linter config and run the correct lint command before committing.

## Formatting

Code must pass the project's formatter. Find the formatter config and run the correct format command before committing.

## Security

Vet dependencies before installing:

- Check for known vulnerabilities in the dependency tree
- Review the package (purpose, maintainer, update frequency)
- Pin exact versions—no caret or tilde ranges
- Do not install flagged packages without justification

## Code Quality

- Prefer clarity over cleverness.
- Do not abract logic into a function unless it needs to be imported in more than one place.
- No magic values—extract named constants.
- One thing per function.
- Validate inputs early.
- Handle every error path.
- Follow language and framework conventions.
- When defining any function/method; the main logic should always be at the top of the file and the helper logic should be below with clear & concise JSDOC describing each helper logic

---

## Codebase Rules

- **Do not re-export.** Import directly from the file where the symbol is defined. Never use barrel re-exports like `export { X } from './other-file'`.

### Component architecture

- **Pre-process data above the return.** Resolve links, filter items, transform data into render-ready shapes in variables at the top of the component. Never embed data transformation logic inside JSX maps.
- **Extract sub-components into `components/` subfolders.** For example, a `header/` component with internal pieces goes into `header/components/nav-link.tsx` and `header/components/theme-toggle.tsx`.
- **Keep the return block lean.** It should read as a layout description — a map of components, not a tangle of ternaries and inline lambdas.
- **Use `PrimitiveLink` as the sole link primitive.** Any component that renders a clickable navigation element must delegate to `@/components/primitives/link` — it handles internal vs external routing and `viewTransition`. Do not import `next/link` directly in new link-like components.
