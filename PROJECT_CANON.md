# PROJECT CANON — Rotana Store

> **This is the single source of truth for all technical decisions.**
> Every team member and AI assistant MUST follow these rules. No exceptions.
> Last updated: March 2026

---

## 1. Tech Stack (Locked — No Substitutions)

| Layer            | Technology                    | Version   |
| ---------------- | ----------------------------- | --------- |
| **Monorepo**     | Turborepo                     | Latest    |
| **Package Mgr**  | pnpm                          | ≥ 9.x     |
| **Frontend**     | Next.js (App Router)          | 16.x      |
| **Backend API**  | NestJS                        | Latest    |
| **Language**     | TypeScript (strict mode)      | ≥ 5.x     |
| **Database**     | PostgreSQL via Supabase       | 15+       |
| **ORM**          | Prisma                        | ≥ 6.x     |
| **Auth**         | Supabase Auth + JWT           | -         |
| **Payments**     | Razorpay / Stripe             | -         |
| **File Storage** | Supabase Storage / Cloudflare R2 | -      |
| **State Mgmt**   | Zustand                       | ≥ 5.x     |
| **UI Components**| shadcn/ui                     | Latest    |
| **CSS**          | Tailwind CSS                  | 4.x       |
| **Validation**   | Zod                           | ≥ 4.x     |
| **API Client**   | TanStack React Query          | ≥ 5.x     |
| **Charts**       | Recharts                      | 3.x       |
| **Icons**        | Lucide React                  | Latest    |
| **Testing**      | Vitest + Playwright           | Latest    |
| **CI/CD**        | GitHub Actions                | -         |
| **Hosting**      | Vercel (frontend) + Supabase  | -         |
| **Mobile**       | React Native (Expo)           | Latest    |

> **Rule**: Do NOT add new dependencies without team discussion in Google Chat and Ayeen's approval.

---

## 2. Monorepo Structure

```
ROTANA-WEB-APP/
├── apps/
│   ├── web/                    # Next.js 16 frontend
│   │   ├── app/                # App Router pages & layouts
│   │   │   ├── (auth)/         # Auth routes (login, register)
│   │   │   ├── (customer)/     # B2C customer portal
│   │   │   ├── (b2b)/          # B2B buyer portal
│   │   │   ├── (admin)/        # Admin dashboards
│   │   │   │   ├── warehouse/
│   │   │   │   ├── store/
│   │   │   │   ├── supplier/
│   │   │   │   ├── salesman/
│   │   │   │   ├── delivery/
│   │   │   │   ├── payroll/
│   │   │   │   ├── inventory/
│   │   │   │   └── invoices/
│   │   │   ├── api/            # Next.js API routes (BFF only)
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components (DO NOT EDIT)
│   │   │   ├── shared/         # Shared project components
│   │   │   ├── forms/          # Form components
│   │   │   ├── tables/         # Data table components
│   │   │   └── layouts/        # Layout components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions, constants
│   │   ├── stores/             # Zustand stores
│   │   ├── types/              # TypeScript type definitions
│   │   └── public/             # Static assets
│   │
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/        # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── inventory/
│   │   │   │   ├── warehouse/
│   │   │   │   ├── store/
│   │   │   │   ├── suppliers/
│   │   │   │   ├── salesman/
│   │   │   │   ├── delivery/
│   │   │   │   ├── payroll/
│   │   │   │   ├── invoices/
│   │   │   │   └── b2b/
│   │   │   ├── common/         # Shared guards, pipes, filters, decorators
│   │   │   ├── config/         # Configuration module
│   │   │   ├── database/       # Prisma service, migrations
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── test/
│   │
│   └── mobile/                 # React Native (Expo)
│       ├── app/
│       ├── components/
│       └── ...
│
├── packages/
│   ├── shared/                 # Shared types, utils, Zod schemas
│   │   ├── src/
│   │   │   ├── types/          # Shared TypeScript interfaces
│   │   │   ├── schemas/        # Shared Zod validation schemas
│   │   │   ├── constants/      # Shared constants (roles, statuses, etc.)
│   │   │   └── utils/          # Shared utility functions
│   │   └── package.json
│   │
│   ├── eslint-config/          # Shared ESLint configuration
│   └── tsconfig/               # Shared TypeScript configuration
│
├── docs/                       # All documentation
│   ├── adr/                    # Architecture Decision Records
│   ├── CODE_STYLE.md
│   ├── SETUP.md
│   ├── SPRINT_PLAN.md
│   └── TEAM_MATRIX.md
│
├── .github/                    # GitHub config
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── CONTRIBUTING.md
├── PROJECT_CANON.md            # ← YOU ARE HERE
├── .cursorrules
├── .prettierrc
├── .commitlintrc.json
├── turbo.json
├── pnpm-workspace.yaml
└── package.json                # Root workspace config
```

