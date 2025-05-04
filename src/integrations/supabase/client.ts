
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ouaqudfefhrdzjoiretu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91YXF1ZGZlZmhyZHpqb2lyZXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMDc5MzUsImV4cCI6MjA2MDY4MzkzNX0.CDW1f4tZLm8QErsJRe3GarT5FZ7e46gfp3GLhwLrBug";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage
    }
  }
);
