import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Home, IdCard, MapPin, Stethoscope, Star } from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import MacOSDock from "../ui/MacOSDock";
import type { DockAppItem } from "../../types/dock";

const SECTIONS = ["home", "services", "panels", "profile", "reviews", "contact"];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
}

export default function AppleDock() {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = el.getBoundingClientRect().bottom + window.scrollY;
        if (mid >= top && mid <= bottom) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const apps = useMemo<DockAppItem[]>(
    () => [
      { id: "home", name: t("nav.dockHome"), icon: <Home /> },
      { id: "services", name: t("nav.dockServices"), icon: <HeartPulse /> },
      { id: "panels", name: t("nav.dockPanels"), icon: <IdCard /> },
      { id: "profile", name: t("nav.dockDoctor"), icon: <Stethoscope /> },
      { id: "reviews", name: t("nav.dockReviews"), icon: <Star /> },
      { id: "contact", name: t("nav.dockContact"), icon: <MapPin /> },
    ],
    [t],
  );

  const onAppClick = (appId: string) => {
    scrollTo(appId);
  };

  return (
    <motion.div initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <MacOSDock apps={apps} onAppClick={onAppClick} openApps={[activeSection]} />
    </motion.div>
  );
}
