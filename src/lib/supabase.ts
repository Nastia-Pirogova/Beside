import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env vars missing. Check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type OrderRow = {
  id: string;
  customer_id: string;
  relative_id: string | null;
  helper_id: string | null;
  category: string;
  title: string;
  description: string;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  scheduled_date: string | null;
  scheduled_time: string;
  estimated_duration: string;
  payment_amount: number;
  attachment_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
};

export type ProfileRow = {
  id: string;
  user_id: string;
  role: 'customer' | 'helper';
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string | null;
  city: string;
  created_at: string;
  updated_at: string;
};

export type RelativeRow = {
  id: string;
  customer_id: string;
  name: string;
  age: number;
  phone: string;
  city: string;
  address: string;
  relationship: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type HelperProfileRow = {
  id: string;
  user_id: string;
  bio: string;
  city: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  phone_verified: boolean;
  identity_verified: boolean;
  training_completed: boolean;
  qualification_verified: boolean;
  rating: number;
  completed_orders: number;
  created_at: string;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  order_id: string;
  customer_id: string;
  helper_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type OrderStatus = 'open' | 'accepted' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled';
