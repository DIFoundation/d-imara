// Blockchain integration with Camp Testnet
import { ethers } from "ethers"

// Contract ABIs (simplified for MVP)
const REWARD_CONTRACT_ABI = [
  "function awardCredits(address student, uint256 points) external",
  "function awardTierBonus(address student, string memory tier) external",
  "function getStudentRewards(address student) external view returns (uint256)",
  "function getQuizzesCompleted(address student) external view returns (uint256)",
]

const WALLET_CONTRACT_ABI = [
  "function createWallet(address student) external",
  "function addCredits(address student, uint256 amount) external",
  "function spendCredits(address student, uint256 amount, uint8 categoryIndex) external",
  "function getBalance(address student) external view returns (uint256)",
  "function getWalletInfo(address student) external view returns (uint256 balance, uint256 totalSpent)",
]

const FUNDING_POOL_ABI = [
  "function registerDonor(address donor, string memory organization) external",
  "function donateForSchool(string memory school, uint256 amount) external",
  "function approveDisbursement(address student, uint256 amount, string memory school) external",
  "function getTotalDisbursements() external view returns (uint256)",
  "function getSchoolBalance(string memory school) external view returns (uint256)",
  "function getPoolInfo() external view returns (uint256 total, uint256 disbursementCount)",
]

interface BlockchainConfig {
  rpcUrl: string
  rewardContractAddress: string
  walletContractAddress: string
  fundingPoolAddress: string
  chainId: number
}

export class BlockchainClient {
  private provider: ethers.JsonRpcProvider
  private rewardContract: ethers.Contract
  private walletContract: ethers.Contract
  private fundingPool: ethers.Contract
  private config: BlockchainConfig

  constructor(config: BlockchainConfig) {
    this.config = config
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl)

    // Initialize contracts
    this.rewardContract = new ethers.Contract(config.rewardContractAddress, REWARD_CONTRACT_ABI, this.provider)

    this.walletContract = new ethers.Contract(config.walletContractAddress, WALLET_CONTRACT_ABI, this.provider)

    this.fundingPool = new ethers.Contract(config.fundingPoolAddress, FUNDING_POOL_ABI, this.provider)
  }

  /**
   * Get signer from private key (server-side only)
   */
  getSigner(privateKey: string) {
    return new ethers.Wallet(privateKey, this.provider)
  }

  /**
   * Award credits to a student for quiz completion
   */
  async awardQuizCredits(signerPrivateKey: string, studentAddress: string, points: number) {
    try {
      const signer = this.getSigner(signerPrivateKey)
      const contract = this.rewardContract.connect(signer)

      const tx = await contract.awardCredits(studentAddress, points)
      const receipt = await tx.wait()

      return {
        success: true,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      }
    } catch (error) {
      console.error("[v0] Award credits error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Award tier bonus (Silver: 1000 tokens, Gold: 2000 tokens)
   */
  async awardTierBonus(signerPrivateKey: string, studentAddress: string, tier: "Silver" | "Gold") {
    try {
      const signer = this.getSigner(signerPrivateKey)
      const contract = this.rewardContract.connect(signer)

      const tx = await contract.awardTierBonus(studentAddress, tier)
      const receipt = await tx.wait()

      return {
        success: true,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        tier,
        amount: tier === "Gold" ? 2000 : 1000,
      }
    } catch (error) {
      console.error("[v0] Tier bonus error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Create wallet for student
   */
  async createStudentWallet(signerPrivateKey: string, studentAddress: string) {
    try {
      const signer = this.getSigner(signerPrivateKey)
      const contract = this.walletContract.connect(signer)

      const tx = await contract.createWallet(studentAddress)
      const receipt = await tx.wait()

      return {
        success: true,
        txHash: receipt.transactionHash,
        walletAddress: studentAddress,
      }
    } catch (error) {
      console.error("[v0] Create wallet error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get student's credit balance
   */
  async getStudentBalance(studentAddress: string): Promise<number> {
    try {
      const balance = await this.walletContract.getBalance(studentAddress)
      return Number.parseInt(balance.toString())
    } catch (error) {
      console.error("[v0] Get balance error:", error)
      return 0
    }
  }

  /**
   * Approve disbursement to student
   */
  async approveDisbursement(signerPrivateKey: string, studentAddress: string, amount: number, school: string) {
    try {
      const signer = this.getSigner(signerPrivateKey)
      const contract = this.fundingPool.connect(signer)

      const tx = await contract.approveDisbursement(studentAddress, amount, school)
      const receipt = await tx.wait()

      return {
        success: true,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        student: studentAddress,
        amount,
      }
    } catch (error) {
      console.error("[v0] Disbursement error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get pool statistics
   */
  async getPoolStats() {
    try {
      const { total, disbursementCount } = await this.fundingPool.getPoolInfo()
      return {
        totalPoolBalance: Number.parseInt(total.toString()),
        disbursementCount: Number.parseInt(disbursementCount.toString()),
      }
    } catch (error) {
      console.error("[v0] Get pool stats error:", error)
      return {
        totalPoolBalance: 0,
        disbursementCount: 0,
      }
    }
  }

  /**
   * Get transaction link for explorer
   */
  getTransactionLink(txHash: string): string {
    // Camp Network explorer URL
    return `https://explorer.camp.io/tx/${txHash}`
  }

  /**
   * Get address link for explorer
   */
  getAddressLink(address: string): string {
    return `https://explorer.camp.io/address/${address}`
  }
}

// Initialize blockchain client
export function initBlockchainClient(): BlockchainClient {
  return new BlockchainClient({
    rpcUrl: process.env.NEXT_PUBLIC_CAMP_RPC_URL || "https://rpc.camp.io",
    rewardContractAddress:
      process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    walletContractAddress:
      process.env.NEXT_PUBLIC_WALLET_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    fundingPoolAddress: process.env.NEXT_PUBLIC_FUNDING_POOL_ADDRESS || "0x0000000000000000000000000000000000000000",
    chainId: 325000,
  })
}
