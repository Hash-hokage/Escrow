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
  const iconColor = type === "document" ? "text-indigo" : "text-emerald";

  return (
    <div className="vault-card p-8">
      <div className={`${iconColor} mb-5`}>
        <Icon size={36} />
      </div>
      <h4 className="font-bold text-lg mb-2 text-text-primary">{title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
      <a
        href="#"
        className="inline-block mt-6 text-xs font-label text-indigo uppercase tracking-widest hover:text-indigo-light transition-colors duration-200"
      >
        {linkLabel}
      </a>
    </div>
  );
}
