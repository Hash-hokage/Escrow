"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import EscrowCard from "@/components/escrow/EscrowCard";
import { useEscrowContract } from "@/hooks/useEscrowContract";
import { useWatchContractEvent } from "wagmi";
import { parseAbiItem } from "viem";

export default function DashboardPage() {
  const { connectedAddress, useUserEscrows, useEscrowById, contractAddress } =
    useEscrowContract();

  // Search logic
  const [searchId, setSearchId] = useState<string>("");
  const [triggerSearchId, setTriggerSearchId] = useState<bigint | undefined>(
    undefined
  );

  const { data: searchedEscrow, isLoading: isSearchLoading } =
    useEscrowById(triggerSearchId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) {
      setTriggerSearchId(undefined);
      return;
    }
    try {
      setTriggerSearchId(BigInt(searchId));
    } catch {
      alert("Invalid ID format. Must be an integer.");
    }
  };

  // User escrows logic
  const {
    data: userEscrows = [],
    isLoading: isUserEscrowsLoading,
    refetch,
  } = useUserEscrows();

  // Watch for new creations to auto-refresh
  useWatchContractEvent({
    address: contractAddress,
    event: parseAbiItem(
      "event EscrowCreated(uint256 indexed id, address buyer, address seller, address arbitrator, uint256 amount, uint256 deadline)"
    ),
    onLogs() {
      refetch();
    },
  });

  return (
    <>
      <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
        {/* Header Section */}
        <section className="mb-24 flex flex-col items-start lg:grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h1 className="text-6xl font-extrabold tracking-tighter leading-[0.9] text-on-surface">
              Ethereal <span className="text-primary">Ledger</span>
            </h1>
            <p className="text-on-surface-variant text-xl max-w-lg leading-relaxed">
              Secure, trustless escrow on-chain for the modern digital economy.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl group mt-12">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <Search size={24} />
              </div>
              <input
                id="escrow-search"
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Look up escrow by ID..."
                className="w-full bg-surface-container-high border-none rounded-xl py-5 pl-14 pr-32 focus:ring-2 focus:ring-primary/20 text-lg font-label placeholder:text-outline outline-none transition-all shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Search Results */}
        {triggerSearchId !== undefined && (
          <section className="mb-24 space-y-6">
            <h2 className="text-2xl font-bold">
              Search Result for ID: {triggerSearchId.toString()}
            </h2>
            {isSearchLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-primary" /> Loading...
              </div>
            ) : searchedEscrow && searchedEscrow.buyer !== "0x0000000000000000000000000000000000000000" ? (
              <EscrowCard escrow={searchedEscrow} />
            ) : (
              <p className="text-on-surface-variant">
                No active escrow found with that ID or it hasn't been created yet.
              </p>
            )}
          </section>
        )}

        {/* Active Escrows Section */}
        <section className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">
              Your Active Escrows
            </h2>
            <p className="text-on-surface-variant mt-2">
              {connectedAddress
                ? "Smart contracts where you are the buyer, seller, or arbitrator."
                : "Connect your wallet to view your active escrows."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isUserEscrowsLoading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant gap-4">
                <Loader2 size={32} className="animate-spin" />
                <p>Syncing ledger...</p>
              </div>
            ) : userEscrows.length > 0 ? (
              userEscrows.map((escrow) => (
                <EscrowCard key={escrow.id.toString()} escrow={escrow} />
              ))
            ) : connectedAddress ? (
              <div className="col-span-full p-12 bg-surface-container-low rounded-3xl text-center border border-outline/10 text-on-surface-variant">
                No active escrows found onchain for your wallet.
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <BottomNav />

      {/* Bottom Decorative */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 pointer-events-none -z-10 bg-gradient-to-t from-primary/5 to-transparent" />
    </>
  );
}
