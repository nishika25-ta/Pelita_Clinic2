import { useState } from "react";
import { BriefcaseBusiness, Megaphone, Sparkles } from "lucide-react";

export default function TopAnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;

  return (
    <div className="relative z-40 border-b border-violet-100/80 bg-white/90 md:bg-white/60 md:backdrop-blur-xl">
      <div className="container-shell flex min-h-12 items-center gap-3 py-2 text-xs text-slate-700 sm:text-sm">
        <div className="hidden items-center gap-1 rounded-full bg-violet-100 px-2 py-1 font-semibold text-violet-700 sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Updates
        </div>
        <p className="flex-1 truncate">
          <span className="font-semibold">Promo:</span> [Client to confirm package/promotion]{" "}
          <span className="mx-2 text-slate-400">|</span>
          <span className="font-semibold">News:</span> [Client to confirm latest announcement]
        </p>
        <div className="hidden items-center gap-3 text-slate-600 md:flex">
          <span className="inline-flex items-center gap-1"><Megaphone className="h-3.5 w-3.5" />Hiring</span>
          <span className="inline-flex items-center gap-1"><BriefcaseBusiness className="h-3.5 w-3.5" />Open roles available</span>
        </div>
      </div>
      <button onClick={() => setIsVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100">
        Close
      </button>
    </div>
  );
}
