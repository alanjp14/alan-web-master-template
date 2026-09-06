# Project standards

This template is a reusable starting point for enterprise dashboard
applications. These documents capture the conventions the template already
follows so that code added on top of it stays consistent with it.

They describe **what the codebase actually does today**, not aspirations.
When a rule and the code disagree, one of them is a bug — fix whichever is
wrong.

| Document                                          | Covers                                                                 |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| [Folder standards](folder-standards.md)           | Directory layout, what belongs where, where new code goes             |
| [Coding standards](coding-standards.md)           | TypeScript, React, imports, styling, state, testing, comments         |
| [Component standards](component-standards.md)     | Component anatomy, props, variants, states, accessibility, barrels    |
| [Naming standards](naming-standards.md)           | Files, directories, symbols, props, CSS tokens, commits, branches     |

## Using this repository as a template

On GitHub: **Use this template → Create a new repository**. Or:

```bash
gh repo create my-app --template <owner>/alan-web-master-template --private
```

Then work through the **Before you ship** checklist in the root
[README.md](../../README.md#before-you-ship): replace the placeholder routes
and starter page, wire real data, and add authentication.

## Enforcement

- **Automated**: `pnpm lint` (ESLint + `eslint-config-next`), `pnpm typecheck`
  (`tsc --strict`), `pnpm test` (Vitest), and `pnpm build` run in
  [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) on every push
  and PR to `main` and `develop`.
- **Review**: anything not machine-checkable (naming intent, component
  anatomy, comment quality) is a code-review responsibility. See
  [CONTRIBUTING.md](../../CONTRIBUTING.md).
