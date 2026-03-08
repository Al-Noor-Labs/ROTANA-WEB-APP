import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, MANAGER_ROLES } from '@/lib/with-auth';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

// GET /api/payroll/commissions - List sales commissions
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isPaid = searchParams.get('isPaid');

    const where: any = {};
    if (userId) where.userId = userId;
    if (isPaid !== null) where.isPaid = isPaid === 'true';

    const commissions = await prisma.salesCommission.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, orderNumber: true, totalAmount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(commissions);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
