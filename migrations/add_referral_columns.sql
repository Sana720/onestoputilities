-- Migration to add referral columns to users table

-- Add referral_code column
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Add referred_by_code column
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by_code TEXT;

-- Create a function to generate a unique random referral code
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excluded I, O, 0, 1 for clarity
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Set 'ADMIN' for the admin user
UPDATE users SET referral_code = 'ADMIN' WHERE role = 'admin' AND referral_code IS NULL;

-- Update existing users with unique referral codes
DO $$
DECLARE
    user_record RECORD;
    new_code TEXT;
BEGIN
    FOR user_record IN SELECT id FROM users WHERE referral_code IS NULL LOOP
        LOOP
            new_code := generate_referral_code();
            BEGIN
                UPDATE users SET referral_code = new_code WHERE id = user_record.id;
                EXIT; -- exit inner loop on success
            EXCEPTION WHEN unique_violation THEN
                -- loop again if collision
            END;
        END LOOP;
    END LOOP;
END $$;

-- Add index for referred_by_code
CREATE INDEX IF NOT EXISTS idx_users_referred_by_code ON users(referred_by_code);

-- Notify Supabase to refresh its schema cache
NOTIFY pgrst, 'reload schema';
