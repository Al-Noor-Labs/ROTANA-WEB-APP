'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/lib/schemas/auth.schema';

/**
 * Registration page for Rotana Store.
 * Posts user data to /api/v1/auth/register and receives JWT tokens.
 */
export default function RegisterPage() {
  const router = useRouter();
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

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setServerError('An account with this email already exists.');
        } else {
          setServerError(
            result.error?.message ?? 'Registration failed. Please try again.'
          );
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
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Card Header */}
        <div className="p-8 pb-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Create your account
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Join Rotana Store — your wholesale network.
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 pt-4 space-y-6"
        >
          {/* Server-level error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {serverError}
            </div>
          )}

          {/* Full Name */}
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-semibold text-slate-900 mb-1.5"
            >
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-lg border-slate-300 focus:ring-2 focus:ring-[#7c3bed] focus:border-[#7c3bed] transition-all placeholder:text-slate-400 text-sm"
              {...register('name')}
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">min 2 characters</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-900 mb-1.5"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-lg border-slate-300 focus:ring-2 focus:ring-[#7c3bed] focus:border-[#7c3bed] transition-all placeholder:text-slate-400 text-sm"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

         {/* Phone Number */}
          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-semibold text-slate-900 mb-1.5"
            >
              Phone Number{' '}
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-sm border-r border-slate-200 pr-2 my-2.5">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                className="w-full pl-16 pr-4 py-2.5 rounded-lg border-slate-300 focus:ring-2 focus:ring-[#7c3bed] focus:border-[#7c3bed] transition-all placeholder:text-slate-400 text-sm"
                {...register('phone')}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-900 mb-1.5"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="SecureP@ss123"
              className="w-full px-4 py-2.5 rounded-lg border-slate-300 focus:ring-2 focus:ring-[#7c3bed] focus:border-[#7c3bed] transition-all placeholder:text-slate-400 text-sm"
              {...register('password')}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">min 8 characters</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#7c3bed] hover:bg-[#7c3bed]/90 text-white font-bold rounded-xl shadow-lg shadow-[#7c3bed]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Card Footer */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#7c3bed] font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            By signing up, you agree to our{' '}
            <Link
              href="#"
              className="underline hover:text-slate-600 transition-colors"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="#"
              className="underline hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
