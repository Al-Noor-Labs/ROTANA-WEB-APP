import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES, DELIVERY_ROLES, STAFF_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { DeliveryStatus } from "@/app/generated/prisma";

// GET /api/deliveries - List deliveries (drivers see only theirs)
export const GET = withAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const driverId = searchParams.get("driverId");

    const where: any = {};
    if (status) where.status = status;
    if (driverId) where.driverId = driverId;
    if (user.role === "DELIVERY_DRIVER") where.driverId = user.userId;

    const deliveries = await prisma.delivery.findMany({
      where,
      include: {
        order: {
          include: {
            customer: { select: { id: true, name: true, phone: true } },
            deliveryAddress: true,
            items: {
              include: {
                variant: {
                  include: { product: { select: { name: true } } },
                },
              },
            },
          },
        },
        driver: { select: { id: true, name: true, phone: true } },
      },
      orderBy: [{ routeOrder: "asc" }, { createdAt: "asc" }],
    });

    return apiSuccess(deliveries);
  } catch (error) {
    return handleApiError(error);
  }
}, DELIVERY_ROLES);

// POST /api/deliveries - Create/assign a delivery
export const POST = withAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const { orderId, driverId, estimatedAt, routeOrder } = z
      .object({
        orderId: z.string().uuid(),
        driverId: z.string().uuid().optional(),
        estimatedAt: z.string().datetime().optional(),
        routeOrder: z.number().int().optional(),
      })
      .parse(body);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return apiError("Order not found", 404);

    const existing = await prisma.delivery.findUnique({ where: { orderId } });
    if (existing) return apiError("Delivery already assigned for this order", 409);

    const delivery = await prisma.delivery.create({
      data: {
        orderId,
        driverId,
        status: DeliveryStatus.ASSIGNED,
        estimatedAt: estimatedAt ? new Date(estimatedAt) : undefined,
        routeOrder,
      },
      include: { order: true, driver: { select: { id: true, name: true, phone: true } } },
    });

    return apiSuccess(delivery, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
