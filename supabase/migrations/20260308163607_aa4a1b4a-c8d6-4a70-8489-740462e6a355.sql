
CREATE TABLE public.content_items (
  id text PRIMARY KEY,
  content_type text NOT NULL,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.content_items
  FOR SELECT TO anon, authenticated USING (true);
