-- Extended Database Schema for CricPro with Advanced Features
-- Run this after the basic setup to add Tournaments, Grounds, Stats, Notifications, Fantasy Cricket, etc.

-- ========== TOURNAMENTS & LEAGUES ==========
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  format TEXT DEFAULT 'T20' CHECK (format IN ('Test', 'ODI', 'T20', 'T10', 'Custom')),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Tournament groups for league-based tournaments
CREATE TABLE IF NOT EXISTS tournament_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  teams UUID[] DEFAULT ARRAY[]::UUID[],
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Leaderboard standings
CREATE TABLE IF NOT EXISTS leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  group_id UUID REFERENCES tournament_groups(id) ON DELETE SET NULL,
  matches_played INTEGER DEFAULT 0,
  matches_won INTEGER DEFAULT 0,
  matches_lost INTEGER DEFAULT 0,
  matches_tied INTEGER DEFAULT 0,
  matches_no_result INTEGER DEFAULT 0,
  runs_for INTEGER DEFAULT 0,
  runs_against INTEGER DEFAULT 0,
  run_rate DECIMAL(5,2),
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT now()
);

-- ========== GROUNDS/VENUES ==========
CREATE TABLE IF NOT EXISTS grounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  capacity INTEGER,
  pitch_type TEXT DEFAULT 'Grass' CHECK (pitch_type IN ('Grass', 'Artificial', 'Concrete', 'Synthetic')),
  facilities TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['FloodLights', 'Hospitality', 'Parking']
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  contact_person TEXT,
  contact_phone TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== STATISTICS & ANALYTICS ==========
-- Head-to-head team statistics
CREATE TABLE IF NOT EXISTS head_to_head_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_a_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  team_b_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  matches_played INTEGER DEFAULT 0,
  team_a_wins INTEGER DEFAULT 0,
  team_b_wins INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,
  no_results INTEGER DEFAULT 0,
  team_a_run_rate DECIMAL(5,2),
  team_b_run_rate DECIMAL(5,2),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(team_a_id, team_b_id)
);

-- Player format-specific career statistics
CREATE TABLE IF NOT EXISTS player_format_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  format TEXT NOT NULL CHECK (format IN ('Test', 'ODI', 'T20', 'T10', 'Domestic')),
  matches_played INTEGER DEFAULT 0,
  innings_played INTEGER DEFAULT 0,
  runs_scored INTEGER DEFAULT 0,
  highest_score INTEGER DEFAULT 0,
  average DECIMAL(6,2),
  strike_rate DECIMAL(6,2),
  centuries INTEGER DEFAULT 0,
  half_centuries INTEGER DEFAULT 0,
  wickets_taken INTEGER DEFAULT 0,
  bowling_average DECIMAL(6,2),
  economy_rate DECIMAL(5,2),
  five_wickets INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(player_id, format)
);

-- ========== COMMENTARY & REAL-TIME UPDATES ==========
CREATE TABLE IF NOT EXISTS match_commentary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  over_number DECIMAL(4,1),
  comment_type TEXT DEFAULT 'general' CHECK (comment_type IN ('general', 'wicket', 'boundary', 'milestone', 'alert')),
  description TEXT NOT NULL,
  runs_scored INTEGER DEFAULT 0,
  commentator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Live scoring dashboard snapshots
CREATE TABLE IF NOT EXISTS live_score_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  batting_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  current_score INTEGER DEFAULT 0,
  wickets_lost INTEGER DEFAULT 0,
  overs_bowled DECIMAL(4,1) DEFAULT 0,
  last_update TIMESTAMP DEFAULT now()
);

-- ========== NOTIFICATIONS & ALERTS ==========
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('match_reminder', 'score_update', 'team_update', 'tournament_update', 'comment_notification', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  related_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- User notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  match_reminders BOOLEAN DEFAULT TRUE,
  score_updates BOOLEAN DEFAULT TRUE,
  team_updates BOOLEAN DEFAULT TRUE,
  tournament_updates BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE
);

-- ========== FANTASY CRICKET ==========
CREATE TABLE IF NOT EXISTS fantasy_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  players_selected UUID[] DEFAULT ARRAY[]::UUID[], -- Array of player IDs
  captain_id UUID REFERENCES players(id) ON DELETE SET NULL,
  vice_captain_id UUID REFERENCES players(id) ON DELETE SET NULL,
  total_points INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'locked', 'completed')),
  created_at TIMESTAMP DEFAULT now()
);

-- Fantasy points record per player per match
CREATE TABLE IF NOT EXISTS fantasy_player_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fantasy_team_id UUID NOT NULL REFERENCES fantasy_teams(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  base_points INTEGER DEFAULT 0,
  runs_points DECIMAL(6,2) DEFAULT 0,
  wickets_points DECIMAL(6,2) DEFAULT 0,
  catch_points DECIMAL(6,2) DEFAULT 0,
  other_points DECIMAL(6,2) DEFAULT 0,
  total_points DECIMAL(8,2) DEFAULT 0,
  captain_multiplier DECIMAL(2,1) DEFAULT 1.0,
  final_points DECIMAL(8,2),
  updated_at TIMESTAMP DEFAULT now()
);

-- ========== EXPORTED REPORTS ==========
CREATE TABLE IF NOT EXISTS exported_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('player_stats', 'team_stats', 'tournament_summary', 'match_scorecard', 'leaderboard', 'custom')),
  title TEXT NOT NULL,
  format TEXT DEFAULT 'pdf' CHECK (format IN ('pdf', 'xlsx', 'csv')),
  file_url TEXT,
  entity_id UUID, -- Can reference match, player, team, or tournament
  created_at TIMESTAMP DEFAULT now()
);

-- ========== STREAMING & COMMENTARY LINKS ==========
CREATE TABLE IF NOT EXISTS match_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  stream_url TEXT,
  platform TEXT DEFAULT 'youtube' CHECK (platform IN ('youtube', 'twitch', 'custom', 'facebook')),
  is_live BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== INDEXES FOR PERFORMANCE ==========
CREATE INDEX idx_tournaments_organizer ON tournaments(organizer_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_leaderboards_tournament ON leaderboards(tournament_id);
CREATE INDEX idx_leaderboards_team ON leaderboards(team_id);
CREATE INDEX idx_grounds_city ON grounds(city);
CREATE INDEX idx_head_to_head_teams ON head_to_head_stats(team_a_id, team_b_id);
CREATE INDEX idx_player_format_stats_player ON player_format_stats(player_id);
CREATE INDEX idx_commentary_match ON match_commentary(match_id);
CREATE INDEX idx_commentary_time ON match_commentary(created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_fantasy_teams_match ON fantasy_teams(match_id);
CREATE INDEX idx_fantasy_teams_user ON fantasy_teams(creator_user_id);
CREATE INDEX idx_fantasy_points_fantasy_team ON fantasy_player_points(fantasy_team_id);
CREATE INDEX idx_live_score_match ON live_score_updates(match_id);
