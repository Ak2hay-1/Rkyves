"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { easeOutExpo, staggerTransition } from "@/lib/motion";

type StaggerProps = HTMLMotionProps<"div"> & {
  onMount?: boolean;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: staggerTransition,
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export function Stagger({ children, className, onMount = false, ...props }: StaggerProps) {
  if (onMount) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = HTMLMotionProps<"div">;

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}
