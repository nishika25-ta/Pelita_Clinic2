import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

export type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

/**
 * Mouse-tracking radial glow (keyboard focus shows a static full glow).
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(139, 92, 246, 0.12)",
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (!reduceMotion) setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (!reduceMotion) setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[2rem] border-2 border-indigo-200/90 bg-white shadow-md shadow-slate-300/25 ring-1 ring-indigo-100/80 transition-all duration-500 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:ring-indigo-200/90 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300"
        style={{
          opacity: reduceMotion ? 0 : opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
        aria-hidden
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
