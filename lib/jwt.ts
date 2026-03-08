import jwt from "jsonwebtoken";
import { Role } from "@/lib/generated/prisma";
import { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Startup validation — fail fast with a clear message if secrets are missing
// ─────────────────────────────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `[rotana] Missing required environment variable: ${name}\n` +
      `Make sure it is set in .env.local (development) or Vercel Environment Variables (production).`
    );
  }
  return value;
}

const ACCESS_SECRET = requireEnv("JWT_ACCESS_SECRET");
const REFRESH_SECRET = requireEnv("JWT_REFRESH_SECRET");

const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

// ─────────────────────────────────────────────────────────────────────────────
// Token operations
// ─────────────────────────────────────────────────────────────────────────────

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

/**
 * Verifies and decodes an access token.
 * Returns the payload or throws if the token is invalid/expired.
 */
export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
}

/**
 * Verifies and decodes a refresh token.
 * Returns the payload or throws if the token is invalid/expired.
 */
export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
}

// ─────────────────────────────────────────────────────────────────────────────
// Request extraction — works for both web (cookie) and mobile (Bearer header)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts a JWT from the request.
 * Priority: Authorization: Bearer <token> → cookie: access_token
 *
 * This dual-extraction ensures the same API routes work for:
 * - Web dashboard (cookie-based session)
 * - Rotana mobile app (Bearer token, separate repo)
 */
export function extractTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies.get("access_token")?.value ?? null;
}

/**
 * Returns the authenticated user from the request, or null if unauthenticated/token invalid.
 * Never throws — always returns null on any auth failure.
 */
export function getAuthUser(req: NextRequest): JWTPayload | null {
  const token = extractTokenFromRequest(req);
  if (!token) return null;
  try {
    return verifyAccessToken(token);
  } catch {
    // Token expired, tampered, or otherwise invalid — treat as unauthenticated
    return null;
  }
}
