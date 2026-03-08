import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES } from "@/lib/with-auth";
import { apiSuccess, apiSuccessList, apiError, handleApiError, parsePagination, buildMeta } from "@/lib/api-helpers";
import type { Prisma } from "@/lib/generated/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// Request schemas
// ─────────────────────────────────────────────────────────────────────────────

const ProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  brand: z.string().max(100).optional(),
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional().default([]),
  barcode: z.string().optional(),
  isPerishable: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  variants: z.array(
    z.object({
      sku: z.string().min(1).max(50),
      name: z.string().min(1).max(100),
      unitValue: z.number().positive(),
      unitLabel: z.string().min(1).max(20),
      costPrice: z.number().nonnegative(),
      sellingPrice: z.number().nonnegative(),
      mrp: z.number().optional(),
      taxRate: z.number().min(0).max(100).optional().default(0),
      reorderLevel: z.number().int().optional().default(10),
    })
  ).min(1, "At least one variant is required"),
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products — list products with filters (public, no auth required)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/products
 *
 * Returns a paginated list of active products.
 * Public endpoint — no authentication required (B2C catalogue browsing).
 * Query params: categoryId, search, page, limit
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(req.url);

    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    // Build typed where clause — no any
    const where: Prisma.ProductWhereInput = { status: "ACTIVE" };
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

    return apiSuccessList(products, buildMeta(page, limit, total));
  } catch (error) {
    return handleApiError(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/products — create product with variants (managers only)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/products
 *
 * Creates a new product with one or more variants.
 * Roles: SUPER_ADMIN, WAREHOUSE_MANAGER, STORE_MANAGER
 */
export const POST = withAuth(async (req) => {
  try {
    const body: unknown = await req.json();
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(422, "VALIDATION_ERROR", parsed.error.flatten().fieldErrors);
    }

    const { variants, ...productData } = parsed.data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
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
