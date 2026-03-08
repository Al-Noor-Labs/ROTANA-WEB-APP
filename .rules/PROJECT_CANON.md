# PROJECT CANON — Rotana Store

# The single source of truth for the entire codebase.

# Read this before touching any file. Update this when conventions change.

# Last updated: March 2026 | Maintained by Ayeen (PM + Backend )

---

## 1. Tech Stack (Pinned Versions)

| Layer               | Technology           | Version           | Notes                                         |
| ------------------- | -------------------- | ----------------- | --------------------------------------------- |
| **Framework**       | Next.js              | 15.x (App Router) | No Pages Router                               |
| **Language**        | TypeScript           | 5.x               | strict mode — no exceptions                   |
| **Package Manager** | pnpm                 | ≥ 9.x             | never use npm or yarn                         |
| **UI Components**   | shadcn/ui            | latest            | managed via CLI — don't edit `components/ui/` |
| **Styling**         | Tailwind CSS         | 4.x               | utility-first, no CSS modules                 |
| **Database**        | PostgreSQL           | 16.x              | hosted on Supabase                            |
| **ORM**             | Prisma               | 5.x               | no raw SQL                                    |
| **Auth**            | Supabase Auth        | latest            | + JWT Bearer for API consumers (mobile)       |
| **Validation**      | Zod                  | 3.x               | all boundaries: API, actions, forms           |
| **Client State**    | Zustand              | 4.x               | dashboards, cart, UI state                    |
| **Server State**    | TanStack React Query | 5.x               | client-side data fetching only                |
| **Forms**           | react-hook-form      | 7.x               | always with Zod resolver                      |
| **File Storage**    | Cloudflare R2        | —                 | invoices, payslips, supplier docs             |
| **Payments**        | Razorpay or Stripe   | —                 | TBD by client                                 |
| **Email**           | Resend               | —                 | transactional emails                          |
| **Logging**         | Pino                 | 9.x               | structured JSON logs                          |
| **Testing**         | Vitest + Playwright  | latest            | unit + E2E                                    |
| **CI/CD**           | GitHub Actions       | —                 | lint → type-check → build → test → deploy     |
| **Hosting**         | Vercel               | —                 | web + API (Next.js Route Handlers)            |

> **Mobile App Note**: The Rotana mobile app (React Native, Expo) is developed by Zaka in a **separate repository**. It consumes this project's API Route Handlers via Bearer token auth. This repository has zero mobile code.

---

## 2. Folder Structure

