import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, MANAGER_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

// GET /api/products/[id] - Get single product
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { where: { isActive: true } },
      },
    });
    if (!product) return apiError(404, 'NOT_FOUND');
    return apiSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/products/[id] - Update product
export const PATCH = withAuth(async (req, { params }) => {
  try {
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body,
      include: { variants: true, category: true },
    });
    return apiSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);

// DELETE /api/products/[id] - Soft delete (set status to DISCONTINUED)
export const DELETE = withAuth(async (_req, { params }) => {
  try {
    await prisma.product.update({
      where: { id: params.id },
      data: { status: 'DISCONTINUED' },
    });
    return apiSuccess({ message: 'Product discontinued' });
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
