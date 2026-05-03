import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  delay = 0,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        "glass rounded-2xl p-6 transition-smooth",
        hover && "hover:border-primary/30",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
