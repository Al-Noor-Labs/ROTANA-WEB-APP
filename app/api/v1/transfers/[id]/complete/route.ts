import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, STAFF_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { applyInventoryEvent } from '@/app/api/v1/inventory/route';
import { InventoryEventType } from '@/lib/generated/prisma';

// POST /api/transfers/[id]/complete - Receive a transfer at destination
export const POST = withAuth(async (req, { params, user }) => {
  try {
    const body = await req.json();
    const { items } = z
      .object({
        items: z.array(
          z.object({
            variantId: z.string().uuid(),
            receivedQty: z.number().int().nonnegative(),
          }),
        ),
      })
      .parse(body);

    const transfer = await prisma.stockTransfer.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!transfer) return apiError(404, 'NOT_FOUND');
    if (transfer.status === 'COMPLETED') {
      return apiError(409, 'CONFLICT');
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update each item received qty
      for (const received of items) {
        await tx.stockTransferItem.updateMany({
          where: { transferId: transfer.id, variantId: received.variantId },
          data: { receivedQty: received.receivedQty },
        });

        // Add to destination inventory
        if (received.receivedQty > 0) {
          await applyInventoryEvent(
            {
              variantId: received.variantId,
              locationId: transfer.toLocationId,
              eventType: InventoryEventType.TRANSFER_IN,
              quantity: received.receivedQty,
              referenceId: transfer.id,
              referenceType: 'TRANSFER',
              createdBy: user.userId,
            },
            tx,
          );
        }
      }

      return tx.stockTransfer.update({
        where: { id: transfer.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
        include: { items: true, fromLocation: true, toLocation: true },
      });
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);
