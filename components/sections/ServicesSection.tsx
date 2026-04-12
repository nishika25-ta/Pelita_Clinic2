import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, type PanInfo } from "framer-motion";
import {
  Activity,
  Baby,
  CheckCircle2,
  Droplets,
  HeartPulse,
  Microscope,
  Scissors,
  ShieldPlus,
  Stethoscope,
  Syringe,
  UserRound,
} from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import type { ServiceItem } from "../../types/clinic";
import { SERVICES } from "../../config/clinicData";
import { SpotlightCard } from "../ui/SpotlightCard";
import { useParallax } from "../../utils/useParallax";

const iconClass = "h-6 w-6 text-indigo-500";

function ServiceCategoryIcon({ service }: { service: ServiceItem }) {
  if (service.category === "Women's Health") return <UserRound className={iconClass} aria-hidden />;
  if (service.category === "Sexual Health") return <ShieldPlus className={iconClass} aria-hidden />;
  switch (service.iconName) {
    case "stethoscope": return <Stethoscope className={iconClass} aria-hidden />;
    case "activity": return <Activity className={iconClass} aria-hidden />;
    case "bug": return <Microscope className={iconClass} aria-hidden />;
    case "syringe": return <Syringe className={iconClass} aria-hidden />;
    case "baby": return <Baby className={iconClass} aria-hidden />;
    case "heartPulse": return <HeartPulse className={iconClass} aria-hidden />;
    case "shieldAlert": return <Droplets className={iconClass} aria-hidden />;
    case "scissors": return <Scissors className={iconClass} aria-hidden />;
    default: return <Stethoscope className={iconClass} aria-hidden />;
  }
}

function ServiceCategoryInner({ service }: { service: ServiceItem }) {
  const { t, localizeService } = useI18n();
  const { title, items } = localizeService(service);

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
          <ServiceCategoryIcon service={service} />
        </div>
        <span className="inline-flex items-center justify-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-600">
          {t("services.itemsBadge", { n: items.length })}
        </span>
      </div>
      <h3 className="mb-5 text-lg font-bold text-slate-900 sm:text-xl">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="group flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-indigo-200 transition-colors group-hover:text-indigo-500"
              aria-hidden
            />
            <span className="text-sm leading-relaxed text-slate-600 transition-colors group-hover:text-slate-900">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DRAG_BUFFER = 28;
const VELOCITY_THRESHOLD = 400;
const SPRING = { type: "spring", stiffness: 280, damping: 28 } as const;
const GAP = 14;

function ServicesMobileCarousel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const x = useMotionValue(0);
  const count = SERVICES.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardWidth = Math.max(260, containerWidth - 32);
  const trackOffset = cardWidth + GAP;

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const dir =
        info.offset.x < -DRAG_BUFFER || info.velocity.x < -VELOCITY_THRESHOLD
          ? 1
          : info.offset.x > DRAG_BUFFER || info.velocity.x > VELOCITY_THRESHOLD
            ? -1
            : 0;
      if (dir === 0) return;
      setPosition((p) => Math.max(0, Math.min(p + dir, count - 1)));
    },
    [count],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-3xl border border-indigo-200/60 bg-white/80 p-4 shadow-sm ring-1 ring-indigo-100/50"
      data-lenis-prevent-touch
    >
      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -trackOffset * (count - 1), right: 0 }}
        style={{ gap: `${GAP}px`, x }}
        onDragEnd={onDragEnd}
        animate={{ x: -(position * trackOffset) }}
        transition={SPRING}
      >
        {SERVICES.map((service) => (
          <div
            key={service.category}
            className="shrink-0 overflow-hidden rounded-2xl border-2 border-indigo-200/90 bg-white shadow-md ring-1 ring-indigo-100/80"
            style={{ width: cardWidth }}
          >
            <ServiceCategoryInner service={service} />
          </div>
        ))}
      </motion.div>

      <div className="mt-4 flex justify-center gap-1.5">
        {SERVICES.map((service, i) => (
          <button
            key={service.category}
            type="button"
            className={`h-2 rounded-full transition-all duration-200 ${
              i === position ? "w-5 bg-indigo-500" : "w-2 bg-slate-300"
            }`}
            onClick={() => setPosition(i)}
            aria-label={`Go to ${service.category}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const { t } = useI18n();
  const totalServices = SERVICES.reduce((sum, service) => sum + service.items.length, 0);
  const bgParallax = useParallax({ distance: 56 });

  return (
    <section id="services" className="section-shell relative overflow-hidden">
      <motion.div
        ref={bgParallax.ref}
        style={{ y: bgParallax.y }}
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-violet-300/35 via-fuchsia-200/20 to-transparent"
        aria-hidden
      />
      <div className="container-shell">
        <div className="relative mx-auto mb-12 max-w-7xl md:mb-16">
            <div className="rounded-[2.5rem] border-2 border-indigo-200/85 bg-white/70 p-8 shadow-md shadow-slate-300/20 ring-1 ring-indigo-100/70 md:backdrop-blur-xl md:p-12">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-indigo-500">
                  {t("services.section")}
                </span>
                <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                  {t("services.titleLine1")} <br className="hidden md:block" />
                  {t("services.titleLine2")}
                </h2>
                <p className="text-lg leading-relaxed text-slate-600">{t("services.desc")}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="min-w-[140px] rounded-2xl border-2 border-indigo-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{t("services.categoriesLabel")}</p>
                  <p className="text-4xl font-black text-slate-800">{SERVICES.length}</p>
                </div>
                <div className="min-w-[140px] rounded-2xl border-2 border-indigo-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{t("services.totalServicesLabel")}</p>
                  <p className="text-4xl font-black text-slate-800">{totalServices}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: masonry columns */}
        <div className="relative mx-auto hidden max-w-7xl md:block columns-1 [column-gap:2rem] md:columns-2 xl:columns-3">
          {SERVICES.map((service) => (
            <SpotlightCard key={service.category} className="mb-8 break-inside-avoid">
              <ServiceCategoryInner service={service} />
            </SpotlightCard>
          ))}
        </div>

        {/* Mobile: swipeable carousel */}
        <div className="md:hidden">
          <ServicesMobileCarousel />
        </div>
      </div>
    </section>
  );
}
