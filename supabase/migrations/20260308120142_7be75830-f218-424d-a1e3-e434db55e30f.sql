
CREATE OR REPLACE FUNCTION public.delete_subscriber(p_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.subscribers WHERE email = lower(trim(p_email));
END;
$$;
