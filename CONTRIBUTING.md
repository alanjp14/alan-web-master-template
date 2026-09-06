# Contributing

This document is the git workflow for this repository — the branch model,
and how a change gets from a local edit to production.

## Branch model

| Branch         | Purpose                                              | Lives forever? |
| -------------- | ----------------------------------------------------- | -------------- |
| `main`         | Production. Every commit here has shipped.             | Yes            |
| `develop`      | Integration branch. Where finished features land first. | Yes          |
| `feature/*`    | One feature or piece of work in progress.              | No — deleted after merge |
| `release/*`    | Stabilizing a version before it ships.                 | No — deleted after merge |
| `hotfix/*`     | An urgent fix to something already in production.      | No — deleted after merge |

```
main ──●───────────────●───────────────●────────────▶  (tags: v1.0.0, v1.1.0, ...)
        \             / \             /
         \  release/* /   \ hotfix/*  /
          \          /     \         /
develop ───●────●───●───────●───────●──▶
            \  /         \  /
             ●            ●
        feature/*    feature/*
```

Name `feature/*`, `hotfix/*` and `release/*` branches descriptively:
`feature/user-invites`, `hotfix/sidebar-crash`, `release/1.2.0`. Prefix with
a ticket number if you track one: `feature/APP-123-user-invites`.

### `main`

Always deployable. Nothing is committed to `main` directly — it only
receives merges from `release/*` (a normal release) or `hotfix/*` (an
emergency fix). Every merge into `main` gets tagged with the version it
represents (`git tag v1.2.0`).

### `develop`

The trunk for ongoing work. `feature/*` branches fork from here and merge
back here. This is what CI (`.github/workflows/ci.yml`) validates on every
push and pull request — `develop` should never be left in a state that
fails `lint` / `typecheck` / `build`.

### `feature/*`

```bash
git switch develop
git pull
git switch -c feature/short-description
# ... commit your work ...
git push -u origin feature/short-description
```

Open a pull request into `develop` when it's ready (see **Pull request
workflow** below). Delete the branch once it's merged — `feature/*`
branches are disposable; the history lives on in `develop`.

### `release/*`

Cut when `develop` has everything the next version needs and it's time to
stabilize:

```bash
git switch develop
git pull
git switch -c release/1.2.0
```

Only bug fixes and release chores (version bumps, changelog) land on a
release branch — no new features. When it's stable:

```bash
git switch main
git merge --no-ff release/1.2.0
git tag v1.2.0
git switch develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0
```

It merges into **both** `main` and `develop` so the fixes made while
stabilizing aren't lost on the trunk.

### `hotfix/*`

For a bug in production that can't wait for the next release. Forks from
`main`, not `develop`:

```bash
git switch main
git pull
git switch -c hotfix/short-description
# ... fix, commit ...
git switch main
git merge --no-ff hotfix/short-description
git tag v1.2.1
git switch develop
git merge --no-ff hotfix/short-description
git branch -d hotfix/short-description
```

Same reasoning as a release branch: merge into both `main` (to ship it) and
`develop` (so it isn't reintroduced by the next feature merge).

## Pull request workflow

1. Branch from `develop` (or `main`, for a `hotfix/*`) using the naming
   convention above.
2. Commit as you go. Keep commits scoped and the message describing *why*,
   not just *what*.
3. Before opening the PR, run the same gate CI runs:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```
4. Push and open the PR against `develop` (or `main`, for a `hotfix/*`).
   Describe what changed and why; link the ticket if there is one.
5. CI must pass. Fix forward rather than force-pushing over review comments
   once someone's looked at it.
6. Address review feedback as new commits — don't rewrite history mid-review.
7. Once approved and green, merge (see **Merge workflow**) and delete the
   branch.

## Merge workflow

- **`feature/*` → `develop`**: squash merge. A feature's in-progress commits
  ("wip", "fix typo", "address review") are noise in `develop`'s history;
  one clean commit per feature is what you want to `git log` or `git bisect`
  later.
- **`release/*` → `main`** and **`release/*` → `develop`**: merge commit
  (`--no-ff`), not squash. You want the release's individual fix commits
  preserved and a merge commit marking where the release landed.
- **`hotfix/*` → `main`** and **`hotfix/*` → `develop`**: merge commit
  (`--no-ff`), same reasoning.
- Never merge with unresolved CI failures. Never merge `main` backward into
  `develop` casually to "sync up" — the only things that flow into `develop`
  outside of `feature/*` merges are `release/*` and `hotfix/*` merges,
  specifically so its history stays legible.

## Release workflow

1. Confirm `develop` is green (CI passing) and has everything the release
   needs.
2. Cut `release/x.y.z` from `develop`.
3. Stabilize: bug fixes only, plus the version bump. Update `version` in
   `package.json` and any changelog on this branch.
4. Merge into `main` (`--no-ff`), tag it (`vX.Y.Z`), merge into `develop`
   (`--no-ff`), delete the release branch.
5. Deploy from the tag.
6. If something's wrong in production afterward, that's what `hotfix/*` is
   for — don't reopen the release branch.

## Commit messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/):
`type(scope): summary`, e.g. `feat(dashboard): add revenue trend card` or
`fix(sidebar): correct collapse animation on mobile`. Common types: `feat`,
`fix`, `chore`, `docs`, `refactor`, `perf`, `test`. It's what makes `git log
--oneline` skimmable and enables automated changelogs later if this repo
adopts one.
