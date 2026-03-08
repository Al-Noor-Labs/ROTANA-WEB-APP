# GitHub Copilot Instructions — Rotana Store

> These instructions apply to GitHub Copilot when used in this repository.

## Project Overview

Rotana Store is a warehouse & store management platform built as a Turborepo monorepo:
- `apps/web` — Next.js 16 (App Router) frontend
- `apps/api` — NestJS backend API
- `apps/mobile` — React Native (Expo) mobile app
- `packages/shared` — Shared types, Zod schemas, utilities

## Key Rules

1. **Package Manager**: Use `pnpm` — never `npm` or `yarn`
2. **TypeScript Strict**: No `any`, no `@ts-ignore`, explicit types everywhere
3. **Server Components First**: Only use `'use client'` when React hooks are required
4. **Validation**: Zod for frontend, class-validator for NestJS DTOs
5. **Database**: Prisma ORM only — never raw SQL
6. **Auth**: Supabase Auth — every endpoint needs auth + role guards
7. **Styling**: Tailwind CSS + shadcn/ui — no inline styles
8. **Testing**: Vitest for unit tests, Playwright for e2e
9. **Imports**: Use `@rotana/shared` for shared code across apps

## Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- DB tables: `snake_case` plural
- DB columns: `snake_case`
- API routes: RESTful, `/api/v1/<resource>`
- Branches: `feature/ROT-<issue#>-short-desc`
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)

## Forbidden

- `any` type
- `console.log` (use logger)
- Default exports (except Next.js pages)
- `useEffect` for data fetching
- Raw SQL queries
- Inline styles
- Magic numbers/strings

## Always Include

- Error handling (try/catch with proper NestJS exceptions)
- Loading and error states in components
- Input validation on all API endpoints
- Auth and role guards on protected routes
- Proper TypeScript return types
