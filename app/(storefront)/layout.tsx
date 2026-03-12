import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-[family-name:var(--font-inter)] bg-[#f7f6f8] text-slate-900 antialiased`}>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
