"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface TextHighlightProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  color?: string;
}

export function TextHighlight({
  children,
  className,
  delay = 0,
  duration = 0.6,
  color = "#fde047",
}: TextHighlightProps) {
  const reduceMotion = useReducedMotion();
  const hiddenUnderline = "0% 0.18em";
  const visibleUnderline = "100% 0.18em";

  return (
    <motion.span
      className={cn(
        "text-highlight inline rounded-[0.12em] bg-left-bottom bg-no-repeat pb-[0.04em] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]",
        className,
      )}
      initial={reduceMotion ? false : { backgroundSize: hiddenUnderline }}
      animate={reduceMotion ? { backgroundSize: visibleUnderline } : undefined}
      whileInView={reduceMotion ? undefined : { backgroundSize: visibleUnderline }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundSize: reduceMotion ? visibleUnderline : hiddenUnderline,
      }}
    >
      {children}
    </motion.span>
  );
}

export default TextHighlight;
