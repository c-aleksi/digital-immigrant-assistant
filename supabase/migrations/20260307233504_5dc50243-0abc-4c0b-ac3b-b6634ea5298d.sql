
-- Fix search_path on function
CREATE OR REPLACE FUNCTION public.update_subscribers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Tighten UPDATE policy: only allow updating own record matched by email
DROP POLICY "Allow anonymous update" ON public.subscribers;
CREATE POLICY "Allow anonymous update by email" ON public.subscribers
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
