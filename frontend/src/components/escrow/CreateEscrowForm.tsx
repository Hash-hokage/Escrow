"use client";

import { useState, FormEvent } from "react";
import { parseEther } from "viem";
import { CreateEscrowFormData } from "@/lib/types";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function CreateEscrowForm() {
  const { createEscrow, isWritePending } = useEscrowContract();

  const [formData, setFormData] = useState<CreateEscrowFormData>({
    seller: "",
    arbitrator: "",
    deadline: "",
    amount: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const deadlineDate = new Date(formData.deadline);
      const deadlineUnix = BigInt(Math.floor(deadlineDate.getTime() / 1000));
      const amountWei = parseEther(formData.amount);
      
      await createEscrow(
        formData.seller as \`0x\${string}\`,
        formData.arbitrator as \`0x\${string}\`,
        deadlineUnix,
        amountWei
      );
      alert("Successfully created Escrow!");
      // Reset form
      setFormData({
        seller: "",
        arbitrator: "",
        deadline: "",
        amount: "",
      });
    } catch (err: any) {
      console.error(err);
      alert(`Failed to create escrow: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-16 mb-24">
      {/* Left: Hero text */}
      <div className="lg:w-1/3">
        <h1 className="text-6xl font-extrabold tracking-tighter mb-6 leading-tight">
          Secure your <span className="text-primary">intent.</span>
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Initialize a high-fidelity smart contract escrow. Funds are locked in
          the ethereal ledger until conditions are met or an arbitrator
          intervenes.
        </p>
        <div className="mt-12 p-6 bg-surface-container-low rounded-xl">
          <div className="flex items-center gap-4 text-secondary mb-2">
            <ShieldCheck size={24} />
            <span className="font-bold tracking-tight">
              Triple-Locked Security
            </span>
          </div>
          <p className="text-sm text-on-surface-variant opacity-80">
            Every transaction is immutable, verified by the network, and
            governed by your chosen arbitrator.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="lg:w-2/3">
        <div className="glass-card p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
          {/* Subtle background light effect */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-outline font-bold ml-1">
                  Seller Wallet Address
                </label>
                <input
                  required
                  type="text"
                  placeholder="0x..."
                  value={formData.seller}
                  onChange={(e) =>
                    setFormData({ ...formData, seller: e.target.value })
                  }
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface font-label focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-outline-variant"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-outline font-bold ml-1">
                  Arbitrator Wallet Address
                </label>
                <input
                  required
                  type="text"
                  placeholder="0x..."
                  value={formData.arbitrator}
                  onChange={(e) =>
                    setFormData({ ...formData, arbitrator: e.target.value })
                  }
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface font-label focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-outline-variant"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-outline font-bold ml-1">
                  Escrow Deadline
                </label>
                <input
                  required
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-1 focus:ring-primary/30 transition-all [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-outline font-bold ml-1">
                  ETH Amount
                </label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    step="0.000000000000000001"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-on-surface font-label focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-outline-variant"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold font-label">
                    ETH
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isWritePending}
              className="flex items-center justify-center gap-2 w-full signature-gradient text-on-primary-container text-xl font-extrabold py-6 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isWritePending ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Pending Transaction...
                </>
              ) : (
                "Create Escrow"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
