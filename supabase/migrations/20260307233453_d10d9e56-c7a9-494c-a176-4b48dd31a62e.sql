
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  consent_status BOOLEAN NOT NULL DEFAULT false,
  language TEXT NOT NULL DEFAULT 'en',
  municipality TEXT,
  scenario TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public onboarding form)
CREATE POLICY "Allow anonymous insert" ON public.subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous update by email (for upsert)
CREATE POLICY "Allow anonymous update" ON public.subscribers
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- No public select/delete
CREATE POLICY "Deny public select" ON public.subscribers
  FOR SELECT TO anon USING (false);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subscribers_updated_at();
