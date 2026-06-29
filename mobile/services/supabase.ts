// services/supabase.ts — Supabase client initialization
// Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env
// Import { supabase } from this file in all service files

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.EXPO_PUBLIC_SUPABASE_URL  || '';
const supabaseKey  = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Client instance — shared across all services
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Use expo-secure-store for token persistence (configured in authStore)
    persistSession:    false,  // We handle persistence in authStore manually
    autoRefreshToken:  true,
    detectSessionInUrl: false,
  },
});
