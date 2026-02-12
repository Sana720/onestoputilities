-- SHREEG Investment Portal Database Schema
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Personal Details
  full_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  dob DATE NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  occupation TEXT NOT NULL,
  permanent_address TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Nominee Details (stored as JSONB)
  nominee JSONB NOT NULL,
  
  -- Bank Details (stored as JSONB)
  bank_details JSONB NOT NULL,
  
  -- Investment Details
  investment_amount NUMERIC(12, 2) NOT NULL,
  number_of_shares INTEGER NOT NULL,
  face_value_per_share NUMERIC(10, 2) DEFAULT 100,
  payment_mode TEXT NOT NULL,
  payment_reference TEXT NOT NULL,
  payment_date DATE NOT NULL,
  
  -- Agreement Details
  lock_in_period INTEGER DEFAULT 3,
  lock_in_start_date DATE NOT NULL,
  lock_in_end_date DATE NOT NULL,
  dividend_rate NUMERIC(5, 2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'matured', 'bought_back')),
  demat_account TEXT,
  demat_credited BOOLEAN DEFAULT FALSE,
  demat_credit_date DATE,
  
  -- Document Fields
  pan_number TEXT,
  marital_status TEXT,
  aadhar_number TEXT,
  
  -- Dividends (stored as JSONB array)
  dividends JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_email ON investments(email);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investments_updated_at ON investments;
CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is an admin without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin());

-- Investments table policies
DROP POLICY IF EXISTS "Users can view their own investments" ON investments;
CREATE POLICY "Users can view their own investments"
  ON investments FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all investments" ON investments;
CREATE POLICY "Admins can view all investments"
  ON investments FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update investments" ON investments;
CREATE POLICY "Admins can update investments"
  ON investments FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Anyone can insert investments (for application)" ON investments;
CREATE POLICY "Anyone can insert investments (for application)"
  ON investments FOR INSERT
  WITH CHECK (true);

-- FIX FOR EXISTING TABLES (Run these if you get "column not found" errors)
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pan_number TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS marital_status TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS aadhar_number TEXT;

-- Notify Supabase to refresh its schema cache after migrations
NOTIFY pgrst, 'reload schema';


-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON investments TO anon, authenticated;
