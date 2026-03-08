import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, MANAGER_ROLES, STAFF_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

const SupplierSchema = z.object({
  name: z.string().min(1),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  paymentTerms: z.number().int().positive().optional().default(30),
  creditLimit: z.number().nonnegative().optional(),
});

// GET /api/suppliers
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const suppliers = await prisma.supplier.findMany({
      where: {
        status: 'ACTIVE',
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { contactName: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
    return apiSuccess(suppliers);
  } catch (error) {
    return handleApiError(error);
  }
}, STAFF_ROLES);

// POST /api/suppliers
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = SupplierSchema.parse(body);
    const supplier = await prisma.supplier.create({ data: validated });
    return apiSuccess(supplier, 201);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
