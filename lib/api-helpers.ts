import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from '@/lib/logger';

// ─────────────────────────────────────────────────────────────────────────────
// Response types
// ─────────────────────────────────────────────────────────────────────────────

export interface IApiSuccess<T> {
  success: true;
  data: T;
}

export interface IApiSuccessList<T> {
  success: true;
  data: T[];
  meta: IPaginationMeta;
}

export interface IApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Human-readable messages for each error code — NEVER expose internal details
const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'The request data is invalid. Check the details field.',
  UNAUTHENTICATED: 'Authentication is required to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'A resource with this identifier already exists.',
  INSUFFICIENT_STOCK: 'One or more items do not have sufficient stock.',
  CREDIT_LIMIT_EXCEEDED: 'This order exceeds the available credit limit.',
  PAYMENT_FAILED: 'The payment could not be processed.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  INTERNAL_ERROR: 'An unexpected error occurred. Our team has been notified.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Success helpers
// ─────────────────────────────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, status = 200): NextResponse<IApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiSuccessList<T>(
  data: T[],
  meta: IPaginationMeta,
): NextResponse<IApiSuccessList<T>> {
  return NextResponse.json({ success: true, data, meta }, { status: 200 });
}

// ─────────────────────────────────────────────────────────────────────────────
// Error helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a structured error response.
 *
 * @param status   - HTTP status code (400, 401, 403, 404, 409, 422, 429, 500)
 * @param code     - Machine-readable SCREAMING_SNAKE_CASE error code
 * @param details  - Optional additional context (e.g. Zod field errors)
 *
 * NEVER pass user-facing or internal error messages from the server directly
 * as `details`. Only pass structured validation errors from Zod.
 */
export function apiError(status: number, code: string, details?: unknown): NextResponse<IApiError> {
  const message = ERROR_MESSAGES[code] ?? ERROR_MESSAGES['INTERNAL_ERROR']!;
  return NextResponse.json({ success: false, error: { code, message, details } }, { status });
}

// ─────────────────────────────────────────────────────────────────────────────
// Global error handler — use in route handler catch blocks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Catches well-known error types and returns the appropriate API response.
 * For unrecognized errors, logs server-side and returns a generic 500.
 *
 * This NEVER exposes internal error.message to the client.
 */
export function handleApiError(error: unknown): NextResponse<IApiError> {
  if (error instanceof ZodError) {
    return apiError(422, 'VALIDATION_ERROR', error.flatten().fieldErrors);
  }

  // Log the real error server-side with full details
  logger.error({ err: error }, 'Unhandled API error');

  // Return a safe, generic message to the client — never leak internals
  return apiError(500, 'INTERNAL_ERROR');
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses standard pagination query params from a URL.
 * Defaults: page=1, limit=20. Max limit enforced at 100.
 */
export function parsePagination(url: string): { page: number; limit: number; skip: number } {
  const { searchParams } = new URL(url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
  return { page, limit, skip: (page - 1) * limit };
}

export function buildMeta(page: number, limit: number, total: number): IPaginationMeta {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

// ─────────────────────────────────────────────────────────────────────────────
// ID generators for business documents
// ─────────────────────────────────────────────────────────────────────────────

function compactTimestamp(): string {
  const now = new Date();
  return [
    now.getFullYear().toString().slice(2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
  ].join('');
}

function randomSuffix(len = 4): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + len)
    .toUpperCase();
}

export function generateGRNNumber(): string {
  return `GRN-${compactTimestamp()}-${randomSuffix()}`;
}

export function generateInvoiceNumber(): string {
  return `INV-${compactTimestamp()}-${randomSuffix()}`;
}

export function generateTransferNumber(): string {
  return `TRF-${compactTimestamp()}-${randomSuffix()}`;
}
