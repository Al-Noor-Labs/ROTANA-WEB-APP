import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth, MANAGER_ROLES } from "@/lib/with-auth";
import { apiSuccess, handleApiError } from "@/lib/api-helpers";

const BulkProductSchema = z.array(z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),
  imageUrl: z.string().url().optional(),
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
  ).min(1),
})).min(1);

// POST /api/products/bulk - Create multiple products in one go
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = BulkProductSchema.parse(body);

    const created = await Promise.all(validated.map(async (item) => {
      const { variants, ...productData } = item;
      return prisma.product.create({
        data: {
          ...productData,
          variants: {
            create: variants.map(v => ({
              ...v,
              unitValue: v.unitValue,
              costPrice: v.costPrice,
              sellingPrice: v.sellingPrice,
              mrp: v.mrp,
              taxRate: v.taxRate,
            })),
          },
        },
        include: { variants: true }
      });
    }));

    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
