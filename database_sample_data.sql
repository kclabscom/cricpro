-- Option 1: DROP & RECREATE (if you want to start fresh)
-- Uncomment and run this section to reset everything

/*
DROP TABLE IF EXISTS innings;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS grounds;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS users;
*/

-- Option 2: INSERT SAMPLE DATA (run this after tables exist)

INSERT INTO users (id, name, email, password_hash, role, plan, team, joined_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin User', 'admin@cricpro.com', 'admin123', 'admin', 'pro', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Raj Organizer', 'raj@cricpro.com', 'raj123', 'organizer', 'pro', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Virat Kumar', 'virat@cricpro.com', 'virat123', 'player', 'free', 'Royal Challengers', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Rohit Singh', 'rohit@cricpro.com', 'rohit123', 'player', 'pro', 'Mumbai Kings', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Fan Viewer', 'fan@cricpro.com', 'fan123', 'viewer', 'free', NULL, NOW());

INSERT INTO teams (id, name, short, color, captain, players, wins, losses, logo, city, founded, home_ground) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Royal Challengers', 'RCB', '#e83b3b', 'Virat Kumar', 15, 8, 3, '🔴', 'Bangalore', '2020', 'Eden Gardens Arena'),
('650e8400-e29b-41d4-a716-446655440002', 'Mumbai Kings', 'MKG', '#1e90ff', 'Rohit Singh', 14, 7, 4, '🔵', 'Mumbai', '2019', 'Wankhede Local'),
('650e8400-e29b-41d4-a716-446655440003', 'Sunrisers FC', 'SFC', '#ff9900', 'David Warner Jr.', 13, 6, 5, '🟡', 'Hyderabad', '2021', 'Chepauk Ground'),
('650e8400-e29b-41d4-a716-446655440004', 'Chennai Lions', 'CHL', '#f7c900', 'MS Dhoni Jr.', 15, 9, 2, '🟡', 'Chennai', '2018', 'Chinnaswamy Mini');

INSERT INTO players (id, name, team, role, matches, runs, avg, sr, wickets, economy, catches, fifties, hundreds, hs, ducks, balls_faced, fours, sixes, bio) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Virat Kumar', 'Royal Challengers', 'Batsman', 22, 780, 46.2, 142.1, 0, 0, 8, 6, 2, 134, 1, 548, 82, 24, 'Aggressive right-hand batsman and captain of Royal Challengers.'),
('750e8400-e29b-41d4-a716-446655440002', 'Rohit Singh', 'Mumbai Kings', 'Batsman', 20, 650, 38.5, 135.4, 0, 0, 6, 5, 1, 118, 2, 480, 70, 18, 'Elegant opener known for big scores.'),
('750e8400-e29b-41d4-a716-446655440003', 'Jasprit Bhai', 'Royal Challengers', 'Bowler', 22, 45, 8.1, 90.5, 28, 7.2, 5, 0, 0, 18, 5, 50, 3, 1, 'Express pace bowler, death-over specialist.'),
('750e8400-e29b-41d4-a716-446655440004', 'MS Dhoni Jr.', 'Chennai Lions', 'WK-Batsman', 25, 620, 52.0, 148.2, 0, 0, 22, 4, 1, 95, 0, 418, 55, 28, 'Wicket-keeper batsman, cool-headed finisher.'),
('750e8400-e29b-41d4-a716-446655440005', 'Ravindra Jadav', 'Chennai Lions', 'All-rounder', 20, 340, 28.3, 145.6, 18, 7.8, 10, 2, 0, 76, 2, 234, 30, 12, 'Crafty left-arm spinner and capable batsman.');

INSERT INTO grounds (id, name, city, capacity, pitch_type, floodlights, status, contact, next_booked) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Eden Gardens Arena', 'Kolkata', 5000, 'Batting', true, 'Available', '9800001111', NULL),
('850e8400-e29b-41d4-a716-446655440002', 'Chinnaswamy Mini', 'Bangalore', 2000, 'Balanced', true, 'Booked', '9800002222', '2026-03-05'),
('850e8400-e29b-41d4-a716-446655440003', 'Wankhede Local', 'Mumbai', 3000, 'Pace', false, 'Available', '9800003333', NULL),
('850e8400-e29b-41d4-a716-446655440004', 'Chepauk Ground', 'Chennai', 2500, 'Spin', true, 'Maintenance', '9800004444', NULL);

INSERT INTO tournaments (id, name, format, teams, start_date, end_date, status, registered, created_by, prize, description) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'City T20 Premier 2026', 'T20', 8, '2026-03-01', '2026-04-15', 'Ongoing', ARRAY['Royal Challengers', 'Mumbai Kings', 'Sunrisers FC', 'Chennai Lions'], '550e8400-e29b-41d4-a716-446655440002', '₹50,000', 'Premier city-level T20 tournament'),
('950e8400-e29b-41d4-a716-446655440002', 'Club Cricket Championship', 'ODI', 16, '2026-05-01', '2026-07-01', 'Upcoming', ARRAY['Royal Challengers', 'Chennai Lions'], '550e8400-e29b-41d4-a716-446655440002', '₹1,00,000', 'Annual 50-over club championship');

