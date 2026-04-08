Steps to enable server-side order persistence (Supabase)

1) Create the `orders` table
- Open your Supabase project → SQL Editor and run the SQL in `supabase/create_orders_table.sql`.

2) Row-Level Security (RLS) & policies
- By default new tables may have RLS disabled. If you enable RLS, add a policy to allow inserts from the frontend (or better: use an Edge Function)

  -- Example (opens insertion to public; consider using an Edge Function for secure handling):
  CREATE POLICY "Allow public inserts" ON public.orders FOR INSERT USING (true);

3) Environment variables
- Ensure your project has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set in the frontend environment (.env), so the browser can call Supabase.

4) Optional: Use an Edge Function or server route
- For better security (avoid exposing write permissions to the anon key), create an Edge Function that accepts order payloads and inserts them into the `orders` table using the Service Role key. Then call that function from the frontend instead of using the anon client.

5) Test
- Start the app locally and place an order through checkout. If the Supabase insert succeeds you should see the new row in the Table Editor → orders, and the Admin → Orders view will list it.

Notes
- The provided `create_orders_table.sql` uses `gen_random_uuid()` for IDs. If your Postgres cluster lacks that function, use `uuid_generate_v4()` or change the ID type accordingly.
- Keep production write access controlled; allowing unauthenticated inserts is a tradeoff (it makes checkout simpler but reduces control over who writes to your orders table). Consider server-side validation if needed.
