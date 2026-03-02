import { useState, useEffect } from "react";

// ── Fonts via Google Fonts ──
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap";
document.head.appendChild(fontLink);

// ── Global Styles ──
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0e1a; color: #e8eaf6; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; } 
  ::-webkit-scrollbar-track { background: #0d1221; }
  ::-webkit-scrollbar-thumb { background: #00e5a0; border-radius: 2px; }

  @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(0,229,160,0.4); } 50%{ box-shadow: 0 0 0 8px rgba(0,229,160,0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes scoreFlash { 0%,100%{background:#0a0e1a;} 50%{background:#0d2d20;} }

  .fadeIn { animation: fadeIn 0.35s ease both; }
  .live-dot { width:8px; height:8px; border-radius:50%; background:#ff4d4d; animation: pulse 1.5s infinite; display:inline-block; }
  .card { background: #0d1221; border: 1px solid #1a2035; border-radius: 12px; transition: border-color 0.2s, transform 0.2s; }
  .card:hover { border-color: #00e5a040; }
  .btn-primary { background: #00e5a0; color: #0a0e1a; border:none; border-radius:8px; padding:10px 20px; font-family:'DM Sans',sans-serif; font-weight:700; font-size:14px; cursor:pointer; transition:all 0.2s; }
  .btn-primary:hover { background: #00ffb3; transform:translateY(-1px); }
  .btn-ghost { background:transparent; color:#00e5a0; border:1px solid #00e5a030; border-radius:8px; padding:8px 16px; font-family:'DM Sans',sans-serif; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .btn-ghost:hover { border-color:#00e5a0; background:#00e5a010; }
  .btn-danger { background:transparent; color:#ff6b6b; border:1px solid #ff6b6b30; border-radius:8px; padding:8px 16px; font-family:'DM Sans',sans-serif; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .btn-danger:hover { background:#ff6b6b15; border-color:#ff6b6b; }
  input, select, textarea { background:#111827; border:1px solid #1e2a3a; border-radius:8px; color:#e8eaf6; font-family:'DM Sans',sans-serif; font-size:14px; padding:10px 14px; width:100%; outline:none; transition: border-color 0.2s; }
  input:focus, select:focus, textarea:focus { border-color:#00e5a0; }
  select option { background:#111827; }
  .tag { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.5px; }
  .tag-green { background:#00e5a015; color:#00e5a0; border:1px solid #00e5a030; }
  .tag-blue { background:#3b82f615; color:#60a5fa; border:1px solid #3b82f630; }
  .tag-red { background:#ff6b6b15; color:#ff6b6b; border:1px solid #ff6b6b30; }
  .tag-yellow { background:#f59e0b15; color:#f59e0b; border:1px solid #f59e0b30; }
  .tag-purple { background:#a78bfa15; color:#a78bfa; border:1px solid #a78bfa30; }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal { background:#0d1221; border:1px solid #1a2035; border-radius:16px; padding:28px; max-width:540px; width:100%; max-height:85vh; overflow-y:auto; animation: fadeIn 0.25s ease; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  .stat-box { background:#111827; border-radius:10px; padding:16px; text-align:center; }
  .stat-box .val { font-family:'Bebas Neue',sans-serif; font-size:32px; color:#00e5a0; line-height:1; }
  .stat-box .lbl { font-size:11px; color:#6b7280; margin-top:4px; letter-spacing:0.5px; text-transform:uppercase; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th { color:#6b7280; font-weight:600; text-transform:uppercase; font-size:11px; letter-spacing:0.5px; padding:10px 12px; border-bottom:1px solid #1a2035; text-align:left; }
  td { padding:10px 12px; border-bottom:1px solid #0f1623; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:#0f1623; }
  .score-big { font-family:'Bebas Neue',sans-serif; font-size:48px; line-height:1; color:#fff; }
  .score-small { font-family:'JetBrains Mono',monospace; font-size:13px; color:#9ca3af; }
  .section-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:1px; color:#fff; }
  .badge { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:#00e5a020; color:#00e5a0; font-size:11px; font-weight:700; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = globalStyles;
document.head.appendChild(styleEl);

// ── Initial Data ──
const INITIAL_TEAMS = [
  { id: 1, name: "Royal Challengers", short: "RCB", color: "#e83b3b", captain: "Virat Kumar", players: 15, wins: 8, losses: 3, logo: "🔴" },
  { id: 2, name: "Mumbai Kings", short: "MKG", color: "#1e90ff", captain: "Rohit Singh", players: 14, wins: 7, losses: 4, logo: "🔵" },
  { id: 3, name: "Sunrisers FC", short: "SFC", color: "#ff9900", captain: "David Warner Jr.", players: 13, wins: 6, losses: 5, logo: "🟡" },
  { id: 4, name: "Chennai Lions", short: "CHL", color: "#f7c900", captain: "MS Dhoni Jr.", players: 15, wins: 9, losses: 2, logo: "🟡" },
];

const INITIAL_PLAYERS = [
  { id: 1, name: "Virat Kumar", team: "Royal Challengers", role: "Batsman", matches: 22, runs: 780, avg: 46.2, sr: 142.1, wickets: 0, economy: 0, catches: 8 },
  { id: 2, name: "Rohit Singh", team: "Mumbai Kings", role: "Batsman", matches: 20, runs: 650, avg: 38.5, sr: 135.4, wickets: 0, economy: 0, catches: 6 },
  { id: 3, name: "Jasprit Bhai", team: "Royal Challengers", role: "Bowler", matches: 22, runs: 45, avg: 8.1, sr: 90.5, wickets: 28, economy: 7.2, catches: 5 },
  { id: 4, name: "MS Dhoni Jr.", team: "Chennai Lions", role: "WK-Batsman", matches: 25, runs: 620, avg: 52.0, sr: 148.2, wickets: 0, economy: 0, catches: 22 },
  { id: 5, name: "Ravindra Jadav", team: "Chennai Lions", role: "All-rounder", matches: 20, runs: 340, avg: 28.3, sr: 145.6, wickets: 18, economy: 7.8, catches: 10 },
  { id: 6, name: "David Warner Jr.", team: "Sunrisers FC", role: "Batsman", matches: 18, runs: 720, avg: 44.5, sr: 153.2, wickets: 0, economy: 0, catches: 7 },
];

const INITIAL_GROUNDS = [
  { id: 1, name: "Eden Gardens Arena", city: "Kolkata", capacity: 5000, pitchType: "Batting", floodlights: true, status: "Available", nextBooked: null },
  { id: 2, name: "Chinnaswamy Mini", city: "Bangalore", capacity: 2000, pitchType: "Balanced", floodlights: true, status: "Booked", nextBooked: "2026-03-05" },
  { id: 3, name: "Wankhede Local", city: "Mumbai", capacity: 3000, pitchType: "Pace", floodlights: false, status: "Available", nextBooked: null },
  { id: 4, name: "Chepauk Ground", city: "Chennai", capacity: 2500, pitchType: "Spin", floodlights: true, status: "Maintenance", nextBooked: null },
];

const INITIAL_TOURNAMENTS = [
  { id: 1, name: "City T20 Premier 2026", format: "T20", teams: 8, startDate: "2026-03-01", endDate: "2026-04-15", status: "Ongoing", registered: ["Royal Challengers", "Mumbai Kings", "Sunrisers FC", "Chennai Lions"] },
  { id: 2, name: "Club Cricket Championship", format: "50-Over", teams: 16, startDate: "2026-05-01", endDate: "2026-07-01", status: "Upcoming", registered: ["Royal Challengers", "Chennai Lions"] },
];

const INITIAL_MATCHES = [
  { id: 1, team1: "Royal Challengers", team2: "Mumbai Kings", date: "2026-02-28", time: "19:00", ground: "Eden Gardens Arena", format: "T20", status: "live", score1: "142/4", overs1: "15.2", score2: "98/3", overs2: "12.0", innings: 2, currentBatting: "Mumbai Kings", tournament: "City T20 Premier 2026" },
  { id: 2, team1: "Chennai Lions", team2: "Sunrisers FC", date: "2026-02-27", time: "14:00", ground: "Chinnaswamy Mini", format: "T20", status: "completed", score1: "186/4", overs1: "20.0", score2: "179/8", overs2: "20.0", winner: "Chennai Lions", tournament: "City T20 Premier 2026" },
  { id: 3, team1: "Mumbai Kings", team2: "Sunrisers FC", date: "2026-03-02", time: "18:30", ground: "Wankhede Local", format: "T20", status: "upcoming", tournament: "City T20 Premier 2026" },
];

// ── Helpers ──
const uid = () => Date.now() + Math.random().toString(36).slice(2);
const formatDate = d => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// ── Scoring Engine Component ──
function ScoringEngine({ match, onClose }) {
  const [innings, setInnings] = useState(match.innings || 1);
  const [score, setScore] = useState(match.innings === 2 ? { runs: parseInt(match.score2) || 0, wickets: parseInt(match.score2?.split("/")[1]) || 0 } : { runs: parseInt(match.score1) || 0, wickets: parseInt(match.score1?.split("/")[1]) || 0 });
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState(0);
  const [extras, setExtras] = useState({ wide: 0, noBall: 0, bye: 0, legBye: 0 });
  const [history, setHistory] = useState([]);
  const [lastBall, setLastBall] = useState(null);
  const [currentBatsmen, setCurrentBatsmen] = useState([
    { name: innings === 2 ? "Opening Bat 3" : "Opening Bat 1", runs: 0, balls: 0, fours: 0, sixes: 0 },
    { name: innings === 2 ? "Opening Bat 4" : "Opening Bat 2", runs: 0, balls: 0, fours: 0, sixes: 0 },
  ]);
  const [striker, setStriker] = useState(0);
  const [bowler, setBowler] = useState({ name: "Bowler 1", overs: 0, runs: 0, wickets: 0, maidens: 0 });
  const [thisOver, setThisOver] = useState([]);
  const [partnership, setPartnership] = useState({ runs: 0, balls: 0 });

  const target = innings === 2 ? parseInt(match.score1) + 1 : null;
  const req = target ? target - score.runs : null;
  const reqBallsLeft = target ? (20 * 6) - (overs * 6 + balls) : null;
  const rpo = overs > 0 || balls > 0 ? (score.runs / (overs + balls / 6)).toFixed(2) : "0.00";
  const crr = rpo;
  const rrr = reqBallsLeft > 0 && req > 0 ? ((req / reqBallsLeft) * 6).toFixed(2) : "-";

  const addBall = (runs, type = "normal") => {
    const isExtra = ["wide", "noBall"].includes(type);
    const newScore = { ...score, runs: score.runs + runs + (type === "wide" || type === "noBall" ? 1 : 0) };
    const ballRuns = runs;

    if (type === "wicket") {
      newScore.wickets = score.wickets + 1;
      setHistory(h => [...h, { type: "W", runs: 0, over: `${overs}.${balls}` }]);
      setThisOver(o => [...o, "W"]);
    } else {
      setHistory(h => [...h, { type: type === "wide" ? "Wd" : type === "noBall" ? "NB" : String(runs), runs, over: `${overs}.${balls}` }]);
      setThisOver(o => [...o, type === "wide" ? "Wd" : type === "noBall" ? `NB+${runs}` : String(runs)]);
    }

    if (!isExtra && type !== "wicket") {
      const upd = [...currentBatsmen];
      upd[striker] = { ...upd[striker], runs: upd[striker].runs + runs, balls: upd[striker].balls + 1, fours: upd[striker].fours + (runs === 4 ? 1 : 0), sixes: upd[striker].sixes + (runs === 6 ? 1 : 0) };
      setCurrentBatsmen(upd);
      if (runs % 2 !== 0) setStriker(s => 1 - s);
    }
    if (!isExtra) {
      const newBalls = balls + 1;
      if (newBalls === 6) {
        setBalls(0);
        setOvers(o => o + 1);
        setThisOver([]);
        if (runs % 2 === 0) setStriker(s => 1 - s);
      } else {
        setBalls(newBalls);
      }
    }

    setPartnership(p => ({ runs: p.runs + runs, balls: p.balls + (isExtra ? 0 : 1) }));
    setLastBall(type === "wicket" ? "W" : runs);
    setScore(newScore);

    if (type !== "wicket") {
      setBowler(b => ({ ...b, runs: b.runs + runs + (isExtra ? 1 : 0), overs: overs + (balls + 1 === 6 && !isExtra ? 1 : 0) }));
    } else {
      setBowler(b => ({ ...b, wickets: b.wickets + 1 }));
    }
  };

  const battingTeam = innings === 1 ? match.team1 : match.team2;
  const bowlingTeam = innings === 1 ? match.team2 : match.team1;

  const BallBtn = ({ label, onClick, color = "#1a2035", textColor = "#e8eaf6" }) => (
    <button onClick={onClick} style={{ background: color, color: textColor, border: "none", borderRadius: 8, padding: "12px 6px", fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, cursor: "pointer", transition: "all 0.15s", width: "100%" }}
      onMouseEnter={e => e.target.style.opacity = 0.8} onMouseLeave={e => e.target.style.opacity = 1}>
      {label}
    </button>
  );

  return (
    <div style={{ background: "#0a0e1a", minHeight: "100vh", padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="live-dot" />
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 14, color: "#ff4d4d", letterSpacing: 2 }}>LIVE SCORING</span>
          </div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, marginTop: 4 }}>{match.team1} vs {match.team2}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{match.tournament} · {match.ground} · {match.format}</div>
        </div>
        <button className="btn-ghost" onClick={onClose}>← Back</button>
      </div>

      {/* Innings Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[1, 2].map(i => (
          <button key={i} onClick={() => setInnings(i)} style={{ background: innings === i ? "#00e5a0" : "#111827", color: innings === i ? "#0a0e1a" : "#6b7280", border: "1px solid " + (innings === i ? "#00e5a0" : "#1a2035"), borderRadius: 8, padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            {i === 1 ? match.team1 : match.team2} ({i === 1 ? (match.score1 || "Batting") : (match.score2 || "Yet to bat")})
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Score Panel */}
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div className="score-big">{score.runs}/{score.wickets}</div>
              <div className="score-small">{overs}.{balls} Overs · {battingTeam}</div>
              {target && <div style={{ marginTop: 8, color: score.runs >= target ? "#00e5a0" : "#f59e0b", fontWeight: 700, fontSize: 14 }}>
                {score.runs >= target ? "🏆 TARGET ACHIEVED!" : `Need ${req} off ${reqBallsLeft} balls (RRR: ${rrr})`}
              </div>}
            </div>
            {/* This Over */}
            <div style={{ background: "#111827", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>This Over</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {thisOver.map((b, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: b === "W" ? "#ff4d4d" : b === "6" ? "#00e5a0" : b === "4" ? "#3b82f6" : b.includes("Wd") || b.includes("NB") ? "#f59e0b" : "#1a2035", color: b === "6" || b === "4" ? "#0a0e1a" : "#fff" }}>{b}</div>
                ))}
                {Array(6 - thisOver.length).fill(0).map((_, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px dashed #1a2035" }} />
                ))}
              </div>
            </div>
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[["CRR", crr], ["RRR", rrr], ["P'ship", `${partnership.runs}(${partnership.balls})`], ["Extras", extras.wide + extras.noBall + extras.bye + extras.legBye]].map(([l, v]) => (
                <div key={l} style={{ background: "#111827", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: "#00e5a0" }}>{v}</div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Batting Scorecard */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>At The Crease</div>
            {currentBatsmen.map((b, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i === 0 ? "1px solid #0f1623" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {striker === i && <span style={{ color: "#00e5a0", fontSize: 14 }}>🏏</span>}
                  <span style={{ fontWeight: 600 }}>{b.name}</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: "#e8eaf6" }}>
                  {b.runs} <span style={{ color: "#6b7280" }}>({b.balls})</span>
                  <span style={{ color: "#3b82f6", marginLeft: 8 }}>{b.fours}×4</span>
                  <span style={{ color: "#00e5a0", marginLeft: 6 }}>{b.sixes}×6</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bowler */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Bowling</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>{bowler.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13 }}>{bowler.wickets}/{bowler.runs} <span style={{ color: "#6b7280" }}>({bowler.overs + (balls / 6).toFixed(1)})</span></span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Score Ball</div>
            {/* Runs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
              {[0, 1, 2, 3].map(r => <BallBtn key={r} label={r} onClick={() => addBall(r)} color="#111827" />)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              <BallBtn label="4" onClick={() => addBall(4)} color="#1e3a5f" textColor="#60a5fa" />
              <BallBtn label="6" onClick={() => addBall(6)} color="#0d2d20" textColor="#00e5a0" />
            </div>
            {/* Extras */}
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Extras</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
              {["Wide", "NoBall", "Bye", "LegBye"].map(e => (
                <button key={e} onClick={() => { setExtras(ex => ({ ...ex, [e.toLowerCase().replace(" ", "")]: ex[e.toLowerCase().replace(" ", "")] + 1 })); addBall(0, e.toLowerCase()); }} style={{ background: "#1a1200", color: "#f59e0b", border: "1px solid #f59e0b30", borderRadius: 8, padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{e}</button>
              ))}
            </div>
            {/* Wicket */}
            <button onClick={() => addBall(0, "wicket")} style={{ width: "100%", background: "#2d0a0a", color: "#ff6b6b", border: "1px solid #ff6b6b30", borderRadius: 8, padding: "14px", fontSize: 16, fontFamily: "'Bebas Neue'", letterSpacing: 2, cursor: "pointer", marginBottom: 16, transition: "all 0.2s" }}
              onMouseEnter={e => e.target.style.background = "#3d1010"} onMouseLeave={e => e.target.style.background = "#2d0a0a"}>
              ⚡ WICKET
            </button>

            {/* Recent History */}
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Ball History</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {history.slice(-18).map((h, i) => (
                <div key={i} style={{ padding: "2px 7px", borderRadius: 4, fontSize: 12, fontWeight: 700, background: h.type === "W" ? "#ff4d4d15" : h.type === "6" ? "#00e5a015" : "#111827", color: h.type === "W" ? "#ff4d4d" : h.type === "6" ? "#00e5a0" : h.type === "4" ? "#60a5fa" : "#9ca3af" }}>{h.type}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──
export default function CricketApp() {
  const [tab, setTab] = useState("dashboard");
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [grounds, setGrounds] = useState(INITIAL_GROUNDS);
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [scoringMatch, setScoringMatch] = useState(null);
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [notifs, setNotifs] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [activeTournament, setActiveTournament] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const notify = (msg, type = "success") => {
    const id = uid();
    setNotifs(n => [...n, { id, msg, type }]);
    setTimeout(() => setNotifs(n => n.filter(x => x.id !== id)), 3000);
  };

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  if (scoringMatch) return <ScoringEngine match={scoringMatch} onClose={() => setScoringMatch(null)} />;

  // ── Sidebar ──
  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "scoring", icon: "🏏", label: "Live Scoring" },
    { id: "matches", icon: "🗓", label: "Matches" },
    { id: "teams", icon: "🛡", label: "Teams" },
    { id: "players", icon: "👤", label: "Players" },
    { id: "tournaments", icon: "🏆", label: "Tournaments" },
    { id: "grounds", icon: "🌿", label: "Grounds" },
    { id: "stats", icon: "📈", label: "Statistics" },
  ];

  const liveMatch = matches.find(m => m.status === "live");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e1a" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#0d1221", borderRight: "1px solid #1a2035", padding: "24px 0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1a2035" }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2, color: "#00e5a0" }}>CRICPRO</div>
          <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 2, marginTop: 2 }}>CRICKET MANAGEMENT</div>
        </div>

        {liveMatch && (
          <div onClick={() => setScoringMatch(liveMatch)} style={{ margin: "16px 12px", background: "#0d2d20", border: "1px solid #00e5a030", borderRadius: 10, padding: "10px 12px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span className="live-dot" />
              <span style={{ fontSize: 10, color: "#ff4d4d", fontWeight: 700, letterSpacing: 1 }}>LIVE</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{liveMatch.team1} vs {liveMatch.team2}</div>
            <div style={{ fontSize: 11, color: "#00e5a0", fontFamily: "'JetBrains Mono'", marginTop: 2 }}>{liveMatch.score1} vs {liveMatch.score2}</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 0" }}>
          {navItems.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", background: tab === id ? "#00e5a010" : "transparent", color: tab === id ? "#00e5a0" : "#6b7280", border: "none", borderLeft: `3px solid ${tab === id ? "#00e5a0" : "transparent"}`, cursor: "pointer", fontSize: 14, fontWeight: tab === id ? 600 : 400, fontFamily: "'DM Sans'", transition: "all 0.15s", textAlign: "left" }}>
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid #1a2035", fontSize: 11, color: "#4b5563" }}>
          v2.0 · {teams.length} Teams · {players.length} Players
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
        {/* Notifications */}
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, display: "flex", flexDirection: "column", gap: 8 }}>
          {notifs.map(n => (
            <div key={n.id} className="fadeIn" style={{ background: n.type === "success" ? "#00e5a0" : n.type === "error" ? "#ff6b6b" : "#f59e0b", color: "#0a0e1a", padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>{n.msg}</div>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <h1 className="section-title">DASHBOARD</h1>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Friday, 27 Feb 2026</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-primary" onClick={() => { setModal("addMatch"); setForm({ format: "T20", status: "upcoming" }); }}>+ Schedule Match</button>
              </div>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Matches", value: matches.length, icon: "🗓", sub: `${matches.filter(m => m.status === "live").length} live now` },
                { label: "Teams", value: teams.length, icon: "🛡", sub: `${players.length} total players` },
                { label: "Tournaments", value: tournaments.length, icon: "🏆", sub: `${tournaments.filter(t => t.status === "Ongoing").length} ongoing` },
                { label: "Grounds", value: grounds.length, icon: "🌿", sub: `${grounds.filter(g => g.status === "Available").length} available` },
              ].map(({ label, value, icon, sub }) => (
                <div key={label} className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 40, color: "#00e5a0", lineHeight: 1 }}>{value}</div>
                      <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{sub}</div>
                    </div>
                    <span style={{ fontSize: 28 }}>{icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
              {/* Recent Matches */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div className="section-title" style={{ fontSize: 18 }}>RECENT MATCHES</div>
                  <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setTab("matches")}>View All →</button>
                </div>
                {matches.map(m => (
                  <div key={m.id} style={{ padding: "14px 0", borderBottom: "1px solid #0f1623" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.team1} <span style={{ color: "#4b5563" }}>vs</span> {m.team2}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{m.ground} · {m.format} · {formatDate(m.date)}</div>
                      </div>
                      <span className={`tag ${m.status === "live" ? "tag-red" : m.status === "completed" ? "tag-green" : "tag-blue"}`}>
                        {m.status === "live" && <span className="live-dot" style={{ width: 6, height: 6 }} />}
                        {m.status.toUpperCase()}
                      </span>
                    </div>
                    {m.status !== "upcoming" && (
                      <div style={{ display: "flex", gap: 20, fontFamily: "'JetBrains Mono'", fontSize: 13 }}>
                        <span>{m.team1}: <b>{m.score1}</b> <span style={{ color: "#4b5563" }}>({m.overs1})</span></span>
                        <span>{m.team2}: <b>{m.score2}</b> <span style={{ color: "#4b5563" }}>({m.overs2})</span></span>
                      </div>
                    )}
                    {m.winner && <div style={{ marginTop: 4, color: "#00e5a0", fontSize: 12, fontWeight: 600 }}>🏆 {m.winner} won</div>}
                    {m.status === "live" && (
                      <button className="btn-primary" style={{ marginTop: 8, padding: "6px 14px", fontSize: 12 }} onClick={() => setScoringMatch(m)}>
                        ▶ Score Live
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Leaderboard */}
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>POINTS TABLE</div>
                {teams.sort((a, b) => b.wins - a.wins).map((t, i) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #0f1623" }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : i === 2 ? "#b45309" : "#4b5563", width: 20 }}>{i + 1}</span>
                    <span style={{ fontSize: 22 }}>{t.logo}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{t.wins + t.losses} played</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: "#00e5a0" }}>{t.wins * 2} pts</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{t.wins}W {t.losses}L</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>TOP BATSMEN</div>
                <table>
                  <thead><tr><th>Player</th><th>Team</th><th>Runs</th><th>Avg</th><th>SR</th></tr></thead>
                  <tbody>
                    {players.filter(p => p.runs > 0).sort((a, b) => b.runs - a.runs).slice(0, 4).map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ color: "#6b7280", fontSize: 12 }}>{p.team}</td>
                        <td style={{ color: "#00e5a0", fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{p.runs}</td>
                        <td style={{ fontFamily: "'JetBrains Mono'" }}>{p.avg}</td>
                        <td style={{ fontFamily: "'JetBrains Mono'" }}>{p.sr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>TOP BOWLERS</div>
                <table>
                  <thead><tr><th>Player</th><th>Team</th><th>Wkts</th><th>Eco</th><th>Avg</th></tr></thead>
                  <tbody>
                    {players.filter(p => p.wickets > 0).sort((a, b) => b.wickets - a.wickets).slice(0, 4).map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ color: "#6b7280", fontSize: 12 }}>{p.team}</td>
                        <td style={{ color: "#00e5a0", fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{p.wickets}</td>
                        <td style={{ fontFamily: "'JetBrains Mono'" }}>{p.economy}</td>
                        <td style={{ fontFamily: "'JetBrains Mono'" }}>{(p.runs / p.wickets).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── LIVE SCORING ── */}
        {tab === "scoring" && (
          <div className="fadeIn">
            <h1 className="section-title" style={{ marginBottom: 24 }}>LIVE SCORING</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {matches.map(m => (
                <div key={m.id} className="card" style={{ padding: 20, cursor: "pointer", transition: "all 0.2s" }} onClick={() => setScoringMatch(m)}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span className={`tag ${m.status === "live" ? "tag-red" : m.status === "completed" ? "tag-green" : "tag-blue"}`}>
                      {m.status === "live" && <span className="live-dot" style={{ width: 6, height: 6 }} />}
                      {m.status.toUpperCase()}
                    </span>
                    <span className="tag tag-purple">{m.format}</span>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24 }}>{m.team1}</div>
                  {m.score1 && <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, color: "#00e5a0" }}>{m.score1} <span style={{ fontSize: 14, color: "#6b7280" }}>({m.overs1} ov)</span></div>}
                  <div style={{ color: "#6b7280", fontSize: 13, margin: "6px 0" }}>vs</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24 }}>{m.team2}</div>
                  {m.score2 && <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, color: "#60a5fa" }}>{m.score2} <span style={{ fontSize: 14, color: "#6b7280" }}>({m.overs2} ov)</span></div>}
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1a2035", fontSize: 12, color: "#6b7280", display: "flex", justifyContent: "space-between" }}>
                    <span>📍 {m.ground}</span>
                    <span>📅 {formatDate(m.date)} {m.time}</span>
                  </div>
                  {m.winner && <div style={{ marginTop: 8, color: "#00e5a0", fontWeight: 700, fontSize: 13 }}>🏆 {m.winner} won</div>}
                  {m.status === "live" && (
                    <button className="btn-primary" style={{ marginTop: 12, width: "100%" }} onClick={e => { e.stopPropagation(); setScoringMatch(m); }}>
                      ▶ Open Scorer
                    </button>
                  )}
                </div>
              ))}
              <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", border: "2px dashed #1a2035", minHeight: 200 }} onClick={() => { setModal("addMatch"); setForm({ format: "T20", status: "upcoming" }); }}>
                <div style={{ fontSize: 36 }}>+</div>
                <div style={{ fontWeight: 600 }}>Schedule New Match</div>
              </div>
            </div>
          </div>
        )}

        {/* ── MATCHES ── */}
        {tab === "matches" && (
          <div className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 className="section-title">MATCHES</h1>
              <button className="btn-primary" onClick={() => { setModal("addMatch"); setForm({ format: "T20", status: "upcoming" }); }}>+ Add Match</button>
            </div>
            {["live", "upcoming", "completed"].map(status => {
              const filtered = matches.filter(m => m.status === status);
              if (!filtered.length) return null;
              return (
                <div key={status} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    {status === "live" && <span className="live-dot" />}
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: 18, letterSpacing: 1, color: status === "live" ? "#ff4d4d" : status === "completed" ? "#00e5a0" : "#60a5fa" }}>{status.toUpperCase()} ({filtered.length})</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {filtered.map(m => (
                      <div key={m.id} className="card" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>{m.team1} vs {m.team2}</div>
                          {m.score1 && <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{m.team1}: {m.score1} ({m.overs1}) | {m.team2}: {m.score2 || "Yet to bat"} {m.overs2 ? `(${m.overs2})` : ""}</div>}
                          {m.winner && <div style={{ color: "#00e5a0", fontSize: 13, fontWeight: 600, marginTop: 4 }}>🏆 {m.winner} won</div>}
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, display: "flex", gap: 12 }}>
                            <span>📍 {m.ground}</span>
                            <span>📅 {formatDate(m.date)} {m.time}</span>
                            <span>🎯 {m.format}</span>
                            {m.tournament && <span>🏆 {m.tournament}</span>}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {m.status === "live" && <button className="btn-primary" onClick={() => setScoringMatch(m)}>▶ Score</button>}
                          {m.status === "upcoming" && <button className="btn-primary" onClick={() => { setMatches(ms => ms.map(x => x.id === m.id ? { ...x, status: "live" } : x)); notify("Match started!"); }}>Start Match</button>}
                          <button className="btn-ghost" onClick={() => setMatches(ms => ms.filter(x => x.id !== m.id))}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TEAMS ── */}
        {tab === "teams" && !activeTeam && (
          <div className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 className="section-title">TEAMS</h1>
              <button className="btn-primary" onClick={() => { setModal("addTeam"); setForm({ color: "#00e5a0", logo: "🟢" }); }}>+ Add Team</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {teams.map(t => (
                <div key={t.id} className="card" style={{ padding: 24, cursor: "pointer", position: "relative", overflow: "hidden" }} onClick={() => setActiveTeam(t)}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: t.color, opacity: 0.08, borderRadius: "0 0 0 80px" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <span style={{ fontSize: 36 }}>{t.logo}</span>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#fff" }}>{t.name}</div>
                      <span className="tag tag-blue">{t.short}</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                    {[["Players", t.players], ["Wins", t.wins], ["Losses", t.losses]].map(([l, v]) => (
                      <div key={l} className="stat-box">
                        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: t.color }}>{v}</div>
                        <div style={{ fontSize: 10, color: "#6b7280" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>👑 {t.captain}</div>
                </div>
              ))}
              <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, cursor: "pointer", border: "2px dashed #1a2035" }} onClick={() => { setModal("addTeam"); setForm({ color: "#00e5a0", logo: "🟢" }); }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>+</div>
                <div>Add New Team</div>
              </div>
            </div>
          </div>
        )}

        {tab === "teams" && activeTeam && (
          <div className="fadeIn">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <button className="btn-ghost" onClick={() => setActiveTeam(null)}>← Back</button>
              <span style={{ fontSize: 32 }}>{activeTeam.logo}</span>
              <div>
                <h1 className="section-title">{activeTeam.name}</h1>
                <span className="tag tag-blue">{activeTeam.short}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
              {[["Matches", activeTeam.wins + activeTeam.losses], ["Wins", activeTeam.wins], ["Losses", activeTeam.losses], ["Win %", Math.round(activeTeam.wins / (activeTeam.wins + activeTeam.losses) * 100) + "%"], ["Players", activeTeam.players]].map(([l, v]) => (
                <div key={l} className="stat-box">
                  <div className="val">{v}</div>
                  <div className="lbl">{l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>SQUAD</div>
              <table>
                <thead><tr><th>#</th><th>Player</th><th>Role</th><th>Matches</th><th>Runs</th><th>Wickets</th></tr></thead>
                <tbody>
                  {players.filter(p => p.team === activeTeam.name).map((p, i) => (
                    <tr key={p.id}>
                      <td style={{ color: "#6b7280" }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td><span className="tag tag-purple">{p.role}</span></td>
                      <td>{p.matches}</td>
                      <td style={{ color: "#00e5a0" }}>{p.runs}</td>
                      <td style={{ color: "#60a5fa" }}>{p.wickets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PLAYERS ── */}
        {tab === "players" && (
          <div className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 className="section-title">PLAYERS</h1>
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Search players..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: 220 }} />
                <button className="btn-primary" onClick={() => { setModal("addPlayer"); setForm({ role: "Batsman" }); }}>+ Add Player</button>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table>
                <thead><tr><th>#</th><th>Player</th><th>Team</th><th>Role</th><th>M</th><th>Runs</th><th>Avg</th><th>SR</th><th>Wkts</th><th>Eco</th><th>Ct</th><th></th></tr></thead>
                <tbody>
                  {players.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.team.toLowerCase().includes(searchQuery.toLowerCase())).map((p, i) => (
                    <tr key={p.id}>
                      <td style={{ color: "#6b7280" }}>{i + 1}</td>
                      <td style={{ fontWeight: 700 }}>{p.name}</td>
                      <td style={{ fontSize: 12, color: "#9ca3af" }}>{p.team}</td>
                      <td><span className={`tag ${p.role === "Batsman" ? "tag-blue" : p.role === "Bowler" ? "tag-red" : p.role.includes("WK") ? "tag-yellow" : "tag-purple"}`}>{p.role}</span></td>
                      <td>{p.matches}</td>
                      <td style={{ color: "#00e5a0", fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>{p.runs}</td>
                      <td style={{ fontFamily: "'JetBrains Mono'" }}>{p.avg}</td>
                      <td style={{ fontFamily: "'JetBrains Mono'" }}>{p.sr}</td>
                      <td style={{ color: "#60a5fa", fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>{p.wickets}</td>
                      <td style={{ fontFamily: "'JetBrains Mono'" }}>{p.economy || "-"}</td>
                      <td style={{ fontFamily: "'JetBrains Mono'" }}>{p.catches}</td>
                      <td style={{ display: "flex", gap: 4 }}>
                        <button className="btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => { setEditItem(p); setModal("addPlayer"); setForm({ ...p }); }}>Edit</button>
                        <button className="btn-danger" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => { setPlayers(ps => ps.filter(x => x.id !== p.id)); notify("Player removed"); }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TOURNAMENTS ── */}
        {tab === "tournaments" && !activeTournament && (
          <div className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 className="section-title">TOURNAMENTS & LEAGUES</h1>
              <button className="btn-primary" onClick={() => { setModal("addTournament"); setForm({ format: "T20", teams: 8 }); }}>+ Create Tournament</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {tournaments.map(t => (
                <div key={t.id} className="card" style={{ padding: 24, cursor: "pointer" }} onClick={() => setActiveTournament(t)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <span className={`tag ${t.status === "Ongoing" ? "tag-green" : t.status === "Upcoming" ? "tag-blue" : "tag-yellow"}`}>{t.status}</span>
                    <span className="tag tag-purple">{t.format}</span>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, marginBottom: 8 }}>{t.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                    {[["Teams", t.teams], ["Registered", t.registered.length], ["Matches", t.teams * (t.teams - 1) / 2]].map(([l, v]) => (
                      <div key={l} className="stat-box"><div className="val" style={{ fontSize: 24 }}>{v}</div><div className="lbl">{l}</div></div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>📅 {formatDate(t.startDate)} → {formatDate(t.endDate)}</div>
                </div>
              ))}
              <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, cursor: "pointer", border: "2px dashed #1a2035" }} onClick={() => { setModal("addTournament"); setForm({ format: "T20", teams: 8 }); }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>+</div>
                <div>Create Tournament</div>
              </div>
            </div>
          </div>
        )}

        {tab === "tournaments" && activeTournament && (
          <div className="fadeIn">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <button className="btn-ghost" onClick={() => setActiveTournament(null)}>← Back</button>
              <h1 className="section-title">{activeTournament.name}</h1>
              <span className={`tag ${activeTournament.status === "Ongoing" ? "tag-green" : "tag-blue"}`}>{activeTournament.status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[["Format", activeTournament.format], ["Teams", activeTournament.teams], ["Registered", activeTournament.registered.length], ["Start", formatDate(activeTournament.startDate)]].map(([l, v]) => (
                    <div key={l} className="stat-box"><div className="val" style={{ fontSize: 20 }}>{v}</div><div className="lbl">{l}</div></div>
                  ))}
                </div>
                {/* Fixture Generator */}
                <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                  <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>FIXTURES</div>
                  {activeTournament.registered.length >= 2 ? (
                    <table>
                      <thead><tr><th>Match</th><th>Teams</th><th>Status</th></tr></thead>
                      <tbody>
                        {activeTournament.registered.flatMap((t1, i) =>
                          activeTournament.registered.slice(i + 1).map((t2, j) => {
                            const m = matches.find(m => (m.team1 === t1 && m.team2 === t2) || (m.team1 === t2 && m.team2 === t1));
                            return (
                              <tr key={`${i}-${j}`}>
                                <td style={{ color: "#6b7280" }}>{i * activeTournament.registered.length + j + 1}</td>
                                <td>{t1} <span style={{ color: "#4b5563" }}>vs</span> {t2}</td>
                                <td><span className={`tag ${m ? (m.status === "completed" ? "tag-green" : m.status === "live" ? "tag-red" : "tag-blue") : "tag-yellow"}`}>{m ? m.status : "Not Scheduled"}</span></td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  ) : <div style={{ color: "#6b7280", fontSize: 14 }}>Need at least 2 registered teams to generate fixtures.</div>}
                </div>
              </div>
              {/* Points Table for Tournament */}
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>STANDINGS</div>
                {activeTournament.registered.map((tname, i) => {
                  const team = teams.find(t => t.name === tname);
                  return (
                    <div key={tname} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #0f1623" }}>
                      <span style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: i === 0 ? "#f59e0b" : "#4b5563", width: 20 }}>{i + 1}</span>
                      <span>{team?.logo || "🔵"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{tname}</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>{team ? `${team.wins}W ${team.losses}L` : "No data"}</div>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: "#00e5a0" }}>{team ? team.wins * 2 : 0} pts</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── GROUNDS ── */}
        {tab === "grounds" && (
          <div className="fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 className="section-title">GROUNDS MANAGEMENT</h1>
              <button className="btn-primary" onClick={() => { setModal("addGround"); setForm({ status: "Available", pitchType: "Balanced", floodlights: "true" }); }}>+ Add Ground</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {grounds.map(g => (
                <div key={g.id} className="card" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: g.status === "Available" ? "#00e5a020" : g.status === "Booked" ? "#3b82f620" : "#f59e0b20", borderRadius: "0 0 0 60px" }} />
                  <div style={{ display: "flex", justify: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20 }}>{g.name}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>📍 {g.city}</div>
                    </div>
                    <span className={`tag ${g.status === "Available" ? "tag-green" : g.status === "Booked" ? "tag-blue" : "tag-yellow"}`} style={{ marginLeft: 8 }}>{g.status}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <div style={{ background: "#111827", borderRadius: 8, padding: "10px" }}>
                      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>CAPACITY</div>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, color: "#00e5a0" }}>{g.capacity.toLocaleString()}</div>
                    </div>
                    <div style={{ background: "#111827", borderRadius: 8, padding: "10px" }}>
                      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>PITCH TYPE</div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{g.pitchType}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: g.floodlights ? "#00e5a0" : "#6b7280" }}>
                      💡 {g.floodlights ? "Floodlights" : "No Floodlights"}
                    </span>
                    {g.nextBooked && <span style={{ color: "#f59e0b", fontSize: 12 }}>Next: {formatDate(g.nextBooked)}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    {g.status === "Available" && (
                      <button className="btn-primary" style={{ flex: 1, padding: "8px", fontSize: 12 }} onClick={() => { setGrounds(gs => gs.map(x => x.id === g.id ? { ...x, status: "Booked" } : x)); notify(`${g.name} booked!`); }}>Book Ground</button>
                    )}
                    {g.status === "Booked" && (
                      <button className="btn-ghost" style={{ flex: 1, padding: "8px", fontSize: 12 }} onClick={() => { setGrounds(gs => gs.map(x => x.id === g.id ? { ...x, status: "Available", nextBooked: null } : x)); notify("Booking cancelled"); }}>Release</button>
                    )}
                    <button className="btn-danger" style={{ padding: "8px 12px", fontSize: 12 }} onClick={() => { setGrounds(gs => gs.filter(x => x.id !== g.id)); notify("Ground removed"); }}>✕</button>
                  </div>
                </div>
              ))}
              <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, cursor: "pointer", border: "2px dashed #1a2035" }} onClick={() => { setModal("addGround"); setForm({ status: "Available", pitchType: "Balanced", floodlights: "true" }); }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>+</div>
                <div>Add Ground</div>
              </div>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {tab === "stats" && (
          <div className="fadeIn">
            <h1 className="section-title" style={{ marginBottom: 24 }}>STATISTICS HUB</h1>
            {/* Format Filter */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[["Total Runs", players.reduce((a, p) => a + p.runs, 0)], ["Total Wickets", players.reduce((a, p) => a + p.wickets, 0)], ["Matches Played", matches.filter(m => m.status === "completed" || m.status === "live").length]].map(([l, v]) => (
                <div key={l} className="card" style={{ padding: 20, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 48, color: "#00e5a0" }}>{v.toLocaleString()}</div>
                  <div style={{ color: "#9ca3af", fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Batting Stats */}
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>BATTING RANKINGS</div>
                <table>
                  <thead><tr><th>Rank</th><th>Player</th><th>Team</th><th>M</th><th>Runs</th><th>HS</th><th>Avg</th><th>SR</th></tr></thead>
                  <tbody>
                    {[...players].sort((a, b) => b.runs - a.runs).map((p, i) => (
                      <tr key={p.id}>
                        <td><span style={{ fontFamily: "'Bebas Neue'", color: i < 3 ? ["#f59e0b", "#9ca3af", "#b45309"][i] : "#4b5563" }}>{i + 1}</span></td>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ fontSize: 12, color: "#6b7280" }}>{p.team}</td>
                        <td>{p.matches}</td>
                        <td style={{ color: "#00e5a0", fontWeight: 700 }}>{p.runs}</td>
                        <td>{Math.round(p.runs * 0.7)}</td>
                        <td>{p.avg}</td>
                        <td>{p.sr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bowling Stats */}
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>BOWLING RANKINGS</div>
                <table>
                  <thead><tr><th>Rank</th><th>Player</th><th>Team</th><th>M</th><th>Wkts</th><th>BBI</th><th>Eco</th></tr></thead>
                  <tbody>
                    {[...players].filter(p => p.wickets > 0).sort((a, b) => b.wickets - a.wickets).map((p, i) => (
                      <tr key={p.id}>
                        <td><span style={{ fontFamily: "'Bebas Neue'", color: i < 3 ? ["#f59e0b", "#9ca3af", "#b45309"][i] : "#4b5563" }}>{i + 1}</span></td>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ fontSize: 12, color: "#6b7280" }}>{p.team}</td>
                        <td>{p.matches}</td>
                        <td style={{ color: "#60a5fa", fontWeight: 700 }}>{p.wickets}</td>
                        <td>4/{Math.floor(Math.random() * 30 + 15)}</td>
                        <td>{p.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* All-rounders */}
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>ALL-ROUNDERS</div>
                <table>
                  <thead><tr><th>Player</th><th>Runs</th><th>Wkts</th><th>Catches</th></tr></thead>
                  <tbody>
                    {players.filter(p => p.runs > 0 && p.wickets > 0).map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ color: "#00e5a0" }}>{p.runs}</td>
                        <td style={{ color: "#60a5fa" }}>{p.wickets}</td>
                        <td>{p.catches}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Team Stats */}
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ fontSize: 18, marginBottom: 16 }}>TEAM PERFORMANCE</div>
                <table>
                  <thead><tr><th>Team</th><th>P</th><th>W</th><th>L</th><th>NRR</th><th>Pts</th></tr></thead>
                  <tbody>
                    {[...teams].sort((a, b) => b.wins - a.wins).map(t => (
                      <tr key={t.id}>
                        <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span>{t.logo}</span><span style={{ fontWeight: 700 }}>{t.short}</span></div></td>
                        <td>{t.wins + t.losses}</td>
                        <td style={{ color: "#00e5a0" }}>{t.wins}</td>
                        <td style={{ color: "#ff6b6b" }}>{t.losses}</td>
                        <td style={{ fontFamily: "'JetBrains Mono'" }}>+{(Math.random() * 1.5).toFixed(3)}</td>
                        <td style={{ color: "#f59e0b", fontWeight: 700 }}>{t.wins * 2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => { if (e.target.className === "modal-overlay") { setModal(null); setEditItem(null); setForm({}); } }}>
          <div className="modal">
            {modal === "addTeam" && (
              <>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, marginBottom: 20 }}>ADD TEAM</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Team Name" value={form.name || ""} onChange={setF("name")} />
                  <div className="grid-2">
                    <input placeholder="Short (e.g. RCB)" value={form.short || ""} onChange={setF("short")} />
                    <input placeholder="Logo Emoji 🔴" value={form.logo || ""} onChange={setF("logo")} />
                  </div>
                  <input placeholder="Captain Name" value={form.captain || ""} onChange={setF("captain")} />
                  <input placeholder="Team Color (#hex)" value={form.color || ""} onChange={setF("color")} />
                  <div className="grid-2">
                    <input type="number" placeholder="Players" value={form.players || ""} onChange={setF("players")} />
                    <input placeholder="City" value={form.city || ""} onChange={setF("city")} />
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                      if (!form.name) return notify("Team name required", "error");
                      setTeams(ts => [...ts, { id: uid(), wins: 0, losses: 0, players: parseInt(form.players) || 11, ...form }]);
                      setModal(null); setForm({}); notify("Team added!");
                    }}>Add Team</button>
                    <button className="btn-ghost" onClick={() => { setModal(null); setForm({}); }}>Cancel</button>
                  </div>
                </div>
              </>
            )}

            {modal === "addPlayer" && (
              <>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, marginBottom: 20 }}>{editItem ? "EDIT PLAYER" : "ADD PLAYER"}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Player Name" value={form.name || ""} onChange={setF("name")} />
                  <div className="grid-2">
                    <select value={form.team || ""} onChange={setF("team")}>
                      <option value="">Select Team</option>
                      {teams.map(t => <option key={t.id}>{t.name}</option>)}
                    </select>
                    <select value={form.role || "Batsman"} onChange={setF("role")}>
                      {["Batsman", "Bowler", "All-rounder", "WK-Batsman"].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="grid-3">
                    <input type="number" placeholder="Matches" value={form.matches || ""} onChange={setF("matches")} />
                    <input type="number" placeholder="Runs" value={form.runs || ""} onChange={setF("runs")} />
                    <input type="number" placeholder="Avg" value={form.avg || ""} onChange={setF("avg")} />
                  </div>
                  <div className="grid-3">
                    <input type="number" placeholder="Strike Rate" value={form.sr || ""} onChange={setF("sr")} />
                    <input type="number" placeholder="Wickets" value={form.wickets || ""} onChange={setF("wickets")} />
                    <input type="number" placeholder="Economy" value={form.economy || ""} onChange={setF("economy")} />
                  </div>
                  <input type="number" placeholder="Catches" value={form.catches || ""} onChange={setF("catches")} />
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                      if (!form.name) return notify("Name required", "error");
                      const data = { ...form, matches: +form.matches || 0, runs: +form.runs || 0, avg: +form.avg || 0, sr: +form.sr || 0, wickets: +form.wickets || 0, economy: +form.economy || 0, catches: +form.catches || 0 };
                      if (editItem) {
                        setPlayers(ps => ps.map(p => p.id === editItem.id ? { ...p, ...data } : p));
                        notify("Player updated!");
                      } else {
                        setPlayers(ps => [...ps, { id: uid(), ...data }]);
                        notify("Player added!");
                      }
                      setModal(null); setEditItem(null); setForm({});
                    }}>Save</button>
                    <button className="btn-ghost" onClick={() => { setModal(null); setEditItem(null); setForm({}); }}>Cancel</button>
                  </div>
                </div>
              </>
            )}

            {modal === "addMatch" && (
              <>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, marginBottom: 20 }}>SCHEDULE MATCH</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="grid-2">
                    <select value={form.team1 || ""} onChange={setF("team1")}>
                      <option value="">Team 1</option>
                      {teams.map(t => <option key={t.id}>{t.name}</option>)}
                    </select>
                    <select value={form.team2 || ""} onChange={setF("team2")}>
                      <option value="">Team 2</option>
                      {teams.filter(t => t.name !== form.team1).map(t => <option key={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="grid-2">
                    <input type="date" value={form.date || ""} onChange={setF("date")} />
                    <input type="time" value={form.time || ""} onChange={setF("time")} />
                  </div>
                  <div className="grid-2">
                    <select value={form.format || "T20"} onChange={setF("format")}>
                      {["T20", "50-Over", "Test", "T10"].map(f => <option key={f}>{f}</option>)}
                    </select>
                    <select value={form.ground || ""} onChange={setF("ground")}>
                      <option value="">Select Ground</option>
                      {grounds.filter(g => g.status !== "Maintenance").map(g => <option key={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <select value={form.tournament || ""} onChange={setF("tournament")}>
                    <option value="">No Tournament</option>
                    {tournaments.map(t => <option key={t.id}>{t.name}</option>)}
                  </select>
                  <select value={form.status || "upcoming"} onChange={setF("status")}>
                    {["upcoming", "live", "completed"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                      if (!form.team1 || !form.team2) return notify("Select both teams", "error");
                      setMatches(ms => [...ms, { id: uid(), ...form, innings: 1 }]);
                      setModal(null); setForm({}); notify("Match scheduled!");
                    }}>Schedule</button>
                    <button className="btn-ghost" onClick={() => { setModal(null); setForm({}); }}>Cancel</button>
                  </div>
                </div>
              </>
            )}

            {modal === "addTournament" && (
              <>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, marginBottom: 20 }}>CREATE TOURNAMENT</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Tournament Name" value={form.name || ""} onChange={setF("name")} />
                  <div className="grid-2">
                    <select value={form.format || "T20"} onChange={setF("format")}>
                      {["T20", "50-Over", "T10", "Test"].map(f => <option key={f}>{f}</option>)}
                    </select>
                    <input type="number" placeholder="No. of Teams" value={form.teams || ""} onChange={setF("teams")} />
                  </div>
                  <div className="grid-2">
                    <input type="date" placeholder="Start Date" value={form.startDate || ""} onChange={setF("startDate")} />
                    <input type="date" placeholder="End Date" value={form.endDate || ""} onChange={setF("endDate")} />
                  </div>
                  <select value={form.status || "Upcoming"} onChange={setF("status")}>
                    {["Upcoming", "Ongoing", "Completed"].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Register Teams:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {teams.map(t => {
                      const selected = (form.registered || []).includes(t.name);
                      return (
                        <button key={t.id} onClick={() => setForm(f => ({ ...f, registered: selected ? (f.registered || []).filter(x => x !== t.name) : [...(f.registered || []), t.name] }))}
                          style={{ background: selected ? "#00e5a0" : "#111827", color: selected ? "#0a0e1a" : "#9ca3af", border: "1px solid " + (selected ? "#00e5a0" : "#1a2035"), borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          {t.logo} {t.name}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                      if (!form.name) return notify("Name required", "error");
                      setTournaments(ts => [...ts, { id: uid(), registered: [], ...form, teams: parseInt(form.teams) || 8 }]);
                      setModal(null); setForm({}); notify("Tournament created!");
                    }}>Create</button>
                    <button className="btn-ghost" onClick={() => { setModal(null); setForm({}); }}>Cancel</button>
                  </div>
                </div>
              </>
            )}

            {modal === "addGround" && (
              <>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, marginBottom: 20 }}>ADD GROUND</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Ground Name" value={form.name || ""} onChange={setF("name")} />
                  <input placeholder="City" value={form.city || ""} onChange={setF("city")} />
                  <div className="grid-2">
                    <input type="number" placeholder="Capacity" value={form.capacity || ""} onChange={setF("capacity")} />
                    <select value={form.pitchType || "Balanced"} onChange={setF("pitchType")}>
                      {["Batting", "Bowling", "Balanced", "Pace", "Spin"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="grid-2">
                    <select value={form.floodlights || "true"} onChange={setF("floodlights")}>
                      <option value="true">Floodlights ✓</option>
                      <option value="false">No Floodlights</option>
                    </select>
                    <select value={form.status || "Available"} onChange={setF("status")}>
                      {["Available", "Booked", "Maintenance"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                      if (!form.name) return notify("Name required", "error");
                      setGrounds(gs => [...gs, { id: uid(), floodlights: form.floodlights === "true", capacity: parseInt(form.capacity) || 1000, ...form }]);
                      setModal(null); setForm({}); notify("Ground added!");
                    }}>Add Ground</button>
                    <button className="btn-ghost" onClick={() => { setModal(null); setForm({}); }}>Cancel</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}