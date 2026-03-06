import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, DELIVERY_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { DeliveryStatus } from "@/app/generated/prisma";

const UpdateDeliverySchema = z.object({
  status: z.nativeEnum(DeliveryStatus),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  deliveryProof: z.string().url().optional(),
  failureReason: z.string().optional(),
  notes: z.string().optional(),
});

// PATCH /api/deliveries/[id] - Driver updates delivery status
export const PATCH = withAuth(async (req, { params, user }) => {
  try {
    const body = await req.json();
    const validated = UpdateDeliverySchema.parse(body);

    const delivery = await prisma.delivery.findUnique({ where: { id: params.id } });
    if (!delivery) return apiError("Delivery not found", 404);

    // Drivers can only update their own deliveries
    if (user.role === "DELIVERY_DRIVER" && delivery.driverId !== user.userId) {
      return apiError("Forbidden", 403);
    }

    const updated = await prisma.delivery.update({
      where: { id: params.id },
      data: {
        ...validated,
        pickedUpAt:
          validated.status === DeliveryStatus.PICKED_UP ? new Date() : undefined,
        deliveredAt:
          validated.status === DeliveryStatus.DELIVERED ? new Date() : undefined,
      },
      include: {
        order: { select: { id: true, orderNumber: true } },
        driver: { select: { id: true, name: true } },
      },
    });

    // If delivered, also update the order status
    if (validated.status === DeliveryStatus.DELIVERED) {
      await prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: "DELIVERED", deliveredAt: new Date() },
      });
    }

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}, DELIVERY_ROLES);
