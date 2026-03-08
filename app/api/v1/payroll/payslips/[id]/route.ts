import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, MANAGER_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

const PayslipUpdateSchema = z.object({
  basicSalary: z.number().nonnegative().optional(),
  allowances: z.number().nonnegative().optional(),
  deductions: z.number().nonnegative().optional(),
  commissions: z.number().nonnegative().optional(),
  paidAt: z.string().optional().nullable(),
});

// GET /api/payroll/payslips/[id] - Individual payslip details
export const GET = withAuth(async (_req, { params }) => {
  try {
    const payslip = await prisma.payslip.findUnique({
      where: { id: params.id },
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
    });

    if (!payslip) return apiError(404, 'NOT_FOUND');

    return apiSuccess(payslip);
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);

// PUT /api/payroll/payslips/[id] - Update a payslip
export const PUT = withAuth(async (req, { params }) => {
  try {
    const body = await req.json();
    const validated = PayslipUpdateSchema.parse(body);

    const payslip = await prisma.payslip.findUnique({
      where: { id: params.id },
    });

    if (!payslip) return apiError(404, 'NOT_FOUND');

    const basicSalary = validated.basicSalary ?? Number(payslip.basicSalary);
    const allowances = validated.allowances ?? Number(payslip.allowances);
    const commissions = validated.commissions ?? Number(payslip.commissions);
    const deductions = validated.deductions ?? Number(payslip.deductions);

    const netPay = basicSalary + allowances + commissions - deductions;

    const updatedPayslip = await prisma.payslip.update({
      where: { id: params.id },
      data: {
        ...validated,
        netPay,
        paidAt: validated.paidAt ? new Date(validated.paidAt) : null,
      },
    });

    return apiSuccess(updatedPayslip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(400, 'VALIDATION_ERROR', error.issues);
    }
    return handleApiError(error);
  }
}, MANAGER_ROLES);

// DELETE /api/payroll/payslips/[id] - Delete a payslip
export const DELETE = withAuth(async (_req, { params }) => {
  try {
    await prisma.payslip.delete({
      where: { id: params.id },
    });

    return apiSuccess({ message: 'Payslip deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}, MANAGER_ROLES);
