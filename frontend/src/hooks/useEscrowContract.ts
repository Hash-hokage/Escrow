import { useMemo } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  usePublicClient,
  useWatchContractEvent,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { parseAbiItem } from "viem";
import { useQuery } from "@tanstack/react-query";
import { escrowAbi } from "@/lib/contracts/escrow-abi";
import escrowJson from "@/lib/contracts/Escrow.json";
import { getEscrowAddress } from "@/lib/contracts/addresses";
import { EscrowTransaction, EscrowState } from "@/lib/types";

// Always use the JSON ABI array
const abi = escrowJson.abi as readonly any[];

/**
 * Custom hook providing read and write actions to the Escrow contract.
 */
export function useEscrowContract() {
  const { address: connectedAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = getEscrowAddress(chainId);
  const publicClient = usePublicClient();

  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Create Escrow
  const createEscrow = async (
    seller: `0x${string}`,
    arbitrator: `0x${string}`,
    deadlineUnix: bigint,
    amountWei: bigint
  ) => {
    if (!isConnected) throw new Error("Wallet not connected");
    return writeContractAsync({
      address: contractAddress,
      abi,
      functionName: "createEscrow",
      args: [seller, arbitrator, deadlineUnix],
      value: amountWei,
    });
  };

  // Actions
  const executeAction = async (
    action: "release" | "dispute" | "refund",
    id: bigint
  ) => {
    return writeContractAsync({
      address: contractAddress,
      abi,
      functionName: action,
      args: [id],
    });
  };

  // Resolve Dispute
  const resolveDispute = async (id: bigint, favouredBuyer: boolean) => {
    return writeContractAsync({
      address: contractAddress,
      abi,
      functionName: "resolve",
      args: [id, favouredBuyer],
    });
  };

  /**
   * Helper query that reads all EscrowCreated events for the connected user (as buyer, seller, or arbitrator).
   * It then reads the current state for those IDs.
   */
  const useUserEscrows = () => {
    return useQuery({
      queryKey: ["userEscrows", connectedAddress, chainId],
      queryFn: async () => {
        if (!connectedAddress || !publicClient) return [];

        // In a real production app we'd need an indexer like TheGraph.
        // For this assignment, we filter locally from block 0 (or a recent block)
        // Note: sepolia public nodes might limit block range for getLogs. We will fetch generically.
        const logs = await publicClient.getLogs({
          address: contractAddress,
          event: parseAbiItem(
            "event EscrowCreated(uint256 indexed id, address buyer, address seller, address arbitrator, uint256 amount, uint256 deadline)"
          ),
          fromBlock: "earliest",
          toBlock: "latest",
        });

        // Filter logs where the user is involved
        const userLogs = logs.filter((log) => {
          const { buyer, seller, arbitrator } = log.args;
          const lowerConnected = connectedAddress.toLowerCase();
          return (
            buyer?.toLowerCase() === lowerConnected ||
            seller?.toLowerCase() === lowerConnected ||
            arbitrator?.toLowerCase() === lowerConnected
          );
        });

        if (userLogs.length === 0) return [];

        // Distinct IDs (just in case)
        const ids = Array.from(
          new Set(userLogs.map((l) => l.args.id).filter((id): id is bigint => id !== undefined))
        );

        // Fetch the current struct state for each ID
        const results = await Promise.all(
          ids.map((id) =>
            publicClient.readContract({
              address: contractAddress,
              abi,
              functionName: "escrows",
              args: [id],
            })
          )
        );

        return results.map((res: any) => {
          return {
            id: res[0],
            buyer: res[1],
            seller: res[2],
            arbitrator: res[3],
            amount: res[4],
            deadline: res[5],
            currentState: Number(res[6]) as EscrowState,
          } as EscrowTransaction;
        });
      },
      enabled: !!connectedAddress && !!publicClient,
    });
  };

  /**
   * Reads a single escrow by ID.
   */
  const useEscrowById = (id: bigint | undefined) => {
    return useQuery({
      queryKey: ["escrow", id?.toString(), chainId],
      queryFn: async () => {
        if (id === undefined || !publicClient) return null;
        try {
          const res: any = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "escrows",
            args: [id],
          });
          return {
            id: res[0],
            buyer: res[1],
            seller: res[2],
            arbitrator: res[3],
            amount: res[4],
            deadline: res[5],
            currentState: Number(res[6]) as EscrowState,
          } as EscrowTransaction;
        } catch {
          return null; // ID might not exist yet
        }
      },
      enabled: id !== undefined && !!publicClient,
    });
  };

  return {
    connectedAddress,
    isConnected,
    createEscrow,
    executeAction,
    resolveDispute,
    isWritePending,
    useUserEscrows,
    useEscrowById,
    contractAddress,
  };
}
