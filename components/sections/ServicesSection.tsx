import { motion } from "framer-motion";
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
import ScrollStack, { ScrollStackItem } from "../ui/ScrollStack";

const iconClass = "h-6 w-6 text-indigo-500";

function ServiceCategoryIcon({ service }: { service: ServiceItem }) {
  if (service.category === "Women's Health") {
    return <UserRound className={iconClass} aria-hidden />;
  }
  if (service.category === "Sexual Health") {
    return <ShieldPlus className={iconClass} aria-hidden />;
  }
  switch (service.iconName) {
    case "stethoscope":
      return <Stethoscope className={iconClass} aria-hidden />;
    case "activity":
      return <Activity className={iconClass} aria-hidden />;
    case "bug":
      return <Microscope className={iconClass} aria-hidden />;
    case "syringe":
      return <Syringe className={iconClass} aria-hidden />;
    case "baby":
      return <Baby className={iconClass} aria-hidden />;
    case "heartPulse":
      return <HeartPulse className={iconClass} aria-hidden />;
    case "shieldAlert":
      return <Droplets className={iconClass} aria-hidden />;
    case "scissors":
      return <Scissors className={iconClass} aria-hidden />;
    default:
      return <Stethoscope className={iconClass} aria-hidden />;
  }
}

function ServiceCategoryInner({ service }: { service: ServiceItem }) {
  const { t, localizeService } = useI18n();
  const { title, items } = localizeService(service);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
          <ServiceCategoryIcon service={service} />
        </div>
        <span className="inline-flex items-center justify-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-600">
          {t("services.itemsBadge", { n: items.length })}
        </span>
      </div>
      <h3 className="mb-6 text-xl font-bold text-slate-900">{title}</h3>
      <ul className="space-y-4">
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
          <div className="rounded-[2.5rem] border-2 border-indigo-200/85 bg-white/70 p-8 shadow-md shadow-slate-300/20 ring-1 ring-indigo-100/70 backdrop-blur-xl md:p-12">
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

        <div className="relative mx-auto hidden max-w-7xl md:block columns-1 [column-gap:2rem] md:columns-2 xl:columns-3">
          {SERVICES.map((service) => (
            <SpotlightCard key={service.category} className="mb-8 break-inside-avoid">
              <ServiceCategoryInner service={service} />
            </SpotlightCard>
          ))}
        </div>

        <div className="relative mx-auto h-[min(78dvh,640px)] w-full max-w-lg md:hidden">
          <ScrollStack
            className="h-full"
            itemDistance={56}
            itemStackDistance={22}
            itemScale={0.024}
            baseScale={0.9}
            stackPosition="14%"
            scaleEndPosition="10%"
          >
            {SERVICES.map((service) => (
              <ScrollStackItem key={service.category} itemClassName="scroll-stack-card--service">
                <SpotlightCard className="mb-0 h-full min-h-0 shadow-md">
                  <ServiceCategoryInner service={service} />
                </SpotlightCard>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>
    </section>
  );
}
