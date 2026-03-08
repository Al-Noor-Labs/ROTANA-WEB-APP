import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, MANAGER_ROLES, STAFF_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError, generateGRNNumber } from '@/lib/api-helpers';
import { applyInventoryEvent } from '@/app/api/inventory/route';
import { GRNStatus, InventoryEventType, Prisma } from '@/lib/generated/prisma';

const GRNSchema = z.object({
  supplierId: z.string().uuid(),
  locationId: z.string().uuid(),
  invoiceRef: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        orderedQty: z.number().int().positive(),
        receivedQty: z.number().int().nonnegative(),
        damagedQty: z.number().int().nonnegative().optional().default(0),
        costPrice: z.number().nonnegative(),
        expiryDate: z.string().datetime().optional(),
        batchNumber: z.string().optional(),
      }),
    )
    .min(1),
});

// GET /api/grn - List all GRNs
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplierId');
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    const where: Prisma.GoodsReceivedNoteWhereInput = {};
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;

    const [grns, total] = await Promise.all([
      prisma.goodsReceivedNote.findMany({
        where,
        include: {
          supplier: { select: { id: true, name: true } },
          location: { select: { id: true, name: true, code: true } },
          receivedBy: { select: { id: true, name: true } },
          items: {
            include: {
              variant: { include: { product: { select: { name: true } } } },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.goodsReceivedNote.count({ where }),
    ]);

    return apiSuccess({
      grns,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);

// POST /api/grn - Create a new GRN and stock in the received items
export const POST = withAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const validated = GRNSchema.parse(body);

    const grn = await prisma.$transaction(async (tx) => {
      // 1. Create the GRN
      const newGRN = await tx.goodsReceivedNote.create({
        data: {
          grnNumber: generateGRNNumber(),
          supplierId: validated.supplierId,
          locationId: validated.locationId,
          invoiceRef: validated.invoiceRef,
          notes: validated.notes,
          receivedById: user.userId,
          status: GRNStatus.RECEIVED,
          receivedAt: new Date(),
          items: {
            create: validated.items.map((item) => ({
              variantId: item.variantId,
              orderedQty: item.orderedQty,
              receivedQty: item.receivedQty,
              damagedQty: item.damagedQty ?? 0,
              costPrice: item.costPrice,
              expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
              batchNumber: item.batchNumber,
            })),
          },
        },
        include: {
          items: { include: { variant: true } },
          supplier: true,
          location: true,
        },
      });

      // 2. Stock in the usable received quantity (excludes damaged)
      for (const item of validated.items) {
        const usableQty = item.receivedQty - (item.damagedQty ?? 0);
        if (usableQty > 0) {
          await applyInventoryEvent(
            {
              variantId: item.variantId,
              locationId: validated.locationId,
              eventType: InventoryEventType.STOCK_IN,
              quantity: usableQty,
              referenceId: newGRN.id,
              referenceType: 'GRN',
              notes: `GRN ${newGRN.grnNumber}`,
              createdBy: user.userId,
            },
            tx,
          );
        }

        // 3. Write off damaged items
        if ((item.damagedQty ?? 0) > 0) {
          await applyInventoryEvent(
            {
              variantId: item.variantId,
              locationId: validated.locationId,
              eventType: InventoryEventType.DAMAGE_WRITE_OFF,
              quantity: item.damagedQty!,
              referenceId: newGRN.id,
              referenceType: 'GRN',
              notes: `Damaged on receipt - GRN ${newGRN.grnNumber}`,
              createdBy: user.userId,
            },
            tx,
          );
        }
      }

      // 4. Mark GRN as STOCKED and return the updated record
      const updatedGRN = await tx.goodsReceivedNote.update({
        where: { id: newGRN.id },
        data: { status: GRNStatus.STOCKED },
        include: {
          items: { include: { variant: true } },
          supplier: true,
          location: true,
        },
      });

      return updatedGRN;
    });

    return apiSuccess(grn, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
