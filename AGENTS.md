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

_Add codebase-specific rules, conventions, and architectural guidelines here._
