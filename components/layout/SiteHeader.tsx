import { CalendarCheck } from "lucide-react";
import { CLINIC_INFO } from "../../config/clinicData";
import { getWhatsAppLink } from "../../utils/contact";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 md:bg-white/80 md:backdrop-blur-md border-b border-purple-100 shadow-sm pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">P</div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none">{CLINIC_INFO.name}</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">EST. {CLINIC_INFO.established}</p>
          </div>
        </div>
        <a
          href={getWhatsAppLink(CLINIC_INFO.phone)}
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-2 bg-purple-400 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md shadow-purple-400/20 hover:shadow-lg hover:-translate-y-0.5"
        >
          <CalendarCheck className="w-4 h-4" />
          Book Appointment
        </a>
      </div>
    </header>
  );
}
