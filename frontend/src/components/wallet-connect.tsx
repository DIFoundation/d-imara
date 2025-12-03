"use client"

import { useEffect, useState } from "react"
import { useConnect, useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"

interface WalletConnectProps {
  onConnect: () => void
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const { connectors, connect } = useConnect()
  const { isConnected, address } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isConnected && address) {
      onConnect()
    }
  }, [isConnected, address, onConnect])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Wallet className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-center text-2xl">Connect Your Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-slate-600 text-sm">
            D-Imara is 100% decentralized. No backend servers, no sign-up forms. Just connect your wallet and start
            earning blockchain rewards.
          </p>
          <div className="space-y-2">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {connector.name}
              </Button>
            ))}
          </div>
          <p className="text-xs text-center text-slate-500 pt-4 border-t">
            MetaMask, Coinbase Wallet, WalletConnect and more supported
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
