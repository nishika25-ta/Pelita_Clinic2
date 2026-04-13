import { useCallback, useEffect, useState } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
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
import WhatsAppFloat from "../components/layout/WhatsAppFloat";
import SplashScreen from "../components/ui/SplashScreen";
import LanguageSwitcher from "../components/layout/LanguageSwitcher";

const IS_MOBILE = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const ZERO: MotionValue<string> = { get: () => "0%", set: () => {}, on: () => () => {} } as unknown as MotionValue<string>;

export default function App() {
  const { scrollYProgress } = useScroll();
  const yHeroDesktop = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yTestimonialDesktop = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const yHero = IS_MOBILE ? ZERO : yHeroDesktop;
  const yTestimonial = IS_MOBILE ? ZERO : yTestimonialDesktop;
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
      <WhatsAppFloat />
      <SmoothScroll>
        <div className="min-h-screen overflow-x-clip overflow-y-visible font-sans text-slate-800 selection:bg-purple-200 selection:text-purple-900">
          <main>
            <HeroSection yHero={yHero} splashReveal={splashHandoff} />
            <ScrollReveal viewport={{ once: true, amount: 0.03, margin: "0px 0px 24% 0px" }}>
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
