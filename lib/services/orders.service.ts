import { prisma } from '@/lib/prisma';
import { applyInventoryEvent, checkStockAvailability } from '@/lib/services/inventory.service';
import { InventoryEventType, OrderType, PaymentMethod, Prisma } from '@/lib/generated/prisma';
import { logger } from '@/lib/logger';

// ─────────────────────────────────────────────────────────────────────────────
// Shared ID generation (temporary — will be replaced by lib/utils/id-generator.ts in Commit 4)
// ─────────────────────────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ICreateOrderInput {
  customerId?: string;
  orderType: OrderType;
  paymentMethod?: PaymentMethod;
  sourceLocationId?: string;
  destLocationId?: string;
  deliveryAddressId?: string;
  items: Array<{ variantId: string; quantity: number }>;
  notes?: string;
  discountAmount?: number;
  deliveryCharge?: number;
}

export interface IOrderListFilter {
  status?: string;
  orderType?: string;
  customerId?: string;
  assignedToId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Read operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a paginated list of orders with customer, items, delivery, and invoice.
 * Filters are applied server-side — callers should scope filters to the user's role
 * before passing them in (e.g. salesman sees only their assigned orders).
 */
export async function listOrders(filter: IOrderListFilter, page: number, limit: number) {
  const where: Prisma.OrderWhereInput = {};
  if (filter.status) where.status = filter.status as Prisma.EnumOrderStatusFilter;
  if (filter.orderType) where.orderType = filter.orderType as Prisma.EnumOrderTypeFilter;
  if (filter.customerId) where.customerId = filter.customerId;
  if (filter.assignedToId) where.assignedToId = filter.assignedToId;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            variant: {
              include: { product: { select: { name: true, imageUrl: true } } },
            },
          },
        },
        delivery: true,
        invoice: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
}

// ─────────────────────────────────────────────────────────────────────────────
// Write operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new order.
 *
 * Steps:
 * 1. Fetch active variants and validate they exist
 * 2. Calculate subtotal, tax, total
 * 3. (Optional) Pre-flight stock availability check
 * 4. Atomic transaction: persist order + reserve inventory
 *
 * @throws Error with code 'VARIANT_INVALID' if any variantId is inactive/missing
 * @throws Error with code 'INSUFFICIENT_STOCK' if stock check fails
 */
export async function createOrder(input: ICreateOrderInput, createdByUserId: string) {
  // 1. Fetch and validate all variants
  const variantIds = input.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds }, isActive: true },
  });

  if (variants.length !== variantIds.length) {
    const error = new Error('One or more product variants are invalid or inactive');
    (error as Error & { code: string }).code = 'VARIANT_INVALID';
    throw error;
  }

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  // 2. Calculate pricing
  let subtotal = 0;
  let taxAmount = 0;

  const orderItems = input.items.map((item) => {
    const variant = variantMap.get(item.variantId)!;
    const unitPrice = Number(variant.sellingPrice);
    const taxRate = Number(variant.taxRate);
    const lineTax = (unitPrice * item.quantity * taxRate) / 100;

    subtotal += unitPrice * item.quantity;
    taxAmount += lineTax;

    return {
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: variant.sellingPrice,
      taxRate: variant.taxRate,
      discount: 0,
      lineTotal: unitPrice * item.quantity + lineTax,
    };
  });

  const discountAmount = input.discountAmount ?? 0;
  const deliveryCharge = input.deliveryCharge ?? 0;
  const totalAmount = subtotal + taxAmount - discountAmount + deliveryCharge;

  // 3. Pre-flight stock check (if source location specified)
  if (input.sourceLocationId) {
    const shortfalls = await checkStockAvailability(input.items, input.sourceLocationId);
    if (shortfalls.length > 0) {
      const details = shortfalls
        .map((s) => `${s.sku}: requested ${s.requested}, available ${s.available}`)
        .join('; ');
      const error = new Error(`Insufficient stock: ${details}`);
      (error as Error & { code: string }).code = 'INSUFFICIENT_STOCK';
      throw error;
    }
  }

  // 4. Atomic transaction: create order + reserve inventory
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: input.customerId,
        orderType: input.orderType,
        paymentMethod: input.paymentMethod,
        sourceLocationId: input.sourceLocationId,
        destLocationId: input.destLocationId,
        deliveryAddressId: input.deliveryAddressId,
        subtotal,
        taxAmount,
        discountAmount,
        deliveryCharge,
        totalAmount,
        notes: input.notes,
        assignedToId: createdByUserId,
        items: { create: orderItems },
      },
      include: {
        items: {
          include: { variant: true },
        },
      },
    });

    // Reserve inventory for each item if a source location is specified
    if (input.sourceLocationId) {
      for (const item of input.items) {
        await applyInventoryEvent(
          {
            variantId: item.variantId,
            locationId: input.sourceLocationId,
            eventType: InventoryEventType.ORDER_RESERVED,
            quantity: item.quantity,
            referenceId: newOrder.id,
            referenceType: 'ORDER',
            createdBy: createdByUserId,
          },
          tx,
        );
      }
    }

    return newOrder;
  });

  logger.info({ orderId: order.id, orderNumber: order.orderNumber, totalAmount }, 'Order created');
  return order;
}
