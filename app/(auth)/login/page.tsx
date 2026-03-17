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
import { loginSchema, type LoginFormValues } from '@/lib/schemas/auth.schema';

/** Response shape from POST /api/v1/auth/login */
interface ILoginApiResponse {
  success: boolean;
  data?: { accessToken: string; refreshToken: string };
  error?: { code: string; message: string };
}

/**
 * Login page for Rotana Store.
 * Posts credentials to /api/v1/auth/login and receives JWT tokens.
 */
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginFormValues) {
    setServerError(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: ILoginApiResponse = await res.json();

      if (!res.ok) {
        setServerError(result.error?.message ?? 'Invalid email or password.');
        return;
      }

      // TODO: Store tokens and redirect based on user role
      // For now, tokens are in result.data.accessToken / result.data.refreshToken
      router.push('/');
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="w-full max-w-[480px]">
      {/* Login Card */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-brand/5 lg:p-10">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 lg:text-3xl">Welcome Back</h1>
          <p className="text-sm text-slate-500">Login to your Rotana Store account.</p>
        </div>

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
              className="h-12 rounded-xl border-slate-200 transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-brand hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-12 rounded-xl border-slate-200 pr-12 transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
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
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-brand font-bold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/90 active:translate-y-0"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="ml-1 font-bold text-brand hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Small Print */}
      <div className="mt-8 space-x-4 text-center">
        <Link href="#" className="text-xs text-slate-400 transition-colors hover:text-slate-600">
          Privacy Policy
        </Link>
        <span className="text-slate-300">•</span>
        <Link href="#" className="text-xs text-slate-400 transition-colors hover:text-slate-600">
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
