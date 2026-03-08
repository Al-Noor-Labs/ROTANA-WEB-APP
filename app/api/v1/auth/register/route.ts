import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { Role } from '@/lib/generated/prisma';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z
    .enum(['CUSTOMER', 'CASHIER', 'SALESMAN', 'DELIVERY_DRIVER'])
    .optional()
    .default('CUSTOMER'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (existing) {
      return apiError(409, 'CONFLICT');
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        passwordHash,
        role: validated.role as Role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return apiSuccess({ user, accessToken, refreshToken }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
