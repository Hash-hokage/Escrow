import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable glassmorphism container.
 * Applies the glass-card class from globals.css.
 */
export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
}
