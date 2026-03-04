import { useState, useEffect } from "react";

// ── Google Fonts ──
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap";
document.head.appendChild(fontLink);

// ── Global Styles ──
const G = `
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { background:#0a0e1a; color:#e8eaf6; font-family:'DM Sans',sans-serif; }
::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0d1221} ::-webkit-scrollbar-thumb{background:#00e5a0;border-radius:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,229,160,.4)}50%{box-shadow:0 0 0 8px rgba(0,229,160,0)}}
@keyframes slideIn{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}
.fadeIn{animation:fadeIn .3s ease both}
.live-dot{width:8px;height:8px;border-radius:50%;background:#ff4d4d;animation:pulse 1.5s infinite;display:inline-block}
.card{background:#0d1221;border:1px solid #1a2035;border-radius:12px;transition:border-color .2s,transform .2s}
.card:hover{border-color:#00e5a040}
.card-click{cursor:pointer} .card-click:hover{border-color:#00e5a0;transform:translateY(-2px)}
.btn-primary{background:#00e5a0;color:#0a0e1a;border:none;border-radius:8px;padding:10px 20px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s}
.btn-primary:hover{background:#00ffb3;transform:translateY(-1px)}
.btn-ghost{background:transparent;color:#00e5a0;border:1px solid #00e5a030;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s}
.btn-ghost:hover{border-color:#00e5a0;background:#00e5a010}
.btn-danger{background:transparent;color:#ff6b6b;border:1px solid #ff6b6b30;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s}
.btn-danger:hover{background:#ff6b6b15;border-color:#ff6b6b}
.btn-yellow{background:transparent;color:#f59e0b;border:1px solid #f59e0b30;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s}
.btn-yellow:hover{background:#f59e0b15;border-color:#f59e0b}
input,select,textarea{background:#111827;border:1px solid #1e2a3a;border-radius:8px;color:#e8eaf6;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 14px;width:100%;outline:none;transition:border-color .2s}
input:focus,select:focus,textarea:focus{border-color:#00e5a0}
select option{background:#111827}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.5px}
.tag-green{background:#00e5a015;color:#00e5a0;border:1px solid #00e5a030}
.tag-blue{background:#3b82f615;color:#60a5fa;border:1px solid #3b82f630}
.tag-red{background:#ff6b6b15;color:#ff6b6b;border:1px solid #ff6b6b30}
.tag-yellow{background:#f59e0b15;color:#f59e0b;border:1px solid #f59e0b30}
.tag-purple{background:#a78bfa15;color:#a78bfa;border:1px solid #a78bfa30}
.tag-orange{background:#fb923c15;color:#fb923c;border:1px solid #fb923c30}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:#0d1221;border:1px solid #1a2035;border-radius:16px;padding:28px;max-width:560px;width:100%;max-height:88vh;overflow-y:auto;animation:fadeIn .25s ease}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}
.stat-box{background:#111827;border-radius:10px;padding:16px;text-align:center}
.stat-box .val{font-family:'Bebas Neue',sans-serif;font-size:32px;color:#00e5a0;line-height:1}
.stat-box .lbl{font-size:11px;color:#6b7280;margin-top:4px;letter-spacing:.5px;text-transform:uppercase}
table{width:100%;border-collapse:collapse;font-size:13px}
th{color:#6b7280;font-weight:600;text-transform:uppercase;font-size:11px;letter-spacing:.5px;padding:10px 12px;border-bottom:1px solid #1a2035;text-align:left}
td{padding:10px 12px;border-bottom:1px solid #0f1623}
tr:last-child td{border-bottom:none}
tr:hover td{background:#0f1623}
.clickable-row{cursor:pointer} .clickable-row:hover td{background:#0d2d20!important}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;color:#fff}
.score-big{font-family:'Bebas Neue',sans-serif;font-size:48px;line-height:1;color:#fff}
.breadcrumb{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b7280;margin-bottom:20px}
.breadcrumb span{color:#6b7280} .breadcrumb .current{color:#e8eaf6;font-weight:600}
.role-badge-admin{background:#ff6b6b15;color:#ff6b6b;border:1px solid #ff6b6b30;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.role-badge-organizer{background:#f59e0b15;color:#f59e0b;border:1px solid #f59e0b30;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.role-badge-scorer{background:#3b82f615;color:#60a5fa;border:1px solid #3b82f630;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.role-badge-player{background:#a78bfa15;color:#a78bfa;border:1px solid #a78bfa30;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.role-badge-viewer{background:#1a2035;color:#9ca3af;border:1px solid #1a2035;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.sidebar-section{padding:8px 20px;font-size:10px;color:#374151;text-transform:uppercase;letter-spacing:1.5px;margin-top:8px}
.progress-bar{height:6px;background:#1a2035;border-radius:3px;overflow:hidden}
.progress-fill{height:100%;background:#00e5a0;border-radius:3px;transition:width .5s ease}
.avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0}
`;
const sEl = document.createElement("style");
sEl.textContent = G;
document.head.appendChild(sEl);

// ── Helpers ──
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—";
const initials = n => n ? n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "??";
const avatarColor = n => { const colors=["#00e5a0","#60a5fa","#f59e0b","#a78bfa","#fb923c","#f472b6"]; let h=0; for(let c of (n||"")) h=c.charCodeAt(0)+((h<<5)-h); return colors[Math.abs(h)%colors.length]; };

// ── ROLES ──
// admin: full access, manage users, see everything
// organizer: create/edit tournaments, manage teams, schedule matches
// scorer: score live matches only
// player: view own stats, register for tournaments
// viewer: read-only

const ROLES = { ADMIN:"admin", ORGANIZER:"organizer", SCORER:"scorer", PLAYER:"player", VIEWER:"viewer" };

const CAN = {
  editTeam:    r => [ROLES.ADMIN, ROLES.ORGANIZER].includes(r),
  editPlayer:  r => [ROLES.ADMIN, ROLES.ORGANIZER].includes(r),
  editMatch:   r => [ROLES.ADMIN, ROLES.ORGANIZER].includes(r),
  scoreMatch:  r => [ROLES.ADMIN, ROLES.SCORER, ROLES.ORGANIZER].includes(r),
  editTournament: r => [ROLES.ADMIN, ROLES.ORGANIZER].includes(r),
  editGround:  r => [ROLES.ADMIN, ROLES.ORGANIZER].includes(r),
  manageUsers: r => r === ROLES.ADMIN,
  viewAdmin:   r => r === ROLES.ADMIN,
};

// ── DEMO USERS ──
const DEMO_USERS = [
  { id:"u1", name:"Admin User",      email:"admin@cricpro.com",     password:"admin123",    role:ROLES.ADMIN,     team:null,           avatar:"🛡" },
  { id:"u2", name:"Raj Organizer",   email:"raj@cricpro.com",       password:"raj123",      role:ROLES.ORGANIZER, team:null,           avatar:"📋" },
  { id:"u3", name:"Scorer Dev",      email:"scorer@cricpro.com",    password:"scorer123",   role:ROLES.SCORER,    team:null,           avatar:"🏏" },
  { id:"u4", name:"Virat Kumar",     email:"virat@cricpro.com",     password:"virat123",    role:ROLES.PLAYER,    team:"Royal Challengers", avatar:"🏏" },
  { id:"u5", name:"Rohit Singh",     email:"rohit@cricpro.com",     password:"rohit123",    role:ROLES.PLAYER,    team:"Mumbai Kings", avatar:"🏏" },
  { id:"u6", name:"Fan Viewer",      email:"fan@cricpro.com",       password:"fan123",      role:ROLES.VIEWER,    team:null,           avatar:"👁" },
];

// ── INITIAL DATA ──
const TEAMS0 = [
  { id:"t1", name:"Royal Challengers", short:"RCB", color:"#e83b3b", captain:"Virat Kumar",    players:15, wins:8, losses:3, logo:"🔴", city:"Bangalore", founded:"2020", homeGround:"Eden Gardens Arena" },
  { id:"t2", name:"Mumbai Kings",      short:"MKG", color:"#1e90ff", captain:"Rohit Singh",    players:14, wins:7, losses:4, logo:"🔵", city:"Mumbai",    founded:"2019", homeGround:"Wankhede Local" },
  { id:"t3", name:"Sunrisers FC",      short:"SFC", color:"#ff9900", captain:"David Warner Jr.",players:13, wins:6, losses:5, logo:"🟡", city:"Hyderabad", founded:"2021", homeGround:"Chepauk Ground" },
  { id:"t4", name:"Chennai Lions",     short:"CHL", color:"#f7c900", captain:"MS Dhoni Jr.",   players:15, wins:9, losses:2, logo:"🟡", city:"Chennai",   founded:"2018", homeGround:"Chinnaswamy Mini" },
];

const PLAYERS0 = [
  { id:"p1",  name:"Virat Kumar",    team:"Royal Challengers", role:"Batsman",     matches:22, runs:780, avg:46.2, sr:142.1, wickets:0,  economy:0,   catches:8,  fifties:6, hundreds:2, hs:134, ducks:1,  balls_faced:548, fours:82, sixes:24, bio:"Aggressive right-hand batsman and captain" },
  { id:"p2",  name:"Rohit Singh",    team:"Mumbai Kings",      role:"Batsman",     matches:20, runs:650, avg:38.5, sr:135.4, wickets:0,  economy:0,   catches:6,  fifties:5, hundreds:1, hs:118, ducks:2,  balls_faced:480, fours:70, sixes:18, bio:"Elegant opener known for big scores" },
  { id:"p3",  name:"Jasprit Bhai",   team:"Royal Challengers", role:"Bowler",      matches:22, runs:45,  avg:8.1,  sr:90.5,  wickets:28, economy:7.2, catches:5,  fifties:0, hundreds:0, hs:18,  ducks:5,  balls_faced:50,  fours:3,  sixes:1,  bio:"Express pace bowler, death over specialist" },
  { id:"p4",  name:"MS Dhoni Jr.",   team:"Chennai Lions",     role:"WK-Batsman",  matches:25, runs:620, avg:52.0, sr:148.2, wickets:0,  economy:0,   catches:22, fifties:4, hundreds:1, hs:95,  ducks:0,  balls_faced:418, fours:55, sixes:28, bio:"Wicket-keeper batsman, finisher extraordinaire" },
  { id:"p5",  name:"Ravindra Jadav", team:"Chennai Lions",     role:"All-rounder", matches:20, runs:340, avg:28.3, sr:145.6, wickets:18, economy:7.8, catches:10, fifties:2, hundreds:0, hs:76,  ducks:2,  balls_faced:234, fours:30, sixes:12, bio:"Crafty left-arm spinner and capable batsman" },
  { id:"p6",  name:"David Warner Jr.",team:"Sunrisers FC",     role:"Batsman",     matches:18, runs:720, avg:44.5, sr:153.2, wickets:0,  economy:0,   catches:7,  fifties:5, hundreds:2, hs:141, ducks:1,  balls_faced:470, fours:88, sixes:30, bio:"Explosive left-handed opener" },
  { id:"p7",  name:"Hardik Dev",     team:"Mumbai Kings",      role:"All-rounder", matches:18, runs:310, avg:25.8, sr:152.4, wickets:15, economy:8.4, catches:8,  fifties:1, hundreds:0, hs:67,  ducks:3,  balls_faced:203, fours:28, sixes:16, bio:"Hard-hitting all-rounder" },
  { id:"p8",  name:"Bumrah Jr.",     team:"Mumbai Kings",      role:"Bowler",      matches:18, runs:20,  avg:4.0,  sr:66.7,  wickets:24, economy:6.8, catches:4,  fifties:0, hundreds:0, hs:12,  ducks:6,  balls_faced:30,  fours:2,  sixes:0,  bio:"World-class death bowler with yorker mastery" },
];