```
ROTANA-WEB-APP/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (login, register, forgot-password)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (admin)/                  # Internal staff dashboards (auth required)
│   │   ├── layout.tsx            # Admin shell layout (sidebar, topbar)
│   │   ├── dashboard/page.tsx    # Super admin overview
│   │   ├── warehouse/            # Warehouse Manager module
│   │   ├── store/                # Store Manager module
│   │   ├── supplier/             # Supplier portal
│   │   ├── salesman/             # Salesman dashboard
│   │   ├── delivery/             # Delivery management
│   │   ├── inventory/            # Inventory & stock
│   │   ├── payroll/              # Payroll & commissions
│   │   └── finance/              # Invoices, due bills, finance
│   │
│   ├── (b2c)/                    # B2C Customer Portal (public + auth)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Homepage / catalogue
│   │   ├── product/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── orders/page.tsx
│   │
│   ├── (b2b)/                    # B2B Business Buyer Portal
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── orders/page.tsx
│   │   └── invoices/page.tsx
│   │
│   ├── api/                      # REST API Route Handlers
│   │   ├── v1/                   # Version namespace (API stability)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts      # GET (list), POST (create)
│   │   │   │   └── [id]/route.ts # GET, PATCH, DELETE
│   │   │   ├── products/route.ts
│   │   │   ├── inventory/route.ts
│   │   │   ├── warehouse/route.ts
│   │   │   ├── suppliers/route.ts
│   │   │   ├── salesman/route.ts
│   │   │   ├── delivery/route.ts
│   │   │   ├── payroll/route.ts
│   │   │   ├── invoices/route.ts
│   │   │   ├── b2b/route.ts
│   │   │   └── payments/
│   │   │       └── webhook/route.ts
│   │
│   ├── layout.tsx                # Root layout (fonts, providers)
│   ├── not-found.tsx
│   └── global-error.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui managed — DO NOT EDIT MANUALLY
│   ├── shared/                   # Reusable across multiple modules
│   │   ├── DataTable/
│   │   ├── SearchBar/
│   │   ├── StatusBadge/
│   │   └── ExportButton/
│   ├── forms/                    # Form components (react-hook-form + Zod)
│   ├── layouts/                  # Layout components (Sidebar, Topbar, Shell)
│   └── [module]/                 # Module-specific components (e.g., components/orders/)
│
├── lib/
│   ├── api/                      # API helpers
│   │   ├── response.ts           # apiSuccess(), apiError() helpers
│   │   └── middleware.ts         # withAuth(), withRole() wrappers
│   ├── services/                 # Business logic (pure TS — no framework deps)
│   │   ├── orders.service.ts
│   │   ├── inventory.service.ts
│   │   ├── auth.service.ts
│   │   ├── payroll.service.ts
│   │   └── ...
│   ├── schemas/                  # Zod schemas (shared: API + forms)
│   │   ├── order.schema.ts
│   │   ├── product.schema.ts
│   │   └── ...
│   ├── types/                    # TypeScript interfaces and types
│   │   ├── api.types.ts          # IApiSuccess, IApiError, IPaginatedResponse
│   │   ├── auth.types.ts         # IAuthUser, UserRole
│   │   └── [module].types.ts
│   ├── constants/                # Named constants (no magic strings/numbers)
│   │   ├── roles.ts              # USER_ROLES enum
│   │   ├── status.ts             # ORDER_STATUS, DELIVERY_STATUS, etc.
│   │   └── id-formats.ts        # CUS-2026-*, ORD-B2C-*, etc.
│   ├── utils/                    # Pure utility functions
│   │   ├── id-generator.ts       # generateCustomerId(), generateOrderId(), etc.
│   │   ├── formatters.ts         # formatCurrency(), formatDate(), etc.
│   │   └── validators.ts
│   ├── db/
│   │   └── prisma.ts             # Prisma client singleton
│   ├── auth/
│   │   └── session.ts            # getSession(), verifyToken(), getUserFromRequest()
│   └── logger.ts                 # Pino logger instance
│
├── hooks/                        # Custom React hooks (client only)
│   ├── useOrderStatus.ts
│   └── useDebounce.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/                       # Static assets
│
├── __tests__/                    # Integration + E2E tests
│
├── docs/                         # Project documentation
│   ├── Rotana_SRD_v1.docx.md
│   ├── API_CONVENTIONS.md        # API route handler patterns
│   ├── CODE_STYLE.md             # Code examples for common patterns
│   ├── SETUP.md                  # Local dev setup guide
│   └── BRANCH_PROTECTION.md     # GitHub branch rules
│
├── .rules/
│   └── PROJECT_CANON.md          # ← THIS FILE
│
├── .rules_ai                     # AI assistant rules file
├── CONTRIBUTING.md               # Team workflow rules
├── README.md                     # Project overview
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── eslint.config.mjs
└── .prettierrc
```

---

## 3. Naming Conventions

### Files & Directories

| Pattern              | Rule                     | Example                                |
| -------------------- | ------------------------ | -------------------------------------- |
| Next.js route files  | lowercase                | `page.tsx`, `layout.tsx`, `route.ts`   |
| React components     | PascalCase               | `OrderStatusBadge.tsx`                 |
| Services / utilities | camelCase with suffix    | `orders.service.ts`, `id-generator.ts` |
| Schemas              | camelCase with suffix    | `order.schema.ts`                      |
| Types                | camelCase with suffix    | `auth.types.ts`                        |
| Hooks                | camelCase, `use` prefix  | `useOrderStatus.ts`                    |
| Constants            | camelCase with suffix    | `roles.ts`                             |
| Test files           | same as source + `.test` | `orders.service.test.ts`               |