---

## 3. Naming Conventions

### Files & Directories

| Type                   | Convention            | Example                         |
| ---------------------- | --------------------- | ------------------------------- |
| React components       | PascalCase            | `OrderCard.tsx`                 |
| Pages/layouts (App Router) | kebab-case dir + `page.tsx` | `app/(admin)/warehouse/page.tsx` |
| Hooks                  | camelCase, `use` prefix | `useOrderStatus.ts`           |
| Utilities              | camelCase             | `formatCurrency.ts`             |
| Constants              | camelCase file, UPPER_SNAKE values | `orderStatuses.ts` → `ORDER_PENDING` |
| Types/Interfaces       | PascalCase            | `Order`, `OrderStatus` |
| Zod schemas            | camelCase, `Schema` suffix | `createOrderSchema`        |
| NestJS modules         | kebab-case directory  | `src/modules/warehouse/`        |
| NestJS services        | PascalCase, `.service.ts` | `WarehouseService`          |
| NestJS controllers     | PascalCase, `.controller.ts` | `WarehouseController`    |
| NestJS DTOs            | PascalCase, `.dto.ts` | `CreateOrderDto`                |
| Test files             | Same name + `.test.ts` or `.spec.ts` | `OrderCard.test.tsx`  |

### Database

| Type        | Convention      | Example                     |
| ----------- | --------------- | --------------------------- |
| Tables      | snake_case, plural | `purchase_orders`          |
| Columns     | snake_case      | `created_at`, `total_amount`|
| Primary Key | `id` (UUID)     | `id UUID DEFAULT gen_random_uuid()` |
| Foreign Key | `<table>_id`    | `order_id`, `customer_id`   |
| Indexes     | `idx_<table>_<columns>` | `idx_orders_customer_id` |
| Enums       | PascalCase      | `OrderStatus`, `UserRole`   |
| Migrations  | Timestamp prefix | `20260307_create_orders`   |

### API Endpoints

| Convention        | Example                                   |
| ----------------- | ----------------------------------------- |
| RESTful, plural nouns | `GET /api/v1/orders`                  |
| Nest resources    | `POST /api/v1/orders`                     |
| Sub-resources     | `GET /api/v1/orders/:id/items`            |
| Query params      | `GET /api/v1/orders?status=pending&page=1`|
| Version prefixed  | `/api/v1/...`                              |

### Git Branches