const MATCHES0 = [
  { id:"m1", team1:"Royal Challengers", team2:"Mumbai Kings",   date:"2026-02-28", time:"19:00", ground:"Eden Gardens Arena",  format:"T20",    status:"live",      score1:"142/4", overs1:"15.2", score2:"98/3",  overs2:"12.0", innings:2, tournament:"City T20 Premier 2026", toss:"Royal Challengers won toss", mom:null,   notes:"Exciting chase underway" },
  { id:"m2", team1:"Chennai Lions",     team2:"Sunrisers FC",   date:"2026-02-27", time:"14:00", ground:"Chinnaswamy Mini",    format:"T20",    status:"completed", score1:"186/4", overs1:"20.0", score2:"179/8", overs2:"20.0", winner:"Chennai Lions", tournament:"City T20 Premier 2026", toss:"Chennai Lions won toss", mom:"MS Dhoni Jr.", notes:"Thriller — Chennai won by 7 runs" },
  { id:"m3", team1:"Mumbai Kings",      team2:"Sunrisers FC",   date:"2026-03-02", time:"18:30", ground:"Wankhede Local",      format:"T20",    status:"upcoming",  score1:null,    overs1:null,   score2:null,   overs2:null,   tournament:"City T20 Premier 2026", toss:null, mom:null, notes:"" },
  { id:"m4", team1:"Royal Challengers", team2:"Chennai Lions",  date:"2026-03-04", time:"19:30", ground:"Eden Gardens Arena",  format:"T20",    status:"upcoming",  score1:null,    overs1:null,   score2:null,   overs2:null,   tournament:"City T20 Premier 2026", toss:null, mom:null, notes:"" },
];

const GROUNDS0 = [
  { id:"g1", name:"Eden Gardens Arena", city:"Kolkata",   capacity:5000, pitchType:"Batting",  floodlights:true,  status:"Available",  facilities:["Pavilion","Parking","Cafeteria"], contact:"9800001111" },
  { id:"g2", name:"Chinnaswamy Mini",   city:"Bangalore", capacity:2000, pitchType:"Balanced", floodlights:true,  status:"Booked",     facilities:["Parking","Cafeteria"],            contact:"9800002222", nextBooked:"2026-03-05" },
  { id:"g3", name:"Wankhede Local",     city:"Mumbai",    capacity:3000, pitchType:"Pace",     floodlights:false, status:"Available",  facilities:["Pavilion","Dressing Rooms"],      contact:"9800003333" },
  { id:"g4", name:"Chepauk Ground",     city:"Chennai",   capacity:2500, pitchType:"Spin",     floodlights:true,  status:"Maintenance",facilities:["Pavilion","Parking"],             contact:"9800004444" },
];

const TOURNAMENTS0 = [
  { id:"tn1", name:"City T20 Premier 2026",    format:"T20",    teams:8,  startDate:"2026-03-01", endDate:"2026-04-15", status:"Ongoing",  registered:["Royal Challengers","Mumbai Kings","Sunrisers FC","Chennai Lions"], createdBy:"u2", prize:"₹50,000", description:"Premier city-level T20 tournament" },
  { id:"tn2", name:"Club Cricket Championship", format:"50-Over",teams:16, startDate:"2026-05-01", endDate:"2026-07-01", status:"Upcoming", registered:["Royal Challengers","Chennai Lions"],                              createdBy:"u2", prize:"₹1,00,000", description:"Annual 50-over club championship" },
];

