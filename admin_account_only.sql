-- CricPro: Create Admin Account Only
-- No sample data, just the admin user for app control

INSERT INTO users (id, name, email, password_hash, role, plan, team, phone, city, bio, joined_date) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Administrator', 'admin@cricpro.com', 'admin123', 'admin', 'pro', NULL, '', '', 'CricPro Super Admin - Full app control', NOW());
