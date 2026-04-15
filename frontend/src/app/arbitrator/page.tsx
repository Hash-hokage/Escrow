"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import DisputeListItem from "@/components/escrow/DisputeListItem";
import DisputeDetailPane from "@/components/escrow/DisputeDetailPane";
import EvidenceCard from "@/components/ui/EvidenceCard";
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
      <main className="pt-32 pb-20 px-8 max-w-screen-xl mx-auto min-h-screen flex items-center justify-center">
        <div className="bg-surface-container-low p-12 rounded-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Wallet Disconnected</h2>
          <p className="text-on-surface-variant">
            Please connect your wallet to access the Arbitrator panel.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="pt-32 pb-32 px-8 max-w-screen-2xl mx-auto min-h-screen">
        {/* Hero / Header Section */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-container/10 text-tertiary rounded-full text-xs font-label uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-tertiary-container active-dot" />
              Priority Jurisdiction
            </div>
            <h1 className="text-6xl font-extrabold tracking-tighter leading-none mb-6">
              Disputed Escrows <br />{" "}
              <span className="text-primary">Assigned to You.</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
              As a verified Arbitrator, you are the final authority on these
              locked assets. Review the metadata, examine off-chain evidence,
              and execute an immutable resolution.
            </p>
          </div>
          <div className="glass-card p-6 rounded-xl flex flex-col gap-1 shadow-2xl">
            <span className="text-xs font-label text-outline uppercase tracking-widest">
              Active Assignments
            </span>
            <span className="text-4xl font-extrabold font-headline">
              {String(arbitratorDisputes.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Main Content: Split-Pane Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-on-surface-variant gap-4">
            <Loader2 size={48} className="animate-spin" />
            <p className="text-lg">Loading cases...</p>
          </div>
        ) : arbitratorDisputes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* List Pane (Left) */}
            <div className="lg:col-span-4 lg:col-start-1 xl:col-span-3 space-y-6">
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
          <div className="p-12 bg-surface-container-low rounded-3xl text-center border border-outline/10 text-on-surface-variant">
            You currently have no active disputes assigned to you.
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
