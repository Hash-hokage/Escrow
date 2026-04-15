import { FileText, MessageCircle } from "lucide-react";

/**
 * EvidenceCard — Arbitrator evidence vault item.
 */
interface EvidenceCardProps {
  type: "document" | "chat";
  title: string;
  description: string;
  linkLabel: string;
}

export default function EvidenceCard({
  type,
  title,
  description,
  linkLabel,
}: EvidenceCardProps) {
  const Icon = type === "document" ? FileText : MessageCircle;
  const iconColor = type === "document" ? "text-primary" : "text-secondary";

  return (
    <div className="glass-card p-8 rounded-3xl shadow-xl">
      <div className={`${iconColor} mb-5`}>
        <Icon size={36} />
      </div>
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-sm text-on-surface-variant leading-relaxed">
        {description}
      </p>
      <a
        href="#"
        className="inline-block mt-6 text-xs font-label text-primary uppercase tracking-widest hover:underline"
      >
        {linkLabel}
      </a>
    </div>
  );
}
