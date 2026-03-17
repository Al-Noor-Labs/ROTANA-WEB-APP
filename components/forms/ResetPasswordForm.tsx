'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/schemas/auth.schema';

/** Response shape from POST /api/v1/auth/reset-password */
interface IResetPasswordApiResponse {
  success: boolean;
  error?: { code: string; message: string };
}

/**
 * Client-side reset password form.
 * Uses useSearchParams to read the token from the URL query string.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  // Guard: show error if token is missing from the URL
  if (!token) {
    return (
      <div className="w-full max-w-[480px]">
        <div className="shadow-brand/5 rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl lg:p-10">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold text-slate-900 lg:text-3xl">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-slate-500">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              href="/forgot-password"
              className="bg-brand shadow-brand/25 hover:bg-brand/90 block rounded-xl px-4 py-3 text-center font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Request New Link
            </Link>
            <p className="text-center text-sm text-slate-500">
              Return to{' '}
              <Link href="/login" className="text-brand font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function onSubmit(data: ResetPasswordFormValues) {
    setServerError(null);

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password, token }),
      });

      const result: IResetPasswordApiResponse = await res.json();

      if (!res.ok) {
        setServerError(result.error?.message ?? 'Failed to reset password. Please try again.');
        return;
      }

      router.push('/login');
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="shadow-brand/5 rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl lg:p-10">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 lg:text-3xl">Reset Password</h1>
          <p className="text-sm text-slate-500">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
              New Password
            </Label>
            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="focus:border-brand focus:ring-brand/20 h-12 rounded-xl border-slate-200 pr-12 transition-all focus:ring-2"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 transition-colors hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            ) : (
              <p className="text-xs text-slate-400">min 8 characters</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
              Confirm Password
            </Label>
            <div className="relative flex items-center">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="focus:border-brand focus:ring-brand/20 h-12 rounded-xl border-slate-200 pr-12 transition-all focus:ring-2"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-slate-400 transition-colors hover:text-slate-600"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Reset Password Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand shadow-brand/25 hover:bg-brand/90 h-12 w-full rounded-xl font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
          </Button>
        </form>

        {/* Return to Login */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Return to{' '}
            <Link href="/login" className="text-brand font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
