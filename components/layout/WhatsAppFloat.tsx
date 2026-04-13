import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "../../contexts/I18nContext";
import { CLINIC_INFO } from "../../config/clinicData";
import { getWhatsAppLink } from "../../utils/contact";

export default function WhatsAppFloat() {
  const { t } = useI18n();
  const [hovered, setHovered] = useState(false);

  const open = useCallback(() => {
    window.open(getWhatsAppLink(CLINIC_INFO.phone), "_blank", "noopener,noreferrer");
  }, []);

  return (
    <motion.button
      type="button"
      onClick={open}
      aria-label={t("nav.dockWhatsapp")}
      className="group fixed z-[90] flex cursor-pointer items-center justify-center rounded-2xl border-0 bg-transparent p-0 shadow-none outline-none ring-0 [-webkit-tap-highlight-color:transparent] touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600/80 max-sm:bottom-[max(6.25rem,calc(env(safe-area-inset-bottom,0px)+5.25rem))] max-sm:right-[max(1rem,env(safe-area-inset-right,0px))] sm:bottom-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+1.25rem))] sm:right-[max(1.5rem,calc(env(safe-area-inset-right,0px)+1.25rem))]"
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08, y: -4, transition: { type: "spring", stiffness: 420, damping: 22 } }}
      whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 500, damping: 28 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.span
        className="flex h-[52px] w-[52px] items-center justify-center will-change-transform sm:h-14 sm:w-14"
        animate={hovered ? { y: 0 } : { y: [0, -5, 0] }}
        transition={hovered ? { duration: 0.2, ease: "easeOut" } : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/logo/whts.png"
          alt=""
          className="h-full w-full select-none rounded-2xl object-contain transition-[filter,transform] duration-300 ease-out [filter:drop-shadow(0_10px_22px_rgba(15,23,42,0.2))_drop-shadow(0_4px_8px_rgba(22,163,74,0.25))] group-hover:[filter:drop-shadow(0_18px_36px_rgba(15,23,42,0.28))_drop-shadow(0_0_28px_rgba(34,197,94,0.55))] group-hover:scale-[1.04]"
          draggable={false}
        />
      </motion.span>
    </motion.button>
  );
}
