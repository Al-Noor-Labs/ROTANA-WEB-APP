import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withAuth, ADMIN_ROLES } from '@/lib/with-auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';

const UserUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z
    .enum([
      'SUPER_ADMIN',
      'WAREHOUSE_MANAGER',
      'STORE_MANAGER',
      'CASHIER',
      'SALESMAN',
      'DELIVERY_DRIVER',
      'ACCOUNTANT',
      'CUSTOMER',
    ])
    .optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

// PATCH /api/users/[id] - Update user (Admin)
export const PATCH = withAuth(async (req, { params }) => {
  try {
    const body = await req.json();
    const validated = UserUpdateSchema.parse(body);

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });
    if (!existingUser) return apiError('User not found', 404);

    let passwordHash = undefined;
    if (validated.password) {
      passwordHash = await bcrypt.hash(validated.password, 12);
    }

    const { password, ...otherData } = validated;

    const dataToUpdate: any = { ...otherData };
    if (passwordHash) {
      dataToUpdate.passwordHash = passwordHash;
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return apiSuccess(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}, ADMIN_ROLES);

// DELETE /api/users/[id] - Disable user (Soft Delete)
export const DELETE = withAuth(async (req, { params }) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });
    if (!existingUser) return apiError('User not found', 404);

    await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return apiSuccess({ message: 'User disabled successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}, ADMIN_ROLES);
