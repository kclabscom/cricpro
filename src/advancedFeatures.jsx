import React from "react";

// Advanced Cricket App Features Components
// Tournaments, Grounds, Statistics, Notifications, Fantasy Cricket, Exports, etc.

// ════════════════════════════════════════════════════════════════════════════════════
// ║ TOURNAMENTS & LEAGUES PAGE
// ════════════════════════════════════════════════════════════════════════════════════
export function TournamentsPage({ tournaments, teams, matches, currentUser, canEditTournament, onAddTournament, DB, notify, uid, fmtDate }) {
  const [expandedTournament, setExpandedTournament] = React.useState(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", format: "T20", status: "upcoming" });

  const leaderboardForTournament = (tournamentId) => {
    const tMatches = matches.filter(m => m.tournament_id === tournamentId);
    const standings = {};
    
    teams.forEach(team => {
      standings[team.id] = { team, played: 0, won: 0, lost: 0, points: 0, for: 0, against: 0 };
    });

    tMatches.forEach(m => {
      const t1 = standings[m.team1_id];
      const t2 = standings[m.team2_id];
      if (!t1 || !t2) return;
      
      t1.played++; t2.played++;
      if (m.winner_id === m.team1_id) { t1.won++; t1.points += 2; t2.lost++; }
      else if (m.winner_id === m.team2_id) { t2.won++; t2.points += 2; t1.lost++; }
      else { t1.points++; t2.points++; } // Tie

      t1.for += m.score1 || 0; t1.against += m.score2 || 0;
      t2.for += m.score2 || 0; t2.against += m.score1 || 0;
    });

    return Object.values(standings).sort((a, b) => b.points - a.points);
  };

  return (
    <div className="fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="section-title">TOURNAMENTS & LEAGUES</h1>
        {canEditTournament && <button className="btn-primary" onClick={() => setShowAddForm(true)}>+ New Tournament</button>}
      </div>

      {showAddForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20, background: "#111827" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input placeholder="Tournament Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <select value={formData.format} onChange={(e) => setFormData({ ...formData, format: e.target.value })}>
              <option>T20</option><option>ODI</option><option>Test</option>
            </select>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={() => { onAddTournament(formData); setShowAddForm(false); setFormData({ name: "", format: "T20", status: "upcoming" }); }}>Create</button>
            <button className="btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {tournaments.map(tournament => {
        const isExpanded = expandedTournament === tournament.id;
        const leaderboard = leaderboardForTournament(tournament.id);
        const tMatches = matches.filter(m => m.tournament_id === tournament.id);

        return (
          <div key={tournament.id} className="card" style={{ marginBottom: 16, padding: 20 }}>
            <div onClick={() => setExpandedTournament(isExpanded ? null : tournament.id)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 1 }}>{tournament.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, display: "flex", gap: 12 }}>
                    <span>🏆 {tournament.format}</span>
                    <span className={`tag ${tournament.status === "ongoing" ? "tag-red" : tournament.status === "completed" ? "tag-green" : "tag-blue"}`}>{tournament.status.toUpperCase()}</span>
                    <span>📅 {tMatches.length} matches</span>
                  </div>
                </div>
                <span style={{ fontSize: 24 }}>{isExpanded ? "▼" : "▶"}</span>
              </div>
            </div>

            {isExpanded && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #1a2035" }}>
                <div className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>LEADERBOARD</div>
                <table style={{ marginBottom: 20, width: "100%" }}>
                  <thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>L</th><th>Points</th><th>NRR</th></tr></thead>
                  <tbody>
                    {leaderboard.slice(0, 5).map((entry, i) => (
                      <tr key={entry.team.id}>
                        <td style={{ color: i === 0 ? "#f59e0b" : "#4b5563", fontFamily: "'Bebas Neue'", fontSize: 16 }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{entry.team.name}</td>
                        <td>{entry.played}</td>
                        <td style={{ color: "#00e5a0" }}>{entry.won}</td>
                        <td style={{ color: "#ff6b6b" }}>{entry.lost}</td>
                        <td style={{ color: "#f59e0b", fontWeight: 700 }}>{entry.points}</td>
                        <td style={{ fontFamily: "'JetBrains Mono'" }}>{((entry.for - entry.against) / Math.max(entry.played, 1)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>RECENT MATCHES</div>
                {tMatches.slice(-3).map(m => (
                  <div key={m.id} style={{ padding: "8px 0", borderBottom: "1px solid #0f1623", fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 600 }}>{m.team1} vs {m.team2}</span>
                      <span className="tag" style={{ fontSize: 10 }}>{m.status.toUpperCase()}</span>
                    </div>
                    {m.score1 && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{m.score1} • {m.score2}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════════
// ║ GROUNDS/VENUES PAGE
// ════════════════════════════════════════════════════════════════════════════════════
export function GroundsPage({ grounds, matches, currentUser, canEditGround, onAddGround, notify, uid, fmtDate }) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [filterCity, setFilterCity] = React.useState("All");
  const [formData, setFormData] = React.useState({ name: "", city: "", capacity: "", pitch_type: "Grass", facilities: [] });

  const cities = [...new Set(grounds.map(g => g.city || "Unknown"))];
  const filteredGrounds = filterCity === "All" ? grounds : grounds.filter(g => g.city === filterCity);
  const groundMatches = (groundId) => matches.filter(m => m.ground_id === groundId).length;

  const facilityEmojis = { FloodLights: "💡", Hospitality: "🏨", Parking: "🅿️", WiFi: "📶", Restaurant: "🍽️" };

  return (
    <div className="fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="section-title">GROUNDS & VENUES</h1>
        {canEditGround && <button className="btn-primary" onClick={() => setShowAddForm(true)}>+ Add Ground</button>}
      </div>

      {showAddForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <input placeholder="Ground Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            <input placeholder="Capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
            <select value={formData.pitch_type} onChange={(e) => setFormData({ ...formData, pitch_type: e.target.value })}>
              <option>Grass</option><option>Artificial</option><option>Concrete</option><option>Synthetic</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={() => { onAddGround(formData); setShowAddForm(false); setFormData({ name: "", city: "", capacity: "", pitch_type: "Grass", facilities: [] }); }}>Add</button>
            <button className="btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", ...cities].map(city => (
          <button key={city} className={filterCity === city ? "btn-primary" : "btn-ghost"} onClick={() => setFilterCity(city)} style={{ fontSize: 12 }}>
            {city} ({grounds.filter(g => city === "All" ? true : g.city === city).length})
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {filteredGrounds.map(ground => (
          <div key={ground.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 1 }}>{ground.name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, display: "flex", gap: 12 }}>
                  <span>📍 {ground.city}</span>
                  <span>🏟️ {ground.capacity || "N/A"}</span>
                </div>
              </div>
              <span style={{ fontSize: 20 }}>🌿</span>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #0f1623" }}>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>Pitch: <b>{ground.pitch_type}</b></div>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                {(ground.facilities || []).map(f => <span key={f} className="tag tag-blue" style={{ fontSize: 10 }}>{facilityEmojis[f] || "⭐"} {f}</span>)}
              </div>
              <div style={{ fontSize: 12, color: "#00e5a0", fontWeight: 600 }}>📊 {groundMatches(ground.id)} matches hosted</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════════
// ║ ADVANCED STATISTICS PAGE
// ════════════════════════════════════════════════════════════════════════════════════
export function StatisticsPage({ players, teams, matches, currentUser, canViewStats, isPro, onUpgrade, uid, fmtDate, LineChart, BarChart }) {
  const [selectedFormat, setSelectedFormat] = React.useState("All");
  const [selectedTeam, setSelectedTeam] = React.useState("All");

  const getFormatStats = (format) => {
    return players
      .filter(p => selectedTeam === "All" || p.team === selectedTeam)
      .sort((a, b) => (format === "batting" ? b.runs - a.runs : b.wickets - a.wickets))
      .slice(0, 10);
  };

  const teamComparison = () => {
    return teams.map(t => ({
      team: t.name,
      wins: t.wins,
      losses: t.losses,
      runs: players.filter(p => p.team === t.name).reduce((sum, p) => sum + p.runs, 0),
      wickets: players.filter(p => p.team === t.name).reduce((sum, p) => sum + p.wickets, 0),
    })).sort((a, b) => b.wins - a.wins).slice(0, 8);
  };

  return (
    <div className="fadeIn">
      <h1 className="section-title" style={{ marginBottom: 24 }}>ADVANCED STATISTICS</h1>

      {!isPro && (
        <div className="pro-banner" style={{ marginBottom: 20 }}>
          <div>🔒 Advanced stats require Pro upgrade</div>
          <button className="btn-pro" onClick={onUpgrade} style={{ fontSize: 12 }}>Upgrade Now</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { title: "Top Batsman", stat: getFormatStats("batting")[0]?.name || "N/A", value: getFormatStats("batting")[0]?.runs || 0, unit: "runs" },
          { title: "Top Bowler", stat: getFormatStats("bowling")[0]?.name || "N/A", value: getFormatStats("bowling")[0]?.wickets || 0, unit: "wickets" },
          { title: "Highest Strike Rate", stat: players.sort((a, b) => b.sr - a.sr)[0]?.name || "N/A", value: players.sort((a, b) => b.sr - a.sr)[0]?.sr || 0, unit: "%" },
          { title: "Best Economy", stat: players.filter(p => p.wickets > 0).sort((a, b) => (a.economy || 100) - (b.economy || 100))[0]?.name || "N/A", value: players.filter(p => p.wickets > 0).sort((a, b) => (a.economy || 100) - (b.economy || 100))[0]?.economy || 0, unit: "eco" },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 1, marginBottom: 8 }}>{stat.title}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{stat.stat}</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: "#00e5a0" }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{stat.unit}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>TOP 10 BATSMEN</div>
          <table style={{ fontSize: 12 }}>
            <thead><tr><th>#</th><th>Player</th><th>Runs</th><th>Avg</th><th>SR</th></tr></thead>
            <tbody>
              {getFormatStats("batting").map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: "#4b5563" }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ color: "#00e5a0" }}>{p.runs}</td>
                  <td>{p.avg.toFixed(1)}</td>
                  <td>{p.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>TEAM COMPARISON</div>
          {teamComparison().length > 0 && <BarChart data={teamComparison().map(t => ({ label: t.team, value: t.wins }))} label="Wins" />}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════════
// ║ NOTIFICATIONS CENTER
// ════════════════════════════════════════════════════════════════════════════════════
export function NotificationsCenter({ userId, notifications, onMarkAsRead, onClearAll }) {
  const unread = notifications.filter(n => !n.is_read);

  return (
    <div className="fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="section-title">NOTIFICATIONS {unread.length > 0 && `(${unread.length})`}</h1>
        {notifications.length > 0 && <button className="btn-danger" style={{ fontSize: 12 }} onClick={onClearAll}>Clear All</button>}
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔔</div>
          <div style={{ color: "#6b7280" }}>No notifications yet</div>
        </div>
      ) : (
        notifications.map(notif => (
          <div key={notif.id} className="card" style={{ padding: 16, marginBottom: 12, opacity: notif.is_read ? 0.6 : 1, background: notif.is_read ? "#0a0e1a" : "#0d2d20" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{notif.title}</div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>{notif.message}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>{new Date(notif.created_at).toLocaleString()}</div>
              </div>
              {!notif.is_read && (
                <button className="btn-ghost" style={{ fontSize: 12, padding: "4px 10px" }} onClick={() => onMarkAsRead(notif.id)}>Mark Read</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════════
// ║ FANTASY CRICKET PAGE
// ════════════════════════════════════════════════════════════════════════════════════
export function FantasyCricketPage({ matches, players, currentUser, onCreateFantasyTeam, fantasyTeams, isPro, onUpgrade }) {
  const [selectedMatch, setSelectedMatch] = React.useState(null);
  const [selectedPlayers, setSelectedPlayers] = React.useState([]);
  const [captain, setCaptain] = React.useState(null);

  const upcomingMatches = matches.filter(m => m.status === "upcoming").slice(0, 5);
  const availablePlayers = selectedMatch ? players.filter(p => {
    const t1Players = players.filter(p => p.team === selectedMatch.team1).map(p => p.id);
    const t2Players = players.filter(p => p.team === selectedMatch.team2).map(p => p.id);
    return [...t1Players, ...t2Players].includes(p.id);
  }) : [];

  return (
    <div className="fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="section-title">FANTASY CRICKET</h1>
        {!isPro && <button className="btn-pro" onClick={onUpgrade}>🔒 Pro Feature</button>}
      </div>

      {!selectedMatch ? (
        <div>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>SELECT MATCH</div>
          {upcomingMatches.map(match => (
            <div key={match.id} className="card card-click" style={{ padding: 16, marginBottom: 12 }} onClick={() => setSelectedMatch(match)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{match.team1} vs {match.team2}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>📍 {match.ground} · 📅 {match.date}</div>
                </div>
                <span style={{ fontSize: 18 }}>🏏</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button className="btn-ghost" style={{ fontSize: 12, marginBottom: 20 }} onClick={() => { setSelectedMatch(null); setSelectedPlayers([]); setCaptain(null); }}>← Back</button>
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24 }}>{selectedMatch.team1} vs {selectedMatch.team2}</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>Select 11 players (Max 5 from one team)</div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {availablePlayers.map(player => (
                <div key={player.id} className={`card ${selectedPlayers.includes(player.id) ? "card-click" : ""}`} style={{ padding: 12, cursor: "pointer", opacity: selectedPlayers.includes(player.id) ? 1 : 0.7, border: selectedPlayers.includes(player.id) ? "2px solid #00e5a0" : undefined }} onClick={() => {
                  if (selectedPlayers.includes(player.id)) {
                    setSelectedPlayers(selectedPlayers.filter(p => p !== player.id));
                  } else if (selectedPlayers.length < 11) {
                    setSelectedPlayers([...selectedPlayers, player.id]);
                  }
                }}>
                  <div style={{ fontWeight: 600 }}>{player.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{player.role}</div>
                  {captain === player.id && <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 4 }}>👑 Captain</div>}
                </div>
              ))}
            </div>
            {selectedPlayers.length === 11 && (
              <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                <button className="btn-primary" onClick={() => onCreateFantasyTeam(selectedMatch.id, selectedPlayers, captain)}>Create Team</button>
              </div>
            )}
          </div>
        </div>
      )}

      {fantasyTeams.filter(t => t.creator_user_id === currentUser.id).length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>YOUR FANTASY TEAMS</div>
          {fantasyTeams.filter(t => t.creator_user_id === currentUser.id).map(team => (
            <div key={team.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{team.team_name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>👥 {team.players_selected?.length || 0} players • 📊 {team.total_points || 0} points</div>
                </div>
                <span className="tag" style={{ fontSize: 10 }}>{team.status?.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════════
// ║ LIVE SCORING DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════════
export function LiveScoringDashboard({ liveMatches, currentUser, onOpenScorer, onAddCommentary, commentary }) {
  const [selectedMatch, setSelectedMatch] = React.useState(liveMatches[0]);
  const [commentForm, setCommentForm] = React.useState("");

  if (!selectedMatch) {
    return (
      <div className="fadeIn">
        <h1 className="section-title" style={{ marginBottom: 24 }}>LIVE DASHBOARD</h1>
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
          <div style={{ color: "#6b7280" }}>No live matches currently</div>
        </div>
      </div>
    );
  }

  const matchCommentary = commentary.filter(c => c.match_id === selectedMatch.id).sort((a, b) => a.over_number - b.over_number);

  return (
    <div className="fadeIn">
      <h1 className="section-title" style={{ marginBottom: 20 }}>🔴 LIVE DASHBOARD</h1>

      {liveMatches.length > 1 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {liveMatches.map(m => (
            <button key={m.id} onClick={() => setSelectedMatch(m)} className={selectedMatch.id === m.id ? "btn-primary" : "btn-ghost"} style={{ fontSize: 12 }}>
              {m.team1} vs {m.team2}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, marginBottom: 16 }}>{selectedMatch.team1} vs {selectedMatch.team2}</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div style={{ background: "#0d2d20", padding: 20, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>🏏 {selectedMatch.team1}</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 48, color: "#00e5a0" }}>{selectedMatch.score1 || 0}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{selectedMatch.overs1 || "0.0"} overs</div>
            </div>
            <div style={{ background: "#0d1f2d", padding: 20, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>🏏 {selectedMatch.team2}</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 48, color: "#60a5fa" }}>{selectedMatch.score2 || "0"}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{selectedMatch.overs2 || "0.0"} overs</div>
            </div>
          </div>

          {currentUser.role !== "player" && (
            <button className="btn-primary" onClick={() => onOpenScorer(selectedMatch)} style={{ width: "100%" }}>Open Scorer</button>
          )}
        </div>

        <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column" }}>
          <div className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>COMMENTARY</div>
          <div style={{ flex: 1, overflowY: "auto", marginBottom: 12, maxHeight: 400 }}>
            {matchCommentary.length === 0 ? (
              <div style={{ color: "#6b7280", fontSize: 12, textAlign: "center", paddingTop: 20 }}>No commentary yet</div>
            ) : (
              matchCommentary.map((c, i) => (
                <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #0f1623", fontSize: 12 }}>
                  <div style={{ color: "#f59e0b", fontWeight: 600 }}>Over {c.over_number}</div>
                  <div style={{ color: "#9ca3af", marginTop: 2 }}>{c.description}</div>
                </div>
              ))
            )}
          </div>
          <input placeholder="Add commentary..." value={commentForm} onChange={(e) => setCommentForm(e.target.value)} style={{ marginBottom: 8 }} onKeyPress={(e) => {
            if (e.key === "Enter" && commentForm.trim()) {
              onAddCommentary(selectedMatch.id, commentForm);
              setCommentForm("");
            }
          }} />
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════════
// ║ EXPORTS & REPORTS PAGE
// ════════════════════════════════════════════════════════════════════════════════════
export function ExportsPage({ currentUser, exportedReports, onExportReport, isPro, onUpgrade }) {
  const [selectedFormat, setSelectedFormat] = React.useState("pdf");
  const [reportType, setReportType] = React.useState("player_stats");

  return (
    <div className="fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="section-title">EXPORTS & REPORTS</h1>
        {!isPro && <button className="btn-pro" onClick={onUpgrade}>🔒 Pro Feature</button>}
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Export Type</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { value: "player_stats", label: "Player Stats" },
              { value: "team_stats", label: "Team Stats" },
              { value: "match_scorecard", label: "Match Scorecard" },
              { value: "leaderboard", label: "Leaderboard" },
            ].map(opt => (
              <button key={opt.value} onClick={() => setReportType(opt.value)} className={reportType === opt.value ? "btn-primary" : "btn-ghost"} style={{ fontSize: 12 }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Format</div>
          <div style={{ display: "flex", gap: 10 }}>
            {["pdf", "xlsx", "csv"].map(fmt => (
              <button key={fmt} onClick={() => setSelectedFormat(fmt)} className={selectedFormat === fmt ? "btn-primary" : "btn-ghost"} style={{ fontSize: 12 }}>
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ width: "100%" }} onClick={() => onExportReport(reportType, selectedFormat)}>📥 Generate & Download</button>
      </div>

      {exportedReports.length > 0 && (
        <>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 12 }}>RECENT EXPORTS</div>
          {exportedReports.slice(0, 10).map(report => (
            <div key={report.id} className="card" style={{ padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{report.title}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{report.format.toUpperCase()} • {new Date(report.created_at).toLocaleDateString()}</div>
              </div>
              <button className="btn-ghost" style={{ fontSize: 12, padding: "4px 10px" }} onClick={() => window.open(report.file_url)}>⬇ Download</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
