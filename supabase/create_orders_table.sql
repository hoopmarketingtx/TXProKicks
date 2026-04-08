-- Run this in your Supabase SQL editor to create an `orders` table

-- Ensure the pgcrypto extension is enabled for gen_random_uuid()
-- (Supabase projects typically already have this enabled)

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  items jsonb NOT NULL,
  contact jsonb,
  pickup_date timestamptz,
  shipping_address jsonb,
  subtotal numeric,
  discount_code text,
  discount_amount numeric,
  total numeric,
  created_at timestamptz DEFAULT now()
);

-- Optional index for querying recent orders
CREATE INDEX IF NOT EXISTS orders_created_idx ON public.orders (created_at DESC);
