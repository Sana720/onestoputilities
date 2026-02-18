-- PRE-PRODUCTION CLEANUP SCRIPT
-- ====================================================================
-- WARNING: THIS SCRIPT WILL PERMANENTLY DELETE ALL CLIENT DATA.
-- BACKUP YOUR DATABASE BEFORE RUNNING THIS.
-- ====================================================================

-- This script:
-- 1. Clears all investments and transaction history.
-- 2. Removes all client profiles while preserving admin accounts.
-- 3. Deletes associated authentication records.
-- 4. Clears document storage metadata.

BEGIN;

-- 1. Identify and protect admins
-- We store the IDs of users with 'admin' role to ensure they are NOT deleted.
CREATE TEMP TABLE preserved_users AS 
SELECT id FROM public.users WHERE role = 'admin';

-- 2. Clear application data
-- This wipse all investment applications, KYC documents links, and history.
DELETE FROM public.investments;

-- 3. Clear public profiles
-- Deletes all users except admins.
DELETE FROM public.users 
WHERE id NOT IN (SELECT id FROM preserved_users);

-- 4. Clear auth accounts
-- Removes login credentials for everyone except preserved admins.
-- Note: Requires permissions to modify the 'auth' schema.
DELETE FROM auth.users 
WHERE id NOT IN (SELECT id FROM preserved_users);

-- 5. Storage Cleanup Note
-- NOTE: Direct deletion from storage.objects is restricted by Supabase triggers.
-- To clear the documents bucket, please use the Supabase Dashboard:
-- Storage -> Buckets -> documents -> Delete all files manually.

-- 6. Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

COMMIT;

-- SUCCESS: The database is now cleared of test data. 
-- Only users with the 'admin' role remain.
