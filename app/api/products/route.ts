import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";

const ProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional().default([]),
  barcode: z.string().optional(),
  isPerishable: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  variants: z.array(
    z.object({
      sku: z.string().min(1),
      name: z.string().min(1),
      unitValue: z.number().positive(),
      unitLabel: z.string().min(1),
      costPrice: z.number().nonnegative(),
      sellingPrice: z.number().nonnegative(),
      mrp: z.number().optional(),
      taxRate: z.number().min(0).max(100).optional().default(0),
      reorderLevel: z.number().int().optional().default(10),
    })
  ).min(1, "At least one variant is required"),
});

// GET /api/products - List all products (with filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const where: any = { status: "ACTIVE" };
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: {
            where: { isActive: true },
            orderBy: { sellingPrice: "asc" },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return apiSuccess({
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/products - Create product with variants
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = ProductSchema.parse(body);
    const { variants, ...productData } = validated;

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants.map((v) => ({
            ...v,
            unitValue: v.unitValue,
            costPrice: v.costPrice,
            sellingPrice: v.sellingPrice,
            mrp: v.mrp,
            taxRate: v.taxRate,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return apiSuccess(product, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
