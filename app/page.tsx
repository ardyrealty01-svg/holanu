'use client';

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

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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
