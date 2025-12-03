"use client"

import { useState } from "react"
import { useConnection } from "wagmi"
// import { useOnChainStorage } from "@/lib/use-on-chain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function DonorDashboard() {
  const { address } = useConnection()
  // const { transferTokens } = useOnChainStorage()
  const [donations, setDonations] = useState([
    {
      id: 1,
      amount: 0.5,
      recipient: "School Fund",
      timestamp: new Date().toLocaleDateString(),
      txHash: "0x123",
      status: "confirmed",
    },
  ])
  const [donationAmount, setDonationAmount] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState("school")
  const [submitting, setSubmitting] = useState(false)

  const recipients = [
    { id: "school", label: "School Fund", address: "0x0000000000000000000000000000000000000001" },
    { id: "direct", label: "Direct to Students", address: "0x0000000000000000000000000000000000000002" },
    { id: "scholarships", label: "Scholarships", address: "0x0000000000000000000000000000000000000003" },
  ]

  const handleDonate = async () => {
    if (!donationAmount || Number.parseFloat(donationAmount) <= 0 || !address) return

    setSubmitting(true)
    try {
      const recipient = recipients.find((r) => r.id === selectedRecipient)
      if (recipient) {
        // In production, use actual token transfer
        const newDonation = {
          id: Date.now(),
          amount: Number.parseFloat(donationAmount),
          recipient: recipient.label,
          timestamp: new Date().toLocaleDateString(),
          txHash: "0x" + Math.random().toString(16).slice(2),
          status: "pending",
        }
        setDonations([newDonation, ...donations])
        setDonationAmount("")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
  const confirmedDonations = donations.filter((d) => d.status === "confirmed").length

  return (
    <div className="space-y-6">
      {/* Donor Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xs truncate">
              {address?.slice(0, 10)}...{address?.slice(-8)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Total Donated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{totalDonated.toFixed(2)} ETH</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{confirmedDonations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Impact Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{donations.length * 10}</p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Recipient</label>
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white"
              disabled={submitting}
            >
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Amount (ETH)</label>
            <Input
              type="number"
              placeholder="0.1"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              step="0.01"
              disabled={submitting}
            />
          </div>
          <Button
            onClick={handleDonate}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? "Processing..." : "Donate"}
          </Button>
        </CardContent>
      </Card>

      {/* Donation History */}
      {donations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Donation History</h2>
          <div className="space-y-3">
            {donations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{donation.amount} ETH</p>
                      <p className="text-sm text-slate-600">{donation.recipient}</p>
                      <p className="text-xs text-slate-500">{donation.timestamp}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge className={donation.status === "confirmed" ? "bg-green-600" : "bg-amber-600"}>
                        {donation.status}
                      </Badge>
                      <a
                        href={`https://etherscan.io/tx/${donation.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs hover:underline"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
