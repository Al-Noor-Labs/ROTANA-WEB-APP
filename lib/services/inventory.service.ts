import { prisma } from '@/lib/prisma';
import { InventoryEventType } from '@/lib/generated/prisma';
import type { Prisma } from '@/lib/generated/prisma';
import { logger } from '@/lib/logger';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface InventoryEventInput {
  variantId: string;
  locationId: string;
  eventType: InventoryEventType;
  quantity: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  createdBy?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core inventory mutation — used by orders, GRN, transfers, adjustments
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Applies an inventory event and updates the materialized InventoryBalance.
 *
 * Must be called inside a Prisma transaction (tx) to guarantee atomicity.
 * The caller is responsible for providing the transaction client.
 *
 * @param input - The inventory event details
 * @param tx    - Active Prisma transaction client
 */
export async function applyInventoryEvent(
  input: InventoryEventInput,
  tx: Prisma.TransactionClient,
): Promise<void> {
  // 1. Record the event (immutable audit trail)
  await tx.inventoryEvent.create({
    data: {
      variantId: input.variantId,
      locationId: input.locationId,
      eventType: input.eventType,
      quantity: input.quantity,
      referenceId: input.referenceId,
      referenceType: input.referenceType,
      notes: input.notes,
      createdBy: input.createdBy,
    },
  });

  // 2. Update the materialized balance according to event semantics
  const delta = resolveBalanceDelta(input.eventType, input.quantity);

  await tx.inventoryBalance.upsert({
    where: {
      variantId_locationId: {
        variantId: input.variantId,
        locationId: input.locationId,
      },
    },
    create: {
      variantId: input.variantId,
      locationId: input.locationId,
      onHand: delta.onHand,
      reserved: delta.reserved,
      available: delta.onHand - delta.reserved,
    },
    update: {
      onHand: { increment: delta.onHand },
      reserved: { increment: delta.reserved },
      available: { increment: delta.onHand - delta.reserved },
    },
  });

  logger.debug(
    {
      variantId: input.variantId,
      locationId: input.locationId,
      eventType: input.eventType,
      quantity: input.quantity,
    },
    'Inventory event applied',
  );
}

/**
 * Maps each InventoryEventType to its effect on onHand and reserved quantities.
 * All quantities are positive; direction is determined here.
 */
function resolveBalanceDelta(
  eventType: InventoryEventType,
  quantity: number,
): { onHand: number; reserved: number } {
  switch (eventType) {
    case InventoryEventType.STOCK_IN:
    case InventoryEventType.RETURN_IN:
    case InventoryEventType.TRANSFER_IN:
      return { onHand: quantity, reserved: 0 };

    case InventoryEventType.ORDER_RESERVED:
      return { onHand: 0, reserved: quantity };

    case InventoryEventType.ORDER_RELEASED:
      return { onHand: 0, reserved: -quantity };

    case InventoryEventType.ORDER_FULFILLED:
      // Stock leaves physically + reservation removed
      return { onHand: -quantity, reserved: -quantity };

    case InventoryEventType.STOCK_OUT:
    case InventoryEventType.TRANSFER_OUT:
    case InventoryEventType.DAMAGE_WRITE_OFF:
      return { onHand: -quantity, reserved: 0 };

    case InventoryEventType.ADJUSTMENT:
      // Caller provides signed quantity — positive = add, negative = remove
      return { onHand: quantity, reserved: 0 };

    default: {
      const _exhaustive: never = eventType;
      logger.warn(
        { eventType: _exhaustive },
        'Unknown InventoryEventType — no balance delta applied',
      );
      return { onHand: 0, reserved: 0 };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Stock availability check (pre-flight — does not mutate)
// ─────────────────────────────────────────────────────────────────────────────

interface StockCheckItem {
  variantId: string;
  quantity: number;
}

interface StockShortfall {
  variantId: string;
  sku: string;
  requested: number;
  available: number;
}

/**
 * Checks stock availability for a list of items at a given location.
 * Returns an array of shortfalls (empty array = sufficient stock for all items).
 * Does NOT mutate anything — safe to call outside a transaction.
 */
export async function checkStockAvailability(
  items: StockCheckItem[],
  locationId: string,
): Promise<StockShortfall[]> {
  const variantIds = items.map((i) => i.variantId);

  const balances = await prisma.inventoryBalance.findMany({
    where: { variantId: { in: variantIds }, locationId },
    include: { variant: { select: { sku: true } } },
  });

  const balanceMap = new Map(balances.map((b) => [b.variantId, b]));
  const shortfalls: StockShortfall[] = [];

  for (const item of items) {
    const balance = balanceMap.get(item.variantId);
    const available = balance?.available ?? 0;
    if (available < item.quantity) {
      shortfalls.push({
        variantId: item.variantId,
        sku: balance?.variant.sku ?? item.variantId,
        requested: item.quantity,
        available,
      });
    }
  }

  return shortfalls;
}
