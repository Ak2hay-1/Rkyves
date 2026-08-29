"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { easeOutExpo, staggerTransition } from "@/lib/motion";

type StaggerProps = HTMLMotionProps<"div"> & {
  onMount?: boolean;
};

export function Stagger({ children, className, onMount = false, ...props }: StaggerProps) {
  const reduceMotion = useReducedMotion();

  const variants = {
    hidden: {},
    visible: {
      transition: staggerTransition,
    },
  };

  if (onMount) {
    return (
      <motion.div
        className={className}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={variants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = HTMLMotionProps<"div">;

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduceMotion
          ? undefined
          : {
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: easeOutExpo },
              },
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
