"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { fundingPoolConfig } from "./hooksConfig";

// Disbursement request status enum
export enum DisbursementStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  COMPLETED = 3,
}

interface UseFundingPoolOptions {
  address?: `0x${string}`;
  requestId?: bigint;
  enabled?: boolean;
}

export function useFundingPool(options: UseFundingPoolOptions = {}) {
  const { address, requestId, enabled = true } = options;

  // =========================
  // WRITE CONTRACT SETUP
  // =========================

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract();

  const {
    data: receipt,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // =========================
  // READ FUNCTIONS
  // =========================

  const balance = useReadContract({
    ...fundingPoolConfig,
    functionName: "balances",
    args: address ? [address] : undefined,
    query: {
      enabled: enabled && !!address,
    },
  });

  const pendingRequests = useReadContract({
    ...fundingPoolConfig,
    functionName: "getPendingRequests",
    query: {
      enabled,
    },
  });

  const allRequests = useReadContract({
    ...fundingPoolConfig,
    functionName: "getAllRequests",
    query: {
      enabled,
    },
  });

  const poolBalance = useReadContract({
    ...fundingPoolConfig,
    functionName: "getPoolBalance",
    query: {
      enabled,
    },
  });

  const requestDetails = useReadContract({
    ...fundingPoolConfig,
    functionName: "getRequest",
    args: requestId !== undefined ? [requestId] : undefined,
    query: {
      enabled: enabled && requestId !== undefined,
    },
  });

  // =========================
  // WRITE FUNCTIONS WITH VALIDATION
  // =========================

  const donate = (amount: bigint) => {
    if (amount <= 0n) {
      throw new Error("Donation amount must be greater than 0");
    }
    if (amount > 10000000000000000000000n) { // 10,000 ETH sanity check
      throw new Error("Donation amount seems unusually high. Please verify.");
    }

    return writeContract({
      ...fundingPoolConfig,
      functionName: "donate",
      value: amount,
    });
  };

  const requestDisbursement = (amount: bigint) => {
    if (amount <= 0n) {
      throw new Error("Disbursement amount must be greater than 0");
    }

    return writeContract({
      ...fundingPoolConfig,
      functionName: "requestDisbursement",
      args: [amount],
    });
  };

  const approveDisbursement = (requestId: bigint) => {
    if (requestId < 0n) {
      throw new Error("Invalid request ID");
    }

    return writeContract({
      ...fundingPoolConfig,
      functionName: "approveDisbursement",
      args: [requestId],
    });
  };

  const rejectDisbursement = (requestId: bigint) => {
    if (requestId < 0n) {
      throw new Error("Invalid request ID");
    }

    return writeContract({
      ...fundingPoolConfig,
      functionName: "rejectDisbursement",
      args: [requestId],
    });
  };

  const withdrawDonation = (amount: bigint) => {
    if (amount <= 0n) {
      throw new Error("Withdrawal amount must be greater than 0");
    }

    return writeContract({
      ...fundingPoolConfig,
      functionName: "withdrawDonation",
      args: [amount],
    });
  };

  const emergencyWithdraw = () => {
    return writeContract({
      ...fundingPoolConfig,
      functionName: "emergencyWithdraw",
      args: [],
    });
  };

  const pause = () =>
    writeContract({
      ...fundingPoolConfig,
      functionName: "pause",
      args: [],
    });

  const unpause = () =>
    writeContract({
      ...fundingPoolConfig,
      functionName: "unpause",
      args: [],
    });

  // =========================
  // RETURN VALUES
  // =========================

  return {
    // Transaction state
    hash,
    receipt,
    isPending: isWritePending || isTxLoading,
    isWritePending,
    isTxLoading,
    isSuccess: isTxSuccess,
    isError: isWriteError || isTxError,
    error: writeError || txError,
    writeError,
    txError,

    // Read data with structured returns
    balance: {
      data: balance.data,
      isLoading: balance.isLoading,
      isError: balance.isError,
      error: balance.error,
      refetch: balance.refetch,
    },
    pendingRequests: {
      data: pendingRequests.data,
      isLoading: pendingRequests.isLoading,
      isError: pendingRequests.isError,
      error: pendingRequests.error,
      refetch: pendingRequests.refetch,
    },
    allRequests: {
      data: allRequests.data,
      isLoading: allRequests.isLoading,
      isError: allRequests.isError,
      error: allRequests.error,
      refetch: allRequests.refetch,
    },
    poolBalance: {
      data: poolBalance.data,
      isLoading: poolBalance.isLoading,
      isError: poolBalance.isError,
      error: poolBalance.error,
      refetch: poolBalance.refetch,
    },
    requestDetails: {
      data: requestDetails.data,
      isLoading: requestDetails.isLoading,
      isError: requestDetails.isError,
      error: requestDetails.error,
      refetch: requestDetails.refetch,
    },

    // Write functions
    donate,
    requestDisbursement,
    approveDisbursement,
    rejectDisbursement,
    withdrawDonation,
    emergencyWithdraw,
    pause,
    unpause,
  };
}

// =========================
// STANDALONE READ HOOKS
// =========================

export function useDonorBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    ...fundingPoolConfig,
    functionName: "balances",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function usePendingRequests() {
  return useReadContract({
    ...fundingPoolConfig,
    functionName: "getPendingRequests",
  });
}

export function useAllDisbursementRequests() {
  return useReadContract({
    ...fundingPoolConfig,
    functionName: "getAllRequests",
  });
}

export function usePoolBalance() {
  return useReadContract({
    ...fundingPoolConfig,
    functionName: "getPoolBalance",
  });
}

export function useRequestDetails(requestId: bigint | undefined) {
  return useReadContract({
    ...fundingPoolConfig,
    functionName: "getRequest",
    args: requestId !== undefined ? [requestId] : undefined,
    query: {
      enabled: requestId !== undefined,
    },
  });
}

export function useFundingPoolPaused() {
  return useReadContract({
    ...fundingPoolConfig,
    functionName: "paused",
  });
}

// =========================
// UTILITY FUNCTIONS
// =========================

/**
 * Format wei amount to ETH string with specified decimals
 */
export function formatDonation(weiAmount: bigint, decimals: number = 4): string {
  const eth = Number(weiAmount) / 1e18;
  return eth.toFixed(decimals);
}

/**
 * Parse ETH string to wei bigint
 */
export function parseDonation(ethAmount: string): bigint {
  const amount = parseFloat(ethAmount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid donation amount");
  }
  return BigInt(Math.floor(amount * 1e18));
}

/**
 * Get status label for disbursement request
 */
export function getRequestStatusLabel(status: number): string {
  switch (status) {
    case DisbursementStatus.PENDING:
      return "Pending";
    case DisbursementStatus.APPROVED:
      return "Approved";
    case DisbursementStatus.REJECTED:
      return "Rejected";
    case DisbursementStatus.COMPLETED:
      return "Completed";
    default:
      return "Unknown";
  }
}