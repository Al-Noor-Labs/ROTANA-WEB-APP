import { prisma } from '@/lib/prisma';
import { withAuth, ADMIN_ROLES } from '@/lib/with-auth';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';
import { Prisma, Role } from '@/lib/generated/prisma';

// GET /api/users - List users (Admin)
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role as Role;

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
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(users);
  } catch (error) {
    return handleApiError(error);
  }
}, ADMIN_ROLES);
