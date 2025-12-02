import { NextResponse } from "next/server"
import { initBlockchainClient } from "@/lib/blockchain-client"

export async function GET() {
  try {
    const blockchainClient = initBlockchainClient()
    const stats = await blockchainClient.getPoolStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("[v0] Pool stats error:", error)
    return NextResponse.json({ error: "Failed to fetch pool stats" }, { status: 500 })
  }
}
