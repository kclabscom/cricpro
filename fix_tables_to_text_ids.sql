-- Fix existing tables to accept TEXT IDs instead of UUID
-- Run this in Supabase SQL Editor

-- ========== FIX USERS TABLE ==========
ALTER TABLE users
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id SET DATA TYPE text;

-- ========== FIX TEAMS TABLE ==========
ALTER TABLE teams
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id SET DATA TYPE text;

-- ========== FIX PLAYERS TABLE ==========
ALTER TABLE players
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id SET DATA TYPE text;

-- ========== FIX MATCHES TABLE ==========
ALTER TABLE matches
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id SET DATA TYPE text;

-- ========== FIX GROUNDS TABLE ==========
ALTER TABLE grounds
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id SET DATA TYPE text;

-- ========== FIX TOURNAMENTS TABLE ==========
ALTER TABLE tournaments
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id SET DATA TYPE text;

-- ========== FIX INNINGS TABLE ==========
ALTER TABLE innings
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id SET DATA TYPE text;

-- ✅ All tables now accept TEXT IDs
-- This allows both UUID and custom string IDs like "mmgfo25eq46oy3lzwrk"
