import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Starting vertical offset in pixels */
  offsetY?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Override Framer `whileInView` viewport (helps mobile / Lenis intersection timing). */
  viewport?: NonNullable<HTMLMotionProps<"div">["viewport"]>;
} & Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport" | "transition">;

/**
 * Fades and slides content into view when the user scrolls it into the viewport.
 * Uses Framer Motion — pair with Lenis smooth scroll without extra setup.
 */
const defaultViewport: NonNullable<HTMLMotionProps<"div">["viewport"]> = {
  once: true,
  amount: 0.08,
  margin: "0px 0px 12% 0px",
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  offsetY = 32,
  duration = 0.75,
  viewport,
  ...rest
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offsetY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport ?? defaultViewport}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
