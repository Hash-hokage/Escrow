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
      className="signature-gradient text-on-primary-container px-6 py-2.5 rounded-full font-bold active:scale-95 duration-150 transition-all"
    >
      {isConnected && address ? formatAddress(address) : "Connect Wallet"}
    </button>
  );
}
