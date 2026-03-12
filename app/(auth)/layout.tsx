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
    <div className="relative min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      {/* Header */}
      <header className="w-full border-b border-primary/10 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-[#7c3bed] text-white p-2 rounded-lg">
              <svg
                className="w-6 h-6"
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
              Rotana{' '}
              <span className="text-[#7c3bed] font-medium">Store</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-[#7c3bed] transition-colors"
            >
              Help Center
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-6 lg:p-12">
        {children}
      </main>

      {/* Decorative background blurs */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#7c3bed]/5 to-transparent -z-10 pointer-events-none" />
      <div className="fixed top-20 right-20 w-64 h-64 bg-[#7c3bed]/5 blur-3xl rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
