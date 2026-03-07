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
};
