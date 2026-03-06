import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES, STAFF_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { LocationType } from "@/app/generated/prisma";

const LocationSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(LocationType),
  code: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
});

const BinSchema = z.object({
  code: z.string().min(1),
  aisle: z.string().optional(),
  rack: z.string().optional(),
  shelf: z.string().optional(),
  maxCapacity: z.number().int().optional(),
});

// GET /api/locations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const locations = await prisma.location.findMany({
      where: {
        isActive: true,
        ...(type ? { type: type as LocationType } : {}),
      },
      include: { bins: { where: { isActive: true } } },
      orderBy: { name: "asc" },
    });
    return apiSuccess(locations);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/locations
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = LocationSchema.parse(body);
    const location = await prisma.location.create({ data: validated });
    return apiSuccess(location, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
