import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { CategorySection } from '@/components/category-section';
import { FeaturedSection } from '@/components/featured-section';
import { LatestSection } from '@/components/latest-section';
import { HowItWorks } from '@/components/how-it-works';
import { AreaExplorer } from '@/components/area-explorer';
import { KPRSection } from '@/components/kpr-section';
import { TrustSection } from '@/components/trust-section';
import { ArticlesSection } from '@/components/articles-section';
import { CTABanner } from '@/components/cta-banner';
import { Footer } from '@/components/footer';
import { ChatbotWidget } from '@/components/chatbot-widget';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
      <LatestSection />
      <HowItWorks />
      <AreaExplorer />
      <KPRSection />
      <TrustSection />
      <ArticlesSection />
      <CTABanner />
      <Footer />
      <ChatbotWidget />
    </>
  );
}
