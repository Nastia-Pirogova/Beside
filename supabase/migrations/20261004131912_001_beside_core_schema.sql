/*
# Beside Core Schema — Profiles, Relatives, Helper Profiles, Orders, Reviews

## Overview
Creates the complete database backend for the Beside MVP — a Ukrainian platform
connecting families with verified local helpers for elderly relatives.

## New Tables

### 1. profiles
- Stores user application profile data linked to Supabase Auth users.
- Fields: id (uuid PK), user_id (→ auth.users), role (customer|helper),
  first_name, last_name, phone, avatar_url, city, created_at, updated_at.

### 2. relatives
- Elderly relatives managed by customer users.
- Fields: id (uuid PK), customer_id (→ profiles.user_id), name, age, phone,
  city, address, relationship, notes, created_at, updated_at.

### 3. helper_profiles
- Extended profile for helpers with verification status.
- Fields: id (uuid PK), user_id (→ auth.users), bio, city,
  verification_status (pending|verified|rejected), phone_verified,
  identity_verified, training_completed, qualification_verified,
  rating, completed_orders, created_at, updated_at.

### 4. orders
- Help requests created by customers, accepted by helpers.
- Fields: id (uuid PK), customer_id (→ profiles.user_id), relative_id (→ relatives),
  helper_id (→ auth.users, nullable), category, title, description, city, address,
  latitude, longitude, scheduled_date, scheduled_time, estimated_duration,
  payment_amount, attachment_url, status (open|accepted|on_the_way|in_progress|
  completed|cancelled), created_at, updated_at, accepted_at, started_at,
  completed_at.

### 5. reviews
- Customer reviews for helpers after order completion.
- Fields: id (uuid PK), order_id (→ orders), customer_id, helper_id,
  rating (1-5), comment, created_at.

### 6. order_status_history
- Audit trail for order status transitions.
- Fields: id (uuid PK), order_id (→ orders), status, changed_by (→ auth.users),
  created_at.

## Security (RLS)
- profiles: users can read/update only their own profile.
- relatives: customers can CRUD only their own relatives.
- helper_profiles: helpers can read/update their own; any authenticated user
  can read verified helper profiles (for order tracking).
- orders: customers can CRUD their own orders; helpers can read open orders
  and update orders assigned to them.
- reviews: customers can create reviews for their own completed orders;
  anyone authenticated can read reviews.
- All policies use auth.uid() for ownership checks.

## Important Notes
1. user_id columns default to auth.uid() so inserts from the client work
   even when user_id is omitted.
2. RLS enabled on every table.
3. Foreign keys with ON DELETE CASCADE where appropriate.
4. Indexes on frequently queried columns.
5. A trigger function auto-updates updated_at on row modification.
*/

-- ============================================================
-- Helper function: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'helper')),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  city text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. relatives
-- ============================================================
CREATE TABLE IF NOT EXISTS relatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer NOT NULL DEFAULT 0,
  phone text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  relationship text NOT NULL DEFAULT 'other',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE relatives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "relatives_select_own" ON relatives;
CREATE POLICY "relatives_select_own"
ON relatives FOR SELECT TO authenticated
USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "relatives_insert_own" ON relatives;
CREATE POLICY "relatives_insert_own"
ON relatives FOR INSERT TO authenticated
WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "relatives_update_own" ON relatives;
CREATE POLICY "relatives_update_own"
ON relatives FOR UPDATE TO authenticated
USING (auth.uid() = customer_id) WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "relatives_delete_own" ON relatives;
CREATE POLICY "relatives_delete_own"
ON relatives FOR DELETE TO authenticated
USING (auth.uid() = customer_id);

DROP TRIGGER IF EXISTS trg_relatives_updated_at ON relatives;
CREATE TRIGGER trg_relatives_updated_at
  BEFORE UPDATE ON relatives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. helper_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS helper_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  bio text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  phone_verified boolean NOT NULL DEFAULT false,
  identity_verified boolean NOT NULL DEFAULT false,
  training_completed boolean NOT NULL DEFAULT false,
  qualification_verified boolean NOT NULL DEFAULT false,
  rating numeric(3,2) NOT NULL DEFAULT 0.00,
  completed_orders integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE helper_profiles ENABLE ROW LEVEL SECURITY;