### TypeScript

| Pattern               | Rule                       | Example                               |
| --------------------- | -------------------------- | ------------------------------------- |
| Interfaces            | `I` prefix, PascalCase     | `ICreateOrderRequest`                 |
| Types (unions/mapped) | PascalCase, no prefix      | `OrderStatus`, `UserRole`             |
| Zod schemas           | camelCase, `Schema` suffix | `createOrderSchema`                   |
| Enums                 | NEVER use TS enums         | Use Zod enum or `as const` object     |
| Constants             | SCREAMING_SNAKE_CASE       | `MAX_CREDIT_LIMIT`                    |
| Functions             | camelCase, verb first      | `getOrderById`, `calculateCommission` |
| React components      | PascalCase                 | `OrderTable`, `WarehouseDashboard`    |

### Database (Prisma / PostgreSQL)

| Element         | Rule                   | Example                                         |
| --------------- | ---------------------- | ----------------------------------------------- |
| Table names     | snake_case, plural     | `purchase_orders`, `order_items`                |
| Column names    | snake_case             | `created_at`, `customer_id`                     |
| Primary key     | `id` (UUID)            | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign keys    | `<entity>_id`          | `customer_id`, `supplier_id`                    |
| Timestamps      | always include both    | `created_at`, `updated_at`                      |
| Boolean columns | `is_` or `has_` prefix | `is_active`, `has_gst`                          |
| Index names     | `idx_<table>_<column>` | `idx_orders_customer_id`                        |

### Environment Variables

| Pattern       | Rule                  | Example                                |
| ------------- | --------------------- | -------------------------------------- |
| Browser-safe  | `NEXT_PUBLIC_` prefix | `NEXT_PUBLIC_SUPABASE_URL`             |
| Server-only   | no prefix             | `SUPABASE_SERVICE_ROLE_KEY`            |
| Secret values | NEVER in codebase     | stored in Vercel Environment Variables |

---

## 4. Forbidden Patterns

```typescript
// ❌ any type
const data: any = response.json();

// ❌ TypeScript enums (use Zod enum or as const)
enum UserRole { ADMIN = 'ADMIN' }

// ❌ Direct Prisma calls from components or route handlers
// (app/api/orders/route.ts calling prisma directly)
const order = await prisma.order.findMany(); // ← move to lib/services/

// ❌ useEffect for data fetching
useEffect(() => { fetch('/api/orders').then(...) }, []);

// ❌ default exports for services/utilities
export default function getOrders() {}

// ❌ console.log in committed code
console.log('debug:', data);

// ❌ Magic strings
if (user.role === 'super_admin') {} // use ROLES.SUPER_ADMIN constant

// ❌ Raw SQL
await prisma.$executeRaw`SELECT * FROM orders`;

// ❌ Inline styles
<div style={{ color: 'red' }}>

// ❌ Secrets in client components
const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only!

// ❌ Unvalidated user input reaching the database
const id = req.params.id; // must be validated with Zod first
await prisma.order.findUnique({ where: { id } });

// ❌ Returning internal error details to client
return NextResponse.json({ error: err.message }); // don't leak internals
```

---

## 5. Preferred Patterns

