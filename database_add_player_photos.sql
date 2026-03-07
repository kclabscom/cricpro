-- Add Profile Picture Support to Players Table

-- Add profile_picture column to store image URL or base64 data
ALTER TABLE players ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Index for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_players_profile_picture ON players(profile_picture) WHERE profile_picture IS NOT NULL;

-- Update existing players with a placeholder (optional)
-- UPDATE players SET profile_picture = NULL WHERE profile_picture IS NULL;
