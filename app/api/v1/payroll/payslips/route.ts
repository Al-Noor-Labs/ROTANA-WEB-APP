import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, MANAGER_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { Prisma } from '@/lib/generated/prisma';

const PayslipSchema = z.object({
  userId: z.string().uuid(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  basicSalary: z.number().nonnegative(),
  allowances: z.number().nonnegative().optional().default(0),
  deductions: z.number().nonnegative().optional().default(0),
  commissions: z.number().nonnegative().optional().default(0),
  paidAt: z.string().optional().nullable(),
});

// GET /api/payroll/payslips - List payslips
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const where: Prisma.PayslipWhereInput = {};
    if (userId) where.userId = userId;
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const payslips = await prisma.payslip.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return apiSuccess(payslips);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);

// POST /api/payroll/payslips - Create or bulk-generate payslips
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();

    // Check if it's bulk generate or single create
    if (Array.isArray(body)) {
      // Bulk create
      const results = [];
      for (const item of body) {
        const validated = PayslipSchema.parse(item);
        const netPay =
          validated.basicSalary +
          validated.allowances +
          validated.commissions -
          validated.deductions;

        const payslip = await prisma.payslip.upsert({
          where: {
            userId_month_year: {
              userId: validated.userId,
              month: validated.month,
              year: validated.year,
            },
          },
          update: {
            ...validated,
            netPay,
            paidAt: validated.paidAt ? new Date(validated.paidAt) : null,
          },
          create: {
            ...validated,
            netPay,
            paidAt: validated.paidAt ? new Date(validated.paidAt) : null,
          },
        });
        results.push(payslip);
      }
      return apiSuccess(results, 201);
    } else {
      // Single create
      const validated = PayslipSchema.parse(body);
      const netPay =
        validated.basicSalary +
        (validated.allowances || 0) +
        (validated.commissions || 0) -
        (validated.deductions || 0);

      const payslip = await prisma.payslip.upsert({
        where: {
          userId_month_year: {
            userId: validated.userId,
            month: validated.month,
            year: validated.year,
          },
        },
        update: {
          ...validated,
          netPay,
          paidAt: validated.paidAt ? new Date(validated.paidAt) : null,
        },
        create: {
          ...validated,
          netPay,
          paidAt: validated.paidAt ? new Date(validated.paidAt) : null,
        },
      });
      return apiSuccess(payslip, 201);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(400, 'VALIDATION_ERROR', error.issues);
    }
    return handleApiError(error);
  }
}, MANAGER_ROLES);