```typescript
// ✅ Explicit types, unknown instead of any
const data: unknown = await response.json();
if (!isOrderResponse(data)) throw new Error('Invalid response shape');

// ✅ Zod enum as const
const UserRole = z.enum([
  'super_admin',
  'warehouse_manager',
  'store_manager',
  'supplier',
  'salesman',
  'b2c_customer',
  'b2b_buyer',
  'delivery_staff',
]);
type UserRole = z.infer<typeof UserRole>;

// ✅ Named constants for magic values
import { ROLES } from '@/lib/constants/roles';
if (user.role === ROLES.SUPER_ADMIN) {
}

// ✅ Service layer separation
// lib/services/orders.service.ts
export async function getOrderById(id: string): Promise<IOrderResponse> {
  const order = await prisma.order.findUniqueOrThrow({ where: { id } });
  return mapOrderToResponse(order);
}

// app/api/v1/orders/[id]/route.ts
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  if (!user) return apiError(401, 'UNAUTHENTICATED');
  const order = await getOrderById(params.id);
  return apiSuccess(order);
}

// ✅ Zod validation at every API boundary
const schema = z.object({ orderId: z.string().uuid() });
const result = schema.safeParse(requestBody);
if (!result.success) return apiError(400, 'VALIDATION_ERROR', result.error.flatten());

// ✅ Structured logging
import { logger } from '@/lib/logger';
logger.info({ orderId, userId }, 'Order created successfully');
```

---

## 6. User Roles (RBAC)

Every protected resource MUST check the user's role. Available roles:

| Constant                  | DB Value            | Description                                  |
| ------------------------- | ------------------- | -------------------------------------------- |
| `ROLES.SUPER_ADMIN`       | `super_admin`       | Full system access                           |
| `ROLES.WAREHOUSE_MANAGER` | `warehouse_manager` | Inbound stock, GRN, bin assignment           |
| `ROLES.STORE_MANAGER`     | `store_manager`     | POS, order fulfillment, shelf stock          |
| `ROLES.SUPPLIER`          | `supplier`          | View POs, upload invoices, track payments    |
| `ROLES.SALESMAN`          | `salesman`          | B2B orders, commission tracking, collections |
| `ROLES.B2C_CUSTOMER`      | `b2c_customer`      | Browse, order, pay online                    |
| `ROLES.B2B_BUYER`         | `b2b_buyer`         | Order on credit, view invoices               |
| `ROLES.DELIVERY_STAFF`    | `delivery_staff`    | View assignments, mark delivered             |

---

## 7. ID Generation Format

All entity IDs use a **UUID** as the database primary key and a **display ID** as the human-readable reference.

| Entity         | Display ID Format      | Example           |
| -------------- | ---------------------- | ----------------- |
| B2C Customer   | `CUS-{YYYY}-{5digits}` | `CUS-2026-00001`  |
| B2B Business   | `BIZ-{YYYY}-{5digits}` | `BIZ-2026-00001`  |
| B2C Order      | `ORD-B2C-{7digits}`    | `ORD-B2C-0000001` |
| B2B Order      | `ORD-B2B-{7digits}`    | `ORD-B2B-0000001` |
| Invoice        | `INV-{YYYY}-{5digits}` | `INV-2026-00001`  |
| Purchase Order | `PO-{YYYY}-{5digits}`  | `PO-2026-00001`   |
| Salesman       | `SAL-{YYYY}-{3digits}` | `SAL-2026-001`    |
| Delivery       | `DEL-{YYYY}-{5digits}` | `DEL-2026-00001`  |

Generation logic lives in `lib/utils/id-generator.ts`.

---

## 8. Environment Variables (Complete List)

```bash
# ─── Supabase ────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=         # Public — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Public — safe for browser
SUPABASE_SERVICE_ROLE_KEY=        # SECRET — server only, never expose

# ─── Database ────────────────────────────────────────────────
DATABASE_URL=                     # Prisma connection string (Supabase pooler)
DIRECT_URL=                       # Direct DB URL for migrations

# ─── Auth ────────────────────────────────────────────────────
NEXTAUTH_SECRET=                  # JWT signing secret (server only)
NEXTAUTH_URL=                     # App URL (https://rotana-store.vercel.app)

# ─── Payments ────────────────────────────────────────────────
RAZORPAY_KEY_ID=                  # Public — can be NEXT_PUBLIC_ if needed
RAZORPAY_KEY_SECRET=              # SECRET — server only
RAZORPAY_WEBHOOK_SECRET=          # SECRET — webhook signature verification

# ─── File Storage ────────────────────────────────────────────
CLOUDFLARE_R2_ACCESS_KEY=         # SECRET
CLOUDFLARE_R2_SECRET_KEY=         # SECRET
CLOUDFLARE_R2_BUCKET=             # Bucket name
CLOUDFLARE_R2_PUBLIC_URL=         # Public CDN URL

# ─── Email ───────────────────────────────────────────────────
RESEND_API_KEY=                   # SECRET

# ─── App ─────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=              # https://rotana-store.vercel.app
NODE_ENV=                         # development | test | production
```

