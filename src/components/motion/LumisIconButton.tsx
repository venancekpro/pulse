"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type MotionButtonProps = ComponentProps<typeof motion.button>;

/** Bouton icône façon Lumis (hover scale + léger rotate, tap compress). */
export function LumisIconButton({
  className,
  children,
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08, rotate: 6 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-2xl border border-[var(--lumis-border)]",
        "bg-white/[0.05] text-[var(--lumis-text-dim)] shadow-xl backdrop-blur-md",
        "outline-none transition-colors hover:border-white/12 hover:text-white",
        "focus-visible:ring-2 focus-visible:ring-[var(--lumis-accent)]/40",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
