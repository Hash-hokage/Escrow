import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable vault-card container.
 * Applies the Glass-Vault treatment from the Obsidian Protocol design system.
 */
export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`vault-card ${className}`}>
      {children}
    </div>
  );
}
