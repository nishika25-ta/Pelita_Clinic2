import { useCallback, useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import SmoothScroll from "../components/layout/SmoothScroll";
import ScrollReveal from "../components/ui/ScrollReveal";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import PanelsSection from "../components/sections/PanelsSection";
import ProfileSection from "../components/sections/ProfileSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactSection from "../components/sections/ContactSection";
import FaqSection from "../components/sections/FaqSection";
import SiteFooter from "../components/layout/SiteFooter";
import AppleDock from "../components/layout/AppleDock";
import SplashScreen from "../components/ui/SplashScreen";
import LanguageSwitcher from "../components/layout/LanguageSwitcher";

export default function App() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yTestimonial = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const [splashHandoff, setSplashHandoff] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  /** Hero only after splash is gone — avoids showing hero during the overlay. */
  const onSplashExitComplete = useCallback(() => {
    setSplashHandoff(true);
    setSplashFinished(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", !splashFinished);
    return () => document.body.classList.remove("overflow-hidden");
  }, [splashFinished]);

  return (
    <>
      <SplashScreen onExitComplete={onSplashExitComplete} />
      <LanguageSwitcher />
      <SmoothScroll>
        <div className="min-h-screen overflow-x-clip overflow-y-visible font-sans text-slate-800 selection:bg-purple-200 selection:text-purple-900">
          <main>
            <HeroSection yHero={yHero} splashReveal={splashHandoff} />
            <ScrollReveal>
              <ServicesSection />
            </ScrollReveal>
            <ScrollReveal>
              <PanelsSection />
            </ScrollReveal>
            <ScrollReveal>
              <ProfileSection />
            </ScrollReveal>
            <ScrollReveal>
              <TestimonialsSection yTestimonial={yTestimonial} />
            </ScrollReveal>
            <ScrollReveal>
              <ContactSection />
            </ScrollReveal>
            <ScrollReveal>
              <FaqSection />
            </ScrollReveal>
          </main>
          <ScrollReveal>
            <SiteFooter />
          </ScrollReveal>
          <AppleDock />
        </div>
      </SmoothScroll>
    </>
  );
}
