"use client";

import { useCallback, useEffect, useState } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import SmoothScroll from "./layout/SmoothScroll";
import ScrollReveal from "./ui/ScrollReveal";
import HeroSection from "./sections/HeroSection";
import ServicesSection from "./sections/ServicesSection";
import PanelsSection from "./sections/PanelsSection";
import ProfileSection from "./sections/ProfileSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import ContactSection from "./sections/ContactSection";
import FaqSection from "./sections/FaqSection";
import SiteFooter from "./layout/SiteFooter";
import AppleDock from "./layout/AppleDock";
import WhatsAppFloat from "./layout/WhatsAppFloat";
import SplashScreen from "./ui/SplashScreen";
import LanguageSwitcher from "./layout/LanguageSwitcher";

const ZERO: MotionValue<string> = { get: () => "0%", set: () => {}, on: () => () => {} } as unknown as MotionValue<string>;

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const yTestimonialDesktop = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsNarrowViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const yTestimonial = isNarrowViewport ? ZERO : yTestimonialDesktop;
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
            <HeroSection splashReveal={splashHandoff} />
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
