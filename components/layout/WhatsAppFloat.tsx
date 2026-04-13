import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "../../contexts/I18nContext";
import { CLINIC_INFO } from "../../config/clinicData";
import { getWhatsAppLink } from "../../utils/contact";
import { getDockBarHeightPx, getDockResponsiveConfig } from "../../utils/dockMetrics";
import "../ui/MacOSDock.css";

export default function WhatsAppFloat() {
  const { t } = useI18n();
  const [hovered, setHovered] = useState(false);
  const [dockBarPx, setDockBarPx] = useState(() => {
    if (typeof window === "undefined") return 58;
    return getDockBarHeightPx(getDockResponsiveConfig(window.innerWidth));
  });

  useEffect(() => {
    const sync = () => {
      setDockBarPx(getDockBarHeightPx(getDockResponsiveConfig(window.innerWidth)));
    };
    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  const open = useCallback(() => {
    window.open(getWhatsAppLink(CLINIC_INFO.phone), "_blank", "noopener,noreferrer");
  }, []);

  const pad = Math.max(5, Math.round(dockBarPx * 0.14));

  return (
    <motion.button
      type="button"
      onClick={open}
      aria-label={t("nav.dockWhatsapp")}
      className="group fixed z-[90] flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 shadow-none outline-none ring-0 [-webkit-tap-highlight-color:transparent] touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600/80 bottom-4 right-4 sm:bottom-6 sm:right-6"
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, y: -2, transition: { type: "spring", stiffness: 420, damping: 22 } }}
      whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 500, damping: 28 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.span
        className="macos-dock-bar flex shrink-0 items-center justify-center overflow-hidden will-change-transform"
        style={{ width: dockBarPx, height: dockBarPx, padding: pad }}
        animate={hovered ? { y: 0 } : { y: [0, -3, 0] }}
        transition={hovered ? { duration: 0.2, ease: "easeOut" } : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/logo/whts.png"
          alt=""
          className="h-full w-full select-none object-contain transition-[filter,transform] duration-300 ease-out [filter:drop-shadow(0_6px_14px_rgba(15,23,42,0.14))_drop-shadow(0_2px_6px_rgba(22,163,74,0.22))] group-hover:[filter:drop-shadow(0_12px_28px_rgba(15,23,42,0.22))_drop-shadow(0_0_22px_rgba(34,197,94,0.45))] group-hover:scale-[1.04]"
          draggable={false}
        />
      </motion.span>
    </motion.button>
  );
}
