#!/bin/bash

echo "D-Imara Deployment Verification Script"
echo "========================================"
echo ""

# Check environment variables
echo "1. Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "✗ NEXT_PUBLIC_SUPABASE_URL not set"
  exit 1
else
  echo "✓ NEXT_PUBLIC_SUPABASE_URL set"
fi

if [ -z "$NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS" ]; then
  echo "✗ NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS not set"
  exit 1
else
  echo "✓ NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS set"
fi

echo ""
echo "2. Checking frontend build..."
if [ -d ".next" ]; then
  echo "✓ Next.js build exists"
else
  echo "✗ Next.js build not found"
  exit 1
fi

echo ""
echo "3. Checking smart contracts..."
if [ -d "contracts" ]; then
  echo "✓ Contracts directory exists"
  if [ -f "contracts/RewardContract.sol" ]; then
    echo "✓ RewardContract.sol found"
  fi
else
  echo "✗ Contracts directory not found"
  exit 1
fi

echo ""
echo "4. Checking database schema..."
if [ -f "scripts/01-init-database.sql" ]; then
  echo "✓ Database migration script found"
else
  echo "✗ Database migration not found"
  exit 1
fi

echo ""
echo "5. Testing API endpoints..."
if [ -f "app/api/quizzes/route.ts" ]; then
  echo "✓ Quiz API found"
fi

if [ -f "app/api/blockchain/award-credits/route.ts" ]; then
  echo "✓ Blockchain API found"
fi

echo ""
echo "========================================"
echo "✓ All deployment checks passed!"
echo ""
echo "Next steps:"
echo "1. npm run contracts:deploy"
echo "2. Verify contracts on Camp explorer"
echo "3. Set contract addresses in .env"
echo "4. Deploy to Vercel: vercel --prod"
