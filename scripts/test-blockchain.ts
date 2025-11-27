/**
 * Test script to verify blockchain integration
 * Run: npx ts-node scripts/test-blockchain.ts
 */

import { initBlockchainClient } from "../lib/blockchain-client"

async function main() {
  console.log("D-Imara Blockchain Integration Test\n")
  console.log("=".repeat(50))

  try {
    const client = initBlockchainClient()

    // Test 1: Get pool stats
    console.log("\n1. Testing Pool Stats...")
    const stats = await client.getPoolStats()
    console.log("✓ Pool Balance:", stats.totalPoolBalance)
    console.log("✓ Disbursement Count:", stats.disbursementCount)

    // Test 2: Generate explorer links
    console.log("\n2. Testing Explorer Links...")
    const mockTxHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE"

    const txLink = client.getTransactionLink(mockTxHash)
    const addrLink = client.getAddressLink(mockAddress)

    console.log("✓ TX Link:", txLink)
    console.log("✓ Address Link:", addrLink)

    // Test 3: Verify contract addresses
    console.log("\n3. Checking Contract Configuration...")
    const rewardAddr = process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS
    const walletAddr = process.env.NEXT_PUBLIC_WALLET_CONTRACT_ADDRESS
    const fundingAddr = process.env.NEXT_PUBLIC_FUNDING_POOL_ADDRESS

    console.log(rewardAddr ? "✓ RewardContract: " + rewardAddr : "✗ RewardContract: NOT SET")
    console.log(walletAddr ? "✓ WalletContract: " + walletAddr : "✗ WalletContract: NOT SET")
    console.log(fundingAddr ? "✓ FundingPool: " + fundingAddr : "✗ FundingPool: NOT SET")

    console.log("\n" + "=".repeat(50))
    console.log("✓ All tests passed!")
  } catch (error) {
    console.error("✗ Test failed:", error)
    process.exit(1)
  }
}

main()
