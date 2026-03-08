import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, MANAGER_ROLES, STAFF_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError, generateTransferNumber } from '@/lib/api-helpers';
import { applyInventoryEvent } from '@/app/api/v1/inventory/route';
import { InventoryEventType } from '@/lib/generated/prisma';

const TransferSchema = z.object({
  fromLocationId: z.string().uuid(),
  toLocationId: z.string().uuid(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        requestedQty: z.number().int().positive(),
      }),
    )
    .min(1),
});

// GET /api/transfers
export const GET = withAuth(async (_req) => {
  try {
    const transfers = await prisma.stockTransfer.findMany({
      include: {
        fromLocation: { select: { id: true, name: true, code: true } },
        toLocation: { select: { id: true, name: true, code: true } },
        items: {
          include: {
            variant: { include: { product: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return apiSuccess(transfers);
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);

// POST /api/transfers - Initiate stock transfer
export const POST = withAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const validated = TransferSchema.parse(body);

    if (validated.fromLocationId === validated.toLocationId) {
      return apiError(400, 'VALIDATION_ERROR');
    }

    // Stock availability check
    for (const item of validated.items) {
      const balance = await prisma.inventoryBalance.findUnique({
        where: {
          variantId_locationId: {
            variantId: item.variantId,
            locationId: validated.fromLocationId,
          },
        },
      });
      if (!balance || balance.available < item.requestedQty) {
        return apiError(422, 'INSUFFICIENT_STOCK');
      }
    }

    const transfer = await prisma.$transaction(async (tx) => {
      const newTransfer = await tx.stockTransfer.create({
        data: {
          transferNumber: generateTransferNumber(),
          fromLocationId: validated.fromLocationId,
          toLocationId: validated.toLocationId,
          requestedById: user.userId,
          notes: validated.notes,
          status: 'IN_TRANSIT',
          items: {
            create: validated.items.map((i) => ({
              variantId: i.variantId,
              requestedQty: i.requestedQty,
              sentQty: i.requestedQty,
            })),
          },
        },
        include: { items: true },
      });

      // Deduct from source location
      for (const item of validated.items) {
        await applyInventoryEvent(
          {
            variantId: item.variantId,
            locationId: validated.fromLocationId,
            eventType: InventoryEventType.TRANSFER_OUT,
            quantity: item.requestedQty,
            referenceId: newTransfer.id,
            referenceType: 'TRANSFER',
            createdBy: user.userId,
          },
          tx,
        );
      }

      return newTransfer;
    });

    return apiSuccess(transfer, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
