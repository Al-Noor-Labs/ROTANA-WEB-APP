import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, STAFF_ROLES, ADMIN_ROLES } from '@/lib/with-auth';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';
import { Prisma } from '@/lib/generated/prisma';

// GET /api/finance/ledger - View all ledger entries
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '30');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const referenceType = searchParams.get('referenceType');

    const where: Prisma.LedgerEntryWhereInput = {};
    if (referenceType) where.referenceType = referenceType;
    if (from || to) {
      where.postedAt = {};
      if (from) where.postedAt.gte = new Date(from);
      if (to) where.postedAt.lte = new Date(to);
    }

    const [entries, total] = await Promise.all([
      prisma.ledgerEntry.findMany({
        where,
        include: {
          debitAccount: { select: { code: true, name: true, type: true } },
          creditAccount: { select: { code: true, name: true, type: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { postedAt: 'desc' },
      }),
      prisma.ledgerEntry.count({ where }),
    ]);

    return apiSuccess({
      entries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);
