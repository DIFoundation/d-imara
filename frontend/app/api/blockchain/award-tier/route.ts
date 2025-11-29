import { type NextRequest, NextResponse } from "next/server"
import { initBlockchainClient } from "@/lib/blockchain-client"

export async function POST(request: NextRequest) {
  try {
    const { studentAddress, tier } = await request.json()

    if (!studentAddress || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["Silver", "Gold"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    const blockchainClient = initBlockchainClient()
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY

    if (!privateKey) {
      return NextResponse.json({ error: "Blockchain private key not configured" }, { status: 500 })
    }

    const result = await blockchainClient.awardTierBonus(privateKey, studentAddress, tier)

    if (result.success) {
      return NextResponse.json({
        success: true,
        txHash: result.txHash,
        tier: result.tier,
        amount: result.amount,
        explorerLink: blockchainClient.getTransactionLink(result.txHash!),
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Tier bonus error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
