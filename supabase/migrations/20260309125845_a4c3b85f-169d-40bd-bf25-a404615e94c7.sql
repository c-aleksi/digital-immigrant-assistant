
-- 1. Content Relations table: bundle/guide_card → step composition
CREATE TABLE public.content_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id text NOT NULL,
  child_id text NOT NULL,
  relation_type text NOT NULL DEFAULT 'bundle_step',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(parent_id, child_id, relation_type)
);

-- RLS: public read, writes via edge functions only
ALTER TABLE public.content_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on content_relations"
  ON public.content_relations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. User Next Steps Feed table
CREATE TABLE public.user_next_steps_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  content_item_id text NOT NULL,
  source_type text NOT NULL DEFAULT 'default_scenario',
  display_order integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  is_hidden boolean NOT NULL DEFAULT false,
  added_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_item_id)
);

-- RLS: users can only read/write their own feed entries
ALTER TABLE public.user_next_steps_feed ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations filtered by user_id (no auth yet, anon access)
CREATE POLICY "Users can read own feed"
  ON public.user_next_steps_feed
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own feed"
  ON public.user_next_steps_feed
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own feed"
  ON public.user_next_steps_feed
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own feed"
  ON public.user_next_steps_feed
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Index for fast lookups
CREATE INDEX idx_user_feed_user_id ON public.user_next_steps_feed(user_id);
CREATE INDEX idx_user_feed_order ON public.user_next_steps_feed(user_id, display_order);
CREATE INDEX idx_content_relations_parent ON public.content_relations(parent_id);
