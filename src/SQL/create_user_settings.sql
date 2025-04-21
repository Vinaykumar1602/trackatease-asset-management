
-- Create a table for user settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for select
CREATE POLICY user_select_own_settings ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);
  
-- Create RLS policy for insert
CREATE POLICY user_insert_own_settings ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
-- Create RLS policy for update
CREATE POLICY user_update_own_settings ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);
