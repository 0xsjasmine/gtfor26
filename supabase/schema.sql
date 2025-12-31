-- GTFOR26 Database Schema
-- AI-Powered Goal Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  current_quarter TEXT -- e.g., "Q1 2025"
);

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL, -- e.g., "Q1 2025"
  category TEXT NOT NULL, -- work, personal, creative, relationships, health, learning
  description TEXT NOT NULL,
  kpi_metric TEXT NOT NULL, -- e.g., "blog posts published"
  kpi_target INTEGER NOT NULL DEFAULT 10,
  kpi_current INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, backlogged, completed, dropped
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anti-goals table
CREATE TABLE anti_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vibe codes table
CREATE TABLE vibe_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  vibe_type TEXT NOT NULL, -- Deep Build, Community, Integration, Rest
  focus_goals UUID[] DEFAULT '{}', -- array of goal IDs
  backlogged_goals UUID[] DEFAULT '{}', -- array of goal IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_user_override BOOLEAN DEFAULT FALSE
);

-- Daily check-ins table
CREATE TABLE daily_check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  accomplishments TEXT,
  doubts TEXT,
  opportunities TEXT,
  mood_context TEXT, -- tired, anxious, energized, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Envy logs table
CREATE TABLE envy_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  trigger TEXT NOT NULL, -- what caused envy
  category_tag TEXT NOT NULL, -- travel, career, relationships, creative, recognition, freedom, lifestyle, other
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backlog items table
CREATE TABLE backlog_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  backlogged_from_date DATE DEFAULT CURRENT_DATE,
  target_quarter TEXT NOT NULL, -- e.g., "Q2 2025"
  reason TEXT,
  times_mentioned INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'backlogged', -- backlogged, promoted, dropped
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reflections table
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- monthly, quarterly
  period TEXT NOT NULL, -- e.g., "Jan 2025" or "Q1 2025"
  llm_questions JSONB DEFAULT '[]',
  user_responses JSONB DEFAULT '[]',
  llm_insights TEXT,
  retrospective_validation JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  context TEXT, -- what tab/view user was on
  is_accountability_redirect BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_quarter ON goals(quarter);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_anti_goals_user_id ON anti_goals(user_id);
CREATE INDEX idx_vibe_codes_user_id ON vibe_codes(user_id);
CREATE INDEX idx_vibe_codes_week ON vibe_codes(week_start_date);
CREATE INDEX idx_daily_check_ins_user_id ON daily_check_ins(user_id);
CREATE INDEX idx_daily_check_ins_date ON daily_check_ins(date);
CREATE INDEX idx_envy_logs_user_id ON envy_logs(user_id);
CREATE INDEX idx_envy_logs_category ON envy_logs(category_tag);
CREATE INDEX idx_backlog_items_user_id ON backlog_items(user_id);
CREATE INDEX idx_backlog_items_status ON backlog_items(status);
CREATE INDEX idx_reflections_user_id ON reflections(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE anti_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibe_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE envy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can only access their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own anti_goals" ON anti_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create anti_goals" ON anti_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own anti_goals" ON anti_goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vibe_codes" ON vibe_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create vibe_codes" ON vibe_codes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vibe_codes" ON vibe_codes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own check_ins" ON daily_check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create check_ins" ON daily_check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own envy_logs" ON envy_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create envy_logs" ON envy_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own backlog_items" ON backlog_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create backlog_items" ON backlog_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own backlog_items" ON backlog_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reflections" ON reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reflections" ON reflections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own chat_messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat_messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_backlog_items_updated_at BEFORE UPDATE ON backlog_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
