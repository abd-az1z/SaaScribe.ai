'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  whileInView?: boolean;
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  whileInView = false,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={whileInView ? { opacity: 1, y: 0 } : undefined}
      whileInView={whileInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
