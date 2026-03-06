import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES, STAFF_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";

const CategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
});

// GET /api/categories - List all categories
export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { children: { where: { isActive: true } } },
      orderBy: { name: "asc" },
    });
    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories - Create category (managers only)
export const POST = withAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const validated = CategorySchema.parse(body);

    const slug = validated.name.toLowerCase().replace(/\s+/g, "-");

    const category = await prisma.category.create({
      data: { ...validated, slug },
    });
    return apiSuccess(category, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