> **Access**: Get values from the **Google Chat pinned message** (team group). Production secrets are managed by Ayeen on the Vercel dashboard.

---

## 9. Team Coding Standards & Practices

### Code Readability

- **Self-documenting code**: variable and function names should tell the reader _what_ and _why_
- **JSDoc required** on: all exported service functions, all API route handlers, all Zod schemas
- **Comment intent, not mechanics**: explain _why_ a decision was made, not _what_ the code does line-by-line
- **Max complexity**: avoid deeply nested conditionals (> 3 levels) — extract helper functions
- **Consistent formatting**: Prettier handles this — never override with inline comments

### Error Handling Standards

- **Never throw raw errors to the client** — always use `apiError()` helper with machine-readable codes
- **Structured error types**: every error has `code` (SCREAMING_SNAKE) + `message` (human-readable) + optional `details`
- **Service layer errors**: throw typed domain errors (e.g., `InsufficientStockError`) — route handlers catch and map to HTTP
- **Unexpected errors**: caught globally — log with structured context (Pino), return generic `INTERNAL_ERROR` to client

### Security Practices (Per-Feature Checklist)

Before marking any feature as done, verify:

- [ ] All inputs validated with Zod (request body, query params, path params)
- [ ] Authentication checked (session cookie OR Bearer token)
- [ ] Authorization checked (user role matches allowed roles for this action)
- [ ] No PII logged (passwords, tokens, personal data, financial data)
- [ ] No secrets exposed to the client (`NEXT_PUBLIC_*` only for genuinely public values)
- [ ] Rate limiting applied on public endpoints (auth, registration, webhooks)

### Performance Budget

| Metric                   | Target  | Measured With        |
| ------------------------ | ------- | -------------------- |
| Lighthouse Performance   | ≥ 90    | Chrome DevTools      |
| Lighthouse Accessibility | ≥ 90    | Chrome DevTools      |
| Time to Interactive      | ≤ 3s    | Real device testing  |
| API response time        | ≤ 200ms | Pino request logging |
| DB query time            | ≤ 100ms | Prisma query logging |

### Documentation Requirements

| Item                       | Where                               | When                            |
| -------------------------- | ----------------------------------- | ------------------------------- |
| API route handler          | JSDoc in the route file             | On creation / modification      |
| Service function           | JSDoc with `@param`, `@returns`     | On creation / modification      |
| Zod schema                 | JSDoc describing the shape          | On creation                     |
| Database migration         | Comment at top of migration SQL     | On creation                     |
| Architecture decision      | `docs/` (if significant)            | When making non-obvious choices |
| Environment variable (new) | `.env.example` + `PROJECT_CANON.md` | On addition                     |

### Definition of Done

A task is **done** only when ALL of the following are true:

1. ✅ Code is written and follows PROJECT_CANON conventions
2. ✅ TypeScript compiles with zero errors (`pnpm type-check`)
3. ✅ Lint passes (`pnpm lint`)
4. ✅ Critical paths have test coverage
5. ✅ Code reviewed and approved by Review Buddy
6. ✅ PR merged into `develop`
7. ✅ Feature tested on the `develop` deployment
8. ✅ Documentation updated (JSDoc, README, etc.)

---

_This document is the law. If code violates PROJECT_CANON, it does not get merged._
_Update this file when conventions evolve — never let it go stale._
