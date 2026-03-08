# ADR-0001: Turborepo Monorepo Architecture

| Field  | Value                     |
| ------ | ------------------------- |
| Status | Accepted                  |
| Date   | 2026-03-07                |
| Author | Ayeen (PM + Backend Lead) |

## Context

Rotana Store consists of 3 distinct applications:

1. **Web** — Next.js 16 admin dashboards + B2C/B2B customer portals
2. **API** — NestJS REST API backend
3. **Mobile** — React Native (Expo) mobile app

These applications share significant code: TypeScript types, Zod validation schemas, constants (roles, statuses, ID formats), and utility functions.

## Decision

We will use a **Turborepo monorepo** with **pnpm workspaces** to manage all three applications in a single repository.

### Structure

```
apps/
  web/      → Next.js 16
  api/      → NestJS
  mobile/   → React Native (Expo)
packages/
  shared/   → Shared types, schemas, utils, constants
  eslint-config/  → Shared ESLint config
  tsconfig/       → Shared TypeScript config
```

## Reasoning

### Why Monorepo (over Multi-Repo)

| Factor                  | Monorepo ✅                        | Multi-Repo ❌                    |
| ----------------------- | ---------------------------------- | -------------------------------- |
| Code sharing            | Trivial, via `@rotana/shared`      | Requires publishing npm packages |
| Type safety across apps | Instant, shared types              | Version mismatch risk            |
| CI/CD                   | Single pipeline, Turborepo caching | Separate pipelines per repo      |
| Refactoring             | Atomic commits across apps         | Coordinated PRs across repos     |
| Team coordination       | One PR, one review                 | Multiple PRs for related changes |
| Onboarding              | One repo to clone                  | Multiple repos to set up         |

### Why Turborepo (over Nx, Lerna)

- **Simplicity** — minimal config, fast to set up
- **Incremental builds** — only rebuilds what changed
- **Remote caching** — Vercel integration for CI speed
- **pnpm native** — first-class pnpm workspace support
- **No lock-in** — standard Node.js workspace conventions

### Why pnpm (over npm, yarn)

- **Faster** — ~2x faster installs than npm
- **Strict** — prevents phantom dependencies (you can't use a package you didn't declare)
- **Disk efficient** — content-addressable storage, no duplicate packages
- **Workspace native** — first-class monorepo support

## Consequences

### Positive

- Single source of truth for all code
- Type changes propagate instantly across all apps
- One CI pipeline to maintain
- Easier code reviews (all related changes in one PR)

### Negative

- Larger repo size over time
- CI runs may be slower without Turborepo caching configured
- All team members need to understand the monorepo structure
- Need disciplined `packages/shared` organization to avoid bloat

### Mitigations

- Configure Turborepo remote caching on Vercel
- Document folder structure in `PROJECT_CANON.md`
- Keep `packages/shared` focused — only truly shared code belongs there

## Alternatives Considered

1. **Separate repos** — rejected due to code sharing overhead
2. **Nx** — rejected due to complexity for a 5-person team
3. **Lerna** — rejected as largely deprecated in favor of Turborepo

---

_This ADR is final. Any changes require team discussion and a new ADR._
