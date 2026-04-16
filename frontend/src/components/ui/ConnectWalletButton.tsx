"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatAddress } from "@/lib/utils";

export default function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: injected() });
    }
  };

  return (
    <button
      id="connect-wallet-btn"
      onClick={handleClick}
      className="vault-btn vault-btn-primary px-5 py-2.5 rounded-full text-sm font-bold"
    >
      {isConnected && address ? (
        <span className="flex items-center gap-2">
          {/* Liveness Indicator */}
          <span className="live-dot" />
          <span className="font-label tracking-tight">{formatAddress(address)}</span>
        </span>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
}
