import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, STAFF_ROLES, MANAGER_ROLES } from "@/lib/with-auth";
import {
  apiSuccess,
  apiError,
  handleApiError,
  generateInvoiceNumber,
} from "@/lib/api-helpers";
import { applyInventoryEvent } from "@/app/api/inventory/route";
import {
  InventoryEventType,
  OrderStatus,
  PaymentStatus,
} from "@/lib/generated/prisma";

// GET /api/orders/[id]
export const GET = withAuth(async (req, { params, user }) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            variant: {
              include: { product: { select: { name: true, imageUrl: true } } },
            },
          },
        },
        sourceLocation: { select: { id: true, name: true, code: true } },
        destLocation: { select: { id: true, name: true, code: true } },
        deliveryAddress: true,
        delivery: { include: { driver: { select: { id: true, name: true, phone: true } } } },
        invoice: true,
        ledgerEntries: true,
      },
    });

    if (!order) return apiError("Order not found", 404);

    // Customers can only view their own orders
    if (user.role === "CUSTOMER" && order.customerId !== user.userId) {
      return apiError("Forbidden", 403);
    }

    return apiSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);

const UpdateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  paidAmount: z.number().nonnegative().optional(),
  gatewayRef: z.string().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().uuid().optional(),
});

// PATCH /api/orders/[id] - Update order status / payment
export const PATCH = withAuth(async (req, { params, user }) => {
  try {
    const body = await req.json();
    const validated = UpdateOrderSchema.parse(body);

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });
    if (!existing) return apiError("Order not found", 404);

    // State machine: handle inventory on status transitions
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: params.id },
        data: {
          ...validated,
          deliveredAt:
            validated.status === OrderStatus.DELIVERED ? new Date() : undefined,
        },
        include: { items: true, invoice: true },
      });

      // On DELIVERED: fulfill inventory (convert RESERVED → FULFILLED)
      if (
        validated.status === OrderStatus.DELIVERED &&
        existing.status !== OrderStatus.DELIVERED &&
        existing.sourceLocationId
      ) {
        for (const item of existing.items) {
          // Release the reservation
          await applyInventoryEvent({
            variantId: item.variantId,
            locationId: existing.sourceLocationId,
            eventType: InventoryEventType.ORDER_RELEASED,
            quantity: item.quantity,
            referenceId: existing.id,
            referenceType: "ORDER",
            createdBy: user.userId,
          }, tx);
          // Now mark as fulfilled (reduce onHand)
          await applyInventoryEvent({
            variantId: item.variantId,
            locationId: existing.sourceLocationId,
            eventType: InventoryEventType.ORDER_FULFILLED,
            quantity: item.quantity,
            referenceId: existing.id,
            referenceType: "ORDER",
            createdBy: user.userId,
          }, tx);
        }

        // Post ledger entries for the sale
        const cashAccount = await tx.ledgerAccount.findFirst({
          where: { code: "1001" },
        });
        const revenueAccount = await tx.ledgerAccount.findFirst({
          where: { code: "4001" },
        });

        if (cashAccount && revenueAccount) {
          await tx.ledgerEntry.create({
            data: {
              debitAccountId: cashAccount.id,
              creditAccountId: revenueAccount.id,
              amount: existing.totalAmount,
              description: `Sales Revenue - Order ${existing.orderNumber}`,
              referenceType: "ORDER",
              referenceId: existing.id,
              orderId: existing.id,
              createdBy: user.userId,
            },
          });
        }

        // Generate invoice if not already generated
        if (!order.invoice) {
          await tx.invoice.create({
            data: {
              invoiceNumber: generateInvoiceNumber(),
              orderId: existing.id,
              totalAmount: existing.totalAmount,
              paymentStatus:
                existing.paymentStatus === PaymentStatus.PAID
                  ? PaymentStatus.PAID
                  : PaymentStatus.PENDING,
            },
          });
        }
      }

      // On CANCELLED: release all reserved inventory
      if (
        validated.status === OrderStatus.CANCELLED &&
        existing.status !== OrderStatus.CANCELLED &&
        existing.sourceLocationId
      ) {
        for (const item of existing.items) {
          await applyInventoryEvent({
            variantId: item.variantId,
            locationId: existing.sourceLocationId,
            eventType: InventoryEventType.ORDER_RELEASED,
            quantity: item.quantity,
            referenceId: existing.id,
            referenceType: "ORDER",
            createdBy: user.userId,
          }, tx);
        }
      }

      return order;
    });

    return apiSuccess(updatedOrder);
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);
