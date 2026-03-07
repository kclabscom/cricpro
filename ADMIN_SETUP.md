# CricPro Admin Account Setup

## Overview
This setup creates only an **admin account** with full control over the entire CricPro application. No sample data is included.

---

## Quick Setup

### Step 1: Run SQL to Create Admin User
1. Open [admin_account_only.sql](admin_account_only.sql)
2. Copy the SQL statement
3. Go to **Supabase Dashboard** → **SQL Editor** → **New Query**
4. Paste the SQL
5. Click **RUN**

### Step 2: Login with Admin Account
1. Start your app: `npm run dev`
2. Open: http://localhost:5173
3. Click **Sign In**
4. Enter credentials:
   - **Email:** `admin@cricpro.com`
   - **Password:** `admin123`
5. Click **Sign In →**
6. You should see the empty dashboard

---

## Admin Account Details

| Field | Value |
|-------|-------|
| **Name** | Administrator |
| **Email** | admin@cricpro.com |
| **Password** | admin123 |
| **Role** | admin |
| **Plan** | pro |
| **Status** | Full App Control |

---

## Admin Permissions

As an admin, you can:

✅ **User Management**
- Create new users (teams, players)
- Edit any user profile
- Delete users
- Assign roles (player, scorer, organizer, viewer)

✅ **Team Management**
- Create teams
- Edit teams
- Delete teams
- Add/remove players from teams

✅ **Player Management**
- Create player profiles
- Edit player stats
- Delete players
- View all player data

✅ **Match Management**
- Create matches
- Update match scores
- Record live scoring
- Close/complete matches

✅ **Ground Management**
- Create new grounds
- Edit ground details
- Delete grounds
- Manage bookings

✅ **Tournament Management**
- Create tournaments
- Register teams
- Update tournament status
- Delete tournaments

✅ **Admin Panel**
- View system statistics
- Manage all data
- Full database access

---

## Start Building Your Data

### Option 1: Manual Entry (Recommended)
1. Login as admin
2. Go to **Teams** → Add Team
3. Go to **Players** → Add Player
4. Go to **Matches** → Create Match
5. etc.

### Option 2: Import Data Later
Once you have sample or production data, you can:
1. Create a SQL file with your data
2. Run it in Supabase SQL Editor
3. Data immediately appears in the app

### Option 3: Use API
Build an import tool or API that inserts data directly to Supabase tables.

---

## Change Admin Password

If you want to change the admin password:

```sql
UPDATE users 
SET password_hash = 'your_new_password' 
WHERE email = 'admin@cricpro.com';
```

Then login with the new password.

---

## Create Additional Admins

To create more admin users:

```sql
INSERT INTO users (id, name, email, password_hash, role, plan, joined_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Second Admin', 'admin2@cricpro.com', 'password123', 'admin', 'pro', NOW());
```

---

## Important Notes

⚠️ **Security:**
- Admin password is in plain text in this SQL (OK for development)
- For production, use Supabase Auth with password hashing
- Enable Row-Level Security (RLS) policies
- Change default password immediately

⚠️ **Data:**
- Database starts empty (no sample data)
- You build your data through the app UI
- Or import via SQL/API

⚠️ **Testing:**
- Create test users through the app
- Assign different roles (player, scorer, organizer)
- Test all features with different user roles

---

## Next Steps

1. ✅ Run `admin_account_only.sql` to create admin
2. ✅ Login with admin@cricpro.com / admin123
3. ✅ Start adding your teams, players, matches
4. ✅ Create other users (players, scorers, organizers)
5. ✅ Test all features
6. ✅ Deploy to production

---

## Quick Start Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Then open http://localhost:5173 and login!
