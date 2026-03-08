import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES, STAFF_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError, generateTransferNumber } from "@/lib/api-helpers";
import { applyInventoryEvent } from "@/app/api/inventory/route";
import { InventoryEventType } from "@/lib/generated/prisma";

const TransferSchema = z.object({
  fromLocationId: z.string().uuid(),
  toLocationId: z.string().uuid(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      variantId: z.string().uuid(),
      requestedQty: z.number().int().positive(),
    })
  ).min(1),
});

const CompleteTransferSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().uuid(),
      receivedQty: z.number().int().nonnegative(),
    })
  ),
});

// GET /api/transfers
export const GET = withAuth(async (req) => {
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
      orderBy: { createdAt: "desc" },
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
      return apiError("Source and destination locations cannot be the same", 400);
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
        return apiError(
          `Insufficient stock for variant ${item.variantId}. Available: ${balance?.available ?? 0}`,
          400
        );
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
          status: "IN_TRANSIT",
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
        await applyInventoryEvent({
          variantId: item.variantId,
          locationId: validated.fromLocationId,
          eventType: InventoryEventType.TRANSFER_OUT,
          quantity: item.requestedQty,
          referenceId: newTransfer.id,
          referenceType: "TRANSFER",
          createdBy: user.userId,
        }, tx);
      }

      return newTransfer;
    });

    return apiSuccess(transfer, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
