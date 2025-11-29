import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 })
    }

    // Mock wallet data
    const wallet = {
      studentId,
      balance: 1000, // 1000 test tokens
      totalEarned: 1000,
      totalSpent: 0,
      walletAddress: "0x" + Math.random().toString(16).substr(2, 40),
    }

    return NextResponse.json(wallet)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, amount, type } = await request.json()

    if (!studentId || !amount || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update wallet
    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      amount,
      type,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 })
  }
}
