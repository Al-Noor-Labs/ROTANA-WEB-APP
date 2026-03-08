# Code Style Guide — Rotana Store

> Companion to `.rules/PROJECT_CANON.md`. This document provides detailed, copy-paste-ready
> code examples for every common pattern in this codebase.

---

## 1. TypeScript Rules

### Strict Mode Everywhere

All `tsconfig.json` must have:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Definitions

```typescript
// ✅ CORRECT — explicit interfaces for API boundaries
interface ICreateOrderRequest {
  customerId: string;
  items: IOrderItem[];
  deliveryAddress: IAddress;
}

interface IOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

// ❌ WRONG — inline types for public APIs
function createOrder(data: { customerId: string; items: unknown[] }): void {}
```

### Enums vs Union Types

```typescript
// ✅ CORRECT — Zod enums for runtime validation + type safety
const OrderStatus = z.enum([
  'PENDING',
  'CONFIRMED',
  'PACKED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]);
type OrderStatus = z.infer<typeof OrderStatus>;

// ❌ WRONG — TypeScript enums (cause bundle bloat and runtime issues)
enum OrderStatus {
  PENDING = 'PENDING',
}
```

---

## 2. React / Next.js Component Patterns

### Server Components (Default)

```tsx
// ✅ CORRECT — Server Component (no 'use client', fetches data directly)
// app/(admin)/warehouse/page.tsx
import { getWarehouseStats } from '@/lib/services/warehouse.service';

export default async function WarehousePage() {
  const stats = await getWarehouseStats();
  return <WarehouseDashboard stats={stats} />;
}
```

### Client Components (Only When Needed)

```tsx
// ✅ CORRECT — Client Component (needs hooks for interactivity)
'use client';

import { useState } from 'react';
import { useOrderStatus } from '@/hooks/useOrderStatus';

interface OrderTrackerProps {
  orderId: string;
}

export function OrderTracker({ orderId }: OrderTrackerProps) {
  const { data, isLoading, error } = useOrderStatus(orderId);

  if (isLoading) return <OrderTrackerSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState message="Order not found" />;

  return <OrderStatusTimeline status={data.status} />;
}
```

### Always Handle 3 States

Every component that fetches data must handle:

1. **Loading** — show skeleton or spinner
2. **Error** — show error message with retry button
3. **Empty** — show helpful empty state message

### Form Pattern

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createOrderSchema } from '@/lib/schemas/order.schema';

export function CreateOrderForm() {
  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { items: [], notes: '' },
  });

  async function onSubmit(data: z.infer<typeof createOrderSchema>) {
    // Call Server Action or POST to /api/v1/orders
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>;
}
```

---

## 3. Next.js API Route Handler Patterns

> See `docs/API_CONVENTIONS.md` for the full reference. This section shows the key patterns
> with concrete examples.

### Route Handler Structure

```typescript
// app/api/v1/orders/route.ts

import { NextRequest } from 'next/server';
import { createOrderSchema } from '@/lib/schemas/order.schema';
import { createOrder } from '@/lib/services/orders.service';
import { getUserFromRequest } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { ROLES } from '@/lib/constants/roles';

/**
 * POST /api/v1/orders
 * Creates a new B2C or B2B order.
 * Roles: b2c_customer, b2b_buyer, salesman
 */
export async function POST(request: NextRequest) {
  // 1. Parse & Validate
  const body: unknown = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, 'VALIDATION_ERROR', parsed.error.flatten());
  }

  // 2. Authenticate (accepts both cookie session AND Bearer token for mobile)
  const user = await getUserFromRequest(request);
  if (!user) return apiError(401, 'UNAUTHENTICATED');

  // 3. Authorize
  const allowedRoles = [ROLES.B2C_CUSTOMER, ROLES.B2B_BUYER, ROLES.SALESMAN];
  if (!allowedRoles.includes(user.role)) return apiError(403, 'FORBIDDEN');

  // 4. Execute (business logic in service layer)
  const order = await createOrder(parsed.data, user);

  // 5. Respond
  return apiSuccess(order, 201);
}
```

### Service Layer (Business Logic)

```typescript
// lib/services/orders.service.ts

import { prisma } from '@/lib/db/prisma';
import { generateOrderId } from '@/lib/utils/id-generator';
import type { ICreateOrderRequest, IOrderResponse, IAuthUser } from '@/lib/types';

/**
 * Creates a new order. Validates stock and deducts inventory atomically.
 * Called from: POST /api/v1/orders
 */
