# D-Imara MVP Testing Guide

## Test Scenarios

### 1. Student Learning Flow
**Objective**: Verify student can complete quiz and earn points

**Steps**:
1. Sign up as student with valid school ID
2. Guardian verification completes (mock OTP)
3. Navigate to quizzes
4. Select "Math Fundamentals"
5. Answer all 5 questions
6. Submit quiz
7. Check score and points awarded

**Expected Results**:
- Quiz submitted successfully
- Score calculated correctly (e.g., 80%)
- Points awarded (+10 per correct answer)
- Student tier remains Bronze (0-50 pts)
- Wallet shows 0 balance (no tier bonus yet)

**Test Data**:
- Name: Test Student
- Email: student@test.com
- School ID: SCHOOL001
- Guardian Phone: 0801234567

---

### 2. Tier Progression (Bronze → Silver)
**Objective**: Verify tier advancement and blockchain reward

**Setup**:
- Student has 50 points (Bronze)

**Steps**:
1. Complete quiz with 40 points (test script adds 40)
2. New total: 90 points (Silver tier)
3. Wait for blockchain transaction
4. Check wallet balance (should be 1000 LCT)

**Expected Results**:
- Tier updated to Silver
- Badge notification shown
- Blockchain transaction confirmed
- Wallet balance shows 1000

**Acceptance Criteria**:
- TX hash visible on Camp explorer
- Block number recorded
- TX status = confirmed

---

### 3. Teacher Verification Flow
**Objective**: Verify teacher can approve enrollments

**Steps**:
1. Login as teacher
2. View pending verifications
3. See 2 pending students
4. Click "Approve" on first student
5. Student status changes to "Active"
6. Approved student appears in Active list

**Expected Results**:
- Pending count decreases
- Student moved to Active
- Student can now take quizzes
- No blockchain TX (approval only)

---

### 4. Teacher Approves Tier Bonus
**Objective**: Verify teacher can trigger blockchain rewards

**Steps**:
1. Login as teacher
2. View students at Silver/Gold tier
3. Click "Approve Release" for Silver student
4. Confirm action
5. Wait for blockchain TX

**Expected Results**:
- TX hash displayed
- Link to Camp explorer works
- Donor dashboard shows new TX
- Wallet balance updated

---

### 5. Donor Dashboard Impact
**Objective**: Verify donor sees real-time blockchain data

**Steps**:
1. Login as donor
2. View impact metrics
3. Check charts for student count (should be 50+)
4. Click on transaction history
5. Verify "View on Explorer" link

**Expected Results**:
- Metrics sync with blockchain
- Charts render correctly
- Explorer links open Camp Network
- TX details visible

---

### 6. Wallet Spending
**Objective**: Verify purpose-locked wallet spending

**Steps**:
1. Student has 1000 LCT in wallet
2. Select "Spend Credits" → Books
3. Enter amount: 200
4. Confirm spending
5. Check updated balance (800)

**Expected Results**:
- Balance decreases
- Spending category locked
- Cannot spend on non-approved items
- Total spent increases

---

## Performance Testing

### Page Load Times
- Landing page: < 2s
- Dashboard: < 3s
- Quiz page: < 1.5s
- Blockchain TX: < 5s (network dependent)

### Database Queries
- Get students by school: < 200ms
- Submit quiz: < 500ms
- Get wallet: < 100ms

### Blockchain Calls
- Get balance: < 2s
- Award credits: < 10s (includes confirmation)
- Get pool stats: < 2s

## Security Testing

### Authentication
- [ ] Cannot access dashboard without login
- [ ] Session expires after 30 minutes
- [ ] Password validation works
- [ ] Email verification required

### Authorization
- [ ] Student cannot access teacher panel
- [ ] Teacher cannot access donor stats
- [ ] Donor cannot modify student data
- [ ] Admin overrides work correctly

### Data Validation
- [ ] Quiz answers validated server-side
- [ ] Invalid school IDs rejected
- [ ] Phone numbers validated
- [ ] SQL injection attempts blocked

### Blockchain Security
- [ ] Private key never exposed in client
- [ ] Transactions signed correctly
- [ ] Only authorized users can award credits
- [ ] Wallet spending locked to approved categories

## Test Data Setup

### Create Test Users
\`\`\`javascript
// Student
{
  name: "John Doe",
  email: "john@test.com",
  role: "student",
  schoolId: "SCHOOL001",
  guardianPhone: "0801234567"
}

// Teacher
{
  name: "Mrs. Smith",
  email: "teacher@test.com",
  role: "teacher",
  schoolId: "SCHOOL001"
}

// Donor
{
  name: "NGO Foundation",
  email: "donor@test.com",
  role: "donor"
}
\`\`\`

### Run Test Scenarios
\`\`\`bash
# Test blockchain integration
npm run test:blockchain

# Test API endpoints
npm run test:api

# Test database
npm run test:db

# Full integration test
npm run test:integration
\`\`\`

## Monitoring & Logs

### Frontend Errors
- Check Vercel error logs
- Open browser DevTools (F12)
- Check Network tab for API failures

### Backend Errors
- Check Render/Railway logs
- Search for error status codes
- Check database connection

### Blockchain Issues
- Verify contract deployment: Camp explorer
- Check gas estimates
- Verify private key format
- Check RPC endpoint availability

## Sign-Off Checklist

- [ ] All test scenarios passed
- [ ] No console errors
- [ ] Page load < 3s
- [ ] Blockchain transactions confirmed
- [ ] Database sync working
- [ ] Email notifications sent
- [ ] Mobile responsive verified
- [ ] Accessibility (a11y) checked
- [ ] Security penetration test passed
- [ ] Load test 100+ concurrent users

## Known Issues & Workarounds

### Issue: Blockchain TX pending indefinitely
**Cause**: Low gas price or network congestion
**Workaround**: Increase gas price, retry transaction

### Issue: Supabase connection timeout
**Cause**: Network or auth token expired
**Workaround**: Refresh page, re-authenticate

### Issue: Quiz cached from old version
**Cause**: Service worker serving stale content
**Workaround**: Hard refresh (Ctrl+Shift+R)

## Reporting Bugs

Include:
1. Steps to reproduce
2. Expected vs actual behavior
3. Screenshots/video
4. Browser/device info
5. Error logs
6. TX hash (if blockchain related)

## Next Round Testing (Post-Hackathon)

- [ ] Load testing (1000+ concurrent users)
- [ ] Chaos engineering (failure scenarios)
- [ ] Contract audit (security)
- [ ] UI/UX usability testing
- [ ] A/B testing for features
