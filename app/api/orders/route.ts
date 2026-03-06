import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, STAFF_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError, generateOrderNumber, generateInvoiceNumber } from "@/lib/api-helpers";
import { applyInventoryEvent } from "@/app/api/inventory/route";
import { InventoryEventType, OrderType, PaymentMethod } from "@/app/generated/prisma";

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
  items: z.array(OrderItemSchema).min(1),
  notes: z.string().optional(),
  discountAmount: z.number().nonnegative().optional().default(0),
  deliveryCharge: z.number().nonnegative().optional().default(0),
});

// GET /api/orders - List orders with filters
export const GET = withAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const orderType = searchParams.get("orderType");
    const customerId = searchParams.get("customerId");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const where: any = {};
    if (status) where.status = status;
    if (orderType) where.orderType = orderType;
    if (customerId) where.customerId = customerId;

    // Salesmen can only see their own orders
    if (user.role === "SALESMAN") where.assignedToId = user.userId;
    // Customers can only see their own orders
    if (user.role === "CUSTOMER") where.customerId = user.userId;

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
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return apiSuccess({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);

// POST /api/orders - Create a new order
export const POST = withAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const validated = CreateOrderSchema.parse(body);

    // 1. Fetch all variant prices
    const variantIds = validated.items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
    });

    if (variants.length !== variantIds.length) {
      return apiError("One or more product variants are invalid or inactive", 400);
    }

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    // 2. Calculate pricing
    let subtotal = 0;
    let taxAmount = 0;

    const orderItems = validated.items.map((item) => {
      const variant = variantMap.get(item.variantId)!;
      const unitPrice = Number(variant.sellingPrice);
      const taxRate = Number(variant.taxRate);
      const lineTax = (unitPrice * item.quantity * taxRate) / 100;
      const lineTotal = unitPrice * item.quantity + lineTax;

      subtotal += unitPrice * item.quantity;
      taxAmount += lineTax;

      return {
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: variant.sellingPrice,
        taxRate: variant.taxRate,
        discount: 0,
        lineTotal,
      };
    });

    const discountAmount = validated.discountAmount ?? 0;
    const deliveryCharge = validated.deliveryCharge ?? 0;
    const totalAmount = subtotal + taxAmount - discountAmount + deliveryCharge;

    // 3. Check stock availability (optional, soft check - reserve handles hard check)
    if (validated.sourceLocationId) {
      for (const item of validated.items) {
        const balance = await prisma.inventoryBalance.findUnique({
          where: {
            variantId_locationId: {
              variantId: item.variantId,
              locationId: validated.sourceLocationId,
            },
          },
        });
        if (!balance || balance.available < item.quantity) {
          const variant = variantMap.get(item.variantId)!;
          return apiError(
            `Insufficient stock for variant SKU: ${variant.sku}. Available: ${balance?.available ?? 0}`,
            400
          );
        }
      }
    }

    // 4. Create the order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: validated.customerId,
          orderType: validated.orderType,
          paymentMethod: validated.paymentMethod,
          sourceLocationId: validated.sourceLocationId,
          destLocationId: validated.destLocationId,
          deliveryAddressId: validated.deliveryAddressId,
          subtotal,
          taxAmount,
          discountAmount,
          deliveryCharge,
          totalAmount,
          notes: validated.notes,
          assignedToId:
            user.role === "SALESMAN" ? user.userId : undefined,
          items: { create: orderItems },
        },
        include: {
          items: {
            include: { variant: true },
          },
        },
      });

      // 5. Reserve inventory for each item
      if (validated.sourceLocationId) {
        for (const item of validated.items) {
          await applyInventoryEvent({
            variantId: item.variantId,
            locationId: validated.sourceLocationId,
            eventType: InventoryEventType.ORDER_RESERVED,
            quantity: item.quantity,
            referenceId: newOrder.id,
            referenceType: "ORDER",
            createdBy: user.userId,
          }, tx);
        }
      }

      return newOrder;
    });

    return apiSuccess(order, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);
