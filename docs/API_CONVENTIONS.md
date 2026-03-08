# API Conventions — Rotana Store

> The definitive guide for building Next.js Route Handlers in the Rotana codebase.
> Every API route MUST follow these conventions — this ensures consistency across the team,
> makes the API consumable by the Rotana mobile app (separate repo, React Native, developed by Zaka),
> and makes code readable to any developer without explanation.

---

## 1. Why API-First?

All backend logic lives in Next.js Route Handlers under `app/api/v1/`. These routes are:

- **Stateless** — no server-side session state; auth is carried in every request
- **JSON REST** — standard HTTP verbs, predictable URLs, consistent response envelope
- **Dual-auth** — accept both session cookies (browser) and Bearer tokens (mobile app)
- **Versioned** — `/api/v1/` prefix allows non-breaking future versions

This means the Rotana web dashboard and the Rotana mobile app talk to **the same API**, keeping feature parity automatic.

---

## 2. Route Handler Anatomy

Every route handler MUST follow this exact sequence. No exceptions.

```typescript
// app/api/v1/orders/route.ts
import { NextRequest } from 'next/server';
import { createOrderSchema } from '@/lib/schemas/order.schema';
import { createOrder } from '@/lib/services/orders.service';
import { getUserFromRequest } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { ROLES } from '@/lib/constants/roles';
import { logger } from '@/lib/logger';

/**
 * POST /api/v1/orders
 *
 * Creates a new order (B2C or B2B).
 *
 * Allowed roles: b2c_customer, b2b_buyer, salesman
 *
 * Request body: CreateOrderRequest (see order.schema.ts)
 * Response: IOrderResponse
 */
export async function POST(request: NextRequest) {
  // ── Step 1: Parse & Validate ──────────────────────────────
  const body: unknown = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, 'VALIDATION_ERROR', parsed.error.flatten());
  }

  // ── Step 2: Authenticate ──────────────────────────────────
  const user = await getUserFromRequest(request);
  if (!user) {
    return apiError(401, 'UNAUTHENTICATED', 'Valid authentication required');
  }

  // ── Step 3: Authorize ─────────────────────────────────────
  const allowedRoles = [ROLES.B2C_CUSTOMER, ROLES.B2B_BUYER, ROLES.SALESMAN];
  if (!allowedRoles.includes(user.role)) {
    return apiError(403, 'FORBIDDEN', 'Insufficient permissions');
  }

  // ── Step 4: Execute (delegate to service layer) ───────────
  const order = await createOrder(parsed.data, user);

  // ── Step 5: Respond ───────────────────────────────────────
  logger.info({ orderId: order.id, userId: user.id }, 'Order created');
  return apiSuccess(order, 201);
}
```

---

## 3. Standard Response Envelope

**All** API responses — success or error — use this envelope. Never deviate.

### Success Response

```typescript
// HTTP 200 (or 201 for created resources)
{
  "success": true,
  "data": { /* typed response object */ },
  "meta": {              // Only present for paginated list responses
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response

```typescript
// HTTP 4xx or 5xx
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",      // Machine-readable error code (SCREAMING_SNAKE_CASE)
    "message": "Human-readable message safe to show in UI",
    "details": { /* optional — validation errors, field-level messages */ }
  }
}
```

### Response Helper (`lib/api/response.ts`)

```typescript
import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiSuccessList<T>(data: T[], meta: IPaginationMeta) {
  return NextResponse.json({ success: true, data, meta }, { status: 200 });
}

export function apiError(status: number, code: string, details?: unknown) {
  const message = ERROR_MESSAGES[code] ?? 'An unexpected error occurred';
  return NextResponse.json({ success: false, error: { code, message, details } }, { status });
}
```

---

## 4. Authentication

Both the web app and the mobile app authenticate via the same mechanism.

### How it Works

```
Web browser  → sends session cookie automatically (set by Supabase Auth)
Mobile app   → sends Authorization: Bearer <jwt_token> header
```

The `getUserFromRequest()` helper handles both:

```typescript
// lib/auth/session.ts
import { createServerClient } from '@supabase/ssr';
import { verifyToken } from './jwt';

export async function getUserFromRequest(request: NextRequest): Promise<IAuthUser | null> {
  // 1. Try Bearer token (mobile app)
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return verifyToken(token); // returns IAuthUser or null
  }

  // 2. Fall back to session cookie (web browser)
  const supabase = createServerClient(/* ... */);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? mapSupabaseUser(user) : null;
}
```

### Auth User Shape

```typescript
// lib/types/auth.types.ts
interface IAuthUser {
  id: string; // UUID — matches users table PK
  email: string;
  role: UserRole; // one of the 8 defined roles
  displayId: string; // e.g., CUS-2026-00001
}
```

---

## 5. Error Codes Reference

Use these exact codes — the mobile app and frontend both depend on machine-readable codes.

| HTTP | Code                    | Meaning                                             |
| ---- | ----------------------- | --------------------------------------------------- |
| 400  | `VALIDATION_ERROR`      | Request body/params failed Zod validation           |
| 400  | `INVALID_REQUEST`       | Malformed JSON or missing required fields           |
| 401  | `UNAUTHENTICATED`       | No valid session or token                           |
| 403  | `FORBIDDEN`             | Authenticated but insufficient role                 |
| 404  | `NOT_FOUND`             | Resource does not exist                             |
| 409  | `CONFLICT`              | Duplicate resource (e.g., email already registered) |
| 422  | `INSUFFICIENT_STOCK`    | Domain error — not enough inventory                 |
| 422  | `CREDIT_LIMIT_EXCEEDED` | B2B order exceeds credit line                       |
| 422  | `PAYMENT_FAILED`        | Payment gateway returned failure                    |
| 429  | `RATE_LIMITED`          | Too many requests                                   |
| 500  | `INTERNAL_ERROR`        | Unexpected server error — never expose internals    |

---

## 6. URL Structure & HTTP Verbs

```
GET    /api/v1/orders              → list orders (paginated)
POST   /api/v1/orders              → create order
GET    /api/v1/orders/:id          → get single order
PATCH  /api/v1/orders/:id          → partial update
DELETE /api/v1/orders/:id          → delete (soft delete preferred)