INSERT INTO matches (id, team1, team2, date, time, ground, format, status, score1, overs1, score2, overs2, winner, tournament, toss, mom, notes) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Royal Challengers', 'Mumbai Kings', '2026-02-28', '19:00', 'Eden Gardens Arena', 'T20', 'live', '142/4', '15.2', '98/3', '12.0', NULL, 'City T20 Premier 2026', 'Royal Challengers won toss', NULL, 'Exciting chase underway'),
('a50e8400-e29b-41d4-a716-446655440002', 'Chennai Lions', 'Sunrisers FC', '2026-02-27', '14:00', 'Chinnaswamy Mini', 'T20', 'completed', '186/4', '20.0', '179/8', '20.0', 'Chennai Lions', 'City T20 Premier 2026', 'Chennai Lions won toss', 'MS Dhoni Jr.', 'Thriller — Chennai won by 7 runs'),
('a50e8400-e29b-41d4-a716-446655440003', 'Mumbai Kings', 'Sunrisers FC', '2026-03-02', '18:30', 'Wankhede Local', 'T20', 'upcoming', NULL, NULL, NULL, NULL, NULL, 'City T20 Premier 2026', NULL, NULL, NULL),
('a50e8400-e29b-41d4-a716-446655440004', 'Royal Challengers', 'Chennai Lions', '2026-03-04', '19:30', 'Eden Gardens Arena', 'T20', 'upcoming', NULL, NULL, NULL, NULL, NULL, 'City T20 Premier 2026', NULL, NULL, NULL);

INSERT INTO innings (id, player_id, match_id, match_name, date, opponent, runs, balls, fours, sixes, sr, out, bowler, ground) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'RCB vs MKG', '2026-02-10', 'Mumbai Kings', 87, 52, 9, 3, 167.3, 'Caught', 'Bumrah Jr.', 'Eden Gardens'),
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'RCB vs SFC', '2026-02-03', 'Sunrisers FC', 134, 89, 14, 6, 150.6, 'Not Out', '-', 'Wankhede Local'),
('b50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'RCB vs CHL', '2026-01-28', 'Chennai Lions', 23, 18, 3, 0, 127.8, 'Bowled', 'Ravindra Jadav', 'Chinnaswamy Mini'),
('b50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'MKG vs RCB', '2026-02-10', 'Royal Challengers', 52, 40, 6, 1, 130, 'Caught', 'Jasprit Bhai', 'Eden Gardens'),
('b50e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'MKG vs SFC', '2026-02-03', 'Sunrisers FC', 118, 82, 12, 4, 143.9, 'Not Out', '-', 'Wankhede Local');
