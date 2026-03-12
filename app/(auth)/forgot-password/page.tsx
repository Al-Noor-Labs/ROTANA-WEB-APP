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
        setServerError(
          result.error?.message ?? 'Failed to send OTP. Please try again.'
        );
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
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-xl shadow-[#7c3bed]/5 p-8 lg:p-10">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Forgot Password
          </h1>
          <p className="text-slate-500 text-sm">
            Enter your email address and we&apos;ll send you an Link to reset
            your password.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
              Link has been sent to your email. Please check your inbox.
            </div>
            <Link
              href="/login"
              className="block text-center text-sm text-[#7c3bed] font-bold hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Server-level error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="h-12 rounded-xl border-slate-200 focus:border-[#7c3bed] focus:ring-2 focus:ring-[#7c3bed]/20 transition-all"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Send Link Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#7c3bed] hover:bg-[#7c3bed]/90 text-white font-bold rounded-xl shadow-lg shadow-[#7c3bed]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Send Link'
              )}
            </Button>
          </form>
        )}

        {/* Return to Login */}
        {!success && (
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Return to{' '}
              <Link
                href="/login"
                className="text-[#7c3bed] font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
