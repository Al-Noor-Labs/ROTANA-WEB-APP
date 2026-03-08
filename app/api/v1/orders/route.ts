import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withAuth, STAFF_ROLES } from '@/lib/with-auth';
import {
  apiSuccess,
  apiSuccessList,
  apiError,
  handleApiError,
  parsePagination,
  buildMeta,
} from '@/lib/api-helpers';
import { Role, OrderType, PaymentMethod } from '@/lib/generated/prisma';
import { listOrders, createOrder } from '@/lib/services/orders.service';

// ─────────────────────────────────────────────────────────────────────────────
// Request schemas
// ─────────────────────────────────────────────────────────────────────────────

const OrderItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const CreateOrderSchema = z.object({
  customerId: z.string().uuid().optional(),
  orderType: z.nativeEnum(OrderType),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  sourceLocationId: z.string().uuid().optional(),
  destLocationId: z.string().uuid().optional(),
  deliveryAddressId: z.string().uuid().optional(),
  items: z.array(OrderItemSchema).min(1, 'Order must have at least one item'),
  notes: z.string().max(500).optional(),
  discountAmount: z.number().nonnegative().optional().default(0),
  deliveryCharge: z.number().nonnegative().optional().default(0),
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/orders — list orders with filters (paginated)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/orders
 *
 * Returns a paginated list of orders.
 * Roles: SUPER_ADMIN, WAREHOUSE_MANAGER, STORE_MANAGER, CASHIER, ACCOUNTANT
 * Scoping: SALESMAN sees only their assigned orders; CUSTOMER sees only their own orders.
 */
export const GET = withAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit } = parsePagination(req.url);

    // Build role-scoped filter — enforce data isolation at the service boundary
    const filter = {
      status: searchParams.get('status') ?? undefined,
      orderType: searchParams.get('orderType') ?? undefined,
      customerId: searchParams.get('customerId') ?? undefined,
      // Salesmen can only see their own assigned orders
      assignedToId: user.role === Role.SALESMAN ? user.userId : undefined,
    };

    // If a customer somehow calls this route, scope to their orders only
    if (user.role === Role.CUSTOMER) {
      filter.customerId = user.userId;
    }

    const { orders, total } = await listOrders(filter, page, limit);

    return apiSuccessList(orders, buildMeta(page, limit, total));
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/orders — create a new order
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/orders
 *
 * Creates a new B2C or B2B order, reserves inventory atomically.
 * Roles: SUPER_ADMIN, WAREHOUSE_MANAGER, STORE_MANAGER, CASHIER, ACCOUNTANT
 */
export const POST = withAuth(async (req, { user }) => {
  try {
    // 1. Validate input
    const body: unknown = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(422, 'VALIDATION_ERROR', parsed.error.flatten().fieldErrors);
    }

    // 2. Delegate to service layer (all business logic lives there)
    const order = await createOrder(parsed.data, user.userId);

    // 3. Respond
    return apiSuccess(order, 201);
  } catch (error) {
    // Handle domain errors thrown by the service layer
    const err = error as Error & { code?: string };
    if (err.code === 'VARIANT_INVALID') return apiError(400, 'VALIDATION_ERROR', err.message);
    if (err.code === 'INSUFFICIENT_STOCK') return apiError(422, 'INSUFFICIENT_STOCK', err.message);
    return handleApiError(error);
  }
}, STAFF_ROLES);
