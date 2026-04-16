"use client";

import { useState } from "react";
import { Loader2, ShieldOff } from "lucide-react";
import DisputeListItem from "@/components/escrow/DisputeListItem";
import DisputeDetailPane from "@/components/escrow/DisputeDetailPane";
import Footer from "@/components/layout/Footer";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import { EscrowState } from "@/lib/types";

export default function ArbitratorPage() {
  const { connectedAddress, isConnected, useUserEscrows } = useEscrowContract();
  const { data: allEscrows = [], isLoading } = useUserEscrows();

  // Filter for disputes where connected user is the arbitrator and state is DISPUTED
  const arbitratorDisputes = allEscrows.filter(
    (e) =>
      e.arbitrator.toLowerCase() === connectedAddress?.toLowerCase() &&
      e.currentState === EscrowState.DISPUTED
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDispute = arbitratorDisputes[selectedIndex];

  if (!isConnected) {
    return (
      <main className="pt-40 pb-22 px-8 max-w-screen-xl mx-auto min-h-screen flex items-center justify-center">
        <div className="vault-card p-14 text-center max-w-md">
          <ShieldOff size={48} className="mx-auto mb-6 text-text-tertiary animate-breathe" />
          <h2 className="text-3xl font-bold mb-4 font-headline gradient-text">Wallet Disconnected</h2>
          <p className="text-text-secondary">
            Please connect your wallet to access the Arbitrator panel.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="pt-40 pb-30 px-8 max-w-screen-2xl mx-auto min-h-screen">
        {/* Hero / Header Section — "Judicial" centered layout */}
        <div className="mb-26 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber/10 text-amber rounded-full text-xs font-label uppercase tracking-widest mb-6 border border-amber/20">
            <span className="live-dot" style={{ background: "#F59E0B", boxShadow: "0 0 8px rgba(245,158,11,0.6)" }} />
            Priority Jurisdiction
          </div>
          <h1 className="text-6xl font-bold tracking-vault leading-tight mb-6 font-headline">
            <span className="gradient-text">Disputed Escrows</span>
            <br />
            <span className="gradient-text-indigo">Assigned to You.</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-xl mx-auto">
            As a verified Arbitrator, you are the final authority on these
            locked assets. Review the metadata, examine off-chain evidence,
            and execute an immutable resolution.
          </p>

          {/* Active Assignments Counter */}
          <div className="inline-flex mt-10 vault-card px-8 py-5 flex-col gap-1 items-center">
            <span className="text-[11px] font-label text-text-tertiary uppercase tracking-widest">
              Active Assignments
            </span>
            <span className="text-4xl font-extrabold font-headline text-text-primary">
              {String(arbitratorDisputes.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Main Content: Split-Pane Grid */}
        {isLoading ? (
          <div className="py-26 flex flex-col items-center justify-center text-text-secondary gap-4">
            <Loader2 size={48} className="animate-spin text-indigo" />
            <p className="text-lg">Loading cases...</p>
          </div>
        ) : arbitratorDisputes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* List Pane (Left) */}
            <div className="lg:col-span-4 lg:col-start-1 xl:col-span-3 space-y-4">
              {arbitratorDisputes.map((dispute, index) => (
                <DisputeListItem
                  key={dispute.id.toString()}
                  dispute={dispute}
                  isSelected={index === selectedIndex}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>

            {/* Detail Pane (Right) */}
            <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9">
              {selectedDispute && (
                <DisputeDetailPane dispute={selectedDispute} />
              )}
            </div>
          </div>
        ) : (
          <div className="vault-card p-14 text-center text-text-secondary max-w-2xl mx-auto">
            You currently have no active disputes assigned to you.
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
