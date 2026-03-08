import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";

const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = RefreshSchema.parse(body);

    // Verify the token is valid
    const payload = verifyRefreshToken(refreshToken);

    // Check if token exists in DB
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date() || !stored.user.isActive) {
      return apiError("Invalid or expired refresh token", 401);
    }

    // Rotate tokens
    const newPayload = {
      userId: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    // Replace old refresh token
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return apiSuccess({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