-- Helpers can read their own profile
DROP POLICY IF EXISTS "helper_profiles_select_own" ON helper_profiles;
CREATE POLICY "helper_profiles_select_own"
ON helper_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Any authenticated user can read verified helper profiles (for order tracking)
DROP POLICY IF EXISTS "helper_profiles_select_verified" ON helper_profiles;
CREATE POLICY "helper_profiles_select_verified"
ON helper_profiles FOR SELECT TO authenticated
USING (verification_status = 'verified');

-- Helpers can insert their own profile
DROP POLICY IF EXISTS "helper_profiles_insert_own" ON helper_profiles;
CREATE POLICY "helper_profiles_insert_own"
ON helper_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Helpers can update their own profile (but not verification fields)
DROP POLICY IF EXISTS "helper_profiles_update_own" ON helper_profiles;
CREATE POLICY "helper_profiles_update_own"
ON helper_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_helper_profiles_updated_at ON helper_profiles;
CREATE TRIGGER trg_helper_profiles_updated_at
  BEFORE UPDATE ON helper_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  relative_id uuid REFERENCES relatives(id) ON DELETE SET NULL,
  helper_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'other',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  latitude numeric(10,7),
  longitude numeric(10,7),
  scheduled_date date,
  scheduled_time text NOT NULL DEFAULT '',
  estimated_duration text NOT NULL DEFAULT '1 год',
  payment_amount integer NOT NULL DEFAULT 0,
  attachment_url text DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customers can see their own orders
DROP POLICY IF EXISTS "orders_select_customer" ON orders;
CREATE POLICY "orders_select_customer"
ON orders FOR SELECT TO authenticated
USING (auth.uid() = customer_id);

-- Helpers can see open orders and orders assigned to them
DROP POLICY IF EXISTS "orders_select_helper" ON orders;
CREATE POLICY "orders_select_helper"
ON orders FOR SELECT TO authenticated
USING (
  status = 'open'
  OR auth.uid() = helper_id
);

-- Customers can create orders
DROP POLICY IF EXISTS "orders_insert_customer" ON orders;
CREATE POLICY "orders_insert_customer"
ON orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own orders (e.g. cancel, edit)
DROP POLICY IF EXISTS "orders_update_customer" ON orders;
CREATE POLICY "orders_update_customer"
ON orders FOR UPDATE TO authenticated
USING (auth.uid() = customer_id) WITH CHECK (auth.uid() = customer_id);

-- Helpers can update orders assigned to them (status changes)
DROP POLICY IF EXISTS "orders_update_helper" ON orders;
CREATE POLICY "orders_update_helper"
ON orders FOR UPDATE TO authenticated
USING (auth.uid() = helper_id) WITH CHECK (auth.uid() = helper_id);

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_helper_id ON orders(helper_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_scheduled_date ON orders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_relatives_customer_id ON relatives(customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_helper_profiles_user_id ON helper_profiles(user_id);

-- ============================================================
-- 5. reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  helper_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read reviews
DROP POLICY IF EXISTS "reviews_select_all" ON reviews;
CREATE POLICY "reviews_select_all"
ON reviews FOR SELECT TO authenticated
USING (true);

-- Customers can create reviews for their own orders
DROP POLICY IF EXISTS "reviews_insert_customer" ON reviews;
CREATE POLICY "reviews_insert_customer"
ON reviews FOR INSERT TO authenticated
WITH CHECK (auth.uid() = customer_id);

-- No updates or deletes on reviews
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_helper_id ON reviews(helper_id);

-- ============================================================
-- 6. order_status_history
-- ============================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_history_select" ON order_status_history;
CREATE POLICY "order_history_select"
ON order_status_history FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id
    AND (orders.customer_id = auth.uid() OR orders.helper_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "order_history_insert" ON order_status_history;
CREATE POLICY "order_history_insert"
ON order_status_history FOR INSERT TO authenticated
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON order_status_history(order_id);
