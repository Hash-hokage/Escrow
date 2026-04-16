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
        formData.seller as `0x${string}`,
        formData.arbitrator as `0x${string}`,
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
    <div className="flex flex-col lg:flex-row gap-16 mb-26">
      {/* Left: Hero text */}
      <div className="lg:w-1/3">
        <h1 className="text-6xl font-bold tracking-vault mb-6 leading-tight font-headline">
          <span className="gradient-text">Secure your</span>{" "}
          <span className="gradient-text-indigo">intent.</span>
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          Initialize a high-fidelity smart contract escrow. Funds are locked in
          the ethereal ledger until conditions are met or an arbitrator
          intervenes.
        </p>
        <div className="mt-12 vault-card p-6">
          <div className="flex items-center gap-4 text-emerald mb-2">
            <ShieldCheck size={24} className="animate-breathe" />
            <span className="font-bold tracking-vault text-text-primary">
              Triple-Locked Security
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            Every transaction is immutable, verified by the network, and
            governed by your chosen arbitrator.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="lg:w-2/3">
        <div className="vault-card p-10 relative overflow-hidden">
          {/* Subtle background atmospheric glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo/8 blur-[100px] rounded-full pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-widest text-text-tertiary font-semibold ml-1">
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
                  className="vault-input"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-widest text-text-tertiary font-semibold ml-1">
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
                  className="vault-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-widest text-text-tertiary font-semibold ml-1">
                  Escrow Deadline
                </label>
                <input
                  required
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="vault-input"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[11px] uppercase tracking-widest text-text-tertiary font-semibold ml-1">
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
                    className="vault-input pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo font-bold font-label text-sm">
                    ETH
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isWritePending}
              className="vault-btn vault-btn-primary w-full text-lg font-extrabold py-5 rounded-xl"
            >
              {isWritePending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Pending Transaction...
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
