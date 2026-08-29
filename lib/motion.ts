export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

export const revealTransition = {
  duration: 0.6,
  ease: easeOutExpo,
};

export const staggerTransition = {
  staggerChildren: 0.1,
  delayChildren: 0.05,
};
