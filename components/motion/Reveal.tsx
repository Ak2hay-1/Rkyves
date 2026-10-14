"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { revealTransition } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...revealTransition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
