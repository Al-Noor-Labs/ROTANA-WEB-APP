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

      const result = await res.json();

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
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-[#7c3bed]/5 lg:p-10">
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
              className="h-12 rounded-xl border-slate-200 transition-all focus:border-[#7c3bed] focus:ring-2 focus:ring-[#7c3bed]/20"
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
                className="text-xs font-medium text-[#7c3bed] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-12 rounded-xl border-slate-200 pr-12 transition-all focus:border-[#7c3bed] focus:ring-2 focus:ring-[#7c3bed]/20"
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
            className="h-12 w-full rounded-xl bg-[#7c3bed] font-bold text-white shadow-lg shadow-[#7c3bed]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3bed]/90 active:translate-y-0"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </Button>

          {/* Divider */}
          {/* <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                Or continue with
              </span>
            </div>
          </div> */}

          {/* Google SSO (placeholder) */}
          {/* <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button> */}
        </form>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="ml-1 font-bold text-[#7c3bed] hover:underline">
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
