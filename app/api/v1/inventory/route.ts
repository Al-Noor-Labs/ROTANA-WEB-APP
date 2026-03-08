import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES, STAFF_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { InventoryEventType } from "@/app/generated/prisma";

const StockEventSchema = z.object({
  variantId: z.string().uuid(),
  locationId: z.string().uuid(),
  binId: z.string().uuid().optional(),
  eventType: z.nativeEnum(InventoryEventType),
  quantity: z.number().int().positive(),
  referenceId: z.string().optional(),
  referenceType: z.string().optional(),
  notes: z.string().optional(),
});

// The events that REDUCE available stock
const OUTBOUND_EVENTS = new Set<InventoryEventType>([
  InventoryEventType.STOCK_OUT,
  InventoryEventType.ORDER_RESERVED,
  InventoryEventType.ORDER_FULFILLED,
  InventoryEventType.TRANSFER_OUT,
  InventoryEventType.DAMAGE_WRITE_OFF,
]);

// The events that INCREASE reserved count
const RESERVE_EVENTS = new Set<InventoryEventType>([InventoryEventType.ORDER_RESERVED]);

// The events that RELEASE reserved count (back to available)
const RELEASE_EVENTS = new Set<InventoryEventType>([InventoryEventType.ORDER_RELEASED]);

/**
 * Core inventory mutation function.
 * Creates an InventoryEvent and updates the InventoryBalance.
 * Accepts an optional `tx` (transaction client) – pass it when calling
 * from inside an existing transaction to avoid nested transactions,
 * which Supabase's PgBouncer does not support.
 */
export async function applyInventoryEvent(
  data: {
    variantId: string;
    locationId: string;
    binId?: string;
    eventType: InventoryEventType;
    quantity: number;
    referenceId?: string;
    referenceType?: string;
    notes?: string;
    createdBy?: string;
  },
  tx?: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
) {
  const db = tx ?? prisma;

  const run = async (client: typeof db) => {
    // 1. Create the immutable event record
    const event = await client.inventoryEvent.create({ data });

    // 2. Compute delta for the balance table
    const isOutbound = OUTBOUND_EVENTS.has(data.eventType);
    const isReserve = RESERVE_EVENTS.has(data.eventType);
    const isRelease = RELEASE_EVENTS.has(data.eventType);

    const onHandDelta = isOutbound ? -data.quantity : data.quantity;
    const reservedDelta = isReserve
      ? data.quantity
      : isRelease
      ? -data.quantity
      : 0;

    // If it's a release event, don't change onHand either
    const actualOnHandDelta =
      data.eventType === InventoryEventType.ORDER_RELEASED ? 0 : onHandDelta;

    // 3. Upsert the balance
    const existing = await client.inventoryBalance.findUnique({
      where: {
        variantId_locationId: {
          variantId: data.variantId,
          locationId: data.locationId,
        },
      },
    });

    if (existing) {
      const newOnHand = Math.max(0, existing.onHand + actualOnHandDelta);
      const newReserved = Math.max(0, existing.reserved + reservedDelta);
      await client.inventoryBalance.update({
        where: { id: existing.id },
        data: {
          onHand: newOnHand,
          reserved: newReserved,
          available: Math.max(0, newOnHand - newReserved),
        },
      });
    } else {
      const onHand = Math.max(0, actualOnHandDelta);
      const reserved = Math.max(0, reservedDelta);
      await client.inventoryBalance.create({
        data: {
          variantId: data.variantId,
          locationId: data.locationId,
          binId: data.binId,
          onHand,
          reserved,
          available: Math.max(0, onHand - reserved),
        },
      });
    }

    return event;
  };

  // If a transaction client was passed, use it directly; otherwise wrap in a new transaction
  if (tx) {
    return run(tx as any);
  }
  return prisma.$transaction(async (innerTx) => run(innerTx as any));
}

// GET /api/inventory - Query current stock levels
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");
    const variantId = searchParams.get("variantId");
    const lowStock = searchParams.get("lowStock") === "true";

    const where: any = {};
    if (locationId) where.locationId = locationId;
    if (variantId) where.variantId = variantId;

    let balances = await prisma.inventoryBalance.findMany({ where });

    // Apply low stock filter in memory (compare with variant reorder level)
    // For a proper impl, this would be a DB view/join
    const variantIds = [...new Set(balances.map((b) => b.variantId))];
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { name: true, imageUrl: true } } },
    });
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    const enriched = balances.map((b) => ({
      ...b,
      variant: variantMap.get(b.variantId),
    }));

    const filtered = lowStock
      ? enriched.filter((b) => {
          const variant = b.variant;
          return variant && b.available <= variant.reorderLevel;
        })
      : enriched;

    return apiSuccess(filtered);
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);

// POST /api/inventory - Manually apply an inventory event (STOCK_IN, ADJUSTMENT, etc.)
export const POST = withAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const validated = StockEventSchema.parse(body);

    const event = await applyInventoryEvent({
      ...validated,
      createdBy: user.userId,
    });

    return apiSuccess(event, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
