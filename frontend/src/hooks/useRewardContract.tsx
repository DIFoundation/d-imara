"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { REWARD_CONTRACT } from "@/hooks/hooksConfig";

// Role constants for access control
export const REWARD_ROLES = {
  DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
  ADMIN_ROLE: '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775' as `0x${string}`,
} as const;

// Tier thresholds
export const TIER_THRESHOLDS = {
  SILVER: 50n,
  GOLD: 100n,
} as const;

export type StudentTier = "Bronze" | "Silver" | "Gold";

interface UseRewardContractOptions {
  studentAddress?: `0x${string}`;
  quizId?: bigint;
  enabled?: boolean;
}

export function useRewardContract(options: UseRewardContractOptions = {}) {
  const { studentAddress, quizId, enabled = true } = options;

  // =========================
  // WRITE CONTRACT SETUP
  // =========================

  const {
    writeContractAsync,
    data: hash,
    error: writeError,
    isPending: isWritePending,
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

  const adminRole = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "ADMIN_ROLE",
    query: { enabled },
  });

  const defaultAdminRole = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "DEFAULT_ADMIN_ROLE",
    query: { enabled },
  });

  const goldThreshold = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "GOLD_THRESHOLD",
    query: { enabled },
  });

  const silverThreshold = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "SILVER_THRESHOLD",
    query: { enabled },
  });

  const studentRewards = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "getStudentRewards",
    args: studentAddress ? [studentAddress] : undefined,
    query: {
      enabled: enabled && !!studentAddress,
    },
  });

  const studentStats = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "getStudentStats",
    args: studentAddress ? [studentAddress] : undefined,
    query: {
      enabled: enabled && !!studentAddress,
    },
  });

  const studentTier = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "getStudentTier",
    args: studentAddress ? [studentAddress] : undefined,
    query: {
      enabled: enabled && !!studentAddress,
    },
  });

  const quizzesCompleted = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "getQuizzesCompleted",
    args: studentAddress ? [studentAddress] : undefined,
    query: {
      enabled: enabled && !!studentAddress,
    },
  });

  const isQuizCompleted = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "isQuizCompleted",
    args: studentAddress && quizId !== undefined ? [studentAddress, quizId] : undefined,
    query: {
      enabled: enabled && !!studentAddress && quizId !== undefined,
    },
  });

  const isPaused = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "paused",
    query: { enabled },
  });

  const walletContract = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "walletContract",
    query: { enabled },
  });

  const learnCreditToken = useReadContract({
    ...REWARD_CONTRACT,
    functionName: "learnCreditToken",
    query: { enabled },
  });

  // =========================
  // WRITE FUNCTIONS WITH VALIDATION
  // =========================

  const awardCredits = async (
    student: `0x${string}`,
    quizId: bigint,
    points: bigint
  ) => {
    if (!student || student === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid student address");
    }
    if (quizId < 0n) {
      throw new Error("Invalid quiz ID");
    }
    if (points <= 0n) {
      throw new Error("Points must be greater than 0");
    }

    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "awardCredits",
      args: [student, quizId, points],
    });
  };

  const batchAwardCredits = async (
    students: `0x${string}`[],
    quizIds: bigint[],
    pointsArray: bigint[]
  ) => {
    if (!students || students.length === 0) {
      throw new Error("Students array cannot be empty");
    }
    if (students.length !== quizIds.length || students.length !== pointsArray.length) {
      throw new Error("Array lengths must match");
    }
    if (students.some(s => !s || s === '0x0000000000000000000000000000000000000000')) {
      throw new Error("Invalid student address in array");
    }
    if (pointsArray.some(p => p <= 0n)) {
      throw new Error("All points must be greater than 0");
    }

    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "batchAwardCredits",
      args: [students, quizIds, pointsArray],
    });
  };

  const manualAwardTierBonus = async (
    student: `0x${string}`,
    tier: string
  ) => {
    if (!student || student === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid student address");
    }
    const validTiers = ["Bronze", "Silver", "Gold"];
    if (!validTiers.includes(tier)) {
      throw new Error(`Invalid tier. Must be one of: ${validTiers.join(", ")}`);
    }

    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "manualAwardTierBonus",
      args: [student, tier],
    });
  };

  const updateTokenAddress = async (newToken: `0x${string}`) => {
    if (!newToken || newToken === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid token address");
    }

    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "updateTokenAddress",
      args: [newToken],
    });
  };

  const updateWalletContract = async (newWallet: `0x${string}`) => {
    if (!newWallet || newWallet === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid wallet address");
    }

    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "updateWalletContract",
      args: [newWallet],
    });
  };

  const grantRole = async (role: `0x${string}`, account: `0x${string}`) => {
    if (!role || !account) {
      throw new Error("Role and account are required");
    }
    if (account === '0x0000000000000000000000000000000000000000') {
      throw new Error("Cannot grant role to zero address");
    }

    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "grantRole",
      args: [role, account],
    });
  };

  const revokeRole = async (role: `0x${string}`, account: `0x${string}`) => {
    if (!role || !account) {
      throw new Error("Role and account are required");
    }

    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "revokeRole",
      args: [role, account],
    });
  };

  const pause = async () =>
    writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "pause",
      args: [],
    });

  const unpause = async () =>
    writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "unpause",
      args: [],
    });

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

    // Read data with structured returns
    adminRole: {
      data: adminRole.data,
      isLoading: adminRole.isLoading,
      isError: adminRole.isError,
      error: adminRole.error,
      refetch: adminRole.refetch,
    },
    defaultAdminRole: {
      data: defaultAdminRole.data,
      isLoading: defaultAdminRole.isLoading,
      isError: defaultAdminRole.isError,
      error: defaultAdminRole.error,
      refetch: defaultAdminRole.refetch,
    },
    goldThreshold: {
      data: goldThreshold.data,
      isLoading: goldThreshold.isLoading,
      isError: goldThreshold.isError,
      error: goldThreshold.error,
      refetch: goldThreshold.refetch,
    },
    silverThreshold: {
      data: silverThreshold.data,
      isLoading: silverThreshold.isLoading,
      isError: silverThreshold.isError,
      error: silverThreshold.error,
      refetch: silverThreshold.refetch,
    },
    studentRewards: {
      data: studentRewards.data,
      isLoading: studentRewards.isLoading,
      isError: studentRewards.isError,
      error: studentRewards.error,
      refetch: studentRewards.refetch,
    },
    studentStats: {
      data: studentStats.data,
      isLoading: studentStats.isLoading,
      isError: studentStats.isError,
      error: studentStats.error,
      refetch: studentStats.refetch,
    },
    studentTier: {
      data: studentTier.data,
      isLoading: studentTier.isLoading,
      isError: studentTier.isError,
      error: studentTier.error,
      refetch: studentTier.refetch,
    },
    quizzesCompleted: {
      data: quizzesCompleted.data,
      isLoading: quizzesCompleted.isLoading,
      isError: quizzesCompleted.isError,
      error: quizzesCompleted.error,
      refetch: quizzesCompleted.refetch,
    },
    isQuizCompleted: {
      data: isQuizCompleted.data,
      isLoading: isQuizCompleted.isLoading,
      isError: isQuizCompleted.isError,
      error: isQuizCompleted.error,
      refetch: isQuizCompleted.refetch,
    },
    isPaused: {
      data: isPaused.data,
      isLoading: isPaused.isLoading,
      isError: isPaused.isError,
      error: isPaused.error,
      refetch: isPaused.refetch,
    },
    walletContract: {
      data: walletContract.data,
      isLoading: walletContract.isLoading,
      isError: walletContract.isError,
      error: walletContract.error,
      refetch: walletContract.refetch,
    },
    learnCreditToken: {
      data: learnCreditToken.data,
      isLoading: learnCreditToken.isLoading,
      isError: learnCreditToken.isError,
      error: learnCreditToken.error,
      refetch: learnCreditToken.refetch,
    },

    // Write functions
    awardCredits,
    batchAwardCredits,
    manualAwardTierBonus,
    updateTokenAddress,
    updateWalletContract,
    grantRole,
    revokeRole,
    pause,
    unpause,
  };
}

