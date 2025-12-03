#!/bin/bash

# Deploy script for D-Imara smart contracts
# Usage: chmod +x deploy.sh && ./deploy.sh <NETWORK>
# Networks: sepolia, camp

NETWORK=${1:-sepolia}

echo "Deploying D-Imara contracts to $NETWORK..."

# Set RPC URL based on network
if [ "$NETWORK" = "sepolia" ]; then
    RPC_URL="https://sepolia.infura.io/v3/$INFURA_KEY"
    CHAIN_ID=11155111
elif [ "$NETWORK" = "camp" ]; then
    RPC_URL="https://rpc.camp.io"
    CHAIN_ID=325000
else
    echo "Unknown network: $NETWORK"
    exit 1
fi

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY environment variable not set"
    exit 1
fi

# Run forge deploy
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    -vvv

echo "Deployment complete!"