// ── SCORING ENGINE ──
function ScoringEngine({ match, currentUser, onClose }) {
  const [score, setScore] = useState({ runs: parseInt(match.score2)||0, wickets: parseInt(match.score2?.split("/")[1])||0 });
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState(0);
  const [history, setHistory] = useState([]);
  const [thisOver, setThisOver] = useState([]);
  const [partnership, setPartnership] = useState({ runs:0, balls:0 });
  const [striker, setStriker] = useState(0);
  const [batsmen, setBatsmen] = useState([
    { name:"Batsman 1", runs:0, balls:0, fours:0, sixes:0 },
    { name:"Batsman 2", runs:0, balls:0, fours:0, sixes:0 },
  ]);
  const [bowler, setBowler] = useState({ name:"Bowler 1", overs:0, runs:0, wickets:0 });

  const target = parseInt(match.score1) + 1;
  const req = target - score.runs;
  const ballsDone = overs*6+balls;
  const totalBalls = 20*6;
  const reqBalls = totalBalls - ballsDone;
  const rrr = reqBalls>0&&req>0 ? ((req/reqBalls)*6).toFixed(2) : "—";
  const crr = ballsDone>0 ? (score.runs/(ballsDone/6)).toFixed(2) : "0.00";

  const addBall = (runs, type="normal") => {
    const isExtra = ["wide","noball"].includes(type);
    const isWicket = type==="wicket";
    const newS = { runs: score.runs+runs+(isExtra?1:0), wickets: score.wickets+(isWicket?1:0) };
    setScore(newS);
    const ball = isWicket?"W":type==="wide"?"Wd":type==="noball"?`NB`:String(runs);
    setHistory(h=>[...h,ball]);
    setThisOver(o=>[...o,ball]);
    if(!isExtra&&!isWicket){
      const upd=[...batsmen]; upd[striker]={...upd[striker],runs:upd[striker].runs+runs,balls:upd[striker].balls+1,fours:upd[striker].fours+(runs===4?1:0),sixes:upd[striker].sixes+(runs===6?1:0)};
      setBatsmen(upd);
      if(runs%2!==0) setStriker(s=>1-s);
    }
    if(!isExtra){
      const nb=balls+1;
      if(nb===6){ setBalls(0); setOvers(o=>o+1); setThisOver([]); if(runs%2===0) setStriker(s=>1-s); }
      else setBalls(nb);
    }
    setPartnership(p=>({runs:p.runs+runs, balls:p.balls+(isExtra?0:1)}));
    setBowler(b=>({...b,runs:b.runs+runs+(isExtra?1:0),wickets:b.wickets+(isWicket?1:0)}));
  };

  const BB = ({label,onClick,bg="#111827",fg="#e8eaf6"}) => (
    <button onClick={onClick} style={{background:bg,color:fg,border:"none",borderRadius:8,padding:"14px 4px",fontFamily:"'Bebas Neue'",fontSize:22,cursor:"pointer",width:"100%",transition:"opacity .15s"}}
      onMouseEnter={e=>e.target.style.opacity=.75} onMouseLeave={e=>e.target.style.opacity=1}>{label}</button>
  );

  return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span className="live-dot"/><span style={{fontFamily:"'Bebas Neue'",fontSize:13,color:"#ff4d4d",letterSpacing:2}}>LIVE SCORING</span></div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:26,marginTop:2}}>{match.team1} vs {match.team2}</div>
          <div style={{fontSize:12,color:"#6b7280"}}>{match.ground} · {match.format} · Logged as <b style={{color:"#00e5a0"}}>{currentUser.name}</b></div>
        </div>
        <button className="btn-ghost" onClick={onClose}>← Back</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <div className="card" style={{padding:20,marginBottom:16}}>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>TARGET: <b style={{color:"#f59e0b"}}>{target}</b></div>
              <div className="score-big">{score.runs}/{score.wickets}</div>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#9ca3af"}}>{overs}.{balls} Overs · {match.team2}</div>
              {score.runs>=target ? <div style={{marginTop:8,color:"#00e5a0",fontWeight:700}}>🏆 TARGET ACHIEVED!</div>
                : <div style={{marginTop:8,color:"#f59e0b",fontSize:13}}>Need {req} off {reqBalls} balls · RRR: {rrr}</div>}
            </div>
            <div style={{background:"#111827",borderRadius:8,padding:"10px 14px",marginBottom:12}}>
              <div style={{fontSize:10,color:"#6b7280",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>This Over</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {thisOver.map((b,i)=><div key={i} style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:b==="W"?"#ff4d4d":b==="6"?"#00e5a0":b==="4"?"#3b82f6":b.includes("Wd")||b.includes("NB")?"#f59e0b":"#1a2035",color:b==="6"||b==="4"?"#0a0e1a":"#fff"}}>{b}</div>)}
                {Array(6-thisOver.length).fill(0).map((_,i)=><div key={i} style={{width:28,height:28,borderRadius:"50%",border:"1px dashed #1a2035"}}/>)}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[["CRR",crr],["RRR",rrr],["P'ship",`${partnership.runs}(${partnership.balls})`],["Extras","0"]].map(([l,v])=>(
                <div key={l} style={{background:"#111827",borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                  <div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#00e5a0"}}>{v}</div>
                  <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{padding:16,marginBottom:12}}>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>At The Crease</div>
            {batsmen.map((b,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i===0?"1px solid #0f1623":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {striker===i&&<span style={{color:"#00e5a0"}}>🏏</span>}
                  <input value={b.name} onChange={e=>{const u=[...batsmen];u[i]={...u[i],name:e.target.value};setBatsmen(u);}} style={{background:"transparent",border:"none",color:"#e8eaf6",fontWeight:600,width:130,padding:"2px 4px",fontSize:13}}/>
                </div>
                <span style={{fontFamily:"'JetBrains Mono'",fontSize:13}}>{b.runs}<span style={{color:"#6b7280"}}> ({b.balls})</span> <span style={{color:"#3b82f6"}}>{b.fours}×4</span> <span style={{color:"#00e5a0"}}>{b.sixes}×6</span></span>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <input value={bowler.name} onChange={e=>setBowler(b=>({...b,name:e.target.value}))} style={{background:"transparent",border:"none",color:"#e8eaf6",fontWeight:600,width:130,fontSize:13}}/>
              <span style={{fontFamily:"'JetBrains Mono'",fontSize:13}}>{bowler.wickets}/{bowler.runs}</span>
            </div>
          </div>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Score Ball</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:8}}>
            {[0,1,2,3].map(r=><BB key={r} label={r} onClick={()=>addBall(r)}/>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <BB label="4" onClick={()=>addBall(4)} bg="#1e3a5f" fg="#60a5fa"/>
            <BB label="6" onClick={()=>addBall(6)} bg="#0d2d20" fg="#00e5a0"/>
          </div>
          <div style={{fontSize:10,color:"#6b7280",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Extras</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14}}>
            {[["Wide","wide"],["NoBall","noball"],["Bye","bye"],["LegBye","legbye"]].map(([l,t])=>(
              <button key={t} onClick={()=>addBall(0,t)} style={{background:"#1a1200",color:"#f59e0b",border:"1px solid #f59e0b30",borderRadius:8,padding:"10px 4px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
          <button onClick={()=>addBall(0,"wicket")} style={{width:"100%",background:"#2d0a0a",color:"#ff6b6b",border:"1px solid #ff6b6b30",borderRadius:8,padding:14,fontSize:18,fontFamily:"'Bebas Neue'",letterSpacing:2,cursor:"pointer",marginBottom:14}}
            onMouseEnter={e=>e.target.style.background="#3d1010"} onMouseLeave={e=>e.target.style.background="#2d0a0a"}>⚡ WICKET</button>
          <div style={{fontSize:10,color:"#6b7280",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Ball Log</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {history.slice(-20).map((b,i)=><span key={i} style={{padding:"2px 7px",borderRadius:4,fontSize:12,fontWeight:700,background:b==="W"?"#ff4d4d15":b==="6"?"#00e5a015":"#111827",color:b==="W"?"#ff4d4d":b==="6"?"#00e5a0":b==="4"?"#60a5fa":"#9ca3af"}}>{b}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN PAGE ──
function LoginPage({ users, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handle = () => {
    const u = users.find(u=>u.email===email&&u.password===password);
    if(u) onLogin(u);
    else setError("Invalid email or password. Try the demo accounts below.");
  };

  const demoLogin = (u) => { setEmail(u.email); setPassword(u.password); setTimeout(()=>onLogin(u),300); };

  return (
    <div style={{minHeight:"100vh",background:"#0a0e1a",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:48,letterSpacing:4,color:"#00e5a0"}}>CRICPRO</div>
          <div style={{fontSize:13,color:"#6b7280",letterSpacing:2,marginTop:4}}>CRICKET MANAGEMENT PLATFORM</div>
        </div>
        <div className="card" style={{padding:32}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:24,letterSpacing:1}}>SIGN IN</div>
          {error && <div style={{background:"#ff6b6b15",border:"1px solid #ff6b6b30",borderRadius:8,padding:"10px 14px",color:"#ff6b6b",fontSize:13,marginBottom:16}}>{error}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
            <input placeholder="Email address" value={email} onChange={e=>{setEmail(e.target.value);setError("")}} type="email"/>
            <div style={{position:"relative"}}>
              <input placeholder="Password" value={password} onChange={e=>{setPassword(e.target.value);setError("")}} type={showPass?"text":"password"} onKeyDown={e=>e.key==="Enter"&&handle()}/>
              <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16}}>{showPass?"🙈":"👁"}</button>
            </div>
          </div>
          <button className="btn-primary" style={{width:"100%",padding:14,fontSize:16}} onClick={handle}>Sign In →</button>
        </div>

        {/* Demo Accounts */}
        <div style={{marginTop:24}}>
          <div style={{fontSize:11,color:"#4b5563",textAlign:"center",marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Demo Accounts — Click to Login</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {DEMO_USERS.map(u=>(
              <button key={u.id} onClick={()=>demoLogin(u)} style={{background:"#0d1221",border:"1px solid #1a2035",borderRadius:10,padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .2s",textAlign:"left"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#00e5a040"} onMouseLeave={e=>e.currentTarget.style.borderColor="#1a2035"}>
                <div className="avatar" style={{background:avatarColor(u.name)+"30",color:avatarColor(u.name)}}>{initials(u.name)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#e8eaf6"}}>{u.name}</div>
                  <div style={{fontSize:11,color:"#6b7280"}}>{u.email}</div>
                </div>
                <span className={`role-badge-${u.role}`}>{u.role.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PLAYER PROFILE PAGE ──
function PlayerProfile({ player, matches, teams, currentUser, onBack }) {
  const team = teams.find(t=>t.name===player.team);
  const recentMatches = matches.filter(m=>m.status==="completed"&&(m.team1===player.team||m.team2===player.team)).slice(-5);
  const battingAvg = player.runs>0&&player.matches>0 ? (player.runs/Math.max(player.matches-player.ducks,1)).toFixed(1) : "0";
  const strikeRate = player.balls_faced>0 ? ((player.runs/player.balls_faced)*100).toFixed(1) : "0";
  const bowlAvg = player.wickets>0 ? (player.runs/player.wickets).toFixed(1) : "—";

  return (
    <div className="fadeIn">
      <div className="breadcrumb"><span onClick={onBack} style={{cursor:"pointer",color:"#00e5a0"}}>Players</span><span>›</span><span className="current">{player.name}</span></div>
      {/* Hero */}
      <div className="card" style={{padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:200,height:200,background:avatarColor(player.name),opacity:.05,borderRadius:"0 0 0 200px"}}/>
        <div style={{display:"flex",alignItems:"flex-start",gap:20}}>
          <div className="avatar" style={{width:72,height:72,fontSize:28,background:avatarColor(player.name)+"25",color:avatarColor(player.name),borderRadius:16}}>{initials(player.name)}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:32,letterSpacing:1}}>{player.name}</div>
            <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
              <span className={`tag ${player.role==="Batsman"?"tag-blue":player.role==="Bowler"?"tag-red":player.role.includes("WK")?"tag-yellow":"tag-purple"}`}>{player.role}</span>
              {team&&<span className="tag tag-green">{team.logo} {player.team}</span>}
            </div>
            <div style={{marginTop:10,fontSize:13,color:"#9ca3af"}}>{player.bio}</div>
          </div>
          {CAN.editPlayer(currentUser.role)&&<button className="btn-ghost" style={{fontSize:12}}>✏ Edit</button>}
        </div>
      </div>
      {/* Key Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        {[["Matches",player.matches],["Runs",player.runs],["Avg",battingAvg],["SR",strikeRate],["Wickets",player.wickets]].map(([l,v])=>(
          <div key={l} className="stat-box"><div className="val">{v}</div><div className="lbl">{l}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Batting */}
        <div className="card" style={{padding:20}}>
          <div className="section-title" style={{fontSize:18,marginBottom:16}}>BATTING</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Innings",player.matches],["Runs",player.runs],["Highest Score",player.hs],["Average",battingAvg],["Strike Rate",strikeRate],["Fifties",player.fifties],["Hundreds",player.hundreds],["Fours",player.fours],["Sixes",player.sixes],["Ducks",player.ducks]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #0f1623"}}>
                <span style={{color:"#6b7280",fontSize:13}}>{l}</span>
                <span style={{fontFamily:"'JetBrains Mono'",fontSize:13,fontWeight:600,color: l==="Ducks"?"#ff6b6b":l==="Hundreds"||l==="Fifties"?"#f59e0b":"#e8eaf6"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Bowling + Recent */}
        <div>
          {player.wickets>0&&(
            <div className="card" style={{padding:20,marginBottom:16}}>
              <div className="section-title" style={{fontSize:18,marginBottom:16}}>BOWLING</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Wickets",player.wickets],["Economy",player.economy],["Average",bowlAvg],["Catches",player.catches]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #0f1623"}}>
                    <span style={{color:"#6b7280",fontSize:13}}>{l}</span>
                    <span style={{fontFamily:"'JetBrains Mono'",fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="card" style={{padding:20}}>
            <div className="section-title" style={{fontSize:18,marginBottom:12}}>RECENT MATCHES</div>
            {recentMatches.length ? recentMatches.map(m=>(
              <div key={m.id} style={{padding:"8px 0",borderBottom:"1px solid #0f1623",fontSize:13}}>
                <div style={{fontWeight:600}}>{m.team1} vs {m.team2}</div>
                <div style={{color:"#6b7280",fontSize:12}}>{fmtDate(m.date)} · {m.ground}</div>
                {m.winner&&<div style={{color:"#00e5a0",fontSize:12}}>🏆 {m.winner} won</div>}
              </div>
            )) : <div style={{color:"#6b7280",fontSize:13}}>No recent matches</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MATCH DETAIL PAGE ──
function MatchDetail({ match, players, currentUser, onBack, onScore }) {
  const team1Players = players.filter(p=>p.team===match.team1);
  const team2Players = players.filter(p=>p.team===match.team2);

  return (
    <div className="fadeIn">
      <div className="breadcrumb"><span onClick={onBack} style={{cursor:"pointer",color:"#00e5a0"}}>Matches</span><span>›</span><span className="current">{match.team1} vs {match.team2}</span></div>
      {/* Match Header */}
      <div className="card" style={{padding:28,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <span className={`tag ${match.status==="live"?"tag-red":match.status==="completed"?"tag-green":"tag-blue"}`}>
                {match.status==="live"&&<span className="live-dot" style={{width:6,height:6}}/>}{match.status.toUpperCase()}
              </span>
              <span className="tag tag-purple">{match.format}</span>
              {match.tournament&&<span className="tag tag-yellow">🏆 {match.tournament}</span>}
            </div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:36}}>{match.team1} <span style={{color:"#4b5563",fontSize:24}}>VS</span> {match.team2}</div>
            <div style={{display:"flex",gap:20,marginTop:10,fontSize:13,color:"#9ca3af",flexWrap:"wrap"}}>
              <span>📍 {match.ground}</span>
              <span>📅 {fmtDate(match.date)} {match.time}</span>
              {match.toss&&<span>🪙 {match.toss}</span>}
            </div>
            {match.notes&&<div style={{marginTop:8,fontSize:13,color:"#60a5fa",fontStyle:"italic"}}>"{match.notes}"</div>}
          </div>
          {CAN.scoreMatch(currentUser.role)&&match.status==="live"&&(
            <button className="btn-primary" onClick={()=>onScore(match)}>▶ Open Scorer</button>
          )}
        </div>
        {/* Scores */}
        {match.score1&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:20,marginTop:24,alignItems:"center"}}>
            <div>
              <div style={{fontSize:13,color:"#9ca3af",marginBottom:4}}>{match.team1}</div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:44,color:"#fff"}}>{match.score1}</div>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#6b7280"}}>{match.overs1} overs</div>
            </div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:"#4b5563"}}>VS</div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,color:"#9ca3af",marginBottom:4}}>{match.team2}</div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:44,color:match.status==="live"?"#60a5fa":"#fff"}}>{match.score2||"Yet to bat"}</div>
              {match.overs2&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#6b7280"}}>{match.overs2} overs</div>}
            </div>
          </div>
        )}
        {match.winner&&<div style={{marginTop:16,padding:"12px 16px",background:"#00e5a010",border:"1px solid #00e5a030",borderRadius:8,color:"#00e5a0",fontWeight:700}}>🏆 {match.winner} won!</div>}
        {match.mom&&<div style={{marginTop:8,fontSize:13,color:"#f59e0b"}}>⭐ Man of the Match: <b>{match.mom}</b></div>}
      </div>

      {/* Squads */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {[[match.team1,team1Players],[match.team2,team2Players]].map(([tname,tplayers])=>(
          <div key={tname} className="card" style={{padding:20}}>
            <div className="section-title" style={{fontSize:16,marginBottom:12}}>{tname}</div>
            {tplayers.length ? tplayers.map(p=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #0f1623",fontSize:13}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className="avatar" style={{width:28,height:28,fontSize:11,background:avatarColor(p.name)+"25",color:avatarColor(p.name)}}>{initials(p.name)}</div>
                  <span style={{fontWeight:600}}>{p.name}</span>
                </div>
                <span className={`tag ${p.role==="Batsman"?"tag-blue":p.role==="Bowler"?"tag-red":"tag-purple"}`} style={{fontSize:10}}>{p.role}</span>
              </div>
            )) : <div style={{color:"#6b7280",fontSize:13}}>No players registered</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TOURNAMENT DETAIL ──
function TournamentDetail({ tournament, teams, matches, players, currentUser, onBack }) {
  const tMatches = matches.filter(m=>m.tournament===tournament.name);
  const standings = tournament.registered.map(tname=>{
    const t = teams.find(x=>x.name===tname)||{};
    const played = tMatches.filter(m=>m.status==="completed"&&(m.team1===tname||m.team2===tname));
    const wins = played.filter(m=>m.winner===tname).length;
    const losses = played.length - wins;
    return { name:tname, logo:t.logo||"🔵", played:played.length, wins, losses, pts:wins*2 };
  }).sort((a,b)=>b.pts-a.pts||b.wins-a.wins);

  return (
    <div className="fadeIn">
      <div className="breadcrumb"><span onClick={onBack} style={{cursor:"pointer",color:"#00e5a0"}}>Tournaments</span><span>›</span><span className="current">{tournament.name}</span></div>
      <div className="card" style={{padding:24,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <span className={`tag ${tournament.status==="Ongoing"?"tag-green":tournament.status==="Upcoming"?"tag-blue":"tag-yellow"}`}>{tournament.status}</span>
              <span className="tag tag-purple">{tournament.format}</span>
            </div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:30}}>{tournament.name}</div>
            <div style={{fontSize:13,color:"#9ca3af",marginTop:6}}>{tournament.description}</div>
            <div style={{display:"flex",gap:20,marginTop:10,fontSize:13,color:"#6b7280"}}>
              <span>📅 {fmtDate(tournament.startDate)} → {fmtDate(tournament.endDate)}</span>
              <span>🏆 Prize: {tournament.prize}</span>
            </div>
          </div>
          {CAN.editTournament(currentUser.role)&&currentUser.id===tournament.createdBy&&(
            <span className="tag tag-yellow">You manage this</span>
          )}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20}}>
        {/* Standings */}
        <div className="card" style={{padding:20}}>
          <div className="section-title" style={{fontSize:18,marginBottom:16}}>STANDINGS</div>
          <table>
            <thead><tr><th>Pos</th><th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th></tr></thead>
            <tbody>
              {standings.map((s,i)=>(
                <tr key={s.name}>
                  <td><span style={{fontFamily:"'Bebas Neue'",fontSize:18,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#b45309":"#4b5563"}}>{i+1}</span></td>
                  <td><div style={{display:"flex",alignItems:"center",gap:6}}><span>{s.logo}</span><span style={{fontWeight:600}}>{s.name}</span></div></td>
                  <td>{s.played}</td>
                  <td style={{color:"#00e5a0",fontWeight:700}}>{s.wins}</td>
                  <td style={{color:"#ff6b6b"}}>{s.losses}</td>
                  <td><span style={{fontFamily:"'Bebas Neue'",fontSize:20,color:"#f59e0b"}}>{s.pts}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Fixtures */}
        <div className="card" style={{padding:20}}>
          <div className="section-title" style={{fontSize:18,marginBottom:16}}>FIXTURES</div>
          {tMatches.length ? tMatches.map(m=>(
            <div key={m.id} style={{padding:"10px 0",borderBottom:"1px solid #0f1623"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontWeight:600,fontSize:13}}>{m.team1} vs {m.team2}</div>
                <span className={`tag ${m.status==="live"?"tag-red":m.status==="completed"?"tag-green":"tag-blue"}`} style={{fontSize:10}}>{m.status}</span>
              </div>
              {m.score1&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:12,color:"#9ca3af",marginTop:2}}>{m.score1} vs {m.score2||"—"}</div>}
              {m.winner&&<div style={{fontSize:12,color:"#00e5a0",fontWeight:600}}>🏆 {m.winner}</div>}
              <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>📅 {fmtDate(m.date)}</div>
            </div>
          )) : <div style={{color:"#6b7280",fontSize:13}}>No fixtures yet</div>}
        </div>
      </div>
    </div>
  );
}

// ── GROUND DETAIL ──
function GroundDetail({ ground, matches, currentUser, onBack }) {
  const groundMatches = matches.filter(m=>m.ground===ground.name);
  return (
    <div className="fadeIn">
      <div className="breadcrumb"><span onClick={onBack} style={{cursor:"pointer",color:"#00e5a0"}}>Grounds</span><span>›</span><span className="current">{ground.name}</span></div>
      <div className="card" style={{padding:24,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:30}}>{ground.name}</div>
            <div style={{fontSize:13,color:"#9ca3af"}}>📍 {ground.city}</div>
            <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
              <span className={`tag ${ground.status==="Available"?"tag-green":ground.status==="Booked"?"tag-blue":"tag-yellow"}`}>{ground.status}</span>
              <span className="tag tag-purple">{ground.pitchType} Pitch</span>
              {ground.floodlights&&<span className="tag tag-yellow">💡 Floodlights</span>}
            </div>
          </div>
          {CAN.editGround(currentUser.role)&&<button className="btn-ghost" style={{fontSize:12}}>✏ Edit</button>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:20}}>
          {[["Capacity",ground.capacity.toLocaleString()],["Pitch",ground.pitchType],["Contact",ground.contact],["Matches Hosted",groundMatches.length]].map(([l,v])=>(
            <div key={l} className="stat-box"><div className="val" style={{fontSize:22}}>{v}</div><div className="lbl">{l}</div></div>
          ))}
        </div>
        {ground.facilities?.length>0&&(
          <div style={{marginTop:16}}>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Facilities</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{ground.facilities.map(f=><span key={f} className="tag tag-green">{f}</span>)}</div>
          </div>
        )}
      </div>
      <div className="card" style={{padding:20}}>
        <div className="section-title" style={{fontSize:18,marginBottom:16}}>MATCHES AT THIS GROUND</div>
        {groundMatches.length ? (
          <table>
            <thead><tr><th>Match</th><th>Date</th><th>Format</th><th>Result</th></tr></thead>
            <tbody>
              {groundMatches.map(m=>(
                <tr key={m.id}>
                  <td style={{fontWeight:600}}>{m.team1} vs {m.team2}</td>
                  <td style={{color:"#6b7280"}}>{fmtDate(m.date)}</td>
                  <td><span className="tag tag-purple">{m.format}</span></td>
                  <td>{m.winner?<span style={{color:"#00e5a0",fontWeight:600}}>🏆 {m.winner}</span>:<span className={`tag ${m.status==="live"?"tag-red":"tag-blue"}`}>{m.status}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div style={{color:"#6b7280",fontSize:13}}>No matches scheduled here yet</div>}
      </div>
    </div>
  );
}

// ── ADMIN PANEL ──
function AdminPanel({ users, setUsers, currentUser, onBack }) {
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({});
  const roleCounts = Object.values(ROLES).map(r=>({ role:r, count:users.filter(u=>u.role===r).length }));

  return (
    <div className="fadeIn">
      <div className="breadcrumb"><span onClick={onBack} style={{cursor:"pointer",color:"#00e5a0"}}>Dashboard</span><span>›</span><span className="current">Admin Panel</span></div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h1 className="section-title">ADMIN PANEL</h1>
        <span className="role-badge-admin">ADMIN ACCESS</span>
      </div>
      {/* Role Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:24}}>
        {roleCounts.map(({role,count})=>(
          <div key={role} className="stat-box">
            <div className="val" style={{fontSize:28}}>{count}</div>
            <div className="lbl">{role}s</div>
          </div>
        ))}
      </div>
      {/* User Table */}
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #1a2035",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="section-title" style={{fontSize:18}}>ALL USERS</div>
          <button className="btn-primary" onClick={()=>{setEditUser({});setForm({role:ROLES.VIEWER,password:"pass123"});}}>+ Add User</button>
        </div>
        <table>
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Team</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div className="avatar" style={{width:32,height:32,fontSize:12,background:avatarColor(u.name)+"25",color:avatarColor(u.name)}}>{initials(u.name)}</div>
                    <span style={{fontWeight:600}}>{u.name}</span>
                    {u.id===currentUser.id&&<span style={{fontSize:10,color:"#00e5a0"}}>(you)</span>}
                  </div>
                </td>
                <td style={{color:"#9ca3af",fontSize:12}}>{u.email}</td>
                <td><span className={`role-badge-${u.role}`}>{u.role.toUpperCase()}</span></td>
                <td style={{color:"#9ca3af",fontSize:12}}>{u.team||"—"}</td>
                <td>
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn-ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>{setEditUser(u);setForm({...u});}}>Edit</button>
                    {u.id!==currentUser.id&&<button className="btn-danger" style={{padding:"4px 10px",fontSize:11}} onClick={()=>setUsers(us=>us.filter(x=>x.id!==u.id))}>Remove</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permissions Info */}
      <div className="card" style={{padding:20,marginTop:20}}>
        <div className="section-title" style={{fontSize:18,marginBottom:16}}>ROLE PERMISSIONS</div>
        <table>
          <thead><tr><th>Permission</th><th>Admin</th><th>Organizer</th><th>Scorer</th><th>Player</th><th>Viewer</th></tr></thead>
          <tbody>
            {[["Add/Edit Teams","✅","✅","❌","❌","❌"],["Add/Edit Players","✅","✅","❌","❌","❌"],["Schedule Matches","✅","✅","❌","❌","❌"],["Score Live Match","✅","✅","✅","❌","❌"],["Create Tournament","✅","✅","❌","❌","❌"],["Book Ground","✅","✅","❌","❌","❌"],["Register for Tournament","✅","✅","✅","✅","❌"],["View All Stats","✅","✅","✅","✅","✅"],["Manage Users","✅","❌","❌","❌","❌"]].map(([perm,...vals])=>(
              <tr key={perm}>
                <td style={{fontWeight:600}}>{perm}</td>
                {vals.map((v,i)=><td key={i} style={{textAlign:"center",fontSize:16}}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add User Modal */}
      {editUser!==null&&(
        <div className="modal-overlay" onClick={e=>e.target.className==="modal-overlay"&&setEditUser(null)}>
          <div className="modal">
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:20}}>{editUser.id?"EDIT USER":"ADD USER"}</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <input placeholder="Full Name" value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              <input placeholder="Email" value={form.email||""} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
              <input placeholder="Password" value={form.password||""} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
              <select value={form.role||ROLES.VIEWER} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                {Object.values(ROLES).map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
              </select>
              <input placeholder="Team (optional)" value={form.team||""} onChange={e=>setForm(f=>({...f,team:e.target.value}))}/>
              <div style={{display:"flex",gap:10,marginTop:8}}>
                <button className="btn-primary" style={{flex:1}} onClick={()=>{
                  if(!form.name||!form.email) return;
                  if(editUser.id) setUsers(us=>us.map(u=>u.id===editUser.id?{...u,...form}:u));
                  else setUsers(us=>[...us,{id:uid(),avatar:"👤",...form}]);
                  setEditUser(null); setForm({});
                }}>Save</button>
                <button className="btn-ghost" onClick={()=>setEditUser(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [users, setUsers] = useState(DEMO_USERS);
  const [teams, setTeams] = useState(TEAMS0);
  const [players, setPlayers] = useState(PLAYERS0);
  const [matches, setMatches] = useState(MATCHES0);
  const [grounds, setGrounds] = useState(GROUNDS0);
  const [tournaments, setTournaments] = useState(TOURNAMENTS0);
  const [scoringMatch, setScoringMatch] = useState(null);
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [notifs, setNotifs] = useState([]);
  const [deepView, setDeepView] = useState(null); // { type, item }
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const notify = (msg, type="success") => {
    const id = uid();
    setNotifs(n=>[...n,{id,msg,type}]);
    setTimeout(()=>setNotifs(n=>n.filter(x=>x.id!==id)),3000);
  };

  const setF = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const closeModal = () => { setModal(null); setEditItem(null); setForm({}); };
  const openDeep = (type, item) => { setDeepView({type,item}); };
  const closeDeep = () => setDeepView(null);

  const logout = () => { setCurrentUser(null); setTab("dashboard"); setDeepView(null); setScoringMatch(null); };

  if(!currentUser) return <LoginPage users={users} onLogin={u=>{setCurrentUser(u);notify(`Welcome back, ${u.name}!`)}}/>;
  if(scoringMatch) return <ScoringEngine match={scoringMatch} currentUser={currentUser} onClose={()=>setScoringMatch(null)}/>;

  const liveMatch = matches.find(m=>m.status==="live");

  const navItems = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"scoring",   icon:"🏏", label:"Live Scoring" },
    { id:"matches",   icon:"🗓", label:"Matches" },
    { id:"teams",     icon:"🛡", label:"Teams" },
    { id:"players",   icon:"👤", label:"Players" },
    { id:"tournaments",icon:"🏆", label:"Tournaments" },
    { id:"grounds",   icon:"🌿", label:"Grounds" },
    { id:"stats",     icon:"📈", label:"Statistics" },
    ...(CAN.viewAdmin(currentUser.role) ? [{ id:"admin", icon:"⚙️", label:"Admin Panel" }] : []),
  ];

  const handleTabChange = (id) => { setTab(id); setDeepView(null); };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#0a0e1a"}}>
      {/* Sidebar */}
      <div style={{width:sidebarOpen?220:64,background:"#0d1221",borderRight:"1px solid #1a2035",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",transition:"width .25s",overflow:"hidden"}}>
        <div style={{padding:"20px 16px",borderBottom:"1px solid #1a2035",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          {sidebarOpen&&<div><div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:2,color:"#00e5a0"}}>CRICPRO</div><div style={{fontSize:9,color:"#4b5563",letterSpacing:2}}>CRICKET MGMT</div></div>}
          <button onClick={()=>setSidebarOpen(s=>!s)} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:18,padding:4}}>☰</button>
        </div>

        {liveMatch&&sidebarOpen&&(
          <div onClick={()=>setScoringMatch(liveMatch)} style={{margin:"12px 10px",background:"#0d2d20",border:"1px solid #00e5a030",borderRadius:10,padding:"10px 12px",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span className="live-dot"/><span style={{fontSize:10,color:"#ff4d4d",fontWeight:700,letterSpacing:1}}>LIVE</span></div>
            <div style={{fontSize:12,fontWeight:600}}>{liveMatch.team1} vs {liveMatch.team2}</div>
            <div style={{fontSize:11,color:"#00e5a0",fontFamily:"'JetBrains Mono'",marginTop:2}}>{liveMatch.score1} vs {liveMatch.score2}</div>
          </div>
        )}

        <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
          {navItems.map(({id,icon,label})=>(
            <button key={id} onClick={()=>handleTabChange(id)} title={!sidebarOpen?label:""} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:sidebarOpen?"11px 20px":"12px",justifyContent:sidebarOpen?"flex-start":"center",background:tab===id?"#00e5a010":"transparent",color:tab===id?"#00e5a0":"#6b7280",border:"none",borderLeft:`3px solid ${tab===id?"#00e5a0":"transparent"}`,cursor:"pointer",fontSize:14,fontWeight:tab===id?600:400,fontFamily:"'DM Sans'",transition:"all .15s",textAlign:"left"}}>
              <span style={{fontSize:sidebarOpen?16:20}}>{icon}</span>
              {sidebarOpen&&<span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div style={{padding:"14px 16px",borderTop:"1px solid #1a2035"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="avatar" style={{width:32,height:32,fontSize:12,background:avatarColor(currentUser.name)+"25",color:avatarColor(currentUser.name),flexShrink:0}}>{initials(currentUser.name)}</div>
            {sidebarOpen&&(
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.name}</div>
                <span className={`role-badge-${currentUser.role}`} style={{fontSize:9,padding:"1px 6px"}}>{currentUser.role.toUpperCase()}</span>
              </div>
            )}
            {sidebarOpen&&<button onClick={logout} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16}} title="Logout">↩</button>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{flex:1,padding:28,overflowY:"auto",maxWidth:"100%"}}>
        {/* Notifications */}
        <div style={{position:"fixed",top:20,right:20,zIndex:2000,display:"flex",flexDirection:"column",gap:8}}>
          {notifs.map(n=>(
            <div key={n.id} className="fadeIn" style={{background:n.type==="success"?"#00e5a0":n.type==="error"?"#ff6b6b":"#f59e0b",color:"#0a0e1a",padding:"10px 18px",borderRadius:8,fontWeight:700,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>{n.msg}</div>
          ))}
        </div>

        {/* ── ADMIN PANEL ── */}
        {tab==="admin"&&CAN.viewAdmin(currentUser.role)&&(
          <AdminPanel users={users} setUsers={setUsers} currentUser={currentUser} onBack={()=>setTab("dashboard")}/>
        )}

        {/* ── DASHBOARD ── */}
        {tab==="dashboard"&&(
          <div className="fadeIn">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
              <div>
                <h1 className="section-title">DASHBOARD</h1>
                <div style={{fontSize:13,color:"#6b7280",marginTop:2}}>Welcome back, <b style={{color:"#e8eaf6"}}>{currentUser.name}</b> · <span className={`role-badge-${currentUser.role}`}>{currentUser.role.toUpperCase()}</span></div>
              </div>
              {CAN.editMatch(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addMatch");setForm({format:"T20",status:"upcoming"});}}>+ Schedule Match</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
              {[{l:"Total Matches",v:matches.length,icon:"🗓",sub:`${matches.filter(m=>m.status==="live").length} live`,click:()=>setTab("matches")},
                {l:"Teams",v:teams.length,icon:"🛡",sub:`${players.length} players`,click:()=>setTab("teams")},
                {l:"Tournaments",v:tournaments.length,icon:"🏆",sub:`${tournaments.filter(t=>t.status==="Ongoing").length} ongoing`,click:()=>setTab("tournaments")},
                {l:"Grounds",v:grounds.length,icon:"🌿",sub:`${grounds.filter(g=>g.status==="Available").length} available`,click:()=>setTab("grounds")}
              ].map(({l,v,icon,sub,click})=>(
                <div key={l} className="card card-click" style={{padding:20}} onClick={click}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div><div style={{fontFamily:"'Bebas Neue'",fontSize:40,color:"#00e5a0",lineHeight:1}}>{v}</div><div style={{fontWeight:600,fontSize:14,marginTop:4}}>{l}</div><div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{sub}</div></div>
                    <span style={{fontSize:28}}>{icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20}}>
              <div className="card" style={{padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div className="section-title" style={{fontSize:18}}>RECENT MATCHES</div><button className="btn-ghost" style={{fontSize:12}} onClick={()=>setTab("matches")}>View All →</button></div>
                {matches.map(m=>(
                  <div key={m.id} className="card-click" style={{padding:"14px 0",borderBottom:"1px solid #0f1623",cursor:"pointer"}} onClick={()=>{setTab("matches");openDeep("match",m);}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div><div style={{fontWeight:600}}>{m.team1} <span style={{color:"#4b5563"}}>vs</span> {m.team2}</div><div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{m.ground} · {m.format} · {fmtDate(m.date)}</div></div>
                      <span className={`tag ${m.status==="live"?"tag-red":m.status==="completed"?"tag-green":"tag-blue"}`}>{m.status==="live"&&<span className="live-dot" style={{width:6,height:6}}/>}{m.status.toUpperCase()}</span>
                    </div>
                    {m.score1&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#9ca3af"}}>{m.team1}: <b style={{color:"#fff"}}>{m.score1}</b> · {m.team2}: <b style={{color:"#fff"}}>{m.score2||"Yet to bat"}</b></div>}
                    {m.winner&&<div style={{marginTop:4,color:"#00e5a0",fontSize:12,fontWeight:600}}>🏆 {m.winner} won</div>}
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>POINTS TABLE</div>
                {[...teams].sort((a,b)=>b.wins-a.wins).map((t,i)=>(
                  <div key={t.id} className="card-click" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #0f1623",cursor:"pointer"}} onClick={()=>openDeep("team",t)}>
                    <span style={{fontFamily:"'Bebas Neue'",fontSize:20,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#b45309":"#4b5563",width:20}}>{i+1}</span>
                    <span style={{fontSize:20}}>{t.logo}</span>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{t.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{t.wins+t.losses} played</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:"#00e5a0"}}>{t.wins*2} pts</div><div style={{fontSize:11,color:"#6b7280"}}>{t.wins}W {t.losses}L</div></div>
                  </div>
                ))}
              </div>
            </div>
            {/* Top Performers */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:20}}>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>TOP BATSMEN</div>
                <table>
                  <thead><tr><th>#</th><th>Player</th><th>Runs</th><th>Avg</th><th>SR</th></tr></thead>
                  <tbody>
                    {[...players].sort((a,b)=>b.runs-a.runs).slice(0,5).map((p,i)=>(
                      <tr key={p.id} className="clickable-row" onClick={()=>{setTab("players");openDeep("player",p);}}>
                        <td style={{color:i===0?"#f59e0b":"#4b5563",fontFamily:"'Bebas Neue'",fontSize:16}}>{i+1}</td>
                        <td style={{fontWeight:600}}>{p.name}</td>
                        <td style={{color:"#00e5a0",fontWeight:700}}>{p.runs}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.avg}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.sr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>TOP BOWLERS</div>
                <table>
                  <thead><tr><th>#</th><th>Player</th><th>Wkts</th><th>Eco</th></tr></thead>
                  <tbody>
                    {[...players].filter(p=>p.wickets>0).sort((a,b)=>b.wickets-a.wickets).slice(0,5).map((p,i)=>(
                      <tr key={p.id} className="clickable-row" onClick={()=>{setTab("players");openDeep("player",p);}}>
                        <td style={{color:i===0?"#f59e0b":"#4b5563",fontFamily:"'Bebas Neue'",fontSize:16}}>{i+1}</td>
                        <td style={{fontWeight:600}}>{p.name}</td>
                        <td style={{color:"#60a5fa",fontWeight:700}}>{p.wickets}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── MATCHES ── */}
        {tab==="matches"&&(
          deepView?.type==="match" ? <MatchDetail match={deepView.item} players={players} currentUser={currentUser} onBack={closeDeep} onScore={setScoringMatch}/> :
          <div className="fadeIn">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="section-title">MATCHES</h1>
              {CAN.editMatch(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addMatch");setForm({format:"T20",status:"upcoming"});}}>+ Add Match</button>}
            </div>
            {["live","upcoming","completed"].map(status=>{
              const filtered=matches.filter(m=>m.status===status);
              if(!filtered.length) return null;
              return (
                <div key={status} style={{marginBottom:24}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    {status==="live"&&<span className="live-dot"/>}
                    <span style={{fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:1,color:status==="live"?"#ff4d4d":status==="completed"?"#00e5a0":"#60a5fa"}}>{status.toUpperCase()} ({filtered.length})</span>
                  </div>
                  {filtered.map(m=>(
                    <div key={m.id} className="card card-click" style={{padding:18,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>openDeep("match",m)}>
                      <div>
                        <div style={{fontWeight:700,fontSize:16}}>{m.team1} vs {m.team2}</div>
                        {m.score1&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#9ca3af",marginTop:4}}>{m.team1}: {m.score1} ({m.overs1}) | {m.team2}: {m.score2||"Yet to bat"}</div>}
                        {m.winner&&<div style={{color:"#00e5a0",fontSize:13,fontWeight:600,marginTop:4}}>🏆 {m.winner} won · {m.mom&&`⭐ MOM: ${m.mom}`}</div>}
                        <div style={{fontSize:12,color:"#6b7280",marginTop:4,display:"flex",gap:12,flexWrap:"wrap"}}>
                          <span>📍 {m.ground}</span><span>📅 {fmtDate(m.date)} {m.time}</span><span>🎯 {m.format}</span>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                        {CAN.scoreMatch(currentUser.role)&&m.status==="live"&&<button className="btn-primary" style={{padding:"8px 14px",fontSize:13}} onClick={()=>setScoringMatch(m)}>▶ Score</button>}
                        {CAN.editMatch(currentUser.role)&&m.status==="upcoming"&&<button className="btn-yellow" style={{padding:"8px 14px",fontSize:13}} onClick={()=>{setMatches(ms=>ms.map(x=>x.id===m.id?{...x,status:"live"}:x));notify("Match started!");}}>Start</button>}
                        {CAN.editMatch(currentUser.role)&&<button className="btn-danger" style={{padding:"8px 12px",fontSize:12}} onClick={()=>{setMatches(ms=>ms.filter(x=>x.id!==m.id));notify("Match removed");}}>✕</button>}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TEAMS ── */}
        {tab==="teams"&&(
          deepView?.type==="team" ? (
            <div className="fadeIn">
              <div className="breadcrumb"><span onClick={closeDeep} style={{cursor:"pointer",color:"#00e5a0"}}>Teams</span><span>›</span><span className="current">{deepView.item.name}</span></div>
              <div className="card" style={{padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,right:0,width:150,height:150,background:deepView.item.color,opacity:.06,borderRadius:"0 0 0 150px"}}/>
                <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20}}>
                  <span style={{fontSize:48}}>{deepView.item.logo}</span>
                  <div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:34}}>{deepView.item.name}</div>
                    <div style={{display:"flex",gap:8,marginTop:6}}><span className="tag tag-blue">{deepView.item.short}</span><span className="tag tag-green">📍 {deepView.item.city}</span><span className="tag tag-yellow">🏠 {deepView.item.homeGround}</span></div>
                    <div style={{marginTop:8,fontSize:13,color:"#9ca3af"}}>👑 Captain: {deepView.item.captain} · Founded: {deepView.item.founded}</div>
                  </div>
                  {CAN.editTeam(currentUser.role)&&<button className="btn-ghost" style={{marginLeft:"auto",fontSize:12}}>✏ Edit Team</button>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
                  {[["Players",deepView.item.players],["Wins",deepView.item.wins],["Losses",deepView.item.losses],["Win%",Math.round(deepView.item.wins/(deepView.item.wins+deepView.item.losses)*100)+"%"],["Points",deepView.item.wins*2]].map(([l,v])=>(
                    <div key={l} className="stat-box"><div className="val">{v}</div><div className="lbl">{l}</div></div>
                  ))}
                </div>
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>SQUAD</div>
                <table>
                  <thead><tr><th>#</th><th>Player</th><th>Role</th><th>M</th><th>Runs</th><th>Avg</th><th>Wkts</th><th>Eco</th></tr></thead>
                  <tbody>
                    {players.filter(p=>p.team===deepView.item.name).map((p,i)=>(
                      <tr key={p.id} className="clickable-row" onClick={()=>openDeep("player",p)}>
                        <td style={{color:"#6b7280"}}>{i+1}</td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div className="avatar" style={{width:28,height:28,fontSize:11,background:avatarColor(p.name)+"25",color:avatarColor(p.name)}}>{initials(p.name)}</div>
                            <span style={{fontWeight:600}}>{p.name}</span>
                            {deepView.item.captain===p.name&&<span style={{fontSize:12}}>👑</span>}
                          </div>
                        </td>
                        <td><span className={`tag ${p.role==="Batsman"?"tag-blue":p.role==="Bowler"?"tag-red":p.role.includes("WK")?"tag-yellow":"tag-purple"}`} style={{fontSize:10}}>{p.role}</span></td>
                        <td>{p.matches}</td>
                        <td style={{color:"#00e5a0",fontWeight:700}}>{p.runs}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.avg}</td>
                        <td style={{color:"#60a5fa",fontWeight:700}}>{p.wickets}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.economy||"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="fadeIn">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <h1 className="section-title">TEAMS</h1>
                {CAN.editTeam(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addTeam");setForm({color:"#00e5a0",logo:"🟢"});}}>+ Add Team</button>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
                {teams.map(t=>(
                  <div key={t.id} className="card card-click" style={{padding:24,position:"relative",overflow:"hidden"}} onClick={()=>openDeep("team",t)}>
                    <div style={{position:"absolute",top:0,right:0,width:80,height:80,background:t.color,opacity:.08,borderRadius:"0 0 0 80px"}}/>
                    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                      <span style={{fontSize:36}}>{t.logo}</span>
                      <div><div style={{fontFamily:"'Bebas Neue'",fontSize:22}}>{t.name}</div><span className="tag tag-blue">{t.short}</span></div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                      {[["Players",t.players],["Wins",t.wins],["Losses",t.losses]].map(([l,v])=>(
                        <div key={l} className="stat-box"><div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:t.color}}>{v}</div><div style={{fontSize:10,color:"#6b7280"}}>{l}</div></div>
                      ))}
                    </div>
                    <div style={{fontSize:12,color:"#6b7280"}}>👑 {t.captain}</div>
                    <div style={{fontSize:11,color:"#4b5563",marginTop:4}}>📍 {t.city} · Est. {t.founded}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* ── PLAYERS ── */}
        {tab==="players"&&(
          deepView?.type==="player" ? <PlayerProfile player={deepView.item} matches={matches} teams={teams} currentUser={currentUser} onBack={closeDeep}/> :
          <div className="fadeIn">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="section-title">PLAYERS</h1>
              <div style={{display:"flex",gap:10}}>
                <input placeholder="Search players..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{width:220}}/>
                {CAN.editPlayer(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addPlayer");setForm({role:"Batsman"});}}>+ Add Player</button>}
              </div>
            </div>
            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <table>
                <thead><tr><th>#</th><th>Player</th><th>Team</th><th>Role</th><th>M</th><th>Runs</th><th>Avg</th><th>SR</th><th>Wkts</th><th>Eco</th><th>Ct</th>{CAN.editPlayer(currentUser.role)&&<th></th>}</tr></thead>
                <tbody>
                  {players.filter(p=>!searchQuery||p.name.toLowerCase().includes(searchQuery.toLowerCase())||p.team.toLowerCase().includes(searchQuery.toLowerCase())).map((p,i)=>(
                    <tr key={p.id} className="clickable-row" onClick={()=>openDeep("player",p)}>
                      <td style={{color:"#6b7280"}}>{i+1}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="avatar" style={{width:28,height:28,fontSize:11,background:avatarColor(p.name)+"25",color:avatarColor(p.name)}}>{initials(p.name)}</div>
                          <span style={{fontWeight:700}}>{p.name}</span>
                          {currentUser.role===ROLES.PLAYER&&currentUser.name===p.name&&<span style={{fontSize:10,color:"#00e5a0"}}>(you)</span>}
                        </div>
                      </td>
                      <td style={{fontSize:12,color:"#9ca3af"}}>{p.team}</td>
                      <td><span className={`tag ${p.role==="Batsman"?"tag-blue":p.role==="Bowler"?"tag-red":p.role.includes("WK")?"tag-yellow":"tag-purple"}`} style={{fontSize:10}}>{p.role}</span></td>
                      <td>{p.matches}</td>
                      <td style={{color:"#00e5a0",fontWeight:700,fontFamily:"'JetBrains Mono'"}}>{p.runs}</td>
                      <td style={{fontFamily:"'JetBrains Mono'"}}>{p.avg}</td>
                      <td style={{fontFamily:"'JetBrains Mono'"}}>{p.sr}</td>
                      <td style={{color:"#60a5fa",fontWeight:700,fontFamily:"'JetBrains Mono'"}}>{p.wickets}</td>
                      <td style={{fontFamily:"'JetBrains Mono'"}}>{p.economy||"—"}</td>
                      <td>{p.catches}</td>
                      {CAN.editPlayer(currentUser.role)&&(
                        <td onClick={e=>e.stopPropagation()}>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn-ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>{setEditItem(p);setModal("addPlayer");setForm({...p});}}>Edit</button>
                            <button className="btn-danger" style={{padding:"4px 10px",fontSize:11}} onClick={()=>{setPlayers(ps=>ps.filter(x=>x.id!==p.id));notify("Player removed");}}>✕</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TOURNAMENTS ── */}
        {tab==="tournaments"&&(
          deepView?.type==="tournament" ? <TournamentDetail tournament={deepView.item} teams={teams} matches={matches} players={players} currentUser={currentUser} onBack={closeDeep}/> :
          <div className="fadeIn">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="section-title">TOURNAMENTS & LEAGUES</h1>
              {CAN.editTournament(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addTournament");setForm({format:"T20",teams:8,registered:[]});}}>+ Create</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
              {tournaments.map(t=>(
                <div key={t.id} className="card card-click" style={{padding:24}} onClick={()=>openDeep("tournament",t)}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <span className={`tag ${t.status==="Ongoing"?"tag-green":t.status==="Upcoming"?"tag-blue":"tag-yellow"}`}>{t.status}</span>
                    <span className="tag tag-purple">{t.format}</span>
                  </div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:6}}>{t.name}</div>
                  <div style={{fontSize:12,color:"#9ca3af",marginBottom:12}}>{t.description}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                    {[["Teams",t.teams],["Registered",t.registered.length],["Prize",t.prize]].map(([l,v])=>(
                      <div key={l} className="stat-box"><div className="val" style={{fontSize:20}}>{v}</div><div className="lbl">{l}</div></div>
                    ))}
                  </div>
                  <div style={{fontSize:12,color:"#6b7280"}}>📅 {fmtDate(t.startDate)} → {fmtDate(t.endDate)}</div>
                  {currentUser.role===ROLES.PLAYER&&!t.registered.includes(currentUser.team)&&t.status==="Upcoming"&&(
                    <button className="btn-ghost" style={{width:"100%",marginTop:12,fontSize:12}} onClick={e=>{e.stopPropagation();if(currentUser.team){setTournaments(ts=>ts.map(x=>x.id===t.id?{...x,registered:[...x.registered,currentUser.team]}:x));notify("Registered!");}else notify("No team assigned","error");}}>
                      Register My Team
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GROUNDS ── */}
        {tab==="grounds"&&(
          deepView?.type==="ground" ? <GroundDetail ground={deepView.item} matches={matches} currentUser={currentUser} onBack={closeDeep}/> :
          <div className="fadeIn">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h1 className="section-title">GROUNDS</h1>
              {CAN.editGround(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addGround");setForm({status:"Available",pitchType:"Balanced",floodlights:"true"});}}>+ Add Ground</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
              {grounds.map(g=>(
                <div key={g.id} className="card card-click" style={{padding:22}} onClick={()=>openDeep("ground",g)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div><div style={{fontFamily:"'Bebas Neue'",fontSize:20}}>{g.name}</div><div style={{fontSize:12,color:"#9ca3af"}}>📍 {g.city}</div></div>
                    <span className={`tag ${g.status==="Available"?"tag-green":g.status==="Booked"?"tag-blue":"tag-yellow"}`}>{g.status}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                    <div className="stat-box"><div className="val" style={{fontSize:20}}>{g.capacity.toLocaleString()}</div><div className="lbl">Capacity</div></div>
                    <div className="stat-box"><div style={{fontWeight:700,fontSize:14,marginTop:6}}>{g.pitchType}</div><div className="lbl">Pitch</div></div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                    <span style={{color:g.floodlights?"#00e5a0":"#6b7280"}}>💡 {g.floodlights?"Floodlights":"No Lights"}</span>
                    {CAN.editGround(currentUser.role)&&g.status==="Available"&&(
                      <button className="btn-primary" style={{padding:"4px 12px",fontSize:11}} onClick={e=>{e.stopPropagation();setGrounds(gs=>gs.map(x=>x.id===g.id?{...x,status:"Booked"}:x));notify(`${g.name} booked!`);}}>Book</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {tab==="stats"&&(
          <div className="fadeIn">
            <h1 className="section-title" style={{marginBottom:24}}>STATISTICS HUB</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
              {[["Total Runs",players.reduce((a,p)=>a+p.runs,0).toLocaleString()],["Total Wickets",players.reduce((a,p)=>a+p.wickets,0)],["Matches Played",matches.filter(m=>m.status!=="upcoming").length]].map(([l,v])=>(
                <div key={l} className="card" style={{padding:20,textAlign:"center"}}>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:48,color:"#00e5a0"}}>{v}</div>
                  <div style={{color:"#9ca3af",fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>BATTING RANKINGS</div>
                <table>
                  <thead><tr><th>Rank</th><th>Player</th><th>Team</th><th>Runs</th><th>HS</th><th>Avg</th><th>100s</th><th>50s</th></tr></thead>
                  <tbody>
                    {[...players].sort((a,b)=>b.runs-a.runs).map((p,i)=>(
                      <tr key={p.id} className="clickable-row" onClick={()=>openDeep("player",p)}>
                        <td style={{fontFamily:"'Bebas Neue'",color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#b45309":"#4b5563",fontSize:16}}>{i+1}</td>
                        <td style={{fontWeight:600}}>{p.name}</td>
                        <td style={{fontSize:11,color:"#6b7280"}}>{p.team}</td>
                        <td style={{color:"#00e5a0",fontWeight:700}}>{p.runs}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.hs}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.avg}</td>
                        <td style={{color:"#f59e0b"}}>{p.hundreds}</td>
                        <td style={{color:"#f59e0b"}}>{p.fifties}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>BOWLING RANKINGS</div>
                <table>
                  <thead><tr><th>Rank</th><th>Player</th><th>Team</th><th>Wkts</th><th>Eco</th><th>Avg</th></tr></thead>
                  <tbody>
                    {[...players].filter(p=>p.wickets>0).sort((a,b)=>b.wickets-a.wickets).map((p,i)=>(
                      <tr key={p.id} className="clickable-row" onClick={()=>openDeep("player",p)}>
                        <td style={{fontFamily:"'Bebas Neue'",color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#b45309":"#4b5563",fontSize:16}}>{i+1}</td>
                        <td style={{fontWeight:600}}>{p.name}</td>
                        <td style={{fontSize:11,color:"#6b7280"}}>{p.team}</td>
                        <td style={{color:"#60a5fa",fontWeight:700}}>{p.wickets}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.economy}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{(p.runs/p.wickets).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>ALL-ROUNDERS</div>
                <table>
                  <thead><tr><th>Player</th><th>Team</th><th>Runs</th><th>Wkts</th><th>Catches</th></tr></thead>
                  <tbody>
                    {players.filter(p=>p.runs>50&&p.wickets>0).map(p=>(
                      <tr key={p.id} className="clickable-row" onClick={()=>openDeep("player",p)}>
                        <td style={{fontWeight:600}}>{p.name}</td>
                        <td style={{fontSize:11,color:"#6b7280"}}>{p.team}</td>
                        <td style={{color:"#00e5a0"}}>{p.runs}</td>
                        <td style={{color:"#60a5fa"}}>{p.wickets}</td>
                        <td>{p.catches}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>TEAM PERFORMANCE</div>
                <table>
                  <thead><tr><th>Team</th><th>P</th><th>W</th><th>L</th><th>Win%</th><th>Pts</th></tr></thead>
                  <tbody>
                    {[...teams].sort((a,b)=>b.wins-a.wins).map(t=>(
                      <tr key={t.id} className="clickable-row" onClick={()=>{setTab("teams");openDeep("team",t);}}>
                        <td><div style={{display:"flex",alignItems:"center",gap:8}}><span>{t.logo}</span><span style={{fontWeight:700}}>{t.short}</span></div></td>
                        <td>{t.wins+t.losses}</td>
                        <td style={{color:"#00e5a0"}}>{t.wins}</td>
                        <td style={{color:"#ff6b6b"}}>{t.losses}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{Math.round(t.wins/(t.wins+t.losses)*100)}%</td>
                        <td style={{color:"#f59e0b",fontWeight:700,fontFamily:"'Bebas Neue'",fontSize:18}}>{t.wins*2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── LIVE SCORING TAB ── */}
        {tab==="scoring"&&(
          <div className="fadeIn">
            <h1 className="section-title" style={{marginBottom:24}}>LIVE SCORING</h1>
            {!CAN.scoreMatch(currentUser.role)&&(
              <div style={{background:"#f59e0b15",border:"1px solid #f59e0b30",borderRadius:10,padding:"14px 18px",color:"#f59e0b",marginBottom:20,fontSize:13}}>
                ⚠️ Your role (<b>{currentUser.role}</b>) cannot score matches. Contact an Admin or Organizer to change your role.
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
              {matches.map(m=>(
                <div key={m.id} className="card" style={{padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <span className={`tag ${m.status==="live"?"tag-red":m.status==="completed"?"tag-green":"tag-blue"}`}>{m.status==="live"&&<span className="live-dot" style={{width:6,height:6}}/>}{m.status.toUpperCase()}</span>
                    <span className="tag tag-purple">{m.format}</span>
                  </div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:22}}>{m.team1}</div>
                  {m.score1&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:18,color:"#00e5a0"}}>{m.score1} <span style={{fontSize:13,color:"#6b7280"}}>({m.overs1})</span></div>}
                  <div style={{color:"#6b7280",fontSize:13,margin:"4px 0"}}>vs</div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:22}}>{m.team2}</div>
                  {m.score2&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:18,color:"#60a5fa"}}>{m.score2} <span style={{fontSize:13,color:"#6b7280"}}>({m.overs2})</span></div>}
                  {m.winner&&<div style={{marginTop:8,color:"#00e5a0",fontWeight:700,fontSize:13}}>🏆 {m.winner} won</div>}
                  <div style={{marginTop:12,fontSize:12,color:"#6b7280"}}>📍 {m.ground} · 📅 {fmtDate(m.date)}</div>
                  {CAN.scoreMatch(currentUser.role)&&m.status==="live"&&(
                    <button className="btn-primary" style={{marginTop:12,width:"100%"}} onClick={()=>setScoringMatch(m)}>▶ Open Scorer</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {modal&&(
        <div className="modal-overlay" onClick={e=>{if(e.target.className==="modal-overlay")closeModal();}}>
          <div className="modal">
            {modal==="addTeam"&&(
              <>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:24,marginBottom:20}}>ADD TEAM</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <input placeholder="Team Name" value={form.name||""} onChange={setF("name")}/>
                  <div className="grid-2"><input placeholder="Short (e.g. RCB)" value={form.short||""} onChange={setF("short")}/><input placeholder="Logo Emoji 🔴" value={form.logo||""} onChange={setF("logo")}/></div>
                  <input placeholder="Captain Name" value={form.captain||""} onChange={setF("captain")}/>
                  <div className="grid-2"><input placeholder="City" value={form.city||""} onChange={setF("city")}/><input placeholder="Founded Year" value={form.founded||""} onChange={setF("founded")}/></div>
                  <div className="grid-2"><input placeholder="Team Color (#hex)" value={form.color||""} onChange={setF("color")}/><input type="number" placeholder="Players" value={form.players||""} onChange={setF("players")}/></div>
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    <button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.name)return notify("Name required","error");setTeams(ts=>[...ts,{id:uid(),wins:0,losses:0,players:parseInt(form.players)||11,...form}]);closeModal();notify("Team added!");}}>Add</button>
                    <button className="btn-ghost" onClick={closeModal}>Cancel</button>
                  </div>
                </div>
              </>
            )}
            {modal==="addPlayer"&&(
              <>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:24,marginBottom:20}}>{editItem?"EDIT PLAYER":"ADD PLAYER"}</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <input placeholder="Player Name" value={form.name||""} onChange={setF("name")}/>
                  <div className="grid-2">
                    <select value={form.team||""} onChange={setF("team")}><option value="">Select Team</option>{teams.map(t=><option key={t.id}>{t.name}</option>)}</select>
                    <select value={form.role||"Batsman"} onChange={setF("role")}>{["Batsman","Bowler","All-rounder","WK-Batsman"].map(r=><option key={r}>{r}</option>)}</select>
                  </div>
                  <textarea placeholder="Player bio..." value={form.bio||""} onChange={setF("bio")} rows={2}/>
                  <div className="grid-3"><input type="number" placeholder="Matches" value={form.matches||""} onChange={setF("matches")}/><input type="number" placeholder="Runs" value={form.runs||""} onChange={setF("runs")}/><input type="number" placeholder="Avg" value={form.avg||""} onChange={setF("avg")}/></div>
                  <div className="grid-3"><input type="number" placeholder="SR" value={form.sr||""} onChange={setF("sr")}/><input type="number" placeholder="Wickets" value={form.wickets||""} onChange={setF("wickets")}/><input type="number" placeholder="Economy" value={form.economy||""} onChange={setF("economy")}/></div>
                  <div className="grid-3"><input type="number" placeholder="Catches" value={form.catches||""} onChange={setF("catches")}/><input type="number" placeholder="Fifties" value={form.fifties||""} onChange={setF("fifties")}/><input type="number" placeholder="Hundreds" value={form.hundreds||""} onChange={setF("hundreds")}/></div>
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    <button className="btn-primary" style={{flex:1}} onClick={()=>{
                      if(!form.name)return notify("Name required","error");
                      const d={...form,matches:+form.matches||0,runs:+form.runs||0,avg:+form.avg||0,sr:+form.sr||0,wickets:+form.wickets||0,economy:+form.economy||0,catches:+form.catches||0,fifties:+form.fifties||0,hundreds:+form.hundreds||0,hs:+form.hs||0,ducks:+form.ducks||0,balls_faced:+form.balls_faced||0,fours:+form.fours||0,sixes:+form.sixes||0};
                      if(editItem){setPlayers(ps=>ps.map(p=>p.id===editItem.id?{...p,...d}:p));notify("Player updated!");}
                      else{setPlayers(ps=>[...ps,{id:uid(),...d}]);notify("Player added!");}
                      closeModal();
                    }}>Save</button>
                    <button className="btn-ghost" onClick={closeModal}>Cancel</button>
                  </div>
                </div>
              </>
            )}
            {modal==="addMatch"&&(
              <>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:24,marginBottom:20}}>SCHEDULE MATCH</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div className="grid-2">
                    <select value={form.team1||""} onChange={setF("team1")}><option value="">Team 1</option>{teams.map(t=><option key={t.id}>{t.name}</option>)}</select>
                    <select value={form.team2||""} onChange={setF("team2")}><option value="">Team 2</option>{teams.filter(t=>t.name!==form.team1).map(t=><option key={t.id}>{t.name}</option>)}</select>
                  </div>
                  <div className="grid-2"><input type="date" value={form.date||""} onChange={setF("date")}/><input type="time" value={form.time||""} onChange={setF("time")}/></div>
                  <div className="grid-2">
                    <select value={form.format||"T20"} onChange={setF("format")}>{["T20","50-Over","Test","T10"].map(f=><option key={f}>{f}</option>)}</select>
                    <select value={form.ground||""} onChange={setF("ground")}><option value="">Select Ground</option>{grounds.filter(g=>g.status!=="Maintenance").map(g=><option key={g.id}>{g.name}</option>)}</select>
                  </div>
                  <select value={form.tournament||""} onChange={setF("tournament")}><option value="">No Tournament</option>{tournaments.map(t=><option key={t.id}>{t.name}</option>)}</select>
                  <input placeholder="Match notes (optional)" value={form.notes||""} onChange={setF("notes")}/>
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    <button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.team1||!form.team2)return notify("Select both teams","error");setMatches(ms=>[...ms,{id:uid(),status:"upcoming",innings:1,...form}]);closeModal();notify("Match scheduled!");}}>Schedule</button>
                    <button className="btn-ghost" onClick={closeModal}>Cancel</button>
                  </div>
                </div>
              </>
            )}
            {modal==="addTournament"&&(
              <>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:24,marginBottom:20}}>CREATE TOURNAMENT</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <input placeholder="Tournament Name" value={form.name||""} onChange={setF("name")}/>
                  <textarea placeholder="Description" value={form.description||""} onChange={setF("description")} rows={2}/>
                  <div className="grid-2"><select value={form.format||"T20"} onChange={setF("format")}>{["T20","50-Over","T10","Test"].map(f=><option key={f}>{f}</option>)}</select><input type="number" placeholder="No. of Teams" value={form.teams||""} onChange={setF("teams")}/></div>
                  <div className="grid-2"><input type="date" value={form.startDate||""} onChange={setF("startDate")}/><input type="date" value={form.endDate||""} onChange={setF("endDate")}/></div>
                  <div className="grid-2"><input placeholder="Prize Money (e.g. ₹50,000)" value={form.prize||""} onChange={setF("prize")}/><select value={form.status||"Upcoming"} onChange={setF("status")}>{["Upcoming","Ongoing","Completed"].map(s=><option key={s}>{s}</option>)}</select></div>
                  <div style={{fontSize:12,color:"#6b7280"}}>Register Teams:</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {teams.map(t=>{const sel=(form.registered||[]).includes(t.name);return(
                      <button key={t.id} onClick={()=>setForm(f=>({...f,registered:sel?(f.registered||[]).filter(x=>x!==t.name):[...(f.registered||[]),t.name]}))} style={{background:sel?"#00e5a0":"#111827",color:sel?"#0a0e1a":"#9ca3af",border:`1px solid ${sel?"#00e5a0":"#1a2035"}`,borderRadius:6,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.logo} {t.name}</button>
                    );})}
                  </div>
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    <button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.name)return notify("Name required","error");setTournaments(ts=>[...ts,{id:uid(),registered:[],createdBy:currentUser.id,...form,teams:parseInt(form.teams)||8}]);closeModal();notify("Tournament created!");}}>Create</button>
                    <button className="btn-ghost" onClick={closeModal}>Cancel</button>
                  </div>
                </div>
              </>
            )}
            {modal==="addGround"&&(
              <>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:24,marginBottom:20}}>ADD GROUND</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <input placeholder="Ground Name" value={form.name||""} onChange={setF("name")}/>
                  <div className="grid-2"><input placeholder="City" value={form.city||""} onChange={setF("city")}/><input type="number" placeholder="Capacity" value={form.capacity||""} onChange={setF("capacity")}/></div>
                  <div className="grid-2">
                    <select value={form.pitchType||"Balanced"} onChange={setF("pitchType")}>{["Batting","Bowling","Balanced","Pace","Spin"].map(p=><option key={p}>{p}</option>)}</select>
                    <select value={form.floodlights||"true"} onChange={setF("floodlights")}><option value="true">Floodlights ✓</option><option value="false">No Floodlights</option></select>
                  </div>
                  <div className="grid-2"><input placeholder="Contact Number" value={form.contact||""} onChange={setF("contact")}/><select value={form.status||"Available"} onChange={setF("status")}>{["Available","Booked","Maintenance"].map(s=><option key={s}>{s}</option>)}</select></div>
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    <button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.name)return notify("Name required","error");setGrounds(gs=>[...gs,{id:uid(),floodlights:form.floodlights!=="false",capacity:parseInt(form.capacity)||1000,facilities:[],...form}]);closeModal();notify("Ground added!");}}>Add</button>
                    <button className="btn-ghost" onClick={closeModal}>Cancel</button>
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