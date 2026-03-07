-- CricPro Extended Schema - Simplified Version (No Foreign Keys)
-- All ID fields are TEXT for flexibility
-- Run this in Supabase SQL Editor

-- ========== TOURNAMENTS ==========
DROP TABLE IF EXISTS tournaments;
CREATE TABLE tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  format TEXT DEFAULT 'T20',
  status TEXT DEFAULT 'upcoming',
  organizer_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== TOURNAMENT GROUPS ==========
DROP TABLE IF EXISTS tournament_groups;
CREATE TABLE tournament_groups (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  name TEXT NOT NULL,
  teams TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== LEADERBOARDS ==========
DROP TABLE IF EXISTS leaderboards;
CREATE TABLE leaderboards (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  group_id TEXT,
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
DROP TABLE IF EXISTS grounds;
CREATE TABLE grounds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  capacity INTEGER,
  pitch_type TEXT DEFAULT 'Grass',
  facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  contact_person TEXT,
  contact_phone TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== HEAD-TO-HEAD STATS ==========
DROP TABLE IF EXISTS head_to_head_stats;
CREATE TABLE head_to_head_stats (
  id TEXT PRIMARY KEY,
  team_a_id TEXT NOT NULL,
  team_b_id TEXT NOT NULL,
  matches_played INTEGER DEFAULT 0,
  team_a_wins INTEGER DEFAULT 0,
  team_b_wins INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,
  no_results INTEGER DEFAULT 0,
  team_a_run_rate DECIMAL(5,2),
  team_b_run_rate DECIMAL(5,2),
  updated_at TIMESTAMP DEFAULT now()
);

-- ========== PLAYER FORMAT STATS ==========
DROP TABLE IF EXISTS player_format_stats;
CREATE TABLE player_format_stats (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  format TEXT NOT NULL,
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
  updated_at TIMESTAMP DEFAULT now()
);

-- ========== MATCH COMMENTARY ==========
DROP TABLE IF EXISTS match_commentary;
CREATE TABLE match_commentary (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  over_number DECIMAL(4,1),
  comment_type TEXT DEFAULT 'general',
  description TEXT NOT NULL,
  runs_scored INTEGER DEFAULT 0,
  commentator_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== LIVE SCORE UPDATES ==========
DROP TABLE IF EXISTS live_score_updates;
CREATE TABLE live_score_updates (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  batting_team_id TEXT,
  current_score INTEGER DEFAULT 0,
  wickets_lost INTEGER DEFAULT 0,
  overs_bowled DECIMAL(4,1) DEFAULT 0,
  last_update TIMESTAMP DEFAULT now()
);

-- ========== NOTIFICATIONS ==========
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_match_id TEXT,
  related_team_id TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== NOTIFICATION PREFERENCES ==========
DROP TABLE IF EXISTS notification_preferences;
CREATE TABLE notification_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  match_reminders BOOLEAN DEFAULT TRUE,
  score_updates BOOLEAN DEFAULT TRUE,
  team_updates BOOLEAN DEFAULT TRUE,
  tournament_updates BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE
);

-- ========== FANTASY TEAMS ==========
DROP TABLE IF EXISTS fantasy_teams;
CREATE TABLE fantasy_teams (
  id TEXT PRIMARY KEY,
  creator_user_id TEXT NOT NULL,
  match_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  players_selected TEXT[] DEFAULT ARRAY[]::TEXT[],
  captain_id TEXT,
  vice_captain_id TEXT,
  total_points INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now()
);

-- ========== FANTASY PLAYER POINTS ==========
DROP TABLE IF EXISTS fantasy_player_points;
CREATE TABLE fantasy_player_points (
  id TEXT PRIMARY KEY,
  fantasy_team_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  match_id TEXT NOT NULL,
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
DROP TABLE IF EXISTS exported_reports;
CREATE TABLE exported_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  format TEXT DEFAULT 'pdf',
  file_url TEXT,
  entity_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== MATCH STREAMS ==========
DROP TABLE IF EXISTS match_streams;
CREATE TABLE match_streams (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL UNIQUE,
  stream_url TEXT,
  platform TEXT DEFAULT 'youtube',
  is_live BOOLEAN DEFAULT FALSE,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========== INDEXES FOR PERFORMANCE ==========
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_leaderboards_tournament ON leaderboards(tournament_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_team ON leaderboards(team_id);
CREATE INDEX IF NOT EXISTS idx_grounds_city ON grounds(city);
CREATE INDEX IF NOT EXISTS idx_commentary_match ON match_commentary(match_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_fantasy_teams_match ON fantasy_teams(match_id);
CREATE INDEX IF NOT EXISTS idx_fantasy_teams_user ON fantasy_teams(creator_user_id);
CREATE INDEX IF NOT EXISTS idx_fantasy_points_team ON fantasy_player_points(fantasy_team_id);
CREATE INDEX IF NOT EXISTS idx_live_score_match ON live_score_updates(match_id);

-- ✅ Script complete! All 12 new tables created.
