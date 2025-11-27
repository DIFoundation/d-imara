# D-Imara MVP Deployment Guide

## Prerequisites
- Node.js 18+
- Hardhat for smart contract compilation
- Vercel account (for frontend)
- Render/Railway account (for backend)
- Supabase account (for database)

## Smart Contract Deployment (Camp Testnet)

### 1. Setup Hardhat
\`\`\`bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox ethers
npx hardhat init
\`\`\`

### 2. Configure Environment
Create `.env` file:
\`\`\`
CAMP_RPC_URL=https://rpc.camp.io
PRIVATE_KEY=your_wallet_private_key
\`\`\`

### 3. Compile Contracts
\`\`\`bash
npm run contracts:compile
\`\`\`

### 4. Deploy to Camp Testnet
\`\`\`bash
npm run contracts:deploy
\`\`\`

This will output contract addresses. Save these to `.env`:
\`\`\`
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_WALLET_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_FUNDING_POOL_ADDRESS=0x...
\`\`\`

## Database Setup (Supabase)

### 1. Create Supabase Project
- Go to supabase.com
- Create new project
- Get URL and anon key

### 2. Run Database Migration
\`\`\`bash
# Option 1: Use Supabase UI to run SQL scripts
# Copy contents of scripts/01-init-database.sql

# Option 2: Use Supabase CLI
supabase db push
\`\`\`

### 3. Configure Environment
Add to `.env.local`:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
\`\`\`

## Frontend Deployment (Vercel)

### 1. Push to GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial D-Imara MVP"
git push origin main
\`\`\`

### 2. Deploy to Vercel
- Connect GitHub repo to Vercel
- Add environment variables from `.env.local`
- Deploy

Or use Vercel CLI:
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

## Backend Deployment (Render/Railway)

### 1. Create API Server
Copy all files to separate backend directory with package.json

### 2. Deploy to Render
\`\`\`bash
render create --project d-imara-backend
\`\`\`

Or Railway:
\`\`\`bash
railway link
railway up
\`\`\`

## Verification Checklist

- [ ] Smart contracts deployed to Camp Testnet
- [ ] Contract addresses set in environment variables
- [ ] Database tables created in Supabase
- [ ] Frontend deployed to Vercel
- [ ] Backend APIs accessible
- [ ] Blockchain client can read contract data
- [ ] Quiz submission triggers points reward
- [ ] Tier achievement triggers blockchain transaction
- [ ] Donor dashboard shows real transaction data

## Testing Flows

### Student Flow
1. Sign up with school ID
2. Guardian verification (mock)
3. Take quiz
4. Check points and tier
5. View wallet balance

### Teacher Flow
1. Login as teacher
2. Approve pending students
3. View student progress
4. Approve tier bonuses (triggers blockchain)

### Donor Flow
1. Login as donor
2. View impact dashboard
3. See blockchain transactions
4. Make donation to school
5. View on explorer link

## Monitoring

- Blockchain transactions: Camp Network explorer
- Database: Supabase dashboard
- Logs: Vercel/Render dashboards
- Performance: Vercel analytics

## Support

For issues:
1. Check error logs on Vercel/Render
2. Verify contract deployment with Camp explorer
3. Check database connection with Supabase
4. Ensure all env vars are set
