// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/WalletContract.sol";
import "../src/RewardContract.sol";
import "../src/FundingPool.sol";

contract DeployScript is Script {
    // Role constants - must match the contracts
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    
    function run() external {
        // Load environment variables or set addresses here
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address adminAddress = vm.envAddress("ADMIN_ADDRESS");
        address merchantAddress = vm.envAddress("MERCHANT_ADDRESS");
        address verifierAddress = vm.envAddress("VERIFIER_ADDRESS");
        address treasurerAddress = vm.envAddress("TREASURER_ADDRESS");
        address tokenAddress = vm.envAddress("TOKEN_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Step 1: Deploy WalletContract
        console.log("Deploying WalletContract...");
        WalletContract wallet = new WalletContract();
        console.log("WalletContract deployed at:", address(wallet));
        
        // Step 2: Deploy FundingPool
        console.log("Deploying FundingPool...");
        FundingPool pool = new FundingPool();
        console.log("FundingPool deployed at:", address(pool));
        
        // Step 3: Deploy RewardContract
        console.log("Deploying RewardContract...");
        RewardContract rewards = new RewardContract(tokenAddress, address(wallet));
        console.log("RewardContract deployed at:", address(rewards));
        
        // Step 4: Grant roles for WalletContract
        console.log("Setting up WalletContract roles...");
        wallet.grantRole(ADMIN_ROLE, adminAddress);
        console.log("Granted ADMIN_ROLE to:", adminAddress);
        
        wallet.grantRole(MERCHANT_ROLE, merchantAddress);
        console.log("Granted MERCHANT_ROLE to:", merchantAddress);
        
        // Step 5: Grant roles for RewardContract
        console.log("Setting up RewardContract roles...");
        rewards.grantRole(VERIFIER_ROLE, verifierAddress);
        console.log("Granted VERIFIER_ROLE to:", verifierAddress);
        
        rewards.grantRole(ADMIN_ROLE, adminAddress);
        console.log("Granted ADMIN_ROLE to:", adminAddress);
        
        // Step 6: Grant roles for FundingPool
        console.log("Setting up FundingPool roles...");
        pool.grantRole(TREASURER_ROLE, treasurerAddress);
        console.log("Granted TREASURER_ROLE to:", treasurerAddress);
        
        pool.grantRole(ADMIN_ROLE, adminAddress);
        console.log("Granted ADMIN_ROLE to:", adminAddress);
        
        vm.stopBroadcast();
        
        // Print deployment summary
        console.log("\n========== DEPLOYMENT SUMMARY ==========");
        console.log("WalletContract:", address(wallet));
        console.log("FundingPool:", address(pool));
        console.log("RewardContract:", address(rewards));
        console.log("========================================\n");
        
        console.log("Save these addresses to your .env file:");
        console.log("WALLET_CONTRACT=", address(wallet));
        console.log("FUNDING_POOL=", address(pool));
        console.log("REWARD_CONTRACT=", address(rewards));
    }
}


// forge script script/Deploy.sol:DeployScript --rpc-url $RPC_URL \
//     --private-key $PRIVATE_KEY \
//     --broadcast \
//     --etherscan-api-key $ETHERSCAN_API_KEY \
//     --verify \
