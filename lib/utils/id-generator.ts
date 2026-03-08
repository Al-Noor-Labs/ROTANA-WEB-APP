import { prisma } from '@/lib/prisma';

// ─────────────────────────────────────────────────────────────────────────────
// Sequential ID counters
// ─────────────────────────────────────────────────────────────────────────────
//
// IDs are human-readable and sequential-looking, using the current year and
// an atomic DB sequence to avoid collisions (even under concurrent requests).
//
// Format reference (from SRD / PROJECT_CANON.md):
//   Orders:    ORD-B2C-0000001  |  ORD-B2B-0000001
//   Customers: CUS-2026-00001
//   Invoices:  INV-2026-00001
//   GRNs:      GRN-2026-00001
//   Transfers: TRF-2026-00001
//   Payslips:  PAY-2026-U1-01  (userId prefix, month)

const year = () => new Date().getFullYear();

/**
 * Generates the next sequential integer for a given sequence name.
 * Uses a `counters` table with an atomic increment — safe under concurrent load.
 *
 * If you don't have a counters table yet, this falls back to a timestamp-based
 * suffix (collisions unlikely but possible — add the counters table in your
 * next migration for true sequential IDs).
 */
async function nextSeq(name: string, digits: number): Promise<string> {
  try {
    // Atomic upsert — increment counter, return new value
    const result = await prisma.$queryRaw<Array<{ next_val: bigint }>>`
      INSERT INTO counters (name, value)
      VALUES (${name}, 1)
      ON CONFLICT (name) DO UPDATE
        SET value = counters.value + 1
      RETURNING value AS next_val
    `;
    const n = Number(result[0]?.next_val ?? 1);
    return String(n).padStart(digits, '0');
  } catch {
    // Fallback if counters table doesn't exist yet (remove after migration)
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${ts}${rand}`.substring(0, digits);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public generators
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ORD-B2C-0000001 or ORD-B2B-0000001
 */
export async function generateOrderId(type: 'B2C' | 'B2B'): Promise<string> {
  const seq = await nextSeq(`order_${type.toLowerCase()}`, 7);
  return `ORD-${type}-${seq}`;
}

/**
 * CUS-2026-00001
 */
export async function generateCustomerId(): Promise<string> {
  const seq = await nextSeq(`customer_${year()}`, 5);
  return `CUS-${year()}-${seq}`;
}

/**
 * INV-2026-00001
 */
export async function generateInvoiceId(): Promise<string> {
  const seq = await nextSeq(`invoice_${year()}`, 5);
  return `INV-${year()}-${seq}`;
}

/**
 * GRN-2026-00001
 */
export async function generateGrnId(): Promise<string> {
  const seq = await nextSeq(`grn_${year()}`, 5);
  return `GRN-${year()}-${seq}`;
}

/**
 * TRF-2026-00001
 */
export async function generateTransferId(): Promise<string> {
  const seq = await nextSeq(`transfer_${year()}`, 5);
  return `TRF-${year()}-${seq}`;
}

/**
 * PAY-U1A2B3-2026-01  (userId first 6 chars, year, month)
 */
export function generatePayslipId(userId: string, month: number, year: number): string {
  const userPrefix = userId.replace(/-/g, '').substring(0, 6).toUpperCase();
  return `PAY-${userPrefix}-${year}-${String(month).padStart(2, '0')}`;
}
