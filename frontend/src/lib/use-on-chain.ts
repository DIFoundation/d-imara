"use client"

import { useEffect, useState } from "react"
import { 
  useConnection, 
  // usePublicClient, 
  useWalletClient } from "wagmi"
import { type OnChainStorageClient, initStorageClient } from "./storage-client"

export function useOnChainStorage() {
  const { address } = useConnection()
  // const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [client, setClient] = useState<OnChainStorageClient | null>(null)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const storageClient = initStorageClient()
    setClient(storageClient)
  }, [])

  useEffect(() => {
    if (address && client) {
      client.getTokenBalance(address).then(setBalance)
    }
  }, [address, client])

  return {
    client,
    balance,
    address,
    recordScore: async (quizId: number, score: number) => {
      if (!client || !walletClient) return { success: false }
      return client.recordQuizScore(walletClient, quizId, score)
    },
    transferTokens: async (to: string, amount: number) => {
      if (!client || !walletClient) return { success: false }
      return client.transferTokens(walletClient, to, amount)
    },
  }
}
