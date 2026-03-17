import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rotana Store — Authentication',
  description: 'Sign in or create your Rotana Store account.',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#F8FAFC] font-sans">
      {/* Header */}
      <header className="border-primary/10 sticky top-0 z-50 w-full border-b bg-white/80 px-6 py-4 backdrop-blur-md lg:px-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-brand p-2 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Rotana <span className="font-medium text-brand">Store</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand"
            >
              Help Center
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-grow items-center justify-center p-6 lg:p-12">{children}</main>

      {/* Decorative background blurs */}
      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-t from-brand/5 to-transparent" />
      <div className="pointer-events-none fixed top-20 right-20 -z-10 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
    </div>
  );
}
