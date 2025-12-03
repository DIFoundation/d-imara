"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { walletContractConfig } from "@/hooks/hooksConfig";

export function useWalletContract() {
  const { data: hash, writeContract, isPending } = useWriteContract();

  const tx = useWaitForTransactionReceipt({
    hash,
  });

  // =========================
  // READ FUNCTIONS
  // =========================

  const readBalance = (student: `0x${string}`) =>
    useReadContract({
      ...walletContractConfig,
      functionName: "getBalance",
      args: [student],
    });

  const readWalletInfo = (student: `0x${string}`) =>
    useReadContract({
      ...walletContractConfig,
      functionName: "getWalletInfo",
      args: [student],
    });

  const readSpendingRequest = (requestId: bigint) =>
    useReadContract({
      ...walletContractConfig,
      functionName: "getSpendingRequest",
      args: [requestId],
    });

  const readNextRequestId = () =>
    useReadContract({
      ...walletContractConfig,
      functionName: "nextRequestId",
      args: [],
    });

  const readHasWallet = (student: `0x${string}`) =>
    useReadContract({
      ...walletContractConfig,
      functionName: "hasWallet",
      args: [student],
    });

  const readPaused = () =>
    useReadContract({
      ...walletContractConfig,
      functionName: "paused",
      args: [],
    });

  // =========================
  // WRITE FUNCTIONS
  // =========================

  const createWallet = (student: `0x${string}`) =>
    writeContract({
      ...walletContractConfig,
      functionName: "createWallet",
      args: [student],
    });

  const addCredits = (student: `0x${string}`, amount: bigint) =>
    writeContract({
      ...walletContractConfig,
      functionName: "addCredits",
      args: [student, amount],
    });

  const requestSpending = (
    amount: bigint,
    categoryIndex: number,
    merchantAddress: string
  ) =>
    writeContract({
      ...walletContractConfig,
      functionName: "requestSpending",
      args: [amount, categoryIndex, merchantAddress],
    });

  const approveSpending = (requestId: bigint) =>
    writeContract({
      ...walletContractConfig,
      functionName: "approveSpending",
      args: [requestId],
    });

  const updateAllowedCategory = (
    student: `0x${string}`,
    category: number,
    allowed: boolean
  ) =>
    writeContract({
      ...walletContractConfig,
      functionName: "updateAllowedCategory",
      args: [student, category, allowed],
    });

  const emergencyWithdraw = (student: `0x${string}`, amount: bigint) =>
    writeContract({
      ...walletContractConfig,
      functionName: "emergencyWithdraw",
      args: [student, amount],
    });

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

  const grantRole = (role: `0x${string}`, account: `0x${string}`) =>
    writeContract({
      ...walletContractConfig,
      functionName: "grantRole",
      args: [role, account],
    });

  const revokeRole = (role: `0x${string}`, account: `0x${string}`) =>
    writeContract({
      ...walletContractConfig,
      functionName: "revokeRole",
      args: [role, account],
    });

  return {
    hash,
    isPending,
    tx,

    // Reads
    readBalance,
    readWalletInfo,
    readSpendingRequest,
    readNextRequestId,
    readHasWallet,
    readPaused,

    // Writes
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
