import { z } from 'zod';

/**
 * Schema for login form validation.
 * Matches the API contract at POST /api/v1/auth/login.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Schema for registration form validation.
 * Matches the API contract at POST /api/v1/auth/register.
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional().or(z.literal('')),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Schema for forgot-password form validation.
 * Matches the API contract at POST /api/v1/auth/forgot-password.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema for reset-password form validation.
 * Matches the API contract at POST /api/v1/auth/reset-password.
 * Validates that password and confirmPassword fields match.
 */
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
