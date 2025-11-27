const hre = require("hardhat")
const ethers = hre.ethers

async function main() {
  console.log("Deploying D-Imara Smart Contracts to Camp Testnet...")

  // Get deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying with account:", deployer.address)

  // Deploy LearnCredit Token (mock for MVP)
  console.log("\n1. Deploying RewardContract...")
  const RewardContract = await ethers.getContractFactory("RewardContract")
  const rewardContract = await RewardContract.deploy(
    "0x0000000000000000000000000000000000000000", // Mock token address
  )
  await rewardContract.deployed()
  console.log("RewardContract deployed to:", rewardContract.address)

  // Deploy WalletContract
  console.log("\n2. Deploying WalletContract...")
  const WalletContract = await ethers.getContractFactory("WalletContract")
  const walletContract = await WalletContract.deploy()
  await walletContract.deployed()
  console.log("WalletContract deployed to:", walletContract.address)

  // Deploy FundingPool
  console.log("\n3. Deploying FundingPool...")
  const FundingPool = await ethers.getContractFactory("FundingPool")
  const fundingPool = await FundingPool.deploy()
  await fundingPool.deployed()
  console.log("FundingPool deployed to:", fundingPool.address)

  // Save contract addresses
  const addresses = {
    rewardContract: rewardContract.address,
    walletContract: walletContract.address,
    fundingPool: fundingPool.address,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
  }

  console.log("\n=== Deployment Complete ===")
  console.log(JSON.stringify(addresses, null, 2))

  // Save to file for frontend use
  const fs = require("fs")
  fs.writeFileSync("./contract-addresses.json", JSON.stringify(addresses, null, 2))
  console.log("\nContract addresses saved to contract-addresses.json")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
