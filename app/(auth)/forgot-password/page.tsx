'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot password page for Rotana Store.
 * Accepts an email address and sends an OTP for password reset.
 */
export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setServerError(null);

    try {
      // TODO: Wire to actual forgot-password API endpoint
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error?.message ?? 'Failed to send OTP. Please try again.');
        return;
      }

      setSuccess(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="w-full max-w-[480px]">
      {/* Forgot Password Card */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-[#7c3bed]/5 lg:p-10">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 lg:text-3xl">Forgot Password</h1>
          <p className="text-sm text-slate-500">
            Enter your email address and we&apos;ll send you an Link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Link has been sent to your email. Please check your inbox.
            </div>
            <Link
              href="/login"
              className="block text-center text-sm font-bold text-[#7c3bed] hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Server-level error */}
            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="h-12 rounded-xl border-slate-200 transition-all focus:border-[#7c3bed] focus:ring-2 focus:ring-[#7c3bed]/20"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Send Link Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-[#7c3bed] font-bold text-white shadow-lg shadow-[#7c3bed]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3bed]/90 active:translate-y-0"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Link'}
            </Button>
          </form>
        )}

        {/* Return to Login */}
        {!success && (
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Return to{' '}
              <Link href="/login" className="font-bold text-[#7c3bed] hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
