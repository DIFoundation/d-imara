"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import {REWARD_CONTRACT} from "@/hooks/hooksConfig"

export function useRewardContract() {
  const { writeContractAsync, data: hash, error: writeError, isPending } = useWriteContract();

  const waitTx = useWaitForTransactionReceipt({
    hash,
  });

  /** --------------------------
   *  WRITE FUNCTIONS
   * --------------------------- */

  const awardCredits = async (student: `0x${string}`, quizId: bigint, points: bigint) => {
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
    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "batchAwardCredits",
      args: [students, quizIds, pointsArray],
    });
  };

  const manualAwardTierBonus = async (student: `0x${string}`, tier: string) => {
    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "manualAwardTierBonus",
      args: [student, tier],
    });
  };

  const updateTokenAddress = async (newToken: `0x${string}`) => {
    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "updateTokenAddress",
      args: [newToken],
    });
  };

  const updateWalletContract = async (newWallet: `0x${string}`) => {
    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "updateWalletContract",
      args: [newWallet],
    });
  };

  const grantRole = async (role: `0x${string}`, account: `0x${string}`) => {
    return writeContractAsync({
      ...REWARD_CONTRACT,
      functionName: "grantRole",
      args: [role, account],
    });
  };

  const revokeRole = async (role: `0x${string}`, account: `0x${string}`) => {
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

  /** --------------------------
   *  READ FUNCTIONS
   * --------------------------- */

  const read = {
    adminRole: () =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "ADMIN_ROLE",
      }),

    defaultAdmin: () =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "DEFAULT_ADMIN_ROLE",
      }),

    goldThreshold: () =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "GOLD_THRESHOLD",
      }),

    silverThreshold: () =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "SILVER_THRESHOLD",
      }),

    getStudentRewards: (student: `0x${string}`) =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "getStudentRewards",
        args: [student],
      }),

    getStudentStats: (student: `0x${string}`) =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "getStudentStats",
        args: [student],
      }),

    getStudentTier: (student: `0x${string}`) =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "getStudentTier",
        args: [student],
      }),

    getQuizzesCompleted: (student: `0x${string}`) =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "getQuizzesCompleted",
        args: [student],
      }),

    isQuizCompleted: (student: `0x${string}`, quizId: bigint) =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "isQuizCompleted",
        args: [student, quizId],
      }),

    paused: () =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "paused",
      }),

    walletContract: () =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "walletContract",
      }),

    learnCreditToken: () =>
      useReadContract({
        ...REWARD_CONTRACT,
        functionName: "learnCreditToken",
      }),
  };

  return {
    // read calls
    read,

    // write calls
    awardCredits,
    batchAwardCredits,
    manualAwardTierBonus,
    updateTokenAddress,
    updateWalletContract,
    grantRole,
    revokeRole,
    pause,
    unpause,

    // tx state
    hash,
    writeError,
    isPending,
    waitTx,
  };
}
