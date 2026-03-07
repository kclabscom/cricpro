# Supabase Integration Setup Guide

## Overview
CricPro is now connected to **Supabase** for backend database storage. All data is stored in Supabase PostgreSQL database instead of browser localStorage.

## Quick Start

### 1. Environment Variables
Credentials are stored in `.env.local` (NOT in version control):
```
VITE_SUPABASE_URL=https://mwslgbimziexlbgagxag.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** The `.env.local` file is in `.gitignore` for security. Never commit it to version control.

---

## Database Schema

Your Supabase project should have these tables:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'player', -- admin, organizer, scorer, player, viewer
  plan TEXT DEFAULT 'free', -- free or pro
  team TEXT,
  phone TEXT,
  city TEXT,
  bio TEXT,
  joined_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Teams Table
```sql
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
```

### Players Table
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team TEXT,
  role TEXT, -- Batsman, Bowler, All-rounder, WK-Batsman
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
```

### Matches Table
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  date TEXT,
  time TEXT,
  ground TEXT,
  format TEXT, -- T20, ODI, etc
  status TEXT, -- upcoming, live, completed
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
```

### Grounds Table
```sql
CREATE TABLE grounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  capacity INTEGER,
  pitch_type TEXT,
  floodlights BOOLEAN DEFAULT false,
  status TEXT, -- Available, Booked, Maintenance
  facilities TEXT[],
  contact TEXT,
  next_booked TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tournaments Table
```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  format TEXT, -- T20, ODI, etc
  teams INTEGER,
  start_date TEXT,
  end_date TEXT,
  status TEXT, -- Upcoming, Ongoing, Completed
  registered TEXT[],
  created_by TEXT,
  prize TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Innings Table (for player statistics drill-down)
```sql
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
```

---

## How It Works

### Data Loading
1. On app startup, `useEffect` fetches all data from Supabase
2. Data is stored in React state
3. Database operations update both state and Supabase database

### Real-time Sync (Optional)
To enable real-time updates across browser tabs:
```javascript
// In supabaseClient.js
supabase
  .on("postgres_changes", { event: "*", schema: "public", table: "matches" },
    (payload) => {
      // Update local state when database changes
    })
  .subscribe();
```

---

## Debugging

### Console Commands
Access data in browser console:
```javascript
// View all data
cricproDB()

// Example output shows users, teams, players, matches, etc.
```

---

## Authentication (Future Enhancement)
Currently using email/password with local storage. For production, consider:
- Supabase Auth with Email/Password
- Google/GitHub OAuth
- Row-Level Security (RLS) policies

---

## Environment Setup

### Local Development
1. Create `.env.local` with Supabase credentials
2. Run `npm install`
3. Run `npm run dev`

### Production
1. Set environment variables in your hosting platform
2. Ensure `.env.local` is not committed to version control
3. Use strong Row-Level Security (RLS) policies in Supabase

---

## Common Issues

### "Missing Supabase credentials"
- Check `.env.local` exists in root directory
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Data not loading
- Open browser DevTools → Console
- Type `cricproDB()` to check data
- Check Supabase dashboard for table data

### Connection errors
- Verify Supabase project is active
- Check API credentials are correct
- Ensure tables exist in database

---

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Create database tables (run SQL above)
3. ✅ Add credentials to `.env.local`
4. ✅ Test data loading with `cricproDB()`
5. (Optional) Enable real-time subscriptions
6. (Optional) Configure Row-Level Security for multi-user safety
7. (Optional) Set up Supabase Auth for email verification
