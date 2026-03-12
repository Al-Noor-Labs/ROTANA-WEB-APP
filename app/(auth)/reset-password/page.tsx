import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';

/**
 * Reset password page (server component).
 * Wraps the client-side form in a Suspense boundary as required
 * by Next.js for components using useSearchParams().
 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#7c3bed]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
