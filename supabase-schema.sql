-- Job Tracker — offers + interactions table
-- Run this in Supabase SQL Editor

-- Drop old table if recreating (optional, skip if you have data)
-- DROP TABLE IF EXISTS offers;

CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT DEFAULT '',
  salary NUMERIC NOT NULL DEFAULT 0,
  benefits NUMERIC NOT NULL DEFAULT 0,
  availability_hours INT NOT NULL DEFAULT 40,
  experience_years INT NOT NULL DEFAULT 0,
  contract_months INT NOT NULL DEFAULT 0,
  team_size INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'postulada', 'entrevista', 'oferta', 'descartada')),
  notes TEXT DEFAULT '',
  url TEXT DEFAULT '',
  interactions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- If table already exists, add the column:
-- ALTER TABLE offers ADD COLUMN IF NOT EXISTS interactions JSONB DEFAULT '[]'::jsonb;

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON offers;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Expose table to Data API (anon role)
GRANT SELECT, INSERT, UPDATE, DELETE ON offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON offers TO authenticated;

-- Row Level Security
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read offers" ON offers;
DROP POLICY IF EXISTS "Anyone can insert offers" ON offers;
DROP POLICY IF EXISTS "Anyone can update offers" ON offers;
DROP POLICY IF EXISTS "Anyone can delete offers" ON offers;

CREATE POLICY "Anyone can read offers" ON offers
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert offers" ON offers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update offers" ON offers
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete offers" ON offers
  FOR DELETE USING (true);
