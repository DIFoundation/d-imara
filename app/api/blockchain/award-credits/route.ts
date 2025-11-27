import { type NextRequest, NextResponse } from "next/server"
import { initBlockchainClient } from "@/lib/blockchain-client"

export async function POST(request: NextRequest) {
  try {
    const { studentAddress, points } = await request.json()

    if (!studentAddress || !points) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const blockchainClient = initBlockchainClient()
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY

    if (!privateKey) {
      return NextResponse.json({ error: "Blockchain private key not configured" }, { status: 500 })
    }

    const result = await blockchainClient.awardQuizCredits(privateKey, studentAddress, points)

    if (result.success) {
      return NextResponse.json({
        success: true,
        txHash: result.txHash,
        explorerLink: blockchainClient.getTransactionLink(result.txHash!),
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Award credits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
