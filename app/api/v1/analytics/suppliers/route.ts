import { prisma } from '@/lib/prisma';
import { withAuth, MANAGER_ROLES } from '@/lib/with-auth';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

// GET /api/analytics/suppliers - Performance analytics for vendors/suppliers
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const now = new Date();
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = endDateParam ? new Date(endDateParam) : now;

    const [allSuppliers, supplierGrns, supplierInvoices, supplierDiscrepancies] =
      (await Promise.all([
        // Get all active suppliers
        prisma.supplier.findMany({
          where: { status: 'ACTIVE' },
          select: { id: true, name: true, city: true, contactName: true },
        }),
        // Count GRNs and total goods received
        prisma.goodsReceivedNote.groupBy({
          by: ['supplierId'],
          where: { createdAt: { gte: startDate, lte: endDate } },
          _count: { id: true },
        }),
        // Total invoices and spent amount
        prisma.supplierInvoice.groupBy({
          by: ['supplierId'],
          where: { createdAt: { gte: startDate, lte: endDate } },
          _sum: { totalAmount: true },
          _count: { id: true },
        }),
        // Sum damaged items and total received items per supplier via GRN items
        prisma.gRNItem.findMany({
          where: {
            grn: {
              createdAt: { gte: startDate, lte: endDate },
            },
          },
          include: { grn: { select: { supplierId: true } } },
        }),
      ]));

    type GrnItem = (typeof supplierDiscrepancies)[number];
    type SupplierInfo = (typeof allSuppliers)[number];
    type GrnGroup = (typeof supplierGrns)[number];
    type InvoiceGroup = (typeof supplierInvoices)[number];

    // Build discrepancy map
    const discrepancyMap = new Map<string, { damaged: number; received: number }>();
    supplierDiscrepancies.forEach((item: GrnItem) => {
      const sId = item.grn.supplierId;
      if (!discrepancyMap.has(sId)) {
        discrepancyMap.set(sId, { damaged: 0, received: 0 });
      }
      const current = discrepancyMap.get(sId);
      current.damaged += item.damagedQty ?? 0;
      current.received += item.receivedQty ?? 0;
    });

    const performanceData = allSuppliers.map((supplier: SupplierInfo) => {
      const grnInfo = supplierGrns.find((g: GrnGroup) => g.supplierId === supplier.id);
      const invoiceInfo = supplierInvoices.find((i: InvoiceGroup) => i.supplierId === supplier.id);
      const discrepancies = discrepancyMap.get(supplier.id) || { damaged: 0, received: 0 };

      const totalReceived = discrepancies.received;
      const totalDamaged = discrepancies.damaged;
      const errorRate = totalReceived > 0 ? (totalDamaged / totalReceived) * 100 : 0;

      return {
        id: supplier.id,
        name: supplier.name,
        location: supplier.city,
        contact: supplier.contactName,
        totalGrns: grnInfo?._count.id || 0,
        totalInvoices: invoiceInfo?._count.id || 0,
        totalSpend: Number(invoiceInfo?._sum.totalAmount || 0),
        discrepancyRate: Number(errorRate.toFixed(2)),
        reliabilityScore: Math.max(0, 100 - errorRate), // rudimentary score
      };
    });

    type PerfRow = (typeof performanceData)[number];
    return apiSuccess({
      period: { startDate, endDate },
      performance: performanceData.sort((a: PerfRow, b: PerfRow) => b.totalSpend - a.totalSpend),
    });
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