export async function createOrder(
  dto: ICreateOrderRequest,
  user: IAuthUser,
): Promise<IOrderResponse> {
  // 1. Validate stock availability
  await validateStockAvailability(dto.items);

  // 2. Calculate totals
  const totals = calculateOrderTotals(dto.items);

  // 3. Persist atomically with Prisma transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        displayId:       generateOrderId(user.role),
        customerId:      user.id,
        orderType:       user.role === 'b2c_customer' ? 'B2C' : 'B2B',
        subtotal:        totals.subtotal,
        taxAmount:       totals.tax,
        totalAmount:     totals.total,
        deliveryAddress: dto.deliveryAddress,
        notes:           dto.notes,
        items:           { create: dto.items },
      },
    });

    await deductStock(dto.items, tx);
    return newOrder;
  });

  // 4. Return typed response (never return raw Prisma object)
  return mapOrderToResponse(order);
}
```

---

## 4. API Response Standard

All API responses follow this exact structure. See `lib/api/response.ts`.

```typescript
// Success response
{
  "success": true,
  "data": { /* typed response */ },
  "meta": {              // paginated lists only
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",        // SCREAMING_SNAKE_CASE
    "message": "User-facing message",
    "details": { /* validation errors, optional */ }
  }
}
```

---

## 5. Database Conventions

### Prisma Model (Schema Example)

```prisma
// prisma/schema.prisma

model Order {
  id              String      @id @default(uuid())
  displayId       String      @unique                // ORD-B2C-0000001
  customerId      String
  orderType       OrderType                          // B2C | B2B
  status          OrderStatus @default(PENDING)
  subtotal        Decimal     @db.Decimal(12, 2)
  taxAmount       Decimal     @db.Decimal(12, 2)    @default(0)
  totalAmount     Decimal     @db.Decimal(12, 2)
  deliveryAddress Json?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  customer        Customer    @relation(fields: [customerId], references: [id])
  items           OrderItem[]

  @@index([customerId])
  @@index([status])
  @@index([createdAt(sort: Desc)])
  @@map("orders")
}
```

### Migration SQL Naming

```sql
-- ✅ CORRECT format
-- Migration: 20260307_create_orders
-- Description: Create orders table for B2C and B2B order management
```

---

## 6. Import Order

Always organize imports in this order (enforced by ESLint):

```typescript
// 1. Node.js built-ins (if any)
import path from 'path';

// 2. External packages
import { z } from 'zod';
import { NextRequest } from 'next/server';

// 3. Internal absolute imports (@/ alias)
import { apiSuccess, apiError } from '@/lib/api/response';
import { getUserFromRequest } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { createOrder } from '@/lib/services/orders.service';
import { ROLES } from '@/lib/constants/roles';

// 4. Relative imports
import { CreateOrderForm } from './CreateOrderForm';
import type { ICreateOrderProps } from './types';
```

---

## 7. Error Handling Patterns

### In Route Handlers

```typescript
// ✅ CORRECT — handled errors return structured JSON
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  if (!user) return apiError(401, 'UNAUTHENTICATED');

  const order = await getOrderById(params.id);
  if (!order) return apiError(404, 'NOT_FOUND', `Order ${params.id} does not exist`);

  return apiSuccess(order);
}

// ✅ CORRECT — unexpected errors caught globally by Next.js error handling
// Add try/catch only if you need to handle a specific error differently
export async function POST(request: NextRequest) {
  try {
    // ... handler logic
  } catch (error) {
    logger.error({ error }, 'Unexpected error creating order');
    return apiError(500, 'INTERNAL_ERROR');  // NEVER expose error.message to client
  }
}
```

### In Components

```tsx
// ✅ CORRECT — error.tsx file handles unexpected errors
// app/(admin)/orders/error.tsx
'use client';

export default function OrdersError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## 8. Logging

```typescript
// ✅ CORRECT — structured logging with pino
import { logger } from '@/lib/logger';

// Good: structured fields for searchability
logger.info({ orderId, userId, totalAmount }, 'Order created successfully');
logger.warn({ customerId, creditUsed, creditLimit }, 'Customer approaching credit limit');
logger.error({ error, requestId }, 'Payment webhook processing failed');

// ❌ WRONG — string interpolation, no structure, leaks PII
console.log(`Order ${orderId} created for user ${user.email}`);
logger.info(`Error: ${error.message}`);
```

---

*This document is maintained by the team. Update when new patterns are established.*
*When a new pattern is agreed upon, add it here before starting implementation.*
