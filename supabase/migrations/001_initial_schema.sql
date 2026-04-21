-- Create tables matching the Prisma schema for Creator Onboarding Builder

-- Main onboarding configuration per creator/whop
CREATE TABLE IF NOT EXISTS onboarding (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  whop_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_onboarding_whop_id ON onboarding(whop_id);

-- Draft and published versions of onboarding configs
CREATE TABLE IF NOT EXISTS onboarding_version (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  onboarding_id TEXT NOT NULL REFERENCES onboarding(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1 NOT NULL,
  status TEXT NOT NULL, -- 'draft' | 'published'
  published_at TIMESTAMPTZ,
  published_by TEXT,

  -- Theme/Branding
  primary_color TEXT DEFAULT '#141212' NOT NULL,
  secondary_color TEXT DEFAULT '#FA4616' NOT NULL,
  light_color TEXT DEFAULT '#FCF6F5' NOT NULL,
  gradient_stops JSONB, -- Array of gradient stops
  button_radius INTEGER DEFAULT 12 NOT NULL,
  button_style TEXT DEFAULT 'solid' NOT NULL, -- 'solid' | 'outline' | 'ghost'
  logo_url TEXT,
  cover_image_url TEXT,
  mode TEXT DEFAULT 'dark' NOT NULL, -- 'light' | 'dark'

  -- Welcome screen
  welcome_title TEXT,
  welcome_subtitle TEXT,
  welcome_completed BOOLEAN DEFAULT FALSE NOT NULL,

  -- Steps (stored as JSON for flexibility)
  steps JSONB NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_onboarding_version_onboarding_status ON onboarding_version(onboarding_id, status);
CREATE INDEX idx_onboarding_version_status ON onboarding_version(status);

-- User progress tracking
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  version_id TEXT NOT NULL REFERENCES onboarding_version(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Whop user ID
  email TEXT,

  -- Progress state
  current_step INTEGER DEFAULT 1 NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,

  -- Step-specific data (stored as JSON)
  step_data JSONB,

  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(version_id, user_id)
);

CREATE INDEX idx_onboarding_progress_version_id ON onboarding_progress(version_id);
CREATE INDEX idx_onboarding_progress_user_id ON onboarding_progress(user_id);
CREATE INDEX idx_onboarding_progress_completed ON onboarding_progress(completed);

-- Step progress tracking (for detailed analytics)
CREATE TABLE IF NOT EXISTS step_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  progress_id TEXT NOT NULL REFERENCES onboarding_progress(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL, -- Which step (0-based)
  step_type TEXT NOT NULL, -- 'choice' | 'video' | 'tour' | 'form' | 'checklist' | 'finale'
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  xp_earned INTEGER DEFAULT 0 NOT NULL,
  completed_at TIMESTAMPTZ,

  UNIQUE(progress_id, step_index)
);

CREATE INDEX idx_step_progress_progress_id ON step_progress(progress_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for auto-updating updated_at
CREATE TRIGGER update_onboarding_updated_at
  BEFORE UPDATE ON onboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_version_updated_at
  BEFORE UPDATE ON onboarding_version
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_progress ENABLE ROW LEVEL SECURITY;

-- Policies can be added based on your auth requirements
-- Example: Allow service role full access
CREATE POLICY "Service role has full access to onboarding"
  ON onboarding FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to onboarding_version"
  ON onboarding_version FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to onboarding_progress"
  ON onboarding_progress FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to step_progress"
  ON step_progress FOR ALL
  USING (auth.role() = 'service_role');
