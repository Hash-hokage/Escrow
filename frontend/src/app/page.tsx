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
    abi: [
      parseAbiItem(
        "event EscrowCreated(uint256 indexed id, address buyer, address seller, address arbitrator, uint256 amount, uint256 deadline)"
      )
    ],
    eventName: "EscrowCreated",
    onLogs() {
      // ..
    }
  })

  return (
    <>
      <main className="pt-40 pb-22 px-8 max-w-screen-2xl mx-auto min-h-screen">
        {/* Header Section */}
        <section className="mb-26 flex flex-col items-start lg:grid lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h1 className="text-7xl font-bold tracking-vault leading-[0.9] font-headline">
              <span className="gradient-text">Ethereal</span>{" "}
              <span className="gradient-text-indigo">Ledger</span>
            </h1>
            <p className="text-text-secondary text-xl max-w-lg leading-relaxed">
              Secure, trustless escrow on-chain for the modern digital economy.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl group mt-14">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-tertiary group-focus-within:text-indigo transition-colors duration-200">
                <Search size={22} />
              </div>
              <input
                id="escrow-search"
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Look up escrow by ID..."
                className="w-full vault-input py-5 pl-14 pr-32 !rounded-xl text-base !font-body"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 vault-btn vault-btn-primary px-6 rounded-lg text-sm font-bold"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Search Results */}
        {triggerSearchId !== undefined && (
          <section className="mb-26 space-y-6">
            <h2 className="text-2xl font-bold font-headline text-text-primary">
              Search Result for ID: {triggerSearchId.toString()}
            </h2>
            {isSearchLoading ? (
              <div className="flex items-center gap-3 text-text-secondary">
                <Loader2 className="animate-spin text-indigo" /> Loading...
              </div>
            ) : searchedEscrow && searchedEscrow.buyer !== "0x0000000000000000000000000000000000000000" ? (
              <EscrowCard escrow={searchedEscrow} />
            ) : (
              <p className="text-text-secondary">
                No active escrow found with that ID or it hasn&apos;t been created yet.
              </p>
            )}
          </section>
        )}

        {/* Active Escrows Section */}
        <section className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold tracking-vault text-text-primary font-headline">
              Your Active Escrows
            </h2>
            <p className="text-text-secondary mt-3">
              {connectedAddress
                ? "Smart contracts where you are the buyer, seller, or arbitrator."
                : "Connect your wallet to view your active escrows."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isUserEscrowsLoading ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-text-secondary gap-4">
                <Loader2 size={32} className="animate-spin text-indigo" />
                <p>Syncing ledger...</p>
              </div>
            ) : userEscrows.length > 0 ? (
              userEscrows.map((escrow) => (
                <EscrowCard key={escrow.id.toString()} escrow={escrow} />
              ))
            ) : connectedAddress ? (
              <div className="col-span-full vault-card p-14 text-center text-text-secondary">
                No active escrows found onchain for your wallet.
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
