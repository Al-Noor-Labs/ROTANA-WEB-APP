import jwt from 'jsonwebtoken';
import { Role } from '@/lib/generated/prisma';
import { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// Lazy secret loading — deferred to first use so `next build` doesn't crash
// when JWT env vars aren't available in the CI build environment.
// At runtime (dev / production), these will fail fast on the first request.
// ─────────────────────────────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `[rotana] Missing required environment variable: ${name}\n` +
      `Make sure it is set in .env.local (development) or Vercel Environment Variables (production).`,
    );
  }
  return value;
}

let _accessSecret: string | null = null;
let _refreshSecret: string | null = null;

function getAccessSecret(): string {
  if (!_accessSecret) _accessSecret = requireEnv('JWT_ACCESS_SECRET');
  return _accessSecret;
}

function getRefreshSecret(): string {
  if (!_refreshSecret) _refreshSecret = requireEnv('JWT_REFRESH_SECRET');
  return _refreshSecret;
}

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
  return jwt.sign(payload, getAccessSecret(), { expiresIn: '15m' });
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: '7d' });
}

/**
 * Verifies and decodes an access token.
 * Returns the payload or throws if the token is invalid/expired.
 */
export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, getAccessSecret()) as JWTPayload;
}

/**
 * Verifies and decodes a refresh token.
 * Returns the payload or throws if the token is invalid/expired.
 */
export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, getRefreshSecret()) as JWTPayload;
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
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.cookies.get('access_token')?.value ?? null;
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
