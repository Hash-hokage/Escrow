export default function Footer() {
  return (
    <footer className="relative bg-vault-base py-16 px-8">
      {/* Top Divider — Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-sm text-text-tertiary font-label uppercase tracking-widest">
          © 2024 Ethereal Ledger Protocol • Secure Neutral Arbitration
        </div>
        <div className="flex gap-8 text-sm text-text-secondary font-medium">
          <a href="#" className="hover:text-indigo transition-colors duration-200">
            Privacy
          </a>
          <a href="#" className="hover:text-indigo transition-colors duration-200">
            Legal Framework
          </a>
          <a href="#" className="hover:text-indigo transition-colors duration-200">
            Nodes
          </a>
        </div>
      </div>
    </footer>
  );
}
