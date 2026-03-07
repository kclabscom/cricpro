-- CricPro Database Schema for Supabase
-- Copy and paste these statements into Supabase SQL Editor

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'player',
  plan TEXT DEFAULT 'free',
  team TEXT,
  phone TEXT,
  city TEXT,
  bio TEXT,
  joined_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  short TEXT,
  color TEXT,
  captain TEXT,
  players INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  logo TEXT,
  city TEXT,
  founded TEXT,
  home_ground TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team TEXT,
  role TEXT,
  matches INTEGER DEFAULT 0,
  runs INTEGER DEFAULT 0,
  avg DECIMAL,
  sr DECIMAL,
  wickets INTEGER DEFAULT 0,
  economy DECIMAL,
  catches INTEGER DEFAULT 0,
  fifties INTEGER DEFAULT 0,
  hundreds INTEGER DEFAULT 0,
  hs INTEGER,
  ducks INTEGER DEFAULT 0,
  balls_faced INTEGER DEFAULT 0,
  fours INTEGER DEFAULT 0,
  sixes INTEGER DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  date TEXT,
  time TEXT,
  ground TEXT,
  format TEXT,
  status TEXT,
  score1 TEXT,
  overs1 TEXT,
  score2 TEXT,
  overs2 TEXT,
  winner TEXT,
  tournament TEXT,
  toss TEXT,
  mom TEXT,
  notes TEXT,
  innings INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE grounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  capacity INTEGER,
  pitch_type TEXT,
  floodlights BOOLEAN DEFAULT false,
  status TEXT,
  facilities TEXT[],
  contact TEXT,
  next_booked TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  format TEXT,
  teams INTEGER,
  start_date TEXT,
  end_date TEXT,
  status TEXT,
  registered TEXT[],
  created_by TEXT,
  prize TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE innings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID,
  match_id TEXT,
  match_name TEXT,
  date TEXT,
  opponent TEXT,
  runs INTEGER,
  balls INTEGER,
  fours INTEGER,
  sixes INTEGER,
  sr DECIMAL,
  out TEXT,
  bowler TEXT,
  ground TEXT,
  wickets INTEGER,
  runs_conceded INTEGER,
  overs_bowled INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
