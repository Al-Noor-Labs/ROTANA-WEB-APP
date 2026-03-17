'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas/auth.schema';
import { DEFAULT_COUNTRY_CODE } from '@/lib/constants/phone';

/** Response shape from POST /api/v1/auth/register */
interface IRegisterApiResponse {
  success: boolean;
  data?: { accessToken: string; refreshToken: string };
  error?: { code: string; message: string };
}

/**
 * Registration page for Rotana Store.
 * Posts user data to /api/v1/auth/register and receives JWT tokens.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', phone: '' },
  });

  async function onSubmit(data: RegisterFormValues) {
    setServerError(null);

    // Strip empty phone before sending
    const payload = {
      ...data,
      phone: data.phone || undefined,
    };

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result: IRegisterApiResponse = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setServerError('An account with this email already exists.');
        } else {
          setServerError(result.error?.message ?? 'Registration failed. Please try again.');
        }
        return;
      }

      // TODO: Store tokens and redirect based on user role
      router.push('/');
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* Signup Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
        {/* Card Header */}
        <div className="p-8 pb-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Join Rotana Store — your wholesale network.</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 pt-4">
          {/* Server-level error */}
          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Full Name */}
          <div>
            <Label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-900">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="focus:border-brand focus:ring-brand w-full rounded-lg border-slate-300 px-4 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:ring-2"
              {...register('name')}
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">min 2 characters</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <Label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-900">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="focus:border-brand focus:ring-brand w-full rounded-lg border-slate-300 px-4 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:ring-2"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-900">
              Phone Number{' '}
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 my-2.5 flex items-center border-r border-slate-200 pr-2 pl-4 text-sm text-slate-400">
                {DEFAULT_COUNTRY_CODE}
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                className="focus:border-brand focus:ring-brand w-full rounded-lg border-slate-300 py-2.5 pr-4 pl-16 text-sm transition-all placeholder:text-slate-400 focus:ring-2"
                {...register('phone')}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-900">
              Password
            </Label>
            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="SecureP@ss123"
                className="focus:border-brand focus:ring-brand w-full rounded-lg border-slate-300 px-4 py-2.5 pr-12 text-sm transition-all placeholder:text-slate-400 focus:ring-2"
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
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">min 8 characters</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand shadow-brand/25 hover:bg-brand/90 h-12 w-full rounded-xl font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
          </Button>
        </form>

        {/* Card Footer */}
        <div className="border-t border-slate-100 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="text-brand font-semibold hover:underline">
              Log in
            </Link>
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            By signing up, you agree to our{' '}
            <Link href="#" className="underline transition-colors hover:text-slate-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline transition-colors hover:text-slate-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
