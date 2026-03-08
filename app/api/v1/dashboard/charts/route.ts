import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, STAFF_ROLES } from '@/lib/with-auth';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

// GET /api/dashboard/charts - FULL BI ANALYTICS SUITE
export const GET = withAuth(async (req) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [dailySales, allOrderItems, locationStock, allPayslips, inventoryBalances] =
      await Promise.all([
        // 1. Sales trends (last 30 days)
        prisma.order.groupBy({
          by: ['createdAt'],
          where: {
            status: 'DELIVERED',
            deliveredAt: { gte: thirtyDaysAgo },
          },
          _sum: { totalAmount: true },
          _count: { id: true },
          orderBy: { createdAt: 'asc' },
        }),

        // 2. All delivered order items (last 30 days) for Profit/Loss & Categories
        prisma.orderItem.findMany({
          where: {
            order: {
              status: 'DELIVERED',
              deliveredAt: { gte: thirtyDaysAgo },
            },
          },
          include: {
            variant: {
              include: {
                product: { include: { category: true } },
              },
            },
          },
        }),

        // 3. Stock counts per location
        prisma.inventoryBalance.groupBy({
          by: ['locationId'],
          _sum: { available: true },
        }),

        // 4. Payroll data
        prisma.payslip.findMany({
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          take: 6, // last 6 months
        }),

        // 5. Inventory value - total money tied up in stock
        prisma.inventoryBalance.findMany({
          include: { variant: true },
        }),
      ]);

    // Financial calculations
    let totalRevenueLine = 0;
    let totalCogsLine = 0;
    const categoryMap = new Map();

    allOrderItems.forEach((item) => {
      const revenue = Number(item.lineTotal || 0);
      const cost = Number(item.variant.costPrice || 0) * item.quantity;
      const catName = item.variant.product.category.name;

      totalRevenueLine += revenue;
      totalCogsLine += cost;
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + revenue);
    });

    // Salaries summary
    const salarySpend = allPayslips.reduce((acc, p) => acc + Number(p.netPay), 0);
    const monthlySalaries = allPayslips.map((p) => ({
      period: `${p.year}-${p.month.toString().padStart(2, '0')}`,
      amount: Number(p.netPay),
    }));

    // Stock value
    const totalStockValue = inventoryBalances.reduce((acc, bal) => {
      return acc + Number(bal.onHand) * Number(bal.variant.costPrice);
    }, 0);

    // Sales charts formatting
    const salesTrends = dailySales.map((day) => ({
      date: day.createdAt.toISOString().split('T')[0],
      revenue: Number(day._sum.totalAmount || 0),
      orders: day._count.id,
    }));

    const categoryDistribution = Array.from(categoryMap.entries()).map(([name, revenue]) => ({
      name,
      revenue,
    }));

    // Locations stock enrichment
    const locationIds = locationStock.map((l) => l.locationId);
    const locations = await prisma.location.findMany({ where: { id: { in: locationIds } } });
    const locMap = new Map(locations.map((l) => [l.id, l.name]));
    const stockByLocation = locationStock.map((l) => ({
      name: locMap.get(l.locationId),
      totalStock: l._sum.available,
    }));

    return apiSuccess({
      finances: {
        last30Days: {
          revenue: totalRevenueLine,
          cogs: totalCogsLine,
          salaries: salarySpend,
          grossProfit: totalRevenueLine - totalCogsLine,
          netProfit: totalRevenueLine - totalCogsLine - salarySpend,
          netProfitMargin:
            totalRevenueLine > 0
              ? ((totalRevenueLine - totalCogsLine - salarySpend) / totalRevenueLine) * 100
              : 0,
        },
        currentStockValue: totalStockValue,
        payrollHistory: monthlySalaries,
      },
      trends: {
        sales: salesTrends,
        categories: categoryDistribution,
        stockPerLocation: stockByLocation,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);
