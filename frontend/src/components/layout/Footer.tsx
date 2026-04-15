export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest py-16 px-8">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-sm text-outline font-label uppercase tracking-widest">
          © 2024 Ethereal Ledger Protocol • Secure Neutral Arbitration
        </div>
        <div className="flex gap-8 text-sm text-on-surface-variant font-medium">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Legal Framework
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Nodes
          </a>
        </div>
      </div>
    </footer>
  );
}
