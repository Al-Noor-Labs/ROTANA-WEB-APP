import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, errors?: unknown) {
  return NextResponse.json({ success: false, message, errors }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError("Validation failed", 422, error.flatten().fieldErrors);
  }
  if (error instanceof Error) {
    console.error("[API Error]", error.message);
    return apiError(error.message, 500);
  }
  return apiError("Internal server error", 500);
}

// Generate sequential-looking reference numbers
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function generateGRNNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `GRN-${timestamp}`;
}

export function generateTransferNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `TRF-${timestamp}`;
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `INV-${timestamp}`;
}

export function generatePayslipNumber(userId: string, month: number, year: number): string {
  return `PAY-${userId.substring(0, 6).toUpperCase()}-${year}${String(month).padStart(2, "0")}`;
}
