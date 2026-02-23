-- SHREEG Investment Portal Database Schema
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client', 'manager')),
  name TEXT NOT NULL,
  password_reset_required BOOLEAN DEFAULT TRUE,
  kyc_verified BOOLEAN DEFAULT FALSE,
  signature_url TEXT,
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
  pan_url TEXT,
  aadhar_url TEXT,
  bank_cheque_url TEXT,
  client_signature_url TEXT,
  client_signed_at TIMESTAMP WITH TIME ZONE,
  admin_signed_at TIMESTAMP WITH TIME ZONE,
  payment_verified BOOLEAN DEFAULT FALSE,
  
  -- Product & Broker Details
  product_name TEXT,
  broker_id TEXT,
  broker_name TEXT,
  
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

-- Create a function to check if a user is staff (admin or manager)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins/Managers can view all users" ON users;
CREATE POLICY "Admins/Managers can view all users"
  ON users FOR SELECT
  USING (is_staff());

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own data" ON users;
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Investments table policies
DROP POLICY IF EXISTS "Users can view their own investments" ON investments;
CREATE POLICY "Users can view their own investments"
  ON investments FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins/Managers can view all investments" ON investments;
CREATE POLICY "Admins/Managers can view all investments"
  ON investments FOR SELECT
  USING (is_staff());

DROP POLICY IF EXISTS "Admins can update investments" ON investments;
CREATE POLICY "Admins can update investments"
  ON investments FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Users can update their own investments" ON investments;
CREATE POLICY "Users can update their own investments"
  ON investments FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can insert investments (for application)" ON investments;
CREATE POLICY "Anyone can insert investments (for application)"
  ON investments FOR INSERT
  WITH CHECK (true);

-- FIX FOR EXISTING TABLES (Run these if you get "column not found" errors)
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pan_number TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS marital_status TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS aadhar_number TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pan_url TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS aadhar_url TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS bank_cheque_url TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS broker_id TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS broker_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS client_signature_url TEXT;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS client_signed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS admin_signed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE;

-- Notify Supabase to refresh its schema cache after migrations
NOTIFY pgrst, 'reload schema';


-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON users TO anon, authenticated;
GRANT ALL ON investments TO anon, authenticated;

-- Create brokers table
CREATE TABLE IF NOT EXISTS brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed real Indian brokers
INSERT INTO brokers (name, code) VALUES
('Direct', 'DIRECT'),
('Zerodha', 'ZERODHA'),
('Groww', 'GROWW'),
('Angel One', 'ANGELONE'),
('Upstox', 'UPSTOX'),
('ICICI Direct', 'ICICIDIRECT'),
('HDFC Securities', 'HDFCSEC'),
('Kotak Securities', 'KOTAKSEC'),
('Motilal Oswal', 'MOTILAL'),
('Paytm Money', 'PAYTM'),
('5paisa', '5PAISA'),
('Dhan', 'DHAN'),
('Arihant Capital', 'ARIHANT'),
('Alice Blue', 'ALICEBLUE'),
('Fyers', 'FYERS'),
('Other', 'OTHER')
ON CONFLICT (name) DO NOTHING;

GRANT ALL ON brokers TO anon, authenticated;

-- ==========================================
-- STORAGE SETUP
-- ==========================================

-- Create a bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read files in the documents bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'documents' );

-- Allow anyone to upload files to the documents bucket (necessary for client signatures during application)
DROP POLICY IF EXISTS "Anyone can Upload" ON storage.objects;
CREATE POLICY "Anyone can Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'documents' );

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects; -- Remove the restrictive one if it exists

-- Allow users to update/delete their own uploads (optional/standard)
DROP POLICY IF EXISTS "User Update Access" ON storage.objects;
CREATE POLICY "User Update Access"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'documents' );

DROP POLICY IF EXISTS "User Delete Access" ON storage.objects;
CREATE POLICY "User Delete Access"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'documents' );

-- OTPs table for secure payment verification
CREATE TABLE IF NOT EXISTS otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otps_email_otp ON otps(email, otp);

-- Create staff_activity_logs table
CREATE TABLE IF NOT EXISTS public.staff_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('LOGIN', 'LOGOUT')),
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_user_id ON public.staff_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_created_at ON public.staff_activity_logs(created_at DESC);

ALTER TABLE public.staff_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view logs" ON public.staff_activity_logs;
CREATE POLICY "Staff can view logs"
    ON public.staff_activity_logs FOR SELECT
    USING (is_staff());

DROP POLICY IF EXISTS "Anyone can insert logs" ON public.staff_activity_logs;
CREATE POLICY "Anyone can insert logs"
    ON public.staff_activity_logs FOR INSERT
    WITH CHECK (true);

GRANT SELECT, INSERT ON public.staff_activity_logs TO authenticated, anon;
GRANT ALL ON public.staff_activity_logs TO service_role;
