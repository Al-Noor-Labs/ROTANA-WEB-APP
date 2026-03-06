import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES } from "@/lib/with-auth";
import { apiSuccess, handleApiError } from "@/lib/api-helpers";

// GET /api/analytics/employees - Performance analytics for staff members
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    
    const now = new Date();
    const startDate = startDateParam ? new Date(startDateParam) : new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = endDateParam ? new Date(endDateParam) : now;

    const [allStaff, staffOrders, staffDeliveries, staffCommissions] = await Promise.all([
      // Get all non-customer users
      prisma.user.findMany({
        where: { role: { not: "CUSTOMER" }, isActive: true },
        select: { id: true, name: true, role: true, email: true }
      }),
      // Count orders handled by each staff
      prisma.order.groupBy({
        by: ["assignedToId"],
        where: { 
          assignedToId: { not: null },
          createdAt: { gte: startDate, lte: endDate }
        },
        _count: { id: true },
        _sum: { totalAmount: true }
      }),
      // Count deliveries by driver
      prisma.delivery.groupBy({
        by: ["driverId"],
        where: {
          driverId: { not: null },
          status: "DELIVERED",
          deliveredAt: { gte: startDate, lte: endDate }
        },
        _count: { id: true }
      }),
      // Total commissions by staff
      prisma.salesCommission.groupBy({
        by: ["userId"],
        where: { createdAt: { gte: startDate, lte: endDate } },
        _sum: { amount: true }
      })
    ]);

    // Build performance map
    const performanceData = allStaff.map((staff: any) => {
      const ordersInfo = staffOrders.find((o: any) => o.assignedToId === staff.id);
      const deliveryInfo = staffDeliveries.find((d: any) => d.driverId === staff.id);
      const commissionInfo = staffCommissions.find((c: any) => c.userId === staff.id);

      return {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        email: staff.email,
        ordersHandled: ordersInfo?._count.id || 0,
        revenueGenerated: Number(ordersInfo?._sum.totalAmount || 0),
        deliveriesCompleted: deliveryInfo?._count.id || 0,
        commissionsEarned: Number(commissionInfo?._sum.amount || 0),
      };
    });

    return apiSuccess({
      period: { startDate, endDate },
      performance: performanceData.sort((a: any, b: any) => b.ordersHandled - a.ordersHandled)
    });
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
