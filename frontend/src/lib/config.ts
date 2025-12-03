// Contract addresses are public blockchain data, not secrets
export const getContractConfig = () => {
  return {
    storageContract: process.env.STORAGE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    rewardToken: process.env.REWARD_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
    rpcUrl: process.env.RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo",
  }
}