See [CONTRIBUTING.md](./CONTRIBUTING.md#branch-naming).

---

## 4. Forbidden Patterns ❌

These will be **rejected in code review**. No exceptions.

### TypeScript
- ❌ `any` type — use `unknown` and narrow with type guards
- ❌ `// @ts-ignore` or `// @ts-expect-error` without a linked issue
- ❌ Non-null assertion `!` without justification
- ❌ `var` keyword — use `const` or `let`
- ❌ `console.log` in committed code — use `pino` logger (backend) or remove before commit (frontend)
- ❌ Magic numbers/strings — use named constants
- ❌ Default exports (except Next.js pages) — use named exports

### React / Next.js
- ❌ `'use client'` on every component — default to Server Components
- ❌ `useEffect` for data fetching — use Server Components or React Query
- ❌ Inline styles — use Tailwind classes
- ❌ `dangerouslySetInnerHTML` — never, unless sanitized AND approved by Ayeen
- ❌ Direct DOM manipulation — use React refs only when necessary
- ❌ Prop drilling beyond 2 levels — use Zustand or Context

### NestJS / Backend
- ❌ Raw SQL queries — use Prisma Client
- ❌ Business logic in controllers — controllers are thin, logic goes in services
- ❌ Missing input validation — every endpoint MUST use DTOs with class-validator or Zod
- ❌ Missing auth guard — every non-public endpoint MUST have `@UseGuards(AuthGuard)`
- ❌ Hardcoded secrets — use environment variables
- ❌ `try/catch` swallowing errors silently — always log or rethrow
- ❌ N+1 queries — use Prisma `include` or `select` properly

### Database
- ❌ Migrations that drop columns/tables without team discussion
- ❌ Missing indexes on foreign keys
- ❌ Nullable columns without business justification
- ❌ `CASCADE DELETE` without explicit approval

### General
- ❌ Committing `.env` files
- ❌ Committing `node_modules`, `.next`, `dist`
- ❌ Large binary files in git (use Supabase Storage)
- ❌ Adding dependencies without team discussion

---

## 5. Required Patterns ✅

### Every API Endpoint Must

```
1. Validate input       → Zod schema or NestJS DTO
2. Check authentication → AuthGuard
3. Check authorization  → RolesGuard (RBAC)
4. Execute business logic → Service layer
5. Handle errors        → Global exception filter
6. Return typed response → Proper HTTP status + typed DTO
```

### Every React Component Must

```
1. Be typed             → Props interface, no 'any'
2. Handle loading state → Skeleton or spinner
3. Handle error state   → Error boundary or inline error
4. Handle empty state   → Empty state message
5. Be accessible        → Proper ARIA labels, keyboard nav
```

### Every Database Migration Must

```
1. Be reversible        → Include down migration
2. Be reviewed          → Ayeen must approve all schema changes
3. Be tested            → Run on local DB before committing
4. Be documented        → Comment explaining the change
```

---

## 6. Security Requirements

### Authentication
- Supabase Auth for user management
- JWT tokens with short expiry (15 min access, 7 day refresh)
- Refresh token rotation enabled
- Session management via Supabase

### Authorization (RBAC)
- 8 roles as defined in SRD: Super Admin, Warehouse Manager, Store Manager, Supplier, Salesman, B2C Customer, B2B Business Buyer, Delivery Staff
- Role checks on EVERY protected endpoint
- Row Level Security (RLS) on Supabase tables
- Principle of least privilege — each role sees only their data

### Input Validation
- ALL user input validated server-side with Zod/class-validator
- Frontend validation is for UX only — never trust client data
- Sanitize all string inputs (XSS prevention)
- Validate file uploads (type, size, content)

### Data Protection
- Encrypt sensitive data at rest (Supabase handles this)
- HTTPS everywhere (enforced by Vercel + Supabase)
- No PII in logs
- CORS configured to allow only our domains
- Rate limiting on all API endpoints
- CSP headers configured

### India-Specific Compliance
- GST data handling per government guidelines
- Data stored in India region (Supabase Mumbai / ap-south-1)
- Payment data handled by Razorpay (PCI DSS compliant — we never store card data)

---

## 7. Environment Variables

### Naming Convention

```
# Format: <SERVICE>_<PURPOSE>
NEXT_PUBLIC_SUPABASE_URL=...           # Public, exposed to browser
NEXT_PUBLIC_SUPABASE_ANON_KEY=...      # Public
SUPABASE_SERVICE_ROLE_KEY=...          # Secret, server-only
DATABASE_URL=...                       # Secret
RAZORPAY_KEY_ID=...                    # Secret
RAZORPAY_KEY_SECRET=...                # Secret
JWT_SECRET=...                         # Secret
```

### Rules

- `NEXT_PUBLIC_*` prefix = safe to expose in browser
- Everything else = server-only, NEVER expose to client
- Store in `.env.local` (gitignored)
- **Dev secrets**: Shared via pinned message in the dedicated team Google Chat group (not open channels)
- **Production secrets**: Managed directly on Vercel/Supabase dashboards by Ayeen only
- Update `.env.example` when adding new variables (values = placeholder only)
- Rotate secrets immediately if accidentally exposed

---

## 8. Error Handling

### Backend (NestJS)

```typescript
// ✅ CORRECT — use NestJS built-in exceptions
throw new NotFoundException('Order not found');
throw new BadRequestException('Invalid quantity');
throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Insufficient permissions');

// ❌ WRONG — generic errors
throw new Error('something went wrong');
```

### Frontend (Next.js)

```typescript
// ✅ CORRECT — error boundaries + typed errors
// app/(admin)/warehouse/error.tsx — automatic error boundary
// Use React Query's error handling for API calls

// ❌ WRONG — unhandled promise rejections
fetch('/api/orders').then(res => res.json()); // Missing .catch()
```

---

## 9. ID Generation System

As per SRD, all entities use formatted IDs:

| Entity       | Format              | Example           |
| ------------ | ------------------- | ----------------- |
| B2C Customer | `CUS-YYYY-NNNNN`   | `CUS-2026-00001`  |
| B2B Business | `BIZ-YYYY-NNNNN`   | `BIZ-2026-00001`  |
| Order (B2C)  | `ORD-B2C-NNNNNNN`  | `ORD-B2C-0000001` |
| Order (B2B)  | `ORD-B2B-NNNNNNN`  | `ORD-B2B-0000001` |
| Invoice      | `INV-YYYY-NNNNN`   | `INV-2026-00001`  |
| Purchase Order | `PO-YYYY-NNNNN`  | `PO-2026-00001`   |
| Salesman     | `SAL-YYYY-NNN`     | `SAL-2026-001`    |
| Delivery     | `DEL-YYYY-NNNNN`   | `DEL-2026-00001`  |

> These are generated server-side via a shared utility in `packages/shared/src/utils/id-generator.ts`. The DB primary key remains UUID — these are display IDs stored in a separate column.

---

*This document is maintained by Ayeen (PM + Backend Lead). Any changes require team notification.*
