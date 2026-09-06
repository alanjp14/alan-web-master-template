# features/

One directory per product feature. A feature module owns its own
components, hooks, and logic, and exposes a public surface through
`index.ts`.

```
features/
  <feature-name>/
    components/     Feature-specific components
    hooks/          Feature-specific hooks
    lib/            Feature-specific pure logic
    index.ts        What the rest of the app may import
```

Rules:

- A feature may depend on `components/`, `hooks/`, `lib/`, `config/`,
  `stores/`, `types/` — **not** on another feature.
- Code two features both need moves *down* to the shared directories, never
  *sideways* between features.
- Anything imported from outside the feature goes through its `index.ts`.

This template ships no features — product code starts here instead of
swelling `components/`. See
[docs/standards/folder-standards.md](../docs/standards/folder-standards.md).
