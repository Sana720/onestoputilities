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

-- Index for faster filtering
CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_user_id ON public.staff_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_created_at ON public.staff_activity_logs(created_at DESC);

-- RLS Policies
ALTER TABLE public.staff_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is staff (admin or manager) if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only admins/managers can view logs
DROP POLICY IF EXISTS "Staff can view logs" ON public.staff_activity_logs;
CREATE POLICY "Staff can view logs"
    ON public.staff_activity_logs FOR SELECT
    USING (public.is_staff());

-- System can insert logs (via service role or if we want to allow staff themselves to log their logout)
DROP POLICY IF EXISTS "Anyone can insert logs" ON public.staff_activity_logs;
CREATE POLICY "Anyone can insert logs"
    ON public.staff_activity_logs FOR INSERT
    WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON public.staff_activity_logs TO authenticated;
GRANT SELECT, INSERT ON public.staff_activity_logs TO anon;
GRANT ALL ON public.staff_activity_logs TO service_role;
