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

## File Structure & Type Safety

### File ordering

Every file must follow this top-to-bottom order. Separate each section with exactly one blank line.

1. **`'use client'` / `'use server'` directive** (if applicable)
2. **Imports** — external first, then internal (`@/`)
3. **Type definitions** — interfaces, type aliases used by the main export
4. **Main export** — the primary component, function, or value the file exists for
5. **Named constants** — `const` declarations that the main export or helpers reference
6. **Helper functions** — unexported functions that the main export delegates to
7. **Module-level side effects** — `loader.init()`, subscription setups, etc. (see rules below)

The main export always sits above its helpers.  A reader opening the file should see *what* it does before *how*.

### One concern per file

- **Data** (token lists, language definitions, configuration objects) belongs in a dedicated file — not mixed with registration logic or React components.
- **Logic** (language registration, init routines) belongs in its own file — not stuffed into a component.
- **UI** (React providers, components) imports and uses the data and logic modules.

A file that contains a 49-line token array, a 40-line registration function, a type, *and* a React component is doing too much. Split it into `constants.ts`, `register-mermaid-language.ts`, and `monaco-mermaid-provider.tsx`.

### Type discipline

- **Never use `any`.**  The eslint config enforces `@typescript-eslint/no-explicit-any: error` — do not disable it.
- For external modules whose types are unavailable at build time (e.g. Monaco loaded from CDN), create a minimal `.d.ts` declaration file with only the members you use.
- If a value genuinely can be anything, use `unknown` and narrow it with type guards before use.
- **Never use blanket `eslint-disable` comments.**  Each disable must be a single-line `// eslint-disable-next-line` with a trailing comment that justifies *why* it is unavoidable.  Example:
  ```ts
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- monaco.languages is only available at runtime; types are loaded from CDN
  ```
  Disabling `no-unsafe-assignment`, `no-unsafe-call`, or `no-unsafe-member-access` across a block is never acceptable — it hides real type errors.

### Error handling

- **Every promise must handle rejection.**  A bare `.then(...)` without `.catch(...)` is a bug.  Use `.catch()` or a `try/catch` around `await`.
- **Module-level side effects must be wrapped** with error handling and a JSDOC block that explains *why* the code runs at module scope (not inside a component or hook).  Example:
  ```ts
  /**
   * Register the Mermaid Monarch tokenizer before any CodeField mounts.
   *
   * loader.init() is a singleton — this call and the one inside
   * @monaco-editor/react share the same Monaco instance.  Running at
   * module evaluation time guarantees registration happens before the
   * first editor is created (a useEffect would be too late).
   */
  function registerMermaidLanguage(): void {
    loader
      .init()
      .then((monaco) => { /* ... */ })
      .catch((err) => {
        if (err?.type !== 'cancelation') {
          console.error('Failed to register Mermaid language for Monaco:', err)
        }
      })
  }

  registerMermaidLanguage()
  ```

### JSDOC

- **Every exported symbol must have a JSDOC comment.**  Functions, components, types, and exported constants.
- **Helper functions must have JSDOC** that describes *what* the function does and *why* it exists (not just how).
- Use `@param`, `@returns`, and `@throws` tags consistently.
- JSDOC sits immediately above the symbol it describes — no blank line between the comment and the declaration.

---

## Codebase Rules

- **Do not re-export.** Import directly from the file where the symbol is defined. Never use barrel re-exports like `export { X } from './other-file'`.

### Component architecture

- **Pre-process data above the return.** Resolve links, filter items, transform data into render-ready shapes in variables at the top of the component. Never embed data transformation logic inside JSX maps.
- **Extract sub-components into `components/` subfolders.** For example, a `header/` component with internal pieces goes into `header/components/nav-link.tsx` and `header/components/theme-toggle.tsx`.
- **Keep the return block lean.** It should read as a layout description — a map of components, not a tangle of ternaries and inline lambdas.
- **Use `PrimitiveLink` as the sole link primitive.** Any component that renders a clickable navigation element must delegate to `@/components/primitives/link` — it handles internal vs external routing and `viewTransition`. Do not import `next/link` directly in new link-like components.