GET    /api/v1/products            → list products
POST   /api/v1/products            → create product (admin only)
GET    /api/v1/products/:id        → get single product

POST   /api/v1/auth/login          → authenticate
POST   /api/v1/auth/register       → register new user
POST   /api/v1/auth/logout         → invalidate session
GET    /api/v1/auth/me             → get current user

POST   /api/v1/payments/webhook    → Razorpay/Stripe webhook (no auth)
```

**Rules:**

- URLs are plural nouns: `/orders`, `/products`, `/invoices` — never verbs
- Use query params for filtering: `GET /api/v1/orders?status=PENDING&page=1&limit=20`
- Use path params for specific resources: `GET /api/v1/orders/ORD-B2C-0000001`

---

## 7. Pagination Standard

All list endpoints MUST support pagination. Never return unlimited lists.

### Query Parameters

```
GET /api/v1/orders?page=1&limit=20&sortBy=createdAt&sortOrder=desc&status=PENDING
```

| Param       | Type        | Default     | Max | Description             |
| ----------- | ----------- | ----------- | --- | ----------------------- |
| `page`      | number      | 1           | —   | Page number (1-indexed) |
| `limit`     | number      | 20          | 100 | Items per page          |
| `sortBy`    | string      | `createdAt` | —   | Field to sort by        |
| `sortOrder` | `asc\|desc` | `desc`      | —   | Sort direction          |

### Response Meta

```typescript
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Pagination Schema (Zod)

```typescript
// lib/schemas/pagination.schema.ts
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
```

---

## 8. Zod Validation Pattern

Every route handler validates EVERY input before processing. No exceptions.

```typescript
// Schema definition (lib/schemas/order.schema.ts)
import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive().max(9999),
        unitPrice: z.number().positive(),
      }),
    )
    .min(1, 'Order must have at least one item'),
  deliveryAddress: z.object({
    street: z.string().min(5).max(255),
    city: z.string().min(2).max(100),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid PIN code'),
  }),
  notes: z.string().max(500).optional(),
});

export type ICreateOrderRequest = z.infer<typeof createOrderSchema>;
```

---

## 9. Service Layer Pattern

Route handlers are **thin wrappers**. All business logic lives in `lib/services/`.

```typescript
// lib/services/orders.service.ts
import { prisma } from '@/lib/db/prisma';
import { generateOrderId } from '@/lib/utils/id-generator';
import type { ICreateOrderRequest, IOrderResponse } from '@/lib/types';

/**
 * Creates a new B2C or B2B order.
 * Validates stock, deducts inventory, and persists the order atomically.
 */
export async function createOrder(
  dto: ICreateOrderRequest,
  user: IAuthUser,
): Promise<IOrderResponse> {
  // 1. Validate stock availability
  await validateStockAvailability(dto.items);

  // 2. Calculate order totals
  const totals = calculateOrderTotals(dto.items);

  // 3. Persist atomically
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        displayId: generateOrderId(user.role),
        customerId: user.id,
        orderType: user.role === 'b2c_customer' ? 'B2C' : 'B2B',
        subtotal: totals.subtotal,
        taxAmount: totals.tax,
        totalAmount: totals.total,
        deliveryAddress: dto.deliveryAddress,
        notes: dto.notes,
        items: { create: dto.items },
      },
    });

    // 4. Deduct inventory
    await deductStock(dto.items, tx);

    return newOrder;
  });

  return mapOrderToResponse(order);
}
```

---

## 10. Rate Limiting

Apply rate limiting on public and sensitive endpoints.

```typescript
// lib/api/rateLimit.ts
// Use Upstash Redis + @upstash/ratelimit or Vercel's built-in rate limiting

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per 60 seconds
});

export async function checkRateLimit(identifier: string) {
  const { success, reset } = await ratelimit.limit(identifier);
  if (!success) {
    return apiError(429, 'RATE_LIMITED');
  }
}
```

Apply to: auth endpoints, registration, payment webhooks, OTP generation.

---

## 11. Webhook Handling (Razorpay / Stripe)

Payment webhooks come from external services — they have no user auth. Verify the signature instead.

```typescript
// app/api/v1/payments/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text(); // raw body for signature verification
  const signature = request.headers.get('x-razorpay-signature') ?? '';

  const isValid = verifyWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET!);
  if (!isValid) {
    return apiError(401, 'UNAUTHENTICATED', 'Invalid webhook signature');
  }

  const event: unknown = JSON.parse(body);
  const parsed = razorpayWebhookSchema.safeParse(event);
  if (!parsed.success) return apiError(400, 'VALIDATION_ERROR');

  // Handle the event
  await handlePaymentWebhook(parsed.data);

  return apiSuccess({ received: true });
}
```

---

_This document is maintained by Ayeen (PM + Backend Lead). Update when new patterns are established._
_Mobile API consumers: see Authentication section (Section 4) for Bearer token usage._
