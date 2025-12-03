"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { walletContractConfig } from "@/hooks/hooksConfig";

// Role constants for access control
export const WALLET_ROLES = {
  DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
  GUARDIAN_ROLE: '0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63' as `0x${string}`,
  // Add other role hashes as needed
} as const;

// Spending category enum
export enum SpendingCategory {
  FOOD = 0,
  TRANSPORT = 1,
  BOOKS = 2,
  ENTERTAINMENT = 3,
  UTILITIES = 4,
  OTHER = 5,
}

interface UseWalletContractOptions {
  studentAddress?: `0x${string}`;
  requestId?: bigint;
  enabled?: boolean;
}

export function useWalletContract(options: UseWalletContractOptions = {}) {
  const { studentAddress, requestId, enabled = true } = options;

  // =========================
  // WRITE CONTRACT SETUP
  // =========================

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
    isError: isWriteError,
  } = useWriteContract();

  const {
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
    ...walletContractConfig,
    functionName: "getBalance",
    args: studentAddress ? [studentAddress] : undefined,
    query: {
      enabled: enabled && !!studentAddress,
    },
  });

  const walletInfo = useReadContract({
    ...walletContractConfig,
    functionName: "getWalletInfo",
    args: studentAddress ? [studentAddress] : undefined,
    query: {
      enabled: enabled && !!studentAddress,
    },
  });

  const spendingRequest = useReadContract({
    ...walletContractConfig,
    functionName: "getSpendingRequest",
    args: requestId !== undefined ? [requestId] : undefined,
    query: {
      enabled: enabled && requestId !== undefined,
    },
  });

  const nextRequestId = useReadContract({
    ...walletContractConfig,
    functionName: "nextRequestId",
    args: [],
    query: {
      enabled,
    },
  });

  const hasWallet = useReadContract({
    ...walletContractConfig,
    functionName: "hasWallet",
    args: studentAddress ? [studentAddress] : undefined,
    query: {
      enabled: enabled && !!studentAddress,
    },
  });

  const isPaused = useReadContract({
    ...walletContractConfig,
    functionName: "paused",
    args: [],
    query: {
      enabled,
    },
  });

  // =========================
  // WRITE FUNCTIONS WITH VALIDATION
  // =========================

  const createWallet = (student: `0x${string}`) => {
    if (!student || student === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid student address");
    }
    return writeContract({
      ...walletContractConfig,
      functionName: "createWallet",
      args: [student],
    });
  };

  const addCredits = (student: `0x${string}`, amount: bigint) => {
    if (!student || student === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid student address");
    }
    if (amount <= 0n) {
      throw new Error("Amount must be greater than 0");
    }
    return writeContract({
      ...walletContractConfig,
      functionName: "addCredits",
      args: [student, amount],
    });
  };

  const requestSpending = (
    amount: bigint,
    categoryIndex: number,
    merchantAddress: string
  ) => {
    if (amount <= 0n) {
      throw new Error("Amount must be greater than 0");
    }
    if (categoryIndex < 0 || categoryIndex > 5) {
      throw new Error("Invalid category index. Must be between 0 and 5");
    }
    if (!merchantAddress || merchantAddress.length === 0) {
      throw new Error("Merchant address is required");
    }
    return writeContract({
      ...walletContractConfig,
      functionName: "requestSpending",
      args: [amount, categoryIndex, merchantAddress],
    });
  };

  const approveSpending = (requestId: bigint) => {
    if (requestId < 0n) {
      throw new Error("Invalid request ID");
    }
    return writeContract({
      ...walletContractConfig,
      functionName: "approveSpending",
      args: [requestId],
    });
  };

  const updateAllowedCategory = (
    student: `0x${string}`,
    category: number,
    allowed: boolean
  ) => {
    if (!student || student === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid student address");
    }
    if (category < 0 || category > 5) {
      throw new Error("Invalid category. Must be between 0 and 5");
    }
    return writeContract({
      ...walletContractConfig,
      functionName: "updateAllowedCategory",
      args: [student, category, allowed],
    });
  };

  const emergencyWithdraw = (student: `0x${string}`, amount: bigint) => {
    if (!student || student === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid student address");
    }
    if (amount <= 0n) {
      throw new Error("Amount must be greater than 0");
    }
    return writeContract({
      ...walletContractConfig,
      functionName: "emergencyWithdraw",
      args: [student, amount],
    });
  };

  const pause = () =>
    writeContract({
      ...walletContractConfig,
      functionName: "pause",
      args: [],
    });

  const unpause = () =>
    writeContract({
      ...walletContractConfig,
      functionName: "unpause",
      args: [],
    });

  const grantRole = (role: `0x${string}`, account: `0x${string}`) => {
    if (!role || !account) {
      throw new Error("Role and account are required");
    }
    if (account === '0x0000000000000000000000000000000000000000') {
      throw new Error("Cannot grant role to zero address");
    }
    return writeContract({
      ...walletContractConfig,
      functionName: "grantRole",
      args: [role, account],
    });
  };

  const revokeRole = (role: `0x${string}`, account: `0x${string}`) => {
    if (!role || !account) {
      throw new Error("Role and account are required");
    }
    return writeContract({
      ...walletContractConfig,
      functionName: "revokeRole",
      args: [role, account],
    });
  };

  // =========================
  // RETURN VALUES
  // =========================

  return {
    // Transaction state
    hash,
    isPending: isWritePending || isTxLoading,
    isWritePending,
    isTxLoading,
    isSuccess: isTxSuccess,
    isError: isWriteError || isTxError,
    error: writeError || txError,
    writeError,
    txError,

    // Read data and states
    balance: {
      data: balance.data,
      isLoading: balance.isLoading,
      isError: balance.isError,
      error: balance.error,
      refetch: balance.refetch,
    },
    walletInfo: {
      data: walletInfo.data,
      isLoading: walletInfo.isLoading,
      isError: walletInfo.isError,
      error: walletInfo.error,
      refetch: walletInfo.refetch,
    },
    spendingRequest: {
      data: spendingRequest.data,
      isLoading: spendingRequest.isLoading,
      isError: spendingRequest.isError,
      error: spendingRequest.error,
      refetch: spendingRequest.refetch,
    },
    nextRequestId: {
      data: nextRequestId.data,
      isLoading: nextRequestId.isLoading,
      isError: nextRequestId.isError,
      error: nextRequestId.error,
      refetch: nextRequestId.refetch,
    },
    hasWallet: {
      data: hasWallet.data,
      isLoading: hasWallet.isLoading,
      isError: hasWallet.isError,
      error: hasWallet.error,
      refetch: hasWallet.refetch,
    },
    isPaused: {
      data: isPaused.data,
      isLoading: isPaused.isLoading,
      isError: isPaused.isError,
      error: isPaused.error,
      refetch: isPaused.refetch,
    },

    // Write functions
    createWallet,
    addCredits,
    requestSpending,
    approveSpending,
    updateAllowedCategory,
    emergencyWithdraw,
    pause,
    unpause,
    grantRole,
    revokeRole,
  };
}

// =========================
// STANDALONE READ HOOKS
// =========================
// Use these when you need to read data for different addresses dynamically

export function useWalletBalance(student: `0x${string}` | undefined) {
  return useReadContract({
    ...walletContractConfig,
    functionName: "getBalance",
    args: student ? [student] : undefined,
    query: {
      enabled: !!student,
    },
  });
}

export function useWalletInfo(student: `0x${string}` | undefined) {
  return useReadContract({
    ...walletContractConfig,
    functionName: "getWalletInfo",
    args: student ? [student] : undefined,
    query: {
      enabled: !!student,
    },
  });
}

export function useSpendingRequest(requestId: bigint | undefined) {
  return useReadContract({
    ...walletContractConfig,
    functionName: "getSpendingRequest",
    args: requestId !== undefined ? [requestId] : undefined,
    query: {
      enabled: requestId !== undefined,
    },
  });
}

export function useHasWallet(student: `0x${string}` | undefined) {
  return useReadContract({
    ...walletContractConfig,
    functionName: "hasWallet",
    args: student ? [student] : undefined,
    query: {
      enabled: !!student,
    },
  });
}