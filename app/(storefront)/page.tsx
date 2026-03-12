import type { Metadata } from 'next';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import DealOfTheDay from './components/DealOfTheDay';
import TopPicksGrid from './components/TopPicksGrid';
import PromoBanner from './components/PromoBanner';
import QuickBuyRow from './components/QuickBuyRow';

export const metadata: Metadata = {
  title: 'Rotana — Fresh Groceries Delivered Daily',
  description:
    'Experience premium quality produce and daily essentials delivered straight to your doorstep within hours.',
};

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto">
      <HeroSection />
      <CategoryGrid />

      {/* Deal of the Day + Top Picks Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mb-12">
        <DealOfTheDay />
        <TopPicksGrid />
      </section>

      <PromoBanner />
      <QuickBuyRow />
    </main>
  );
}
