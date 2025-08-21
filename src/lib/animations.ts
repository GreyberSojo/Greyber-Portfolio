import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

// función para transición con delay
export const fadeUpTransition = (i: number) => ({
  delay: i * 0.2,
  duration: 0.6,
  ease: "easeOut" as const
});
