/**
 * RBAC Role constants.
 *
 * Use these instead of raw string literals like "SALESMAN" or "CUSTOMER" in route handlers.
 * These align with the Role enum in prisma/schema.prisma.
 *
 * Usage:
 *   import { ROLES } from "@/lib/constants/roles";
 *   if (user.role === ROLES.SALESMAN) { ... }
 */
export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    WAREHOUSE_MANAGER: "WAREHOUSE_MANAGER",
    STORE_MANAGER: "STORE_MANAGER",
    CASHIER: "CASHIER",
    SALESMAN: "SALESMAN",
    DELIVERY_DRIVER: "DELIVERY_DRIVER",
    ACCOUNTANT: "ACCOUNTANT",
    CUSTOMER: "CUSTOMER",
} as const;

export type RoleKey = keyof typeof ROLES;
export type RoleValue = (typeof ROLES)[RoleKey];
