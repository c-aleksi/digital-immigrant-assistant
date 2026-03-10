
-- Create a secure upsert function that bypasses RLS
CREATE OR REPLACE FUNCTION public.upsert_subscriber(
  p_email TEXT,
  p_consent_status BOOLEAN,
  p_language TEXT,
  p_municipality TEXT,
  p_scenario TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscribers (email, consent_status, language, municipality, scenario)
  VALUES (lower(trim(p_email)), p_consent_status, p_language, p_municipality, p_scenario)
  ON CONFLICT (email) DO UPDATE SET
    consent_status = EXCLUDED.consent_status,
    language = EXCLUDED.language,
    municipality = EXCLUDED.municipality,
    scenario = EXCLUDED.scenario,
    updated_at = now();
END;
$$;
