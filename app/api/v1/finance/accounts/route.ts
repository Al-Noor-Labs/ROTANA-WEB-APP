import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, STAFF_ROLES, ADMIN_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { AccountType } from '@/lib/generated/prisma';

const AccountSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(AccountType),
  description: z.string().optional(),
});

// GET /api/finance/accounts - List ledger accounts
export const GET = withAuth(async (_req) => {
  try {
    const accounts = await prisma.ledgerAccount.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });
    return apiSuccess(accounts);
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);

// POST /api/finance/accounts - Create a ledger account
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = AccountSchema.parse(body);

    // Check if code already exists
    const existing = await prisma.ledgerAccount.findUnique({
      where: { code: validated.code },
    });

    if (existing) {
      return apiError(409, 'CONFLICT');
    }

    const account = await prisma.ledgerAccount.create({
      data: {
        ...validated,
        isSystem: false, // Users can only create non-system accounts
      },
    });

    return apiSuccess(account, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, ADMIN_ROLES);
