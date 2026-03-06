import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/jwt";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return apiError("Unauthorized", 401);

    // Delete all refresh tokens for this user
    await prisma.refreshToken.deleteMany({
      where: { userId: user.userId },
    });

    return apiSuccess({ message: "Logged out successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!dbUser) return apiError("User not found", 404);

    return apiSuccess(dbUser);
  } catch (error) {
    return handleApiError(error);
  }
}
