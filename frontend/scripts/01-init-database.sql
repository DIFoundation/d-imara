-- D-Imara Database Schema
-- PostgreSQL/Supabase setup

-- Users table (Students, Teachers, Admins, Donors)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin', 'donor')),
    school_id VARCHAR(100),
    guardian_phone VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students extended info
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    class_grade VARCHAR(50),
    learning_points INTEGER DEFAULT 0,
    tier VARCHAR(50) DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold')),
    wallet_address VARCHAR(255),
    total_quizzes_completed INTEGER DEFAULT 0,
    avg_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    course VARCHAR(100),
    description TEXT,
    questions JSONB,
    passing_score INTEGER DEFAULT 60,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz responses and scores
CREATE TABLE IF NOT EXISTS quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id),
    score INTEGER,
    passed BOOLEAN,
    points_earned INTEGER,
    answers JSONB,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student wallets
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    balance DECIMAL(18,2) DEFAULT 0,
    total_earned DECIMAL(18,2) DEFAULT 0,
    total_spent DECIMAL(18,2) DEFAULT 0,
    wallet_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain transactions
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_hash VARCHAR(255),
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    amount DECIMAL(18,2),
    tx_type VARCHAR(50) CHECK (tx_type IN ('reward', 'donation', 'disbursement')),
    student_id UUID REFERENCES students(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- School admin enrollments
CREATE TABLE IF NOT EXISTS school_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donor donations and disbursements
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES users(id),
    school_id VARCHAR(100),
    amount DECIMAL(18,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disbursements to students
CREATE TABLE IF NOT EXISTS disbursements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    amount DECIMAL(18,2),
    school_id VARCHAR(100),
    purpose VARCHAR(100) CHECK (purpose IN ('books', 'fees', 'supplies', 'other')),
    approved_by UUID REFERENCES users(id),
    tx_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges and achievements
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    badge_type VARCHAR(100),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_tier ON students(tier);
CREATE INDEX idx_quiz_responses_student ON quiz_responses(student_id);
CREATE INDEX idx_quiz_responses_quiz ON quiz_responses(quiz_id);
CREATE INDEX idx_wallets_student ON wallets(student_id);
CREATE INDEX idx_blockchain_tx_student ON blockchain_transactions(student_id);
CREATE INDEX idx_disbursements_student ON disbursements(student_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school ON users(school_id);
