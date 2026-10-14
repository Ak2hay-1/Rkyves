"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { revealTransition } from "@/lib/motion";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export default function FadeIn({
  children,
  className,
  delay = 0,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...revealTransition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
