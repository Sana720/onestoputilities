-- Add fees column to investments table
ALTER TABLE investments ADD COLUMN IF NOT EXISTS fees JSONB DEFAULT '[]'::jsonb;

-- Notify pgrst
NOTIFY pgrst, 'reload schema';
