# D-Imara MVP - Smart Performance-Based Learning & Micro-Funding

A gamified learning platform with blockchain-tracked education credits for rural African students, teachers, and NGO donors.

## Features

### Student Dashboard
- AI-powered quizzes with instant scoring
- Learning points accumulation
- Tier system (Bronze → Silver → Gold)
- Education wallet with purpose-locked spending
- Real-time progress tracking

### Teacher/Admin Panel
- Student enrollment verification
- Guardian verification (OTP-based)
- Performance monitoring
- Tier bonus approval (triggers blockchain rewards)
- Impact reporting

### Donor Dashboard
- Real-time impact metrics
- Blockchain transaction ledger
- Donation management
- Student progress tracking
- Performance charts

## Tech Stack

### Smart Contracts
- **Blockchain**: Camp Network Testnet
- **Language**: Solidity 0.8.20
- **Contracts**:
  - RewardContract: Issues LearnCredit tokens
  - WalletContract: Purpose-locked education spending
  - FundingPool: Transparent fund distribution

### Backend
- **Framework**: Next.js 16 (Route Handlers)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render/Railway
- **Contract Compilation**: Hardhat
- **Version Control**: GitHub

## Getting Started

### Local Development

\`\`\`bash
# Install dependencies
npm install

# Compile smart contracts
npm run contracts:compile

# Create .env.local with your keys
cp .env.example .env.local

# Run development server
npm run dev
\`\`\`

Visit http://localhost:3000

### Smart Contract Deployment

\`\`\`bash
# Compile
npm run contracts:compile

# Deploy to Camp Testnet
npm run contracts:deploy

# Copy contract addresses to .env.local
\`\`\`

### Database Setup

\`\`\`bash
# Run migration in Supabase
# Use supabase-cli or Supabase dashboard
# Import: scripts/01-init-database.sql
\`\`\`

## Project Structure

\`\`\`
.
├── app/
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── sign-up/          # Sign-up page
│   ├── page.tsx          # Landing page
│   └── layout.tsx        # Root layout
├── components/
│   ├── dashboards/       # Dashboard components
│   └── ui/              # Reusable UI components
├── contracts/            # Solidity smart contracts
├── lib/                  # Utilities and helpers
├── scripts/              # Database and deployment scripts
└── public/               # Static assets
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Create account
- `POST /api/auth/login` - Login

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes?subject=Math` - Get quizzes by subject
- `POST /api/quizzes/submit` - Submit quiz responses

### Students
- `GET /api/students?schoolId=SCHOOL001` - Get school students
- `GET /api/students/:id` - Get student details

### Wallet
- `GET /api/wallet?studentId=:id` - Get wallet info
- `POST /api/wallet` - Create wallet transaction

### Blockchain
- `POST /api/blockchain/award-credits` - Award quiz credits
- `POST /api/blockchain/award-tier` - Award tier bonus
- `GET /api/blockchain/pool-stats` - Get funding pool stats

## Database Schema

### Core Tables
- `users` - All user types (student, teacher, donor)
- `students` - Extended student info with points and tier
- `quizzes` - Quiz definitions
- `quiz_responses` - Student quiz submissions
- `wallets` - Education wallets
- `blockchain_transactions` - Transaction ledger

### Support Tables
- `school_enrollments` - Enrollment verification
- `donations` - Donor contributions
- `disbursements` - Fund releases to students
- `badges` - Achievement tracking

## Key Flows

### Learning → Reward → Funding
1. Student completes quiz (5-10 questions)
2. System calculates score
3. Correct answers = points (+10 per correct)
4. Points update student tier
5. Tier change triggers blockchain reward
6. Wallet receives education credits
7. Credits visible to donor dashboard
8. Teacher approves disbursement
9. Transaction recorded on Camp Network

### Tier Progression
- **Bronze**: 0-50 points
- **Silver**: 51-100 points (₦1,000 education credit reward)
- **Gold**: 101-200 points (₦2,000 education credit reward)

## Offline Support
- Quizzes cached locally
- Responses queued for sync
- Automatic sync when connected

## Security
- Row-Level Security (RLS) on all tables
- Purpose-locked wallet spending
- Teacher verification for enrollments
- All blockchain transactions logged
- No real money - testnet tokens only

## Monitoring

- **Blockchain**: Camp Network explorer
- **Database**: Supabase dashboard
- **Frontend**: Vercel analytics
- **Errors**: Sentry integration (optional)

## Hackathon KPIs

- ✅ 50+ test students enrolled
- ✅ 300+ quizzes completed
- ✅ 20%+ score improvement tracked
- ✅ 10+ blockchain transactions
- ✅ 95%+ dashboard uptime
- ✅ Full MVP demo ready

## Next Steps (Post-Hackathon)

- [ ] SMS/USSD lessons for low-connectivity areas
- [ ] Teacher incentive program
- [ ] Vendor marketplace for approved purchases
- [ ] Mentor matching system
- [ ] Radio broadcast lessons
- [ ] Mobile app (React Native)
- [ ] Government school API integration
- [ ] AI tutoring system
- [ ] Production token (not testnet)

## License

MIT

## Support

For deployment help: See `DEPLOYMENT.md`
For technical docs: Check inline code comments
For issues: Open GitHub issue
