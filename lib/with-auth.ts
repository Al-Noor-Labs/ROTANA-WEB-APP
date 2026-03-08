import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, JWTPayload } from '@/lib/jwt';
import { Role } from '@/lib/generated/prisma';
import { apiError } from '@/lib/api-helpers';

type RouteHandler = (
  req: NextRequest,
  context: { params: Record<string, string>; user: JWTPayload },
) => Promise<NextResponse>;

/**
 * Wraps a route handler with RBAC protection.
 * @param handler - The actual route handler
 * @param allowedRoles - Roles that can access this route. Empty array = any authenticated user.
 */
export function withAuth(handler: RouteHandler, allowedRoles: Role[] = []) {
  return async (
    req: NextRequest,
    context: { params: Record<string, string> | Promise<Record<string, string>> },
  ) => {
    const user = getAuthUser(req);

    if (!user) {
      return apiError('Authentication required', 401);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return apiError('You do not have permission to perform this action', 403);
    }

    const params = await context.params;
    return handler(req, { ...context, params, user });
  };
}

// Role groups for convenience
export const ADMIN_ROLES: Role[] = [Role.SUPER_ADMIN];
export const MANAGER_ROLES: Role[] = [Role.SUPER_ADMIN, Role.WAREHOUSE_MANAGER, Role.STORE_MANAGER];
export const STAFF_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.WAREHOUSE_MANAGER,
  Role.STORE_MANAGER,
  Role.CASHIER,
  Role.ACCOUNTANT,
];
export const DELIVERY_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.WAREHOUSE_MANAGER,
  Role.DELIVERY_DRIVER,
];