// =========================
// STANDALONE READ HOOKS
// =========================

export function useStudentRewards(student: `0x${string}` | undefined) {
  return useReadContract({
    ...REWARD_CONTRACT,
    functionName: "getStudentRewards",
    args: student ? [student] : undefined,
    query: {
      enabled: !!student,
    },
  });
}

export function useStudentStats(student: `0x${string}` | undefined) {
  return useReadContract({
    ...REWARD_CONTRACT,
    functionName: "getStudentStats",
    args: student ? [student] : undefined,
    query: {
      enabled: !!student,
    },
  });
}

export function useStudentTier(student: `0x${string}` | undefined) {
  return useReadContract({
    ...REWARD_CONTRACT,
    functionName: "getStudentTier",
    args: student ? [student] : undefined,
    query: {
      enabled: !!student,
    },
  });
}

export function useQuizzesCompleted(student: `0x${string}` | undefined) {
  return useReadContract({
    ...REWARD_CONTRACT,
    functionName: "getQuizzesCompleted",
    args: student ? [student] : undefined,
    query: {
      enabled: !!student,
    },
  });
}

export function useIsQuizCompleted(
  student: `0x${string}` | undefined,
  quizId: bigint | undefined
) {
  return useReadContract({
    ...REWARD_CONTRACT,
    functionName: "isQuizCompleted",
    args: student && quizId !== undefined ? [student, quizId] : undefined,
    query: {
      enabled: !!student && quizId !== undefined,
    },
  });
}

export function useRewardPaused() {
  return useReadContract({
    ...REWARD_CONTRACT,
    functionName: "paused",
  });
}