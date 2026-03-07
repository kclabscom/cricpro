import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase credentials in .env.local file");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabaseClient = {
  // Auth
  async signUp(email, password, name, role = "player", plan = "free") {
    const { data, error } = await supabase.auth.signUpWithPassword({ email, password });
    if (error) throw error;
    
    // Create user profile
    await supabase.from("users").insert({
      id: data.user.id,
      name,
      email,
      password_hash: password,
      role,
      plan,
      joined_date: new Date().toISOString(),
    });
    
    return data.user;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  },

  // Users
  async getUsers() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data || [];
  },

  async getUserById(id) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  // Teams
  async getTeams() {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) throw error;
    return data || [];
  },

  async addTeam(team) {
    const { data, error } = await supabase.from("teams").insert(team).select().single();
    if (error) throw error;
    return data;
  },

  async updateTeam(id, updates) {
    const { data, error } = await supabase.from("teams").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteTeam(id) {
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) throw error;
  },

  // Players
  async getPlayers() {
    const { data, error } = await supabase.from("players").select("*");
    if (error) throw error;
    return data || [];
  },

  async addPlayer(player) {
    const { data, error } = await supabase.from("players").insert(player).select().single();
    if (error) throw error;
    return data;
  },

  async updatePlayer(id, updates) {
    const { data, error } = await supabase.from("players").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deletePlayer(id) {
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) throw error;
  },

  // Matches
  async getMatches() {
    const { data, error } = await supabase.from("matches").select("*");
    if (error) throw error;
    return data || [];
  },

  async addMatch(match) {
    const { data, error } = await supabase.from("matches").insert(match).select().single();
    if (error) throw error;
    return data;
  },

  async updateMatch(id, updates) {
    const { data, error } = await supabase.from("matches").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteMatch(id) {
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) throw error;
  },

  // Grounds
  async getGrounds() {
    const { data, error } = await supabase.from("grounds").select("*");
    if (error) throw error;
    return data || [];
  },

  async addGround(ground) {
    const { data, error } = await supabase.from("grounds").insert(ground).select().single();
    if (error) throw error;
    return data;
  },

  async updateGround(id, updates) {
    const { data, error } = await supabase.from("grounds").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteGround(id) {
    const { error } = await supabase.from("grounds").delete().eq("id", id);
    if (error) throw error;
  },

  // Tournaments
  async getTournaments() {
    const { data, error } = await supabase.from("tournaments").select("*");
    if (error) throw error;
    return data || [];
  },

  async addTournament(tournament) {
    const { data, error } = await supabase.from("tournaments").insert(tournament).select().single();
    if (error) throw error;
    return data;
  },

  async updateTournament(id, updates) {
    const { data, error } = await supabase.from("tournaments").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteTournament(id) {
    const { error } = await supabase.from("tournaments").delete().eq("id", id);
    if (error) throw error;
  },

  // Innings Data
  async getInningsData(playerId) {
    const { data, error } = await supabase.from("innings").select("*").eq("player_id", playerId).order("date", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addInnings(innings) {
    const { data, error } = await supabase.from("innings").insert(innings).select().single();
    if (error) throw error;
    return data;
  },

  async updateInnings(id, updates) {
    const { data, error } = await supabase.from("innings").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  // ========== TOURNAMENT GROUPS ==========
  async getTournamentGroups(tournamentId) {
    const { data, error } = await supabase.from("tournament_groups").select("*").eq("tournament_id", tournamentId);
    if (error) throw error;
    return data || [];
  },

  async addTournamentGroup(group) {
    const { data, error } = await supabase.from("tournament_groups").insert(group).select().single();
    if (error) throw error;
    return data;
  },

  async updateTournamentGroup(id, updates) {
    const { data, error } = await supabase.from("tournament_groups").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteTournamentGroup(id) {
    const { error } = await supabase.from("tournament_groups").delete().eq("id", id);
    if (error) throw error;
  },

  // ========== LEADERBOARDS ==========
  async getLeaderboards(tournamentId) {
    const { data, error } = await supabase.from("leaderboards").select("*").eq("tournament_id", tournamentId).order("points", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getLeaderboardsByGroup(groupId) {
    const { data, error } = await supabase.from("leaderboards").select("*").eq("group_id", groupId).order("points", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateLeaderboard(id, updates) {
    const { data, error } = await supabase.from("leaderboards").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async addLeaderboardEntry(entry) {
    const { data, error } = await supabase.from("leaderboards").insert(entry).select().single();
    if (error) throw error;
    return data;
  },

  // ========== GROUNDS/VENUES ==========
  async getGroundByCity(city) {
    const { data, error } = await supabase.from("grounds").select("*").eq("city", city);
    if (error) throw error;
    return data || [];
  },

  async searchGrounds(query) {
    const { data, error } = await supabase.from("grounds").select("*").ilike("name", `%${query}%`);
    if (error) throw error;
    return data || [];
  },

  // ========== HEAD-TO-HEAD STATISTICS ==========
  async getHeadToHeadStats(teamAId, teamBId) {
    const { data, error } = await supabase.from("head_to_head_stats").select("*")
      .or(`and(team_a_id.eq.${teamAId},team_b_id.eq.${teamBId}),and(team_a_id.eq.${teamBId},team_b_id.eq.${teamAId})`)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async updateHeadToHeadStats(teamAId, teamBId, updates) {
    const existing = await this.getHeadToHeadStats(teamAId, teamBId);
    
    if (!existing) {
      const { data, error } = await supabase.from("head_to_head_stats").insert({
        team_a_id: teamAId,
        team_b_id: teamBId,
        ...updates
      }).select().single();
      if (error) throw error;
      return data;
    }
    
    const { data, error } = await supabase.from("head_to_head_stats").update(updates).eq("id", existing.id).select().single();
    if (error) throw error;
    return data;
  },

  // ========== PLAYER FORMAT STATISTICS ==========
  async getPlayerFormatStats(playerId) {
    const { data, error } = await supabase.from("player_format_stats").select("*").eq("player_id", playerId);
    if (error) throw error;
    return data || [];
  },

  async getPlayerFormatStat(playerId, format) {
    const { data, error } = await supabase.from("player_format_stats").select("*").eq("player_id", playerId).eq("format", format).single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async updatePlayerFormatStats(playerId, format, updates) {
    const existing = await this.getPlayerFormatStat(playerId, format);
    
    if (!existing) {
      const { data, error } = await supabase.from("player_format_stats").insert({
        player_id: playerId,
        format,
        ...updates
      }).select().single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase.from("player_format_stats").update(updates).eq("id", existing.id).select().single();
    if (error) throw error;
    return data;
  },

  // ========== MATCH COMMENTARY ==========
  async getMatchCommentary(matchId) {
    const { data, error } = await supabase.from("match_commentary").select("*").eq("match_id", matchId).order("over_number", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async addCommentary(commentary) {
    const { data, error } = await supabase.from("match_commentary").insert(commentary).select().single();
    if (error) throw error;
    return data;
  },

  async deleteCommentary(id) {
    const { error } = await supabase.from("match_commentary").delete().eq("id", id);
    if (error) throw error;
  },

  // ========== LIVE SCORE UPDATES ==========
  async getLiveScore(matchId) {
    const { data, error } = await supabase.from("live_score_updates").select("*").eq("match_id", matchId).single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async updateLiveScore(matchId, updates) {
    const existing = await this.getLiveScore(matchId);
    
    if (!existing) {
      const { data, error } = await supabase.from("live_score_updates").insert({
        match_id: matchId,
        ...updates
      }).select().single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase.from("live_score_updates").update(updates).eq("match_id", matchId).select().single();
    if (error) throw error;
    return data;
  },

  // ========== NOTIFICATIONS ==========
  async getNotifications(userId) {
    const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
    if (error) throw error;
    return data || [];
  },

  async getUnreadNotifications(userId) {
    const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId).eq("is_read", false);
    if (error) throw error;
    return data || [];
  },

  async addNotification(notification) {
    const { data, error } = await supabase.from("notifications").insert(notification).select().single();
    if (error) throw error;
    return data;
  },

  async markNotificationAsRead(notificationId) {
    const { data, error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId).select().single();
    if (error) throw error;
    return data;
  },

  async getNotificationPreferences(userId) {
    const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", userId).single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async updateNotificationPreferences(userId, preferences) {
    const existing = await this.getNotificationPreferences(userId);
    
    if (!existing) {
      const { data, error } = await supabase.from("notification_preferences").insert({
        user_id: userId,
        ...preferences
      }).select().single();
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase.from("notification_preferences").update(preferences).eq("user_id", userId).select().single();
    if (error) throw error;
    return data;
  },

  // ========== FANTASY CRICKET ==========
  async getFantasyTeams(matchId) {
    const { data, error } = await supabase.from("fantasy_teams").select("*").eq("match_id", matchId);
    if (error) throw error;
    return data || [];
  },

  async getUserFantasyTeams(userId) {
    const { data, error } = await supabase.from("fantasy_teams").select("*").eq("creator_user_id", userId);
    if (error) throw error;
    return data || [];
  },

  async addFantasyTeam(team) {
    const { data, error } = await supabase.from("fantasy_teams").insert(team).select().single();
    if (error) throw error;
    return data;
  },

  async updateFantasyTeam(id, updates) {
    const { data, error } = await supabase.from("fantasy_teams").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteFantasyTeam(id) {
    const { error } = await supabase.from("fantasy_teams").delete().eq("id", id);
    if (error) throw error;
  },

  async getFantasyPlayerPoints(fantasyTeamId) {
    const { data, error } = await supabase.from("fantasy_player_points").select("*").eq("fantasy_team_id", fantasyTeamId);
    if (error) throw error;
    return data || [];
  },

  async addFantasyPlayerPoints(points) {
    const { data, error } = await supabase.from("fantasy_player_points").insert(points).select().single();
    if (error) throw error;
    return data;
  },

  async updateFantasyPlayerPoints(id, updates) {
    const { data, error } = await supabase.from("fantasy_player_points").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  // ========== EXPORTED REPORTS ==========
  async getExportedReports(userId) {
    const { data, error } = await supabase.from("exported_reports").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addExportedReport(report) {
    const { data, error } = await supabase.from("exported_reports").insert(report).select().single();
    if (error) throw error;
    return data;
  },

  async deleteExportedReport(id) {
    const { error } = await supabase.from("exported_reports").delete().eq("id", id);
    if (error) throw error;
  },

  // ========== MATCH STREAMS ==========
  async getMatchStream(matchId) {
    const { data, error } = await supabase.from("match_streams").select("*").eq("match_id", matchId).single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async addMatchStream(stream) {
    const { data, error } = await supabase.from("match_streams").insert(stream).select().single();
    if (error) throw error;
    return data;
  },

  async updateMatchStream(matchId, updates) {
    const { data, error } = await supabase.from("match_streams").update(updates).eq("match_id", matchId).select().single();
    if (error) throw error;
    return data;
  },

  async deleteMatchStream(matchId) {
    const { error } = await supabase.from("match_streams").delete().eq("match_id", matchId);
    if (error) throw error;
  },
};
