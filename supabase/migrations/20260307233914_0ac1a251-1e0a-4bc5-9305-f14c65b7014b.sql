
-- Remove permissive policies since we use SECURITY DEFINER function
DROP POLICY "Allow anonymous insert" ON public.subscribers;
DROP POLICY "Allow anonymous update by email" ON public.subscribers;
