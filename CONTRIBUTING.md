# Contributing to Rotana Store

> **Read this before writing a single line of code.**
> This guide is mandatory for all team members — human and AI-assisted.

---

## Table of Contents

1. [Team & Ownership](#team--ownership)
2. [Git Workflow (GitFlow)](#git-workflow-gitflow)
3. [Branch Naming](#branch-naming)
4. [Commit Convention](#commit-convention)
5. [Pull Request Process](#pull-request-process)
6. [Code Review Checklist](#code-review-checklist)
7. [AI-Generated Code Policy](#ai-generated-code-policy)
8. [Environment Setup](#environment-setup)
9. [Communication](#communication)

---

## Team & Ownership

| Member  | Role                   | Modules Owned                                    | Review Buddy | Repo |
| ------- | ---------------------- | ------------------------------------------------ | ------------ | ---- |
| Ayeen   | PM + Backend Lead      | Auth, API architecture, DB schema, DevOps, CI/CD | Rahmath      | This repo |
| Rahmath | Backend Developer      | Inventory, Invoicing, Payroll, B2B credit logic  | Ayeen        | This repo |
| Faizan  | Frontend Developer     | B2C portal, Customer flows, Checkout UI          | Najeeb       | This repo |
| Najeeb  | Frontend Developer     | Admin dashboards, Warehouse/Store UI             | Faizan       | This repo |
| Zaka    | Mobile Developer       | Rotana mobile app (React Native, Expo)           | Ayeen        | **Separate repo** — not this codebase |

> **Note on Zaka**: Zaka works on the Rotana mobile app in a separate repository. The mobile app consumes the API Route Handlers in this repo via Bearer token auth. Zaka does not commit to this repository. Any API contract changes that could affect the mobile app must be communicated to Zaka before merging.

**Review Buddy** = the person who reviews your PRs by default. You may request additional reviewers for complex changes.

---

## Git Workflow (GitFlow)

```
main ─────────────────────────────────── (production, auto-deploys to Vercel)
  │
  └── develop ────────────────────────── (integration branch, all features merge here)
        │
        ├── feature/ROT-12-add-cart ──── (feature branches, from develop)
        ├── fix/ROT-45-stock-calc ────── (bug fix branches, from develop)
        └── ...
  │
  └── release/v1.0 ──────────────────── (release prep, from develop → main)
  │
  └── hotfix/ROT-99-payment-crash ───── (urgent fixes, from main → main + develop)
```

### Branch Lifecycle

1. Create branch from `develop` (or `main` for hotfixes)
2. Work on your task — commit often with conventional commits
3. Push and open a PR to `develop`
4. Get 1 approval from your Review Buddy
5. CI must pass (lint + type-check + build)
6. Squash-merge into `develop`
7. Delete the branch after merge

### Protected Branches

| Branch    | Direct Push | Force Push | PR Required | Approvals | CI Required |
| --------- | ----------- | ---------- | ----------- | --------- | ----------- |
| `main`    | ❌ No       | ❌ No      | ✅ Yes      | 1         | ✅ Yes      |
| `develop` | ❌ No       | ❌ No      | ✅ Yes      | 1         | ✅ Yes      |

---

## Branch Naming

Format: `<type>/ROT-<issue#>-<short-description>`

| Type       | Use Case                         | Example                           |
| ---------- | -------------------------------- | --------------------------------- |
| `feature/` | New functionality                | `feature/ROT-12-b2c-cart`         |
| `fix/`     | Bug fixes                        | `fix/ROT-45-stock-negative`       |
| `refactor/`| Code improvement, no new feature | `refactor/ROT-67-api-validation`  |
| `docs/`    | Documentation only               | `docs/ROT-89-api-docs`            |
| `chore/`   | Tooling, config, deps            | `chore/ROT-23-eslint-update`      |
| `hotfix/`  | Urgent production fix            | `hotfix/ROT-99-payment-crash`     |
| `release/` | Release preparation              | `release/v1.0`                    |

**Rules:**
- Always lowercase, hyphen-separated
- Always include the GitHub Issue number (`ROT-<number>`)
- Keep description under 5 words

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/). This is **enforced by commitlint** — non-compliant commits will be rejected.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to Use                          | Example                                      |
| ---------- | ------------------------------------ | -------------------------------------------- |
| `feat`     | New feature                          | `feat(cart): add quantity selector`           |
| `fix`      | Bug fix                              | `fix(inventory): correct stock deduction`    |
| `docs`     | Documentation only                   | `docs(api): add endpoint descriptions`       |
| `style`    | Formatting, no logic change          | `style(ui): fix button alignment`            |
| `refactor` | Code change, no feature/fix          | `refactor(auth): extract token validation`   |
| `test`     | Adding/fixing tests                  | `test(orders): add checkout unit tests`      |
| `chore`    | Tooling, config, deps                | `chore(deps): update next to 15.2`           |
| `perf`     | Performance improvement              | `perf(db): add index on orders.created_at`   |
| `ci`       | CI/CD changes                        | `ci: add type-check step to pipeline`        |


### Scopes (use the module name)

`auth`, `cart`, `checkout`, `inventory`, `warehouse`, `store`, `supplier`, `salesman`, `delivery`, `payroll`, `invoice`, `b2b`, `b2c`, `admin`, `db`, `api`, `ui`, `deps`, `ci`

> **Note**: `mobile` is no longer a valid scope in this repo. Mobile changes are made in the mobile app repository.

### Rules
- Subject line ≤ 72 characters
- Use imperative mood ("add" not "added" or "adds")
- No period at the end
- Body: explain **why**, not what (the diff shows what)

---

## Pull Request Process

### Before Opening a PR

- [ ] Your branch is up-to-date with `develop` (`git pull origin develop`)
- [ ] All lint errors are resolved (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm type-check`)
- [ ] You've tested your changes locally
- [ ] No `console.log` or debug code left in
- [ ] If changing an API route: confirm the change doesn't break the mobile app contract (check with Zaka)

### PR Template (auto-loaded)

Every PR will auto-populate with our template. Fill in **all sections**, don't delete them.

### After Opening

1. Assign your **Review Buddy** as reviewer
2. Link the GitHub Issue (`Closes #XX` in PR description)
3. Add appropriate labels (`frontend`, `backend`, `api`, `bug`, `feature`, `breaking`)
4. Wait for CI to pass — if it fails, fix it before requesting review
5. Respond to review comments within **24 hours**

### Merge Policy

- **Squash merge** into `develop` (keeps history clean)
- Delete branch after merge
- PR author merges after approval (not the reviewer)

---

## Code Review Checklist

Reviewers MUST check these before approving:

### Correctness
- [ ] Does the code do what the issue/ticket describes?
- [ ] Are edge cases handled? (null, empty, negative values, large inputs)
- [ ] Are error states handled gracefully? (try/catch, error boundaries)

### Security
- [ ] No secrets or credentials in code
- [ ] All user input is validated with Zod schemas before processing
- [ ] API route handlers check both authentication AND authorization (role)
- [ ] No raw SQL — use Prisma only
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] No `NEXT_PUBLIC_*` misuse — only expose what the browser truly needs

### Code Quality
- [ ] Follows `.rules/PROJECT_CANON.md` naming and structure rules
- [ ] No `any` type in TypeScript (use `unknown` if needed)
- [ ] No code duplication — uses shared utilities from `lib/`
- [ ] Functions are < 50 lines (ideally < 30)
- [ ] Components are < 200 lines

### API-Specific Checks (for Route Handler changes)
- [ ] Follows the 5-step pattern: Validate → Authenticate → Authorize → Execute → Respond
- [ ] Business logic is in `lib/services/` — not in the route handler
- [ ] Response uses `apiSuccess()` / `apiError()` helpers
- [ ] Zod schema is defined in `lib/schemas/` — not inline in the handler
- [ ] Bearer token auth works (mobile app compatibility)
- [ ] Endpoint is documented with JSDoc

### AI-Specific Checks
- [ ] No hallucinated APIs or library methods
- [ ] No made-up environment variables
- [ ] No phantom dependencies (packages not in package.json)
- [ ] No unnecessary abstractions (YAGNI)
- [ ] Pattern matches existing codebase conventions

### Performance
- [ ] No N+1 queries (use Prisma `include` and `select`)
- [ ] Large lists are paginated
- [ ] Images are optimized (next/image)
- [ ] No blocking operations on the main thread

---

## AI-Generated Code Policy

> **Every team member uses AI coding assistants. That's fine. But AI code is YOUR code — you own it.**

### Mandatory Rules

1. **Understand every line** — If you can't explain it, don't commit it
2. **Verify APIs exist** — AI hallucinates library methods. Check the docs.
3. **Check imports** — AI adds packages that aren't installed. Verify `package.json`.
4. **Test it** — AI-generated code is untested by default. YOU must test it.
5. **Follow the canon** — AI doesn't know our project rules. YOU must enforce `.rules/PROJECT_CANON.md`.
6. **No bulk AI commits** — Break AI-generated code into small, reviewable commits
7. **Flag it** — In your PR description, note which parts were AI-assisted (honesty helps reviewers)

### Forbidden AI Patterns

- ❌ Copying an entire AI-generated file without reading it
- ❌ Using AI to generate database migrations without reviewing the SQL
- ❌ Letting AI add new dependencies without team discussion
- ❌ AI-generated "clever" abstractions that no one else understands
- ❌ Using AI to bypass code review ("it's just AI-generated, looks fine")
- ❌ Letting AI introduce NestJS, Express, or any backend framework (we use Next.js Route Handlers only)
- ❌ Letting AI generate monorepo configs — this is a single Next.js app

---

## Environment Setup

### Prerequisites

- **Node.js** ≥ 20.x (LTS)
- **pnpm** ≥ 9.x (`npm install -g pnpm`)
- **Git** ≥ 2.40
- **VS Code** or **Cursor** (recommended)

### First-Time Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd ROTANA-WEB-APP

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env.local
# Fill in values from Google Chat pinned message

# 4. Set up the database
pnpm db:migrate
pnpm db:seed

# 5. Start development
pnpm dev
```

See [docs/SETUP.md](docs/SETUP.md) for detailed instructions.

---

## Communication

| Channel        | Purpose                                                     |
| -------------- | ----------------------------------------------------------- |
| Google Chat    | Daily standups, quick questions, .env updates, urgent alerts |
| GitHub Issues  | All tasks, bugs, and feature requests                       |
| GitHub PRs     | Code-specific discussions                                   |

> **⚠️ Secrets Sharing**: Environment variable values are shared via Google Chat pinned message. Never share secrets in open channels — use the dedicated team group only. For production secrets, Ayeen&Rahmath manages them directly on Vercel/Supabase dashboards.

> **⚠️ Mobile API Contract**: If you modify or add an API route that the mobile app consumes, notify Zaka in Google Chat before merging. Breaking changes to existing API routes require coordination across both repos.

### Daily Standup (on Google Chat)

Post by **10:00 AM IST** every working day:

```
🟢 Yesterday: [what you completed]
🔵 Today: [what you plan to do]
🔴 Blockers: [anything stopping you, or "none"]
```

---

*Last updated: March 2026 | Maintained by Ayeen (PM)*
