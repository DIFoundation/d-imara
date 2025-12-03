"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { fundingPoolConfig } from "./hooksConfig";

export function useFundingPool() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { data: receipt } = useWaitForTransactionReceipt({ hash });

  // ---- READ CONTRACT HELPERS ----
  const getBalance = () =>
    useReadContract({
      ...fundingPoolConfig,
      functionName: "balances",
      args: [], // if needed: [address]
    });

  const getPendingRequests = () =>
    useReadContract({
      ...fundingPoolConfig,
      functionName: "getPendingRequests",
    });

  const getAllRequests = () =>
    useReadContract({
      ...fundingPoolConfig,
      functionName: "getAllRequests",
    });

  // ---- WRITE HELPERS ----
  const donate = (amount: bigint) =>
    writeContract({
      ...fundingPoolConfig,
      functionName: "donate",
      value: amount,
    });

  const requestDisbursement = (amount: bigint) =>
    writeContract({
      ...fundingPoolConfig,
      functionName: "requestDisbursement",
      args: [amount],
    });

  const approveDisbursement = (requestId: bigint) =>
    writeContract({
      ...fundingPoolConfig,
      functionName: "approveDisbursement",
      args: [requestId],
    });

  const rejectDisbursement = (requestId: bigint) =>
    writeContract({
      ...fundingPoolConfig,
      functionName: "rejectDisbursement",
      args: [requestId],
    });

  return {
    /** READ */
    getBalance,
    getPendingRequests,
    getAllRequests,

    /** WRITE */
    donate,
    requestDisbursement,
    approveDisbursement,
    rejectDisbursement,

    /** STATUS */
    hash,
    receipt,
    isPending,
  };
}
