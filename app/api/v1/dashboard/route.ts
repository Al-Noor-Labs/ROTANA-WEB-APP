import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, STAFF_ROLES } from '@/lib/with-auth';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

// GET /api/dashboard - Business intelligence summary
export const GET = withAuth(async (req) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      // Order stats
      todaysOrders,
      monthOrders,
      pendingOrders,
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,

      // Inventory alerts
      totalProducts,
      lowStockCount,

      // Delivery stats
      activeDeliveries,
      deliveredToday,

      // Top selling variants
      topProducts,
    ] = await Promise.all([
      // Today's orders count
      prisma.order.count({
        where: { createdAt: { gte: todayStart }, status: { not: 'CANCELLED' } },
      }),
      // This month's orders
      prisma.order.count({
        where: { createdAt: { gte: monthStart }, status: { not: 'CANCELLED' } },
      }),
      // Pending orders (not delivered/cancelled)
      prisma.order.count({
        where: { status: { notIn: ['DELIVERED', 'CANCELLED', 'RETURNED'] } },
      }),
      // All-time revenue
      prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { totalAmount: true },
      }),
      // This month's revenue
      prisma.order.aggregate({
        where: {
          status: 'DELIVERED',
          deliveredAt: { gte: monthStart },
        },
        _sum: { totalAmount: true },
      }),
      // Last month's revenue
      prisma.order.aggregate({
        where: {
          status: 'DELIVERED',
          deliveredAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _sum: { totalAmount: true },
      }),

      // Product counts
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      // Low stock - items where available <= reorderLevel
      prisma.inventoryBalance.count({ where: { available: { lte: 10 } } }),

      // Active deliveries
      prisma.delivery.count({
        where: { status: { in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] } },
      }),
      // Delivered today
      prisma.delivery.count({
        where: {
          status: 'DELIVERED',
          deliveredAt: { gte: todayStart },
        },
      }),

      // Top 5 selling products this month
      prisma.orderItem.groupBy({
        by: ['variantId'],
        where: {
          order: {
            createdAt: { gte: monthStart },
            status: { not: 'CANCELLED' },
          },
        },
        _sum: { quantity: true, lineTotal: true },
        orderBy: { _sum: { lineTotal: 'desc' } },
        take: 5,
      }),
    ]);

    // Enrich top products with variant info
    const topVariantIds = topProducts.map((p) => p.variantId);
    const topVariants = await prisma.productVariant.findMany({
      where: { id: { in: topVariantIds } },
      include: { product: { select: { name: true, imageUrl: true } } },
    });
    const variantMap = new Map(topVariants.map((v) => [v.id, v]));

    const currentMonthRevenue = Number(monthRevenue._sum.totalAmount ?? 0);
    const prevMonthRevenue = Number(lastMonthRevenue._sum.totalAmount ?? 0);
    const revenueGrowth =
      prevMonthRevenue > 0
        ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
        : 0;

    return apiSuccess({
      orders: {
        today: todaysOrders,
        thisMonth: monthOrders,
        pending: pendingOrders,
      },
      revenue: {
        total: Number(totalRevenue._sum.totalAmount ?? 0),
        thisMonth: currentMonthRevenue,
        lastMonth: prevMonthRevenue,
        growthPercent: Math.round(revenueGrowth * 100) / 100,
      },
      inventory: {
        totalProducts,
        lowStockAlerts: lowStockCount,
      },
      delivery: {
        active: activeDeliveries,
        deliveredToday,
      },
      topProducts: topProducts.map((p) => ({
        variant: variantMap.get(p.variantId),
        totalQuantitySold: p._sum.quantity,
        totalRevenue: p._sum.lineTotal,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);
