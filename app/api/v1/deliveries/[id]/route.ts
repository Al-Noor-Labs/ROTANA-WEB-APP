import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, DELIVERY_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError, generateInvoiceNumber } from '@/lib/api-helpers';
import {
  DeliveryStatus,
  InventoryEventType,
  OrderStatus,
  PaymentStatus,
} from '@/lib/generated/prisma';
import { applyInventoryEvent } from '@/app/api/inventory/route';

const UpdateDeliverySchema = z.object({
  status: z.nativeEnum(DeliveryStatus),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  deliveryProof: z.string().url().optional(),
  failureReason: z.string().optional(),
  notes: z.string().optional(),
});

// PATCH /api/deliveries/[id] - Driver updates delivery status
export const PATCH = withAuth(async (req, { params, user }) => {
  try {
    const body = await req.json();
    const validated = UpdateDeliverySchema.parse(body);

    const delivery = await prisma.delivery.findUnique({ where: { id: params.id } });
    if (!delivery) return apiError('Delivery not found', 404);

    // Drivers can only update their own deliveries
    if (user.role === 'DELIVERY_DRIVER' && delivery.driverId !== user.userId) {
      return apiError('Forbidden', 403);
    }

    const updated = await prisma.delivery.update({
      where: { id: params.id },
      data: {
        ...validated,
        pickedUpAt: validated.status === DeliveryStatus.PICKED_UP ? new Date() : undefined,
        deliveredAt: validated.status === DeliveryStatus.DELIVERED ? new Date() : undefined,
      },
      include: {
        order: { select: { id: true, orderNumber: true } },
        driver: { select: { id: true, name: true } },
      },
    });

    // If delivered, update the order status AND run the full fulfillment logic
    if (validated.status === DeliveryStatus.DELIVERED) {
      const existingOrder = await prisma.order.findUnique({
        where: { id: delivery.orderId },
        include: { items: true, invoice: true },
      });

      if (existingOrder && existingOrder.status !== OrderStatus.DELIVERED) {
        await prisma.$transaction(async (tx) => {
          // Update order to DELIVERED
          await tx.order.update({
            where: { id: delivery.orderId },
            data: { status: OrderStatus.DELIVERED, deliveredAt: new Date() },
          });

          // Fulfill inventory: release reservation → fulfilled
          if (existingOrder.sourceLocationId) {
            for (const item of existingOrder.items) {
              await applyInventoryEvent(
                {
                  variantId: item.variantId,
                  locationId: existingOrder.sourceLocationId,
                  eventType: InventoryEventType.ORDER_RELEASED,
                  quantity: item.quantity,
                  referenceId: existingOrder.id,
                  referenceType: 'ORDER',
                  createdBy: user.userId,
                },
                tx,
              );

              await applyInventoryEvent(
                {
                  variantId: item.variantId,
                  locationId: existingOrder.sourceLocationId,
                  eventType: InventoryEventType.ORDER_FULFILLED,
                  quantity: item.quantity,
                  referenceId: existingOrder.id,
                  referenceType: 'ORDER',
                  createdBy: user.userId,
                },
                tx,
              );
            }
          }

          // Post ledger entries for the sale
          const cashAccount = await tx.ledgerAccount.findFirst({ where: { code: '1001' } });
          const revenueAccount = await tx.ledgerAccount.findFirst({ where: { code: '4001' } });

          if (cashAccount && revenueAccount) {
            await tx.ledgerEntry.create({
              data: {
                debitAccountId: cashAccount.id,
                creditAccountId: revenueAccount.id,
                amount: existingOrder.totalAmount,
                description: `Sales Revenue - Order ${existingOrder.orderNumber}`,
                referenceType: 'ORDER',
                referenceId: existingOrder.id,
                orderId: existingOrder.id,
                createdBy: user.userId,
              },
            });
          }

          // Generate invoice if not already generated
          if (!existingOrder.invoice) {
            await tx.invoice.create({
              data: {
                invoiceNumber: generateInvoiceNumber(),
                orderId: existingOrder.id,
                totalAmount: existingOrder.totalAmount,
                paymentStatus:
                  existingOrder.paymentStatus === PaymentStatus.PAID
                    ? PaymentStatus.PAID
                    : PaymentStatus.PENDING,
              },
            });
          }
        });
      }
    }

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}, DELIVERY_ROLES);
