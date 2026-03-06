# Code Style Guide — Rotana Store

> Companion to `PROJECT_CANON.md`. This document provides detailed code examples for common patterns.

---

## 1. TypeScript Rules

### Strict Mode Everywhere

All `tsconfig.json` files must have:

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

// ❌ WRONG — TypeScript enums (cause bundle bloat)
enum OrderStatus {
  PENDING = 'PENDING',
}
```

---

## 2. React / Next.js Patterns

### Server Components (Default)

```tsx
// ✅ CORRECT — Server Component (no 'use client', fetches data directly)
// app/(admin)/warehouse/page.tsx
import { getWarehouseStats } from '@/lib/api/warehouse';

export default async function WarehousePage() {
  const stats = await getWarehouseStats();
  return <WarehouseDashboard stats={stats} />;
}
```

### Client Components (Only When Needed)

```tsx
// ✅ CORRECT — Client Component (needs hooks)
'use client';

import { useState } from 'react';
import { useOrderStatus } from '@/hooks/useOrderStatus';

export function OrderTracker({ orderId }: { orderId: string }) {
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
import { createOrderSchema } from '@rotana/shared/schemas';

export function CreateOrderForm() {
  const form = useForm({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { /* ... */ },
  });

  async function onSubmit(data: z.infer<typeof createOrderSchema>) {
    // API call with validated data
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>;
}
```

---

## 3. NestJS Patterns

### Module Structure

```
src/modules/orders/
├── orders.module.ts        # Module definition
├── orders.controller.ts    # HTTP handlers (thin)
├── orders.service.ts       # Business logic
├── orders.repository.ts    # Data access (Prisma calls)
├── dto/
│   ├── create-order.dto.ts
│   └── update-order.dto.ts
├── entities/
│   └── order.entity.ts     # Response shape
└── orders.spec.ts          # Tests
```

### Controller Pattern

```typescript
@Controller('api/v1/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.B2C_CUSTOMER, UserRole.B2B_BUYER, UserRole.SALESMAN)
  @UseGuards(RolesGuard)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: IAuthUser,
  ): Promise<IOrderResponse> {
    return this.ordersService.create(createOrderDto, user);
  }
}
```

### Service Pattern

```typescript
@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(dto: CreateOrderDto, user: IAuthUser): Promise<IOrderResponse> {
    // 1. Validate stock availability
    await this.inventoryService.validateStock(dto.items);

    // 2. Calculate totals
    const totals = this.calculateTotals(dto.items);

    // 3. Create order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: { /* ... */ } });
      await this.inventoryService.deductStock(dto.items, tx);
      return order;
    });

    // 4. Return typed response
    return this.mapToResponse(order);
  }
}
```

---

## 4. API Response Standard

All API responses follow this structure:

```typescript
// Success response
{
  "success": true,
  "data": { /* typed response */ },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order ORD-B2C-0000123 not found",
    "statusCode": 404
  }
}
```

---

## 5. Database Conventions

### Migration Example

```sql
-- Migration: 20260307_create_orders
-- Description: Create orders table for B2C and B2B order management

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_id VARCHAR(20) NOT NULL UNIQUE,     -- ORD-B2C-0000001
  customer_id UUID NOT NULL REFERENCES customers(id),
  order_type VARCHAR(3) NOT NULL CHECK (order_type IN ('B2C', 'B2B')),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  delivery_address JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_display_id ON orders(display_id);
```

---

## 6. Import Order

Always organize imports in this order (enforced by ESLint):

```typescript
// 1. External packages
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

// 2. Monorepo packages
import { IOrderResponse } from '@rotana/shared/types';
import { createOrderSchema } from '@rotana/shared/schemas';

// 3. Internal absolute imports
import { PrismaService } from '@/database/prisma.service';
import { InventoryService } from '@/modules/inventory/inventory.service';

// 4. Relative imports
import { CreateOrderDto } from './dto/create-order.dto';
```

---

*This document is maintained by the team. Update when new patterns are established.*
