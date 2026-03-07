import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, ADMIN_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import bcrypt from "bcryptjs";

const UserUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "WAREHOUSE_MANAGER", "STORE_MANAGER", "CASHIER", "SALESMAN", "DELIVERY_DRIVER", "ACCOUNTANT", "CUSTOMER"]).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional()
});

// GET /api/users - List users (Admin)
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    
    const where: any = {};
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return apiSuccess(users);
  } catch (error) {
    return handleApiError(error);
  }
}, ADMIN_ROLES);
