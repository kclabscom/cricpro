import { useState, useEffect, useRef } from "react";
import { supabaseClient } from "./supabaseClient";

// ── Fonts ──
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap";
document.head.appendChild(fl);

// ── Global CSS ──
const G = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0e1a;color:#e8eaf6;font-family:'DM Sans',sans-serif}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d1221}::-webkit-scrollbar-thumb{background:#00e5a0;border-radius:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,229,160,.4)}50%{box-shadow:0 0 0 8px rgba(0,229,160,0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.fadeIn{animation:fadeIn .3s ease both}
.live-dot{width:8px;height:8px;border-radius:50%;background:#ff4d4d;animation:pulse 1.5s infinite;display:inline-block}
.card{background:#0d1221;border:1px solid #1a2035;border-radius:12px;transition:border-color .2s,transform .2s}
.card:hover{border-color:#00e5a040}
.card-click{cursor:pointer}.card-click:hover{border-color:#00e5a0;transform:translateY(-2px)}
.btn-primary{background:#00e5a0;color:#0a0e1a;border:none;border-radius:8px;padding:10px 20px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s}
.btn-primary:hover{background:#00ffb3;transform:translateY(-1px)}
.btn-ghost{background:transparent;color:#00e5a0;border:1px solid #00e5a030;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s}
.btn-ghost:hover{border-color:#00e5a0;background:#00e5a010}
.btn-pro{background:linear-gradient(135deg,#f59e0b,#fb923c);color:#0a0e1a;border:none;border-radius:8px;padding:10px 20px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s}
.btn-pro:hover{opacity:.9;transform:translateY(-1px)}
.btn-danger{background:transparent;color:#ff6b6b;border:1px solid #ff6b6b30;border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s}
.btn-danger:hover{background:#ff6b6b15;border-color:#ff6b6b}
input,select,textarea{background:#111827;border:1px solid #1e2a3a;border-radius:8px;color:#e8eaf6;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 14px;width:100%;outline:none;transition:border-color .2s}
input:focus,select:focus,textarea:focus{border-color:#00e5a0}
select option{background:#111827}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.5px}
.tag-green{background:#00e5a015;color:#00e5a0;border:1px solid #00e5a030}
.tag-blue{background:#3b82f615;color:#60a5fa;border:1px solid #3b82f630}
.tag-red{background:#ff6b6b15;color:#ff6b6b;border:1px solid #ff6b6b30}
.tag-yellow{background:#f59e0b15;color:#f59e0b;border:1px solid #f59e0b30}
.tag-purple{background:#a78bfa15;color:#a78bfa;border:1px solid #a78bfa30}
.tag-pro{background:linear-gradient(135deg,#f59e0b20,#fb923c20);color:#f59e0b;border:1px solid #f59e0b40}
.pro-lock{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#f59e0b15,#fb923c15);border:1px solid #f59e0b30;border-radius:8px;padding:8px 14px;color:#f59e0b;font-size:13px;font-weight:600}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:#0d1221;border:1px solid #1a2035;border-radius:16px;padding:28px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;animation:fadeIn .25s ease}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.stat-box{background:#111827;border-radius:10px;padding:16px;text-align:center;cursor:pointer;transition:all .2s}
.stat-box:hover{border:1px solid #00e5a040;background:#0d2d20}
.stat-box .val{font-family:'Bebas Neue',sans-serif;font-size:32px;color:#00e5a0;line-height:1}
.stat-box .lbl{font-size:11px;color:#6b7280;margin-top:4px;letter-spacing:.5px;text-transform:uppercase}
table{width:100%;border-collapse:collapse;font-size:13px}
th{color:#6b7280;font-weight:600;text-transform:uppercase;font-size:11px;letter-spacing:.5px;padding:10px 12px;border-bottom:1px solid #1a2035;text-align:left}
td{padding:10px 12px;border-bottom:1px solid #0f1623}
tr:last-child td{border-bottom:none}
.clickable-row{cursor:pointer}.clickable-row:hover td{background:#0d2d20!important}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;color:#fff}
.breadcrumb{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b7280;margin-bottom:20px;flex-wrap:wrap}
.breadcrumb .bc-link{color:#00e5a0;cursor:pointer}.breadcrumb .bc-link:hover{text-decoration:underline}
.role-badge-admin{background:#ff6b6b15;color:#ff6b6b;border:1px solid #ff6b6b30;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}
.role-badge-organizer{background:#f59e0b15;color:#f59e0b;border:1px solid #f59e0b30;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}
.role-badge-scorer{background:#3b82f615;color:#60a5fa;border:1px solid #3b82f630;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}
.role-badge-player{background:#a78bfa15;color:#a78bfa;border:1px solid #a78bfa30;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}
.role-badge-viewer{background:#1a2035;color:#9ca3af;border:1px solid #1a2035;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}
.plan-free{background:#1a2035;border:1px solid #2a3045;border-radius:14px;padding:24px}
.plan-pro{background:linear-gradient(135deg,#1a1500,#1a0d00);border:2px solid #f59e0b50;border-radius:14px;padding:24px;position:relative;overflow:hidden}
.plan-pro::before{content:'';position:absolute;top:0;right:0;width:100px;height:100px;background:radial-gradient(circle,#f59e0b15,transparent);pointer-events:none}
.chart-bar{background:#1a2035;border-radius:4px;position:relative;overflow:hidden;transition:all .3s}
.chart-fill{position:absolute;bottom:0;left:0;right:0;border-radius:4px;transition:height .8s ease}
.innings-row{cursor:pointer;transition:background .15s}.innings-row:hover{background:#0d2d20}
.pro-banner{background:linear-gradient(135deg,#1a1500,#1a0a00);border:1px solid #f59e0b40;border-radius:12px;padding:20px;display:flex;align-items:center;gap:16px;margin-bottom:20px}
`;
const sEl = document.createElement("style"); sEl.textContent = G; document.head.appendChild(sEl);

// ── Helpers ──
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2);
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
const initials = n => n ? n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "??";
const avatarColor = n => { const c=["#00e5a0","#60a5fa","#f59e0b","#a78bfa","#fb923c","#f472b6"]; let h=0; for(let ch of(n||""))h=ch.charCodeAt(0)+((h<<5)-h); return c[Math.abs(h)%c.length]; };

// ── ROLES & PLANS ──
const ROLES = { ADMIN:"admin", ORGANIZER:"organizer", SCORER:"scorer", PLAYER:"player", VIEWER:"viewer" };
const PLANS = { FREE:"free", PRO:"pro" };
const CAN = {
  editTeam:    r=>[ROLES.ADMIN,ROLES.ORGANIZER].includes(r),
  editPlayer:  r=>[ROLES.ADMIN,ROLES.ORGANIZER].includes(r),
  editMatch:   r=>[ROLES.ADMIN,ROLES.ORGANIZER].includes(r),
  scoreMatch:  r=>[ROLES.ADMIN,ROLES.SCORER,ROLES.ORGANIZER].includes(r),
  editTournament:r=>[ROLES.ADMIN,ROLES.ORGANIZER].includes(r),
  editGround:  r=>[ROLES.ADMIN,ROLES.ORGANIZER].includes(r),
  manageUsers: r=>r===ROLES.ADMIN,
};
const isPro = u => u?.plan===PLANS.PRO||u?.role===ROLES.ADMIN||u?.role===ROLES.ORGANIZER;

// ── PRO GATE COMPONENT ──
function ProGate({ user, onUpgrade, children, feature="This feature" }) {
  if(isPro(user)) return children;
  return (
    <div className="pro-banner">
      <div style={{fontSize:32}}>🔒</div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,color:"#f59e0b",marginBottom:4}}>{feature} is a Pro Feature</div>
        <div style={{fontSize:13,color:"#9ca3af"}}>Upgrade to CricPro Pro for ₹99/month to unlock deep stats, charts, innings history and more.</div>
      </div>
      <button className="btn-pro" onClick={onUpgrade}>Upgrade ₹99/mo</button>
    </div>
  );
}

// ── MINI BAR CHART ──
function BarChart({ data, color="#00e5a0", label="" }) {
  const max = Math.max(...data.map(d=>d.val), 1);
  return (
    <div>
      {label&&<div style={{fontSize:11,color:"#6b7280",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{label}</div>}
      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
        {data.map((d,i)=>(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:"100%",height:70,position:"relative"}}>
              <div className="chart-bar" style={{width:"100%",height:"100%"}}>
                <div className="chart-fill" style={{height:`${(d.val/max)*100}%`,background:color,opacity:.85}}/>
              </div>
            </div>
            <div style={{fontSize:10,color:"#6b7280",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:32,textAlign:"center"}}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LINE CHART (SVG) ──
function LineChart({ data, color="#00e5a0", label="" }) {
  if(!data||data.length<2) return <div style={{color:"#6b7280",fontSize:13}}>Not enough data</div>;
  const W=300,H=80,pad=10;
  const vals=data.map(d=>d.val);
  const mn=Math.min(...vals), mx=Math.max(...vals,mn+1);
  const px=(i)=>pad+(i/(data.length-1))*(W-2*pad);
  const py=(v)=>H-pad-((v-mn)/(mx-mn))*(H-2*pad);
  const pts=data.map((d,i)=>`${px(i)},${py(d.val)}`).join(" ");
  return (
    <div>
      {label&&<div style={{fontSize:11,color:"#6b7280",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{label}</div>}
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        {data.map((d,i)=>(
          <circle key={i} cx={px(i)} cy={py(d.val)} r="3" fill={color}/>
        ))}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
        {data.filter((_,i)=>i===0||i===data.length-1||i===Math.floor(data.length/2)).map((d,i)=>(
          <div key={i} style={{fontSize:10,color:"#6b7280"}}>{d.label}</div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ── DATABASE LAYER (Supabase) ──
// All reads/writes go through Supabase
// ═══════════════════════════════════════════════════════════════
const DB = {
  // Users
  async getAll(table) {
    try {
      if (table === "users") return await supabaseClient.getUsers();
      if (table === "teams") return await supabaseClient.getTeams();
      if (table === "players") return await supabaseClient.getPlayers();
      if (table === "matches") return await supabaseClient.getMatches();
      if (table === "grounds") return await supabaseClient.getGrounds();
      if (table === "tournaments") return await supabaseClient.getTournaments();
      return [];
    } catch(e) { console.error("DB.getAll error", table, e); return []; }
  },

  async saveAll(table, arr) {
    // Note: Supabase doesn't support bulk upsert via this pattern
    // This is handled via individual insert/update calls
    return true;
  },

  async insert(table, item) {
    try {
      if (table === "users") return await supabaseClient.addTeam(item);
      if (table === "teams") return await supabaseClient.addTeam(item);
      if (table === "players") return await supabaseClient.addPlayer(item);
      if (table === "matches") return await supabaseClient.addMatch(item);
      if (table === "grounds") return await supabaseClient.addGround(item);
      if (table === "tournaments") return await supabaseClient.addTournament(item);
      return item;
    } catch(e) { console.error("DB.insert error", table, e); return null; }
  },

  async update(table, id, patch) {
    try {
      if (table === "users") return await supabaseClient.updateUser(id, patch);
      if (table === "teams") return await supabaseClient.updateTeam(id, patch);
      if (table === "players") return await supabaseClient.updatePlayer(id, patch);
      if (table === "matches") return await supabaseClient.updateMatch(id, patch);
      if (table === "grounds") return await supabaseClient.updateGround(id, patch);
      if (table === "tournaments") return await supabaseClient.updateTournament(id, patch);
      return null;
    } catch(e) { console.error("DB.update error", table, id, e); return null; }
  },

  async delete(table, id) {
    try {
      if (table === "users") return await supabaseClient.deleteTeam(id);
      if (table === "teams") return await supabaseClient.deleteTeam(id);
      if (table === "players") return await supabaseClient.deletePlayer(id);
      if (table === "matches") return await supabaseClient.deleteMatch(id);
      if (table === "grounds") return await supabaseClient.deleteGround(id);
      if (table === "tournaments") return await supabaseClient.deleteTournament(id);
      return true;
    } catch(e) { console.error("DB.delete error", table, id, e); return false; }
  },

  async findById(table, id) {
    try {
      const all = await this.getAll(table);
      return all.find(x => x.id === id) || null;
    } catch(e) { console.error("DB.findById error", table, id, e); return null; }
  },

  // Session (stored in localStorage for now)
  getSession() {
    try { const v = localStorage.getItem("cricpro_session"); return v ? JSON.parse(v) : null; }
    catch(e) { return null; }
  },
  
  setSession(userId) {
    try { localStorage.setItem("cricpro_session", JSON.stringify({userId, ts:Date.now()})); }
    catch(e) {}
  },
  
  clearSession() {
    try { localStorage.removeItem("cricpro_session"); }
    catch(e) {}
  },

  // Table keys for compatibility
  KEYS: {
    USERS:"users", TEAMS:"teams", PLAYERS:"players",
    MATCHES:"matches", GROUNDS:"grounds", TOURNAMENTS:"tournaments",
    SESSION:"session",
  },
};

// ── PRICING PAGE ──
function PricingPage({ user, onUpgrade, onClose }) {
  const features = {
    free:  ["View all matches & live scores","Basic player profiles","Join 1 team","Register for 1 tournament","Public leaderboard access"],
    pro:   ["Everything in Free","Innings-by-innings breakdown","Performance charts & trends","Advanced batting/bowling analysis","Unlimited teams & tournaments","Priority live scoring access","Export stats to PDF (coming soon)","Dedicated support"],
  };
  return (
    <div style={{minHeight:"100vh",background:"#0a0e1a",padding:40,display:"flex",flexDirection:"column",alignItems:"center"}}>
      {onClose&&<button className="btn-ghost" style={{alignSelf:"flex-start",marginBottom:24}} onClick={onClose}>← Back</button>}
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:42,letterSpacing:2,color:"#00e5a0"}}>CHOOSE YOUR PLAN</div>
        <div style={{color:"#9ca3af",fontSize:15,marginTop:8}}>Unlock the full power of CricPro</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:720,width:"100%"}}>
        {/* FREE */}
        <div className="plan-free">
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:28,letterSpacing:1}}>FREE</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:48,color:"#e8eaf6",lineHeight:1}}>₹0<span style={{fontSize:18,color:"#6b7280",fontFamily:"'DM Sans'"}}>/month</span></div>
            <div style={{fontSize:13,color:"#6b7280",marginTop:4}}>Get started, no card needed</div>
          </div>
          {features.free.map(f=><div key={f} style={{display:"flex",gap:10,marginBottom:10,fontSize:13}}><span style={{color:"#00e5a0"}}>✓</span><span style={{color:"#9ca3af"}}>{f}</span></div>)}
          <button className="btn-ghost" style={{width:"100%",marginTop:20,padding:12}} onClick={()=>onClose&&onClose()}>
            {user?.plan===PLANS.FREE?"Current Plan":"Get Started Free"}
          </button>
        </div>
        {/* PRO */}
        <div className="plan-pro">
          <div style={{position:"absolute",top:14,right:14,background:"linear-gradient(135deg,#f59e0b,#fb923c)",color:"#0a0e1a",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20,letterSpacing:1}}>MOST POPULAR</div>
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:28,letterSpacing:1,color:"#f59e0b"}}>PRO</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:48,color:"#f59e0b",lineHeight:1}}>₹99<span style={{fontSize:18,color:"#9ca3af",fontFamily:"'DM Sans'"}}>/month</span></div>
            <div style={{fontSize:13,color:"#9ca3af",marginTop:4}}>Cancel anytime</div>
          </div>
          {features.pro.map(f=><div key={f} style={{display:"flex",gap:10,marginBottom:10,fontSize:13}}><span style={{color:"#f59e0b"}}>★</span><span style={{color:"#e8eaf6"}}>{f}</span></div>)}
          <button className="btn-pro" style={{width:"100%",marginTop:20,padding:12,fontSize:15}} onClick={onUpgrade}>
            {user?.plan===PLANS.PRO?"✓ Current Plan":"Upgrade to Pro — ₹99/mo"}
          </button>
          <div style={{fontSize:11,color:"#6b7280",textAlign:"center",marginTop:8}}>Secure payment via Razorpay</div>
        </div>
      </div>
      {/* Feature comparison */}
      <div style={{maxWidth:720,width:"100%",marginTop:40}}>
        <div className="section-title" style={{fontSize:18,marginBottom:16,textAlign:"center"}}>FEATURE COMPARISON</div>
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          <table>
            <thead><tr><th>Feature</th><th style={{textAlign:"center"}}>Free</th><th style={{textAlign:"center",color:"#f59e0b"}}>Pro</th></tr></thead>
            <tbody>
              {[["Match scores & live updates","✅","✅"],["Basic player stats","✅","✅"],["Join teams","1 team","Unlimited"],["Tournament registration","1","Unlimited"],["Innings-by-innings history","❌","✅"],["Performance charts","❌","✅"],["Advanced analysis","❌","✅"],["Priority scoring","❌","✅"],["Export to PDF","❌","✅"],["Ad-free experience","❌","✅"]].map(([f,fr,pr])=>(
                <tr key={f}>
                  <td style={{fontWeight:500}}>{f}</td>
                  <td style={{textAlign:"center",color:fr==="✅"?"#00e5a0":fr==="❌"?"#4b5563":"#e8eaf6"}}>{fr}</td>
                  <td style={{textAlign:"center",color:pr==="✅"?"#f59e0b":pr==="❌"?"#4b5563":"#f59e0b",fontWeight:600}}>{pr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── PAYMENT MOCK ──
function PaymentModal({ user, onSuccess, onClose }) {
  const [step, setStep] = useState("card"); // card | processing | done
  const [card, setCard] = useState({number:"",expiry:"",cvv:"",name:""});
  const process = () => {
    setStep("processing");
    setTimeout(()=>setStep("done"),2000);
  };
  return (
    <div className="modal-overlay">
      <div className="modal" style={{maxWidth:420}}>
        {step==="card"&&<>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22}}>UPGRADE TO PRO</div>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:20}}>×</button>
          </div>
          <div style={{background:"linear-gradient(135deg,#1a1500,#1a0d00)",border:"1px solid #f59e0b30",borderRadius:10,padding:16,marginBottom:20}}>
            <div style={{color:"#f59e0b",fontWeight:700}}>CricPro Pro Plan</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"#f59e0b"}}>₹99 <span style={{fontSize:14,color:"#9ca3af",fontFamily:"'DM Sans'"}}>/ month</span></div>
            <div style={{fontSize:12,color:"#9ca3af",marginTop:4}}>Billed monthly · Cancel anytime</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input placeholder="Name on card" value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))}/>
            <input placeholder="Card number (demo: any 16 digits)" value={card.number} onChange={e=>setCard(c=>({...c,number:e.target.value}))} maxLength={16}/>
            <div className="grid-2">
              <input placeholder="MM/YY" value={card.expiry} onChange={e=>setCard(c=>({...c,expiry:e.target.value}))} maxLength={5}/>
              <input placeholder="CVV" value={card.cvv} onChange={e=>setCard(c=>({...c,cvv:e.target.value}))} maxLength={3} type="password"/>
            </div>
            <div style={{background:"#111827",borderRadius:8,padding:"10px 14px",display:"flex",gap:8,alignItems:"center",fontSize:12,color:"#6b7280"}}>
              🔒 Demo mode — no real payment. Powered by Razorpay (production)
            </div>
            <button className="btn-pro" style={{padding:14,fontSize:15}} onClick={process} disabled={!card.name||card.number.length<4}>Pay ₹99 →</button>
          </div>
        </>}
        {step==="processing"&&<div style={{textAlign:"center",padding:40}}>
          <div style={{fontSize:48,marginBottom:16}}>⏳</div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#f59e0b"}}>PROCESSING...</div>
          <div style={{color:"#9ca3af",marginTop:8}}>Connecting to payment gateway</div>
        </div>}
        {step==="done"&&<div style={{textAlign:"center",padding:40}}>
          <div style={{fontSize:48,marginBottom:16}}>🎉</div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:26,color:"#00e5a0"}}>UPGRADE SUCCESSFUL!</div>
          <div style={{color:"#9ca3af",marginTop:8,marginBottom:24}}>Welcome to CricPro Pro! All premium features are now unlocked.</div>
          <button className="btn-pro" style={{width:"100%",padding:12}} onClick={onSuccess}>Start Exploring Pro Features →</button>
        </div>}
      </div>
    </div>
  );
}

// ── CRICKET ANIMATED BACKGROUND ──
function CricketBackground() {
  const items = [
    {icon:"🏏",x:8,y:12,size:52,dur:14,delay:0,rot:25},
    {icon:"🏏",x:80,y:70,size:38,dur:18,delay:3,rot:-15},
    {icon:"🎳",x:20,y:60,size:44,dur:16,delay:1,rot:0},
    {icon:"🎳",x:70,y:20,size:32,dur:20,delay:5,rot:10},
    {icon:"⛑️",x:50,y:8,size:48,dur:13,delay:2,rot:-20},
    {icon:"⛑️",x:88,y:45,size:34,dur:22,delay:4,rot:30},
    {icon:"🏟️",x:35,y:80,size:56,dur:17,delay:0,rot:0},
    {icon:"🏟️",x:62,y:55,size:36,dur:19,delay:6,rot:5},
    {icon:"🌿",x:5,y:88,size:40,dur:15,delay:2,rot:-10},
    {icon:"🌿",x:92,y:85,size:30,dur:21,delay:3,rot:15},
    {icon:"🏆",x:45,y:35,size:42,dur:12,delay:1,rot:0},
    {icon:"🏆",x:15,y:38,size:28,dur:24,delay:7,rot:-5},
    {icon:"👟",x:75,y:92,size:34,dur:16,delay:0,rot:20},
    {icon:"👟",x:28,y:5,size:30,dur:20,delay:4,rot:-25},
    {icon:"📣",x:58,y:78,size:36,dur:18,delay:2,rot:10},
    {icon:"📣",x:3,y:52,size:28,dur:23,delay:5,rot:-8},
  ];
  const css = `
    @keyframes floatUp{0%{transform:translateY(0) rotate(var(--rot));opacity:.12}50%{transform:translateY(-28px) rotate(calc(var(--rot) + 8deg));opacity:.22}100%{transform:translateY(0) rotate(var(--rot));opacity:.12}}
    @keyframes driftAcross{0%{transform:translateX(0) rotate(var(--rot));opacity:.10}50%{transform:translateX(18px) rotate(calc(var(--rot) - 6deg));opacity:.20}100%{transform:translateX(0) rotate(var(--rot));opacity:.10}}
    @keyframes pitchPulse{0%,100%{opacity:.07}50%{opacity:.15}}
    .cf{animation:floatUp var(--dur)s ease-in-out infinite}
    .cd{animation:driftAcross var(--dur)s ease-in-out infinite}
  `;
  return (
    <>
      <style>{css}</style>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 60%,#0d2d20 0%,#0a0e1a 55%,#0d1221 100%)",zIndex:0}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1,animation:"pitchPulse 4s ease-in-out infinite"}} viewBox="0 0 500 700" preserveAspectRatio="none">
        <ellipse cx="250" cy="350" rx="230" ry="310" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeDasharray="8 6"/>
        <rect x="215" y="200" width="70" height="300" fill="none" stroke="#00e5a0" strokeWidth="1" strokeDasharray="5 5"/>
        <line x1="205" y1="270" x2="295" y2="270" stroke="#00e5a0" strokeWidth="1.5"/>
        <line x1="205" y1="430" x2="295" y2="430" stroke="#00e5a0" strokeWidth="1.5"/>
        <line x1="236" y1="200" x2="236" y2="220" stroke="#f59e0b" strokeWidth="2"/>
        <line x1="250" y1="200" x2="250" y2="220" stroke="#f59e0b" strokeWidth="2"/>
        <line x1="264" y1="200" x2="264" y2="220" stroke="#f59e0b" strokeWidth="2"/>
        <line x1="236" y1="480" x2="236" y2="500" stroke="#f59e0b" strokeWidth="2"/>
        <line x1="250" y1="480" x2="250" y2="500" stroke="#f59e0b" strokeWidth="2"/>
        <line x1="264" y1="480" x2="264" y2="500" stroke="#f59e0b" strokeWidth="2"/>
        <path d="M 250 490 Q 210 350 250 210" fill="none" stroke="#ff6b6b" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5"/>
        {Array.from({length:40}).map((_,i)=><circle key={`t${i}`} cx={30+(i%20)*22+(Math.floor(i/20)%2)*11} cy={640+Math.floor(i/20)*18+(i%3)*5} r="3" fill={["#00e5a0","#f59e0b","#60a5fa","#e8eaf6"][i%4]} opacity="0.2"/>)}
        {Array.from({length:40}).map((_,i)=><circle key={`b${i}`} cx={30+(i%20)*22+(Math.floor(i/20)%2)*11} cy={60-Math.floor(i/20)*14-(i%3)*4} r="3" fill={["#00e5a0","#f59e0b","#60a5fa","#e8eaf6"][i%4]} opacity="0.2"/>)}
      </svg>
      {items.map((item,i)=>(
        <div key={i} className={i%2===0?"cf":"cd"} style={{position:"absolute",left:`${item.x}%`,top:`${item.y}%`,fontSize:item.size,"--dur":`${item.dur}`,"--rot":`${item.rot}deg`,animationDelay:`${item.delay}s`,zIndex:2,userSelect:"none",pointerEvents:"none"}}>
          {item.icon}
        </div>
      ))}
      <div style={{position:"absolute",bottom:36,right:36,zIndex:3,fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:3,color:"#00e5a0",opacity:.22,textAlign:"right",lineHeight:1.9,pointerEvents:"none"}}>
        <div>CITY T20 PREMIER</div>
        <div style={{fontSize:10,color:"#f59e0b"}}>LIVE · IN PROGRESS</div>
        <div style={{fontSize:30,color:"#fff",marginTop:2}}>142/4</div>
        <div style={{fontSize:10,color:"#9ca3af"}}>15.2 OVERS</div>
      </div>
    </>
  );
}

// ── AUTH PAGE (Login + Signup) ──
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({role:ROLES.PLAYER,plan:PLANS.FREE});
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sf = k => e => { setForm(f=>({...f,[k]:e.target.value})); setFieldErrors(fe=>({...fe,[k]:""})); setError(""); };

  const validateEmail = email => {
    if(!email) return "Email is required";
    if(!emailRegex.test(email)) return "Enter a valid email — e.g. name@example.com";
    return "";
  };

  const handleLogin = async () => {
    const ee = validateEmail(form.email||"");
    if(ee) return setFieldErrors(fe=>({...fe,email:ee}));
    if(!form.password) return setFieldErrors(fe=>({...fe,password:"Password is required"}));
    
    setLoading(true);
    setError("");
    try {
      const allUsers = await DB.getAll(DB.KEYS.USERS);
      const u = allUsers.find(u=>u.email?.toLowerCase()===form.email.toLowerCase()&&u.password===form.password);
      if(u) {
        await onLogin(u);
      } else {
        setError("Incorrect email or password. Please try again.");
      }
    } catch(e) {
      console.error("Login error:", e);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    const errs = {};
    if(!form.name?.trim()) errs.name = "Full name is required";
    const ee = validateEmail(form.email||"");
    if(ee) errs.email = ee;
    else {
      try {
        const allUsers = await DB.getAll(DB.KEYS.USERS);
        if(allUsers.find(u=>u.email?.toLowerCase()===form.email.toLowerCase())) errs.email = "Email already registered — sign in instead";
      } catch(e) {
        errs.email = "Error checking email availability";
      }
    }
    if(!form.password) errs.password = "Password is required";
    else if(form.password.length<6) errs.password = "Minimum 6 characters required";
    if(form.confirmPassword && form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if(Object.keys(errs).length>0) return setFieldErrors(errs);
    setFieldErrors({}); setError(""); setSignupStep(2);
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const newUser = {
        id:uid(), 
        name:form.name.trim(), 
        email:form.email.toLowerCase().trim(),
        password:form.password, 
        role:form.role||ROLES.PLAYER, 
        plan:form.plan||PLANS.FREE,
        team:null, 
        joined_date:new Date().toISOString().split("T")[0],
        phone:"", 
        city:"", 
        bio:"",
      };
      await DB.insert(DB.KEYS.USERS, newUser);
      await onLogin(newUser);
    } catch(e) {
      console.error("Signup error:", e);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Err = ({k}) => fieldErrors[k]
    ? <div style={{fontSize:11,color:"#ff6b6b",marginTop:4,marginLeft:2,display:"flex",alignItems:"center",gap:4}}>⚠ {fieldErrors[k]}</div>
    : null;

  const inp = k => ({border:`1px solid ${fieldErrors[k]?"#ff6b6b60":"#1e2a3a"}`,boxShadow:fieldErrors[k]?"0 0 0 2px #ff6b6b18":"none"});

  if(mode==="pricing") return <PricingPage user={null} onUpgrade={()=>{setForm(f=>({...f,plan:PLANS.PRO}));setMode("signup");}} onClose={()=>setMode("signup")}/>;

  return (
    <div style={{minHeight:"100vh",background:"#0a0e1a",display:"flex"}}>

      {/* ── Left: form ── */}
      <div style={{width:460,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"28px 36px",overflowY:"auto",position:"relative",zIndex:10,background:"#0a0e1aee"}}>
        <div style={{width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:50,letterSpacing:4,color:"#00e5a0",lineHeight:1}}>CRICPRO</div>
            <div style={{fontSize:10,color:"#6b7280",letterSpacing:3,marginTop:3}}>CRICKET MANAGEMENT PLATFORM</div>
          </div>

          {/* Mode tabs */}
          <div style={{display:"flex",background:"#111827",borderRadius:10,padding:4,marginBottom:18}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");setFieldErrors({});setSignupStep(1);}} style={{flex:1,padding:"9px",border:"none",borderRadius:8,background:mode===m?"#0d1221":"transparent",color:mode===m?"#00e5a0":"#6b7280",fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>
                {m==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          {error&&<div style={{background:"#ff6b6b15",border:"1px solid #ff6b6b30",borderRadius:8,padding:"9px 13px",color:"#ff6b6b",fontSize:13,marginBottom:12}}>{error}</div>}

          {/* LOGIN */}
          {mode==="login"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div>
                <input placeholder="Email address" value={form.email||""} onChange={sf("email")} type="email" style={inp("email")} onKeyDown={e=>e.key==="Enter"&&!loading&&handleLogin()} disabled={loading}/>
                <Err k="email"/>
              </div>
              <div style={{position:"relative"}}>
                <input placeholder="Password" value={form.password||""} onChange={sf("password")} type={showPass?"text":"password"} style={inp("password")} onKeyDown={e=>e.key==="Enter"&&!loading&&handleLogin()} disabled={loading}/>
                <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6b7280",cursor:"pointer"}}>{showPass?"🙈":"👁"}</button>
              </div>
              <button className="btn-primary" style={{padding:13,fontSize:15,marginTop:2,opacity:loading?0.6:1}} onClick={handleLogin} disabled={loading}>
                {loading?`⏳ Logging in...`:`Sign In →`}
              </button>
              <div style={{textAlign:"center",fontSize:13,color:"#6b7280",marginTop:2}}>No account? <span onClick={()=>{setMode("signup");setFieldErrors({});}} style={{color:"#00e5a0",cursor:loading?"not-allowed":"pointer",fontWeight:600,opacity:loading?0.5:1}}>{loading?"Please wait...":"Sign up free →"}</span></div>
            </div>
          )}

          {/* SIGNUP */}
          {mode==="signup"&&(
            <>
              {/* Step pills */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                {[1,2].map((s,i)=>(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:signupStep>=s?"#00e5a0":"#1a2035",color:signupStep>=s?"#0a0e1a":"#6b7280",transition:"all .3s"}}>{s}</div>
                    <span style={{fontSize:11,color:signupStep===s?"#e8eaf6":"#4b5563"}}>{s===1?"Details":"Plan"}</span>
                    {i===0&&<div style={{width:24,height:2,background:signupStep>1?"#00e5a0":"#1a2035",borderRadius:2,transition:"all .3s"}}/>}
                  </div>
                ))}
              </div>

              {signupStep===1&&(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <div>
                    <input placeholder="Full Name" value={form.name||""} onChange={sf("name")} style={inp("name")}/>
                    <Err k="name"/>
                  </div>
                  <div style={{marginTop:6}}>
                    <input placeholder="Email — e.g. you@gmail.com" value={form.email||""} onChange={sf("email")} type="email" style={inp("email")}/>
                    <Err k="email"/>
                  </div>
                  <div style={{marginTop:6,position:"relative"}}>
                    <input placeholder="Password — min 6 characters" value={form.password||""} onChange={sf("password")} type={showPass?"text":"password"} style={inp("password")}/>
                    <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:12,top:13,background:"none",border:"none",color:"#6b7280",cursor:"pointer"}}>{showPass?"🙈":"👁"}</button>
                    <Err k="password"/>
                  </div>
                  {/* Strength bar */}
                  {form.password&&(
                    <div style={{marginTop:2}}>
                      <div style={{height:3,background:"#1a2035",borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:2,transition:"width .3s,background .3s",width:`${Math.min(form.password.length/10*100,100)}%`,background:form.password.length<6?"#ff6b6b":form.password.length<9?"#f59e0b":"#00e5a0"}}/>
                      </div>
                      <div style={{fontSize:10,marginTop:2,color:form.password.length<6?"#ff6b6b":form.password.length<9?"#f59e0b":"#00e5a0"}}>{form.password.length<6?"Weak":form.password.length<9?"Medium":"Strong"} password</div>
                    </div>
                  )}
                  <div style={{marginTop:6}}>
                    <select value={form.role||ROLES.PLAYER} onChange={sf("role")}>
                      <option value={ROLES.PLAYER}>🏏 Player</option>
                      <option value={ROLES.SCORER}>📋 Scorer / Umpire</option>
                      <option value={ROLES.ORGANIZER}>🏆 Tournament Organizer</option>
                      <option value={ROLES.VIEWER}>👁 Fan / Viewer</option>
                    </select>
                  </div>
                  <button className="btn-primary" style={{padding:12,marginTop:10,opacity:loading?0.6:1}} onClick={handleNextStep} disabled={loading}>
                    {loading?`⏳ Validating...`:`Next — Choose Plan →`}
                  </button>
                  <div style={{textAlign:"center",fontSize:13,color:"#6b7280",marginTop:4}}>Have an account? <span onClick={()=>{!loading&&setMode("login");setFieldErrors({});}} style={{color:"#00e5a0",cursor:loading?"not-allowed":"pointer",fontWeight:600,opacity:loading?0.5:1}}>Sign in</span></div>
                </div>
              )}

              {signupStep===2&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <button onClick={()=>setSignupStep(1)} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:18,lineHeight:1}}>←</button>
                    <span style={{fontWeight:600,fontSize:14}}>Choose Your Plan</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
                    {[{plan:PLANS.FREE,label:"Free",price:"₹0/mo",desc:"View matches, basic stats, 1 team",bg:"#111827",bdr:"#2a3045"},{plan:PLANS.PRO,label:"Pro ★",price:"₹99/mo",desc:"All features — charts, deep stats, unlimited",bg:"linear-gradient(135deg,#1a1500,#1a0d00)",bdr:"#f59e0b60"}].map(p=>(
                      <div key={p.plan} onClick={()=>setForm(f=>({...f,plan:p.plan}))} style={{background:p.bg,border:`2px solid ${form.plan===p.plan?p.plan===PLANS.PRO?"#f59e0b":"#00e5a0":p.bdr}`,borderRadius:12,padding:14,cursor:"pointer",transition:"all .2s"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div><div style={{fontWeight:700,color:p.plan===PLANS.PRO?"#f59e0b":"#e8eaf6"}}>{p.label}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{p.desc}</div></div>
                          <div style={{textAlign:"right",flexShrink:0}}><div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:p.plan===PLANS.PRO?"#f59e0b":"#e8eaf6"}}>{p.price}</div>{form.plan===p.plan&&<div style={{fontSize:10,color:p.plan===PLANS.PRO?"#f59e0b":"#00e5a0",fontWeight:700}}>✓ SELECTED</div>}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button style={{width:"100%",textAlign:"left",background:"none",border:"none",color:"#6b7280",fontSize:12,cursor:"pointer",marginBottom:10,padding:"2px 0"}} onClick={()=>setMode("pricing")}>See full feature comparison →</button>
                  <button className={form.plan===PLANS.PRO?"btn-pro":"btn-primary"} style={{width:"100%",padding:12,fontSize:14,opacity:loading?0.6:1}} onClick={handleSignup} disabled={loading}>
                    {loading?`⏳ Creating account...`:(form.plan===PLANS.PRO?"Start Pro — ₹99/mo →":"Create Free Account →")}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Dev hint */}
          {mode==="login"&&(
            <div style={{marginTop:14,padding:"8px 12px",background:"#0a0f1a",border:"1px solid #1a2035",borderRadius:8,textAlign:"center"}}>
              <div style={{fontSize:11,color:"#374151"}}>🔧 Dev console: type <span style={{fontFamily:"monospace",color:"#00e5a040"}}>cricproDB()</span> to inspect stored data</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Cricket animated background ── */}
      <div style={{flex:1,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <CricketBackground/>
        <div style={{position:"relative",zIndex:10,padding:48,maxWidth:440,pointerEvents:"none"}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:12,letterSpacing:4,color:"#00e5a0",marginBottom:10,opacity:.85}}>INDIA'S #1 CRICKET PLATFORM</div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:48,lineHeight:1,color:"#fff",marginBottom:24,letterSpacing:1,textShadow:"0 2px 20px rgba(0,0,0,.8)"}}>MANAGE.<br/>SCORE.<br/>ANALYSE.</div>
          {[["🏏","Live Ball-by-Ball Scoring","Real-time scoring with full over-by-over stats"],["📊","Deep Player Analytics","Innings history, performance charts & trends"],["🏆","Tournament Management","Leagues, fixtures, standings — all in one place"],["👥","Role-Based Access","Admin, Organizer, Scorer, Player & Fan roles"]].map(([icon,title,desc])=>(
            <div key={title} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
              <div style={{fontSize:20,flexShrink:0,marginTop:1}}>{icon}</div>
              <div><div style={{fontWeight:700,fontSize:14,color:"#e8eaf6",textShadow:"0 1px 8px rgba(0,0,0,.8)"}}>{title}</div><div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{desc}</div></div>
            </div>
          ))}
          <div style={{marginTop:24,padding:"14px 18px",background:"rgba(0,229,160,.07)",border:"1px solid #00e5a025",borderRadius:12}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"#00e5a0",letterSpacing:1}}>500+ CLUBS · 10,000+ PLAYERS</div>
            <div style={{fontSize:12,color:"#4b5563",marginTop:3}}>Across India · Free to start · No card needed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ── INNINGS DETAIL DRILL-DOWN ──
function InningsDetail({ player, innings, onBack, currentUser, onUpgrade }) {
  const [selectedInning, setSelectedInning] = useState(null);
  const data = (inningsData[player.id]||[]) || [];

  if(selectedInning) return (
    <div className="fadeIn">
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>{player.name}</span>
        <span>›</span><span className="bc-link" onClick={()=>setSelectedInning(null)}>Innings History</span>
        <span>›</span><span style={{color:"#e8eaf6"}}>{selectedInning.match}</span>
      </div>
      <div className="card" style={{padding:28,marginBottom:16}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:28,marginBottom:4}}>{selectedInning.match}</div>
        <div style={{fontSize:13,color:"#9ca3af",marginBottom:20}}>📅 {fmtDate(selectedInning.date)} · 📍 {selectedInning.ground} · vs {selectedInning.opponent}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
          {[["Runs",selectedInning.runs,selectedInning.runs>=50?"#f59e0b":"#00e5a0"],["Balls",selectedInning.balls,"#e8eaf6"],["4s",selectedInning.fours,"#60a5fa"],["6s",selectedInning.sixes,"#00e5a0"],["SR",selectedInning.sr.toFixed(1),selectedInning.sr>=150?"#00e5a0":selectedInning.sr>=120?"#f59e0b":"#ff6b6b"]].map(([l,v,c])=>(
            <div key={l} className="stat-box"><div style={{fontFamily:"'Bebas Neue'",fontSize:36,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:11,color:"#6b7280",marginTop:4,textTransform:"uppercase"}}>{l}</div></div>
          ))}
        </div>
        <div style={{marginTop:20,padding:"12px 16px",background:selectedInning.out==="Not Out"?"#00e5a010":"#ff6b6b10",border:`1px solid ${selectedInning.out==="Not Out"?"#00e5a030":"#ff6b6b30"}`,borderRadius:8,fontSize:13}}>
          <span style={{color:selectedInning.out==="Not Out"?"#00e5a0":"#ff6b6b",fontWeight:700}}>{selectedInning.out==="Not Out"?"✓ Not Out":"✕ "+selectedInning.out}</span>
          {selectedInning.bowler!=="-"&&<span style={{color:"#9ca3af"}}> · b. {selectedInning.bowler}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fadeIn">
      <div className="breadcrumb">
        <span className="bc-link" onClick={onBack}>{player.name}</span>
        <span>›</span><span style={{color:"#e8eaf6"}}>Innings History ({data.length})</span>
      </div>
      <ProGate user={currentUser} onUpgrade={onUpgrade} feature="Innings-by-innings history">
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          <table>
            <thead><tr><th>#</th><th>Match</th><th>Date</th><th>Opponent</th><th>Runs</th><th>Balls</th><th>4s</th><th>6s</th><th>SR</th><th>Dismissal</th></tr></thead>
            <tbody>
              {data.map((inn,i)=>(
                <tr key={inn.id} className="innings-row" onClick={()=>setSelectedInning(inn)}>
                  <td style={{color:"#6b7280"}}>{i+1}</td>
                  <td style={{fontWeight:600}}>{inn.match}</td>
                  <td style={{color:"#6b7280",fontSize:12}}>{fmtDate(inn.date)}</td>
                  <td style={{fontSize:12}}>{inn.opponent}</td>
                  <td style={{fontFamily:"'Bebas Neue'",fontSize:22,color:inn.runs>=100?"#f59e0b":inn.runs>=50?"#00e5a0":inn.runs===0?"#ff6b6b":"#e8eaf6"}}>{inn.runs}</td>
                  <td style={{fontFamily:"'JetBrains Mono'"}}>{inn.balls}</td>
                  <td style={{color:"#60a5fa"}}>{inn.fours}</td>
                  <td style={{color:"#00e5a0"}}>{inn.sixes}</td>
                  <td style={{fontFamily:"'JetBrains Mono'",color:inn.sr>=150?"#00e5a0":inn.sr>=120?"#f59e0b":"#9ca3af"}}>{inn.sr.toFixed(1)}</td>
                  <td><span className={`tag ${inn.out==="Not Out"?"tag-green":"tag-red"}`} style={{fontSize:10}}>{inn.out}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProGate>
    </div>
  );
}

// ── PERFORMANCE CHARTS ──
function PerformanceCharts({ player, currentUser, onUpgrade }) {
  const data = (inningsData[player.id]||[]) || [];
  const runsData = data.slice(-8).map(d=>({val:d.runs,label:fmtDate(d.date).split(" ").slice(0,2).join(" ")}));
  const srData = data.filter(d=>d.balls>0).slice(-8).map(d=>({val:parseFloat(d.sr),label:fmtDate(d.date).split(" ").slice(0,2).join(" ")}));

  return (
    <ProGate user={currentUser} onUpgrade={onUpgrade} feature="Performance charts & analytics">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:16,textTransform:"uppercase",letterSpacing:1}}>Runs Per Innings (Last 8)</div>
          {runsData.length>0 ? <BarChart data={runsData} color="#00e5a0"/> : <div style={{color:"#6b7280",fontSize:13}}>No data</div>}
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:16,textTransform:"uppercase",letterSpacing:1}}>Strike Rate Trend</div>
          {srData.length>1 ? <LineChart data={srData} color="#f59e0b"/> : <div style={{color:"#6b7280",fontSize:13}}>No data</div>}
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:16,textTransform:"uppercase",letterSpacing:1}}>Boundary Breakdown</div>
          <BarChart data={[{val:player.fours,label:"4s"},{val:player.sixes,label:"6s"},{val:player.catches,label:"Ct"}]} color="#60a5fa"/>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:16,textTransform:"uppercase",letterSpacing:1}}>Milestones</div>
          {[["Hundreds",player.hundreds,"#f59e0b"],["Fifties",player.fifties,"#00e5a0"],["Ducks",player.ducks,"#ff6b6b"]].map(([l,v,c])=>(
            <div key={l} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                <span style={{color:"#9ca3af"}}>{l}</span>
                <span style={{fontWeight:700,color:c}}>{v}</span>
              </div>
              <div style={{height:6,background:"#1a2035",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min((v/Math.max(player.matches,1))*100*3,100)}%`,background:c,borderRadius:3,transition:"width .8s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProGate>
  );
}

// ── ADVANCED ANALYSIS ──
function AdvancedAnalysis({ player, currentUser, onUpgrade }) {
  const data = (inningsData[player.id]||[]) || [];
  const byOpponent = {};
  data.forEach(d=>{ if(!byOpponent[d.opponent])byOpponent[d.opponent]={runs:0,inns:0,balls:0}; byOpponent[d.opponent].runs+=d.runs; byOpponent[d.opponent].inns+=1; byOpponent[d.opponent].balls+=d.balls; });
  const vsOpponents = Object.entries(byOpponent).map(([k,v])=>({opponent:k,runs:v.runs,inns:v.inns,avg:(v.runs/v.inns).toFixed(1),sr:v.balls>0?((v.runs/v.balls)*100).toFixed(1):"—"}));

  return (
    <ProGate user={currentUser} onUpgrade={onUpgrade} feature="Advanced batting analysis">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card" style={{padding:20}}>
          <div className="section-title" style={{fontSize:16,marginBottom:16}}>PERFORMANCE VS OPPONENTS</div>
          {vsOpponents.length>0 ? (
            <table>
              <thead><tr><th>Opponent</th><th>Inns</th><th>Runs</th><th>Avg</th><th>SR</th></tr></thead>
              <tbody>
                {vsOpponents.sort((a,b)=>b.runs-a.runs).map(r=>(
                  <tr key={r.opponent}>
                    <td style={{fontWeight:600,fontSize:12}}>{r.opponent}</td>
                    <td>{r.inns}</td>
                    <td style={{color:"#00e5a0",fontWeight:700}}>{r.runs}</td>
                    <td style={{fontFamily:"'JetBrains Mono'"}}>{r.avg}</td>
                    <td style={{fontFamily:"'JetBrains Mono'"}}>{r.sr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div style={{color:"#6b7280",fontSize:13}}>No data available</div>}
        </div>
        <div className="card" style={{padding:20}}>
          <div className="section-title" style={{fontSize:16,marginBottom:16}}>DISMISSAL ANALYSIS</div>
          {(()=>{
            const types={};
            data.forEach(d=>{ if(d.out!=="DNB"){types[d.out]=(types[d.out]||0)+1;} });
            const total=Object.values(types).reduce((a,b)=>a+b,0);
            return Object.entries(types).length > 0 ? Object.entries(types).sort((a,b)=>b[1]-a[1]).map(([type,cnt])=>(
              <div key={type} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                  <span style={{color:"#9ca3af"}}>{type}</span>
                  <span style={{fontWeight:700}}>{cnt} ({Math.round(cnt/total*100)}%)</span>
                </div>
                <div style={{height:6,background:"#1a2035",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${cnt/total*100}%`,background:"#ff6b6b",borderRadius:3}}/>
                </div>
              </div>
            )) : <div style={{color:"#6b7280",fontSize:13}}>No dismissal data</div>;
          })()}
        </div>
        <div className="card" style={{padding:20,gridColumn:"span 2"}}>
          <div className="section-title" style={{fontSize:16,marginBottom:16}}>FORM GUIDE (LAST 5 INNINGS)</div>
          <div style={{display:"flex",gap:12}}>
            {data.slice(0,5).map((inn,i)=>(
              <div key={i} style={{flex:1,textAlign:"center",padding:"12px 8px",background:"#111827",borderRadius:10,border:`1px solid ${inn.runs>=50?"#f59e0b30":inn.runs===0?"#ff6b6b30":"#1a2035"}`}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:inn.runs>=100?"#f59e0b":inn.runs>=50?"#00e5a0":inn.runs===0?"#ff6b6b":"#e8eaf6"}}>{inn.runs}</div>
                <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{inn.balls}b</div>
                <div style={{fontSize:10,color:"#6b7280"}}>{fmtDate(inn.date).split(" ").slice(0,2).join(" ")}</div>
                <div style={{marginTop:6}}><span className={`tag ${inn.out==="Not Out"?"tag-green":"tag-red"}`} style={{fontSize:9}}>{inn.out==="Not Out"?"NO":inn.out.slice(0,3).toUpperCase()}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProGate>
  );
}

// ── FULL PLAYER PROFILE ──
function PlayerProfile({ player, matches, teams, currentUser, onBack, onUpgrade, inningsData, setInningsData }) {
  const [profileTab, setProfileTab] = useState("overview");
  const team = teams.find(t=>t.name===player.team);

  const tabs = [
    {id:"overview",label:"Overview"},
    {id:"innings",label:`Innings (${((inningsData[player.id]||[])||[]).length})`,pro:true},
    {id:"charts",label:"Performance Charts",pro:true},
    {id:"analysis",label:"Advanced Analysis",pro:true},
  ];

  return (
    <div className="fadeIn">
      <div className="breadcrumb"><span className="bc-link" onClick={onBack}>Players</span><span>›</span><span style={{color:"#e8eaf6"}}>{player.name}</span></div>

      {/* Hero */}
      <div className="card" style={{padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:200,height:200,background:avatarColor(player.name),opacity:.05,borderRadius:"0 0 0 200px"}}/>
        <div style={{display:"flex",alignItems:"flex-start",gap:20}}>
          <div style={{width:72,height:72,fontSize:26,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",background:avatarColor(player.name)+"25",color:avatarColor(player.name),fontWeight:700,flexShrink:0}}>{initials(player.name)}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:34,letterSpacing:1}}>{player.name}</div>
            <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
              <span className={`tag ${player.role==="Batsman"?"tag-blue":player.role==="Bowler"?"tag-red":player.role.includes("WK")?"tag-yellow":"tag-purple"}`}>{player.role}</span>
              {team&&<span className="tag tag-green">{team.logo} {player.team}</span>}
              {currentUser?.name===player.name&&<span className="tag-pro tag">★ Your Profile</span>}
            </div>
            <div style={{marginTop:10,fontSize:13,color:"#9ca3af"}}>{player.bio}</div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
        {[["Matches",player.matches,null],["Runs",player.runs,"innings"],["Avg",(player.runs/Math.max(player.matches-player.ducks,1)).toFixed(1),"innings"],["SR",player.sr,"charts"],["Wickets",player.wickets,player.wickets>0?"innings":null]].map(([l,v,clickTab])=>(
          <div key={l} className="stat-box" onClick={()=>clickTab&&setProfileTab(clickTab)} style={{border:clickTab?"1px solid #1a2035":"1px solid transparent"}}>
            <div className="val">{v}</div>
            <div className="lbl">{l}</div>
            {clickTab&&<div style={{fontSize:9,color:"#00e5a0",marginTop:4}}>click to explore</div>}
          </div>
        ))}
      </div>

      {/* Profile Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:20,flexWrap:"wrap"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setProfileTab(t.id)} style={{padding:"8px 16px",border:"none",borderRadius:8,background:profileTab===t.id?"#00e5a0":"#111827",color:profileTab===t.id?"#0a0e1a":"#6b7280",fontFamily:"'DM Sans'",fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            {t.label}{t.pro&&!isPro(currentUser)&&<span style={{fontSize:10}}>🔒</span>}
          </button>
        ))}
      </div>

      {profileTab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div className="card" style={{padding:20}}>
            <div className="section-title" style={{fontSize:18,marginBottom:16}}>BATTING</div>
            {[["Innings",player.matches],["Runs",player.runs],["Highest Score",player.hs],["Average",(player.runs/Math.max(player.matches-player.ducks,1)).toFixed(1)],["Strike Rate",player.sr],["Fifties",player.fifties],["Hundreds",player.hundreds],["Fours",player.fours],["Sixes",player.sixes],["Ducks",player.ducks]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #0f1623",fontSize:13}}>
                <span style={{color:"#6b7280"}}>{l}</span>
                <span style={{fontFamily:"'JetBrains Mono'",fontWeight:600,color:l==="Ducks"?"#ff6b6b":l==="Hundreds"||l==="Fifties"?"#f59e0b":"#e8eaf6"}}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            {player.wickets>0&&<div className="card" style={{padding:20,marginBottom:16}}>
              <div className="section-title" style={{fontSize:18,marginBottom:16}}>BOWLING</div>
              {[["Wickets",player.wickets],["Economy",player.economy],["Average",(player.runs/player.wickets).toFixed(1)],["Catches",player.catches]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #0f1623",fontSize:13}}>
                  <span style={{color:"#6b7280"}}>{l}</span>
                  <span style={{fontFamily:"'JetBrains Mono'",fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>}
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="section-title" style={{fontSize:16}}>QUICK CHARTS</div>
                {!isPro(currentUser)&&<button className="btn-pro" style={{fontSize:11,padding:"4px 10px"}} onClick={onUpgrade}>Unlock Pro</button>}
              </div>
              {isPro(currentUser) ? (
                <BarChart data={[{val:player.runs,label:"Runs"},{val:player.wickets*20,label:"Wkts×20"},{val:player.catches*30,label:"Ct×30"}]} color="#00e5a0" label="Career at a glance"/>
              ) : (
                <div style={{textAlign:"center",padding:20}}>
                  <div style={{fontSize:32,marginBottom:8}}>📊</div>
                  <div style={{fontSize:13,color:"#6b7280"}}>Upgrade to Pro to see performance charts</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {profileTab==="innings"&&<InningsDetail player={player} currentUser={currentUser} onBack={()=>setProfileTab("overview")} onUpgrade={onUpgrade}/>}
      {profileTab==="charts"&&<PerformanceCharts player={player} currentUser={currentUser} onUpgrade={onUpgrade}/>}
      {profileTab==="analysis"&&<AdvancedAnalysis player={player} currentUser={currentUser} onUpgrade={onUpgrade}/>}
    </div>
  );
}

// ── MAIN APP ──
export default function App() {
  // ── State: will load from Supabase via useEffect ──
  const [currentUser, setCurrentUser] = useState(null);
  const [users,       setUsers]       = useState([]);
  const [teams,       setTeams]       = useState([]);
  const [players,     setPlayers]     = useState([]);
  const [matches,     setMatches]     = useState([]);
  const [grounds,     setGrounds]     = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [tab,         setTab]         = useState("dashboard");
  const [scoringMatch,setScoringMatch]= useState(null);
  const [modal,       setModal]       = useState(null);
  const [editItem,    setEditItem]    = useState(null);
  const [form,        setForm]        = useState({});
  const [notifs,      setNotifs]      = useState([]);
  const [deepView,    setDeepView]    = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [inningsData, setInningsData] = useState({});
  const [isLoading,   setIsLoading]   = useState(true);

  // ── Initialize data from Supabase on mount ──
  useEffect(()=>{
    const loadData = async () => {
      try {
        const [u, t, p, m, g, tn] = await Promise.all([
          DB.getAll(DB.KEYS.USERS),
          DB.getAll(DB.KEYS.TEAMS),
          DB.getAll(DB.KEYS.PLAYERS),
          DB.getAll(DB.KEYS.MATCHES),
          DB.getAll(DB.KEYS.GROUNDS),
          DB.getAll(DB.KEYS.TOURNAMENTS),
        ]);
        setUsers(u);
        setTeams(t);
        setPlayers(p);
        setMatches(m);
        setGrounds(g);
        setTournaments(tn);
        
        // Restore session
        const sess = DB.getSession();
        if(sess?.userId) {
          const user = u.find(x => x.id === sess.userId);
          if(user) setCurrentUser(user);
          else DB.clearSession();
        }
      } catch(e) {
        console.error("Failed to load data from Supabase:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // ── Expose debug inspector in browser console ──
  useEffect(()=>{
    window.cricproDB = async () => {
      try {
        const data = {
          users:       users.map(u=>({id:u.id,name:u.name,email:u.email,role:u.role,plan:u.plan})),
          teams:       teams,
          players:     players,
          matches:     matches,
          grounds:     grounds,
          tournaments: tournaments,
          session:     DB.getSession(),
        };
        console.group("🏏 CricPro Database Inspector (Supabase)");
        console.log("👤 Users     :", data.users.length, data.users);
        console.log("🛡 Teams     :", data.teams.length, data.teams);
        console.log("👥 Players   :", data.players.length, data.players);
        console.log("🗓 Matches   :", data.matches.length, data.matches);
        console.log("🌿 Grounds   :", data.grounds.length, data.grounds);
        console.log("🏆 Tournaments:", data.tournaments.length, data.tournaments);
        console.log("🔑 Session   :", data.session);
        console.groupEnd();
        return data;
      } catch(e) { console.error("cricproDB error:", e); }
    };
    console.log("🏏 CricPro with Supabase loaded. Type cricproDB() to inspect data.");
  }, [users, teams, players, matches, grounds, tournaments]);

  const notify = (msg,type="success") => { const id=uid(); setNotifs(n=>[...n,{id,msg,type}]); setTimeout(()=>setNotifs(n=>n.filter(x=>x.id!==id)),3500); };
  const sf = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const closeModal = () => { setModal(null); setEditItem(null); setForm({}); };
  const openDeep = (type,item) => setDeepView({type,item});
  const closeDeep = () => setDeepView(null);

  const handleUpgrade = () => setShowPayment(true);
  const handleUpgradeSuccess = () => {
    const updated = {...currentUser, plan:PLANS.PRO};
    setCurrentUser(updated);
    setUsers(us=>us.map(u=>u.id===currentUser.id?updated:u));
    DB.update(DB.KEYS.USERS, currentUser.id, {plan:PLANS.PRO});
    setShowPayment(false); setShowPricing(false);
    notify("🎉 Welcome to CricPro Pro! All features unlocked.");
  };

  const logout = () => {
    DB.clearSession();
    setCurrentUser(null); setTab("dashboard"); setDeepView(null); setScoringMatch(null); setShowPricing(false); setShowPayment(false);
  };

  const handleLogin = async (u) => {
    // Reload from Supabase to get latest data
    try {
      const freshUser = await DB.findById(DB.KEYS.USERS, u.id);
      if(!freshUser) {
        notify("User not found in database", "error");
        return;
      }
      
      const [allUsers, allTeams, allPlayers, allMatches, allGrounds, allTournaments] = await Promise.all([
        DB.getAll(DB.KEYS.USERS),
        DB.getAll(DB.KEYS.TEAMS),
        DB.getAll(DB.KEYS.PLAYERS),
        DB.getAll(DB.KEYS.MATCHES),
        DB.getAll(DB.KEYS.GROUNDS),
        DB.getAll(DB.KEYS.TOURNAMENTS),
      ]);
      
      setCurrentUser(freshUser);
      setUsers(allUsers);
      setTeams(allTeams);
      setPlayers(allPlayers);
      setMatches(allMatches);
      setGrounds(allGrounds);
      setTournaments(allTournaments);
      DB.setSession(freshUser.id);
      notify(`Welcome back, ${freshUser.name}! 👋`);
    } catch(e) {
      console.error("Login error:", e);
      notify("Failed to login. Please try again.", "error");
    }
  };

  if(!currentUser) return <AuthPage onLogin={handleLogin}/>;

  if(showPricing) return <><PricingPage user={currentUser} onUpgrade={handleUpgrade} onClose={()=>setShowPricing(false)}/>{showPayment&&<PaymentModal user={currentUser} onSuccess={handleUpgradeSuccess} onClose={()=>setShowPayment(false)}/>}</>;

  if(showPayment) return <PaymentModal user={currentUser} onSuccess={handleUpgradeSuccess} onClose={()=>setShowPayment(false)}/>;

  if(scoringMatch) return (
    <ScoringEngine match={scoringMatch} currentUser={currentUser} onClose={()=>setScoringMatch(null)}/>
  );

  // Show loading screen while fetching from Supabase
  if(isLoading) return (
    <div style={{minHeight:"100vh",background:"#0a0e1a",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>🏏</div>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:"#00e5a0",letterSpacing:2}}>CRICPRO</div>
        <div style={{fontSize:13,color:"#6b7280",marginTop:12}}>Connecting to database...</div>
        <div style={{marginTop:20,display:"flex",gap:6,justifyContent:"center"}}>
          {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#00e5a0",animation:`pulse 1.5s infinite`,animationDelay:`${i*0.2}s`}}/>)}
        </div>
      </div>
    </div>
  );

  const liveMatch = matches.find(m=>m.status==="live");
  const navItems = [
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    {id:"scoring",icon:"🏏",label:"Live Scoring"},
    {id:"matches",icon:"🗓",label:"Matches"},
    {id:"teams",icon:"🛡",label:"Teams"},
    {id:"players",icon:"👤",label:"Players"},
    {id:"tournaments",icon:"🏆",label:"Tournaments"},
    {id:"grounds",icon:"🌿",label:"Grounds"},
    {id:"stats",icon:"📈",label:"Statistics"},
    {id:"settings",icon:"👤",label:"My Account"},
    ...(currentUser.role===ROLES.ADMIN?[{id:"admin",icon:"⚙️",label:"Admin Panel"}]:[]),
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#0a0e1a"}}>
      {/* Sidebar */}
      <div style={{width:sidebarOpen?220:64,background:"#0d1221",borderRight:"1px solid #1a2035",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",transition:"width .25s",overflow:"hidden",flexShrink:0}}>
        <div style={{padding:"18px 14px",borderBottom:"1px solid #1a2035",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          {sidebarOpen&&<div><div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:2,color:"#00e5a0"}}>CRICPRO</div><div style={{fontSize:9,color:"#4b5563",letterSpacing:2}}>CRICKET MGMT</div></div>}
          <button onClick={()=>setSidebarOpen(s=>!s)} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:18,padding:4}}>☰</button>
        </div>
        {liveMatch&&sidebarOpen&&(
          <div onClick={()=>setScoringMatch(liveMatch)} style={{margin:"10px",background:"#0d2d20",border:"1px solid #00e5a030",borderRadius:10,padding:"10px 12px",cursor:"pointer"}}>
            <div style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}><span className="live-dot"/><span style={{fontSize:10,color:"#ff4d4d",fontWeight:700,letterSpacing:1}}>LIVE</span></div>
            <div style={{fontSize:12,fontWeight:600}}>{liveMatch.team1} vs {liveMatch.team2}</div>
            <div style={{fontSize:11,color:"#00e5a0",fontFamily:"'JetBrains Mono'",marginTop:2}}>{liveMatch.score1} vs {liveMatch.score2}</div>
          </div>
        )}
        <nav style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
          {navItems.map(({id,icon,label})=>(
            <button key={id} onClick={()=>{setTab(id);closeDeep();}} title={!sidebarOpen?label:""} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:sidebarOpen?"10px 18px":"11px",justifyContent:sidebarOpen?"flex-start":"center",background:tab===id?"#00e5a010":"transparent",color:tab===id?"#00e5a0":"#6b7280",border:"none",borderLeft:`3px solid ${tab===id?"#00e5a0":"transparent"}`,cursor:"pointer",fontSize:14,fontWeight:tab===id?600:400,fontFamily:"'DM Sans'",transition:"all .15s"}}>
              <span style={{fontSize:sidebarOpen?15:20}}>{icon}</span>{sidebarOpen&&<span>{label}</span>}
            </button>
          ))}
        </nav>
        {/* Pro Banner in sidebar */}
        {sidebarOpen&&!isPro(currentUser)&&(
          <div style={{margin:"10px",background:"linear-gradient(135deg,#1a1500,#1a0d00)",border:"1px solid #f59e0b30",borderRadius:10,padding:12,cursor:"pointer"}} onClick={()=>setShowPricing(true)}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,marginBottom:4}}>★ UPGRADE TO PRO</div>
            <div style={{fontSize:11,color:"#6b7280"}}>Unlock deep stats & charts</div>
            <div style={{fontSize:13,color:"#f59e0b",fontWeight:700,marginTop:6}}>₹99/month →</div>
          </div>
        )}
        {/* ── USER CARD + SIGN OUT ── */}
        <div style={{borderTop:"1px solid #1a2035"}}>
          {/* Account Settings link */}
          <div
            onClick={()=>{setTab("settings");closeDeep();}}
            style={{display:"flex",alignItems:"center",gap:10,padding:sidebarOpen?"10px 14px":"10px",cursor:"pointer",transition:"background .15s",background:tab==="settings"?"#00e5a010":"transparent",borderLeft:`3px solid ${tab==="settings"?"#00e5a0":"transparent"}`}}>
            <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:avatarColor(currentUser.name)+"30",color:avatarColor(currentUser.name),fontWeight:700,fontSize:12,flexShrink:0,border:`2px solid ${tab==="settings"?"#00e5a0":"#ffffff10"}`}}>
              {initials(currentUser.name)}
            </div>
            {sidebarOpen&&<div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:tab==="settings"?"#00e5a0":"#e8eaf6"}}>{currentUser.name}</div>
              <div style={{display:"flex",gap:4,marginTop:2,flexWrap:"wrap"}}>
                <span className={`role-badge-${currentUser.role}`}>{currentUser.role.toUpperCase()}</span>
                {isPro(currentUser)&&<span className="tag-pro tag" style={{fontSize:9,padding:"1px 6px"}}>PRO</span>}
              </div>
            </div>}
          </div>
          {/* Sign Out button — always visible */}
          <button
            onClick={logout}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:sidebarOpen?"10px 14px":"11px",justifyContent:sidebarOpen?"flex-start":"center",background:"transparent",color:"#ff6b6b",border:"none",borderLeft:"3px solid transparent",borderTop:"1px solid #0f1623",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'DM Sans'",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#ff6b6b10"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            title={!sidebarOpen?"Sign Out":""}>
            <span style={{fontSize:sidebarOpen?15:20}}>🚪</span>
            {sidebarOpen&&<span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,padding:28,overflowY:"auto"}}>
        {/* Notifications */}
        <div style={{position:"fixed",top:20,right:20,zIndex:2000,display:"flex",flexDirection:"column",gap:8}}>
          {notifs.map(n=><div key={n.id} className="fadeIn" style={{background:n.type==="success"?"#00e5a0":n.type==="error"?"#ff6b6b":"#f59e0b",color:"#0a0e1a",padding:"10px 18px",borderRadius:8,fontWeight:700,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{n.msg}</div>)}
        </div>

        {/* PRO UPSELL bar for free users */}
        {!isPro(currentUser)&&tab!=="admin"&&(
          <div style={{background:"linear-gradient(135deg,#1a1500,#1a0a00)",border:"1px solid #f59e0b30",borderRadius:10,padding:"12px 18px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <div style={{fontSize:13,color:"#f59e0b"}}>★ <b>CricPro Pro</b> — Unlock innings history, performance charts, advanced analysis & more</div>
            <button className="btn-pro" style={{fontSize:12,padding:"6px 14px",whiteSpace:"nowrap"}} onClick={()=>setShowPricing(true)}>Upgrade ₹99/mo</button>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {tab==="dashboard"&&(
          <div className="fadeIn">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div>
                <h1 className="section-title">DASHBOARD</h1>
                <div style={{fontSize:13,color:"#6b7280",marginTop:2}}>Welcome, <b style={{color:"#e8eaf6"}}>{currentUser.name}</b> · <span className={`role-badge-${currentUser.role}`}>{currentUser.role}</span> {isPro(currentUser)&&<span className="tag-pro tag" style={{fontSize:9}}>PRO</span>}</div>
              </div>
              {CAN.editMatch(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addMatch");setForm({format:"T20",status:"upcoming"});}}>+ Schedule Match</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
              {[{l:"Matches",v:matches.length,icon:"🗓",sub:`${matches.filter(m=>m.status==="live").length} live`,go:"matches"},{l:"Teams",v:teams.length,icon:"🛡",sub:`${players.length} players`,go:"teams"},{l:"Tournaments",v:tournaments.length,icon:"🏆",sub:`${tournaments.filter(t=>t.status==="Ongoing").length} ongoing`,go:"tournaments"},{l:"Grounds",v:grounds.length,icon:"🌿",sub:`${grounds.filter(g=>g.status==="Available").length} available`,go:"grounds"}].map(({l,v,icon,sub,go})=>(
                <div key={l} className="card card-click" style={{padding:20}} onClick={()=>setTab(go)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div><div style={{fontFamily:"'Bebas Neue'",fontSize:40,color:"#00e5a0",lineHeight:1}}>{v}</div><div style={{fontWeight:600,fontSize:14,marginTop:4}}>{l}</div><div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{sub}</div></div>
                    <span style={{fontSize:28}}>{icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20}}>
              <div className="card" style={{padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div className="section-title" style={{fontSize:18}}>RECENT MATCHES</div><button className="btn-ghost" style={{fontSize:12}} onClick={()=>setTab("matches")}>All →</button></div>
                {matches.map(m=>(
                  <div key={m.id} className="card-click" style={{padding:"12px 0",borderBottom:"1px solid #0f1623"}} onClick={()=>{setTab("matches");openDeep("match",m);}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <div><div style={{fontWeight:600}}>{m.team1} <span style={{color:"#4b5563"}}>vs</span> {m.team2}</div><div style={{fontSize:11,color:"#6b7280"}}>{m.ground} · {fmtDate(m.date)}</div></div>
                      <span className={`tag ${m.status==="live"?"tag-red":m.status==="completed"?"tag-green":"tag-blue"}`}>{m.status==="live"&&<span className="live-dot" style={{width:6,height:6}}/>}{m.status.toUpperCase()}</span>
                    </div>
                    {m.score1&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:12,color:"#9ca3af"}}>{m.team1}: <b style={{color:"#fff"}}>{m.score1}</b> · {m.team2}: <b style={{color:"#fff"}}>{m.score2||"Yet to bat"}</b></div>}
                    {m.winner&&<div style={{color:"#00e5a0",fontSize:12,fontWeight:600,marginTop:2}}>🏆 {m.winner} won · {m.mom&&`⭐ ${m.mom}`}</div>}
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>POINTS TABLE</div>
                {[...teams].sort((a,b)=>b.wins-a.wins).map((t,i)=>(
                  <div key={t.id} className="card-click" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #0f1623"}} onClick={()=>{setTab("teams");openDeep("team",t);}}>
                    <span style={{fontFamily:"'Bebas Neue'",fontSize:20,color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#b45309":"#4b5563",width:20}}>{i+1}</span>
                    <span style={{fontSize:18}}>{t.logo}</span>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{t.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{t.wins+t.losses}P</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:"#00e5a0"}}>{t.wins*2}pts</div><div style={{fontSize:11,color:"#6b7280"}}>{t.wins}W {t.losses}L</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:20}}>
              {[{title:"TOP BATSMEN",key:"runs",col:"#00e5a0",cols:[["Runs","runs"],["Avg","avg"],["SR","sr"]],filter:p=>p},{title:"TOP BOWLERS",key:"wickets",col:"#60a5fa",cols:[["Wkts","wickets"],["Eco","economy"]],filter:p=>p.wickets>0}].map(({title,key,col,cols,filter})=>(
                <div key={title} className="card" style={{padding:20}}>
                  <div className="section-title" style={{fontSize:18,marginBottom:16}}>{title}</div>
                  <table>
                    <thead><tr><th>#</th><th>Player</th>{cols.map(([l])=><th key={l}>{l}</th>)}</tr></thead>
                    <tbody>
                      {[...players].filter(filter).sort((a,b)=>b[key]-a[key]).slice(0,5).map((p,i)=>(
                        <tr key={p.id} className="clickable-row" onClick={()=>{setTab("players");openDeep("player",p);}}>
                          <td style={{color:i===0?"#f59e0b":"#4b5563",fontFamily:"'Bebas Neue'",fontSize:16}}>{i+1}</td>
                          <td style={{fontWeight:600}}>{p.name}</td>
                          {cols.map(([l,k2])=><td key={l} style={{color:l===cols[0][0]?col:"#e8eaf6",fontWeight:l===cols[0][0]?700:400,fontFamily:"'JetBrains Mono'"}}>{p[k2]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PLAYERS ── */}
        {tab==="players"&&(
          deepView?.type==="player" ?
          <PlayerProfile player={deepView.item} matches={matches} teams={teams} currentUser={currentUser} onBack={closeDeep} onUpgrade={handleUpgrade} inningsData={inningsData} setInningsData={setInningsData}/>
          : (
            <div className="fadeIn">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <h1 className="section-title">PLAYERS</h1>
                <div style={{display:"flex",gap:10}}>
                  <input placeholder="Search players..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{width:200}}/>
                  {CAN.editPlayer(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addPlayer");setForm({role:"Batsman"});}}>+ Add Player</button>}
                </div>
              </div>
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <table>
                  <thead><tr><th>#</th><th>Player</th><th>Team</th><th>Role</th><th>M</th><th>Runs</th><th>Avg</th><th>SR</th><th>Wkts</th><th>Eco</th>{CAN.editPlayer(currentUser.role)&&<th></th>}</tr></thead>
                  <tbody>
                    {players.filter(p=>!searchQuery||p.name.toLowerCase().includes(searchQuery.toLowerCase())||p.team.toLowerCase().includes(searchQuery.toLowerCase())).map((p,i)=>(
                      <tr key={p.id} className="clickable-row" onClick={()=>openDeep("player",p)}>
                        <td style={{color:"#6b7280"}}>{i+1}</td>
                        <td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:avatarColor(p.name)+"25",color:avatarColor(p.name)}}>{initials(p.name)}</div><span style={{fontWeight:700}}>{p.name}</span>{currentUser.name===p.name&&<span style={{fontSize:10,color:"#00e5a0"}}>(you)</span>}</div></td>
                        <td style={{fontSize:12,color:"#9ca3af"}}>{p.team}</td>
                        <td><span className={`tag ${p.role==="Batsman"?"tag-blue":p.role==="Bowler"?"tag-red":p.role.includes("WK")?"tag-yellow":"tag-purple"}`} style={{fontSize:10}}>{p.role}</span></td>
                        <td>{p.matches}</td>
                        <td style={{color:"#00e5a0",fontWeight:700,fontFamily:"'JetBrains Mono'"}}>{p.runs}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.avg}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.sr}</td>
                        <td style={{color:"#60a5fa",fontWeight:700,fontFamily:"'JetBrains Mono'"}}>{p.wickets}</td>
                        <td style={{fontFamily:"'JetBrains Mono'"}}>{p.economy||"—"}</td>
                        {CAN.editPlayer(currentUser.role)&&<td onClick={e=>e.stopPropagation()}><div style={{display:"flex",gap:4}}><button className="btn-ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>{setEditItem(p);setModal("addPlayer");setForm({...p});}}>Edit</button><button className="btn-danger" style={{padding:"4px 10px",fontSize:11}} onClick={()=>{setPlayers(ps=>ps.filter(x=>x.id!==p.id));notify("Removed");}}>✕</button></div></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* ── MATCHES ── */}
        {tab==="matches"&&(
          deepView?.type==="match" ? (
            <div className="fadeIn">
              <div className="breadcrumb"><span className="bc-link" onClick={closeDeep}>Matches</span><span>›</span><span style={{color:"#e8eaf6"}}>{deepView.item.team1} vs {deepView.item.team2}</span></div>
              <div className="card" style={{padding:28,marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                  <div>
                    <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                      <span className={`tag ${deepView.item.status==="live"?"tag-red":deepView.item.status==="completed"?"tag-green":"tag-blue"}`}>{deepView.item.status==="live"&&<span className="live-dot" style={{width:6,height:6}}/>}{deepView.item.status.toUpperCase()}</span>
                      <span className="tag tag-purple">{deepView.item.format}</span>
                      {deepView.item.tournament&&<span className="tag tag-yellow">🏆 {deepView.item.tournament}</span>}
                    </div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:34}}>{deepView.item.team1} <span style={{color:"#4b5563",fontSize:22}}>VS</span> {deepView.item.team2}</div>
                    <div style={{display:"flex",gap:16,marginTop:10,fontSize:13,color:"#9ca3af",flexWrap:"wrap"}}>
                      <span>📍 {deepView.item.ground}</span><span>📅 {fmtDate(deepView.item.date)} {deepView.item.time}</span>
                      {deepView.item.toss&&<span>🪙 {deepView.item.toss}</span>}
                    </div>
                    {deepView.item.notes&&<div style={{marginTop:8,fontSize:13,color:"#60a5fa",fontStyle:"italic"}}>"{deepView.item.notes}"</div>}
                  </div>
                  {CAN.scoreMatch(currentUser.role)&&deepView.item.status==="live"&&<button className="btn-primary" onClick={()=>setScoringMatch(deepView.item)}>▶ Open Scorer</button>}
                </div>
                {deepView.item.score1&&(
                  <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:20,marginTop:24,alignItems:"center"}}>
                    <div><div style={{fontSize:13,color:"#9ca3af",marginBottom:4}}>{deepView.item.team1}</div><div style={{fontFamily:"'Bebas Neue'",fontSize:48}}>{deepView.item.score1}</div><div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#6b7280"}}>{deepView.item.overs1} overs</div></div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"#4b5563"}}>VS</div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:13,color:"#9ca3af",marginBottom:4}}>{deepView.item.team2}</div><div style={{fontFamily:"'Bebas Neue'",fontSize:48,color:deepView.item.status==="live"?"#60a5fa":"#fff"}}>{deepView.item.score2||"Yet to bat"}</div>{deepView.item.overs2&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#6b7280"}}>{deepView.item.overs2} overs</div>}</div>
                  </div>
                )}
                {deepView.item.winner&&<div style={{marginTop:16,padding:"12px 16px",background:"#00e5a010",border:"1px solid #00e5a030",borderRadius:8,color:"#00e5a0",fontWeight:700}}>🏆 {deepView.item.winner} won!</div>}
                {deepView.item.mom&&<div style={{marginTop:8,fontSize:13,color:"#f59e0b"}}>⭐ Man of the Match: <b className="bc-link" onClick={()=>{const p=players.find(x=>x.name===deepView.item.mom);if(p){setTab("players");openDeep("player",p);}}}>{deepView.item.mom}</b></div>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {[deepView.item.team1,deepView.item.team2].map(tname=>(
                  <div key={tname} className="card" style={{padding:20}}>
                    <div className="section-title" style={{fontSize:16,marginBottom:12}}>{tname}</div>
                    {players.filter(p=>p.team===tname).map(p=>(
                      <div key={p.id} className="card-click" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #0f1623"}} onClick={()=>{setTab("players");openDeep("player",p);}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:avatarColor(p.name)+"25",color:avatarColor(p.name)}}>{initials(p.name)}</div>
                          <span style={{fontWeight:600,fontSize:13}}>{p.name}</span>
                        </div>
                        <span className={`tag ${p.role==="Batsman"?"tag-blue":p.role==="Bowler"?"tag-red":"tag-purple"}`} style={{fontSize:10}}>{p.role}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="fadeIn">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <h1 className="section-title">MATCHES</h1>
                {CAN.editMatch(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addMatch");setForm({format:"T20",status:"upcoming"});}}>+ Add Match</button>}
              </div>
              {["live","upcoming","completed"].map(status=>{
                const fl=matches.filter(m=>m.status===status);
                if(!fl.length) return null;
                return <div key={status} style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>{status==="live"&&<span className="live-dot"/>}<span style={{fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:1,color:status==="live"?"#ff4d4d":status==="completed"?"#00e5a0":"#60a5fa"}}>{status.toUpperCase()} ({fl.length})</span></div>
                  {fl.map(m=>(
                    <div key={m.id} className="card card-click" style={{padding:16,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>openDeep("match",m)}>
                      <div><div style={{fontWeight:700}}>{m.team1} vs {m.team2}</div>
                        {m.score1&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:12,color:"#9ca3af",marginTop:2}}>{m.score1} v {m.score2||"TBB"}</div>}
                        {m.winner&&<div style={{color:"#00e5a0",fontSize:12,fontWeight:600}}>🏆 {m.winner}</div>}
                        <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>📍 {m.ground} · {fmtDate(m.date)} · {m.format}</div>
                      </div>
                      <div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
                        {CAN.scoreMatch(currentUser.role)&&m.status==="live"&&<button className="btn-primary" style={{padding:"6px 12px",fontSize:12}} onClick={()=>setScoringMatch(m)}>▶</button>}
                        {CAN.editMatch(currentUser.role)&&m.status==="upcoming"&&<button className="btn-ghost" style={{padding:"6px 12px",fontSize:12}} onClick={()=>{setMatches(ms=>ms.map(x=>x.id===m.id?{...x,status:"live"}:x));notify("Match started!");}}>Start</button>}
                        {CAN.editMatch(currentUser.role)&&<button className="btn-danger" style={{padding:"6px 10px",fontSize:12}} onClick={()=>{setMatches(ms=>ms.filter(x=>x.id!==m.id));notify("Removed");}}>✕</button>}
                      </div>
                    </div>
                  ))}
                </div>;
              })}
            </div>
          )
        )}

        {/* ── TEAMS ── */}
        {tab==="teams"&&(
          deepView?.type==="team" ? (
            <div className="fadeIn">
              <div className="breadcrumb"><span className="bc-link" onClick={closeDeep}>Teams</span><span>›</span><span style={{color:"#e8eaf6"}}>{deepView.item.name}</span></div>
              <div className="card" style={{padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,right:0,width:150,height:150,background:deepView.item.color,opacity:.06,borderRadius:"0 0 0 150px"}}/>
                <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20}}>
                  <span style={{fontSize:48}}>{deepView.item.logo}</span>
                  <div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:32}}>{deepView.item.name}</div>
                    <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}><span className="tag tag-blue">{deepView.item.short}</span><span className="tag tag-green">📍 {deepView.item.city}</span></div>
                    <div style={{fontSize:13,color:"#9ca3af",marginTop:6}}>👑 {deepView.item.captain} · Est. {deepView.item.founded}</div>
                  </div>
                  {CAN.editTeam(currentUser.role)&&<button className="btn-ghost" style={{marginLeft:"auto",fontSize:12}}>✏ Edit</button>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
                  {[["Players",deepView.item.players],["Wins",deepView.item.wins],["Losses",deepView.item.losses],["Win%",Math.round(deepView.item.wins/(deepView.item.wins+deepView.item.losses)*100)+"%"],["Points",deepView.item.wins*2]].map(([l,v])=><div key={l} className="stat-box"><div className="val">{v}</div><div className="lbl">{l}</div></div>)}
                </div>
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>SQUAD — Click player for full profile</div>
                <table>
                  <thead><tr><th>#</th><th>Player</th><th>Role</th><th>M</th><th>Runs</th><th>Avg</th><th>Wkts</th></tr></thead>
                  <tbody>
                    {players.filter(p=>p.team===deepView.item.name).map((p,i)=>(
                      <tr key={p.id} className="clickable-row" onClick={()=>{setTab("players");openDeep("player",p);}}>
                        <td style={{color:"#6b7280"}}>{i+1}</td>
                        <td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:avatarColor(p.name)+"25",color:avatarColor(p.name)}}>{initials(p.name)}</div><span style={{fontWeight:600}}>{p.name}</span>{deepView.item.captain===p.name&&<span>👑</span>}</div></td>
                        <td><span className={`tag ${p.role==="Batsman"?"tag-blue":p.role==="Bowler"?"tag-red":p.role.includes("WK")?"tag-yellow":"tag-purple"}`} style={{fontSize:10}}>{p.role}</span></td>
                        <td>{p.matches}</td><td style={{color:"#00e5a0",fontWeight:700}}>{p.runs}</td><td style={{fontFamily:"'JetBrains Mono'"}}>{p.avg}</td><td style={{color:"#60a5fa",fontWeight:700}}>{p.wickets}</td>
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
                    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}><span style={{fontSize:36}}>{t.logo}</span><div><div style={{fontFamily:"'Bebas Neue'",fontSize:22}}>{t.name}</div><span className="tag tag-blue">{t.short}</span></div></div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                      {[["Players",t.players],["Wins",t.wins],["Losses",t.losses]].map(([l,v])=><div key={l} style={{background:"#111827",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:t.color}}>{v}</div><div style={{fontSize:10,color:"#6b7280"}}>{l}</div></div>)}
                    </div>
                    <div style={{fontSize:12,color:"#6b7280"}}>👑 {t.captain} · 📍 {t.city}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* ── TOURNAMENTS ── */}
        {tab==="tournaments"&&(
          deepView?.type==="tournament" ? (
            <div className="fadeIn">
              <div className="breadcrumb"><span className="bc-link" onClick={closeDeep}>Tournaments</span><span>›</span><span style={{color:"#e8eaf6"}}>{deepView.item.name}</span></div>
              <div className="card" style={{padding:24,marginBottom:20}}>
                <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                  <span className={`tag ${deepView.item.status==="Ongoing"?"tag-green":deepView.item.status==="Upcoming"?"tag-blue":"tag-yellow"}`}>{deepView.item.status}</span>
                  <span className="tag tag-purple">{deepView.item.format}</span>
                </div>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:30,marginBottom:6}}>{deepView.item.name}</div>
                <div style={{fontSize:13,color:"#9ca3af",marginBottom:12}}>{deepView.item.description}</div>
                <div style={{display:"flex",gap:20,fontSize:13,color:"#6b7280",flexWrap:"wrap"}}><span>📅 {fmtDate(deepView.item.startDate)} → {fmtDate(deepView.item.endDate)}</span><span>🏆 {deepView.item.prize}</span></div>
                {currentUser.role===ROLES.PLAYER&&deepView.item.status==="Upcoming"&&(
                  <button className="btn-ghost" style={{marginTop:14,fontSize:13}} onClick={()=>{if(currentUser.team&&!deepView.item.registered.includes(currentUser.team)){setTournaments(ts=>ts.map(t=>t.id===deepView.item.id?{...t,registered:[...t.registered,currentUser.team]}:t));notify("Registered!");}else notify("Already registered or no team","error");}}>
                    + Register My Team
                  </button>
                )}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:20}}>
                <div className="card" style={{padding:20}}>
                  <div className="section-title" style={{fontSize:18,marginBottom:16}}>STANDINGS</div>
                  {deepView.item.registered.map((tname,i)=>{
                    const t=teams.find(x=>x.name===tname)||{};
                    const played=matches.filter(m=>m.status==="completed"&&(m.team1===tname||m.team2===tname));
                    const wins=played.filter(m=>m.winner===tname).length;
                    return (
                      <div key={tname} className="card-click" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #0f1623"}} onClick={()=>{const team=teams.find(x=>x.name===tname);if(team){setTab("teams");openDeep("team",team);}}}>
                        <span style={{fontFamily:"'Bebas Neue'",fontSize:18,color:i===0?"#f59e0b":"#4b5563",width:20}}>{i+1}</span>
                        <span>{t.logo||"🔵"}</span>
                        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{tname}</div><div style={{fontSize:11,color:"#6b7280"}}>{played.length}P {wins}W</div></div>
                        <div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"#f59e0b"}}>{wins*2}pts</div>
                      </div>
                    );
                  })}
                </div>
                <div className="card" style={{padding:20}}>
                  <div className="section-title" style={{fontSize:18,marginBottom:16}}>FIXTURES</div>
                  {matches.filter(m=>m.tournament===deepView.item.name).map(m=>(
                    <div key={m.id} className="card-click" style={{padding:"10px 0",borderBottom:"1px solid #0f1623"}} onClick={()=>{setTab("matches");openDeep("match",m);}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontWeight:600,fontSize:13}}>{m.team1} vs {m.team2}</div><span className={`tag ${m.status==="live"?"tag-red":m.status==="completed"?"tag-green":"tag-blue"}`} style={{fontSize:10}}>{m.status}</span></div>
                      {m.winner&&<div style={{fontSize:12,color:"#00e5a0",fontWeight:600}}>🏆 {m.winner}</div>}
                      <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{fmtDate(m.date)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="fadeIn">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <h1 className="section-title">TOURNAMENTS & LEAGUES</h1>
                {CAN.editTournament(currentUser.role)&&<button className="btn-primary" onClick={()=>{setModal("addTournament");setForm({format:"T20",teams:8,registered:[]});}}>+ Create</button>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
                {tournaments.map(t=>(
                  <div key={t.id} className="card card-click" style={{padding:24}} onClick={()=>openDeep("tournament",t)}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span className={`tag ${t.status==="Ongoing"?"tag-green":t.status==="Upcoming"?"tag-blue":"tag-yellow"}`}>{t.status}</span><span className="tag tag-purple">{t.format}</span></div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:4}}>{t.name}</div>
                    <div style={{fontSize:12,color:"#9ca3af",marginBottom:12}}>{t.description}</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                      {[["Teams",t.teams],["Registered",t.registered.length],["Prize",t.prize]].map(([l,v])=><div key={l} style={{background:"#111827",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"#00e5a0"}}>{v}</div><div style={{fontSize:10,color:"#6b7280"}}>{l}</div></div>)}
                    </div>
                    <div style={{fontSize:12,color:"#6b7280"}}>📅 {fmtDate(t.startDate)} → {fmtDate(t.endDate)}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* ── GROUNDS ── */}
        {tab==="grounds"&&(
          deepView?.type==="ground" ? (
            <div className="fadeIn">
              <div className="breadcrumb"><span className="bc-link" onClick={closeDeep}>Grounds</span><span>›</span><span style={{color:"#e8eaf6"}}>{deepView.item.name}</span></div>
              <div className="card" style={{padding:24,marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><div style={{fontFamily:"'Bebas Neue'",fontSize:28}}>{deepView.item.name}</div><div style={{fontSize:13,color:"#9ca3af"}}>📍 {deepView.item.city}</div>
                    <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}><span className={`tag ${deepView.item.status==="Available"?"tag-green":deepView.item.status==="Booked"?"tag-blue":"tag-yellow"}`}>{deepView.item.status}</span><span className="tag tag-purple">{deepView.item.pitchType} Pitch</span>{deepView.item.floodlights&&<span className="tag tag-yellow">💡 Floodlights</span>}</div>
                  </div>
                  {CAN.editGround(currentUser.role)&&deepView.item.status==="Available"&&<button className="btn-primary" onClick={()=>{setGrounds(gs=>gs.map(x=>x.id===deepView.item.id?{...x,status:"Booked"}:x));notify("Ground booked!");}}>Book Ground</button>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:20}}>
                  {[["Capacity",deepView.item.capacity.toLocaleString()],["Pitch",deepView.item.pitchType],["Contact",deepView.item.contact||"N/A"],["Matches",matches.filter(m=>m.ground===deepView.item.name).length]].map(([l,v])=><div key={l} className="stat-box"><div className="val" style={{fontSize:20}}>{v}</div><div className="lbl">{l}</div></div>)}
                </div>
                {deepView.item.facilities?.length>0&&<div style={{marginTop:16}}><div style={{fontSize:11,color:"#6b7280",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Facilities</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{deepView.item.facilities.map(f=><span key={f} className="tag tag-green">{f}</span>)}</div></div>}
              </div>
              <div className="card" style={{padding:20}}>
                <div className="section-title" style={{fontSize:18,marginBottom:16}}>MATCHES AT THIS GROUND</div>
                {matches.filter(m=>m.ground===deepView.item.name).length>0 ? (
                  <table><thead><tr><th>Match</th><th>Date</th><th>Format</th><th>Result</th></tr></thead>
                    <tbody>{matches.filter(m=>m.ground===deepView.item.name).map(m=>(
                      <tr key={m.id} className="clickable-row" onClick={()=>{setTab("matches");openDeep("match",m);}}>
                        <td style={{fontWeight:600}}>{m.team1} vs {m.team2}</td>
                        <td style={{color:"#6b7280"}}>{fmtDate(m.date)}</td>
                        <td><span className="tag tag-purple">{m.format}</span></td>
                        <td>{m.winner?<span style={{color:"#00e5a0",fontWeight:600}}>🏆 {m.winner}</span>:<span className={`tag ${m.status==="live"?"tag-red":"tag-blue"}`}>{m.status}</span>}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                ) : <div style={{color:"#6b7280",fontSize:13}}>No matches at this ground yet</div>}
              </div>
            </div>
          ) : (
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
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                      <div style={{background:"#111827",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:"#00e5a0"}}>{g.capacity.toLocaleString()}</div><div style={{fontSize:10,color:"#6b7280"}}>CAPACITY</div></div>
                      <div style={{background:"#111827",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontWeight:700,fontSize:13,marginTop:4}}>{g.pitchType}</div><div style={{fontSize:10,color:"#6b7280"}}>PITCH</div></div>
                    </div>
                    <div style={{fontSize:12,color:g.floodlights?"#00e5a0":"#6b7280"}}>💡 {g.floodlights?"Floodlights":"No Floodlights"}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* ── STATS ── */}
        {tab==="stats"&&(
          <div className="fadeIn">
            <h1 className="section-title" style={{marginBottom:24}}>STATISTICS HUB</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
              {[["Total Runs",players.reduce((a,p)=>a+p.runs,0).toLocaleString()],["Total Wickets",players.reduce((a,p)=>a+p.wickets,0)],["Matches",matches.filter(m=>m.status!=="upcoming").length]].map(([l,v])=>(
                <div key={l} className="card" style={{padding:20,textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:48,color:"#00e5a0"}}>{v}</div><div style={{color:"#9ca3af",fontWeight:600}}>{l}</div></div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              {[{title:"BATTING RANKINGS",sort:"runs",col:"#00e5a0",filter:p=>p,cols:[["Runs","runs"],["HS","hs"],["Avg","avg"],["100s","hundreds"],["50s","fifties"]]},{title:"BOWLING RANKINGS",sort:"wickets",col:"#60a5fa",filter:p=>p.wickets>0,cols:[["Wkts","wickets"],["Eco","economy"]]}].map(({title,sort,col,filter,cols})=>(
                <div key={title} className="card" style={{padding:20}}>
                  <div className="section-title" style={{fontSize:18,marginBottom:16}}>{title}</div>
                  <table>
                    <thead><tr><th>#</th><th>Player</th>{cols.map(([l])=><th key={l}>{l}</th>)}</tr></thead>
                    <tbody>
                      {[...players].filter(filter).sort((a,b)=>b[sort]-a[sort]).map((p,i)=>(
                        <tr key={p.id} className="clickable-row" onClick={()=>{setTab("players");openDeep("player",p);}}>
                          <td style={{fontFamily:"'Bebas Neue'",color:i===0?"#f59e0b":i===1?"#9ca3af":i===2?"#b45309":"#4b5563",fontSize:16}}>{i+1}</td>
                          <td style={{fontWeight:600}}>{p.name}</td>
                          {cols.map(([l,k])=><td key={l} style={{color:l===cols[0][0]?col:"#e8eaf6",fontWeight:l===cols[0][0]?700:400,fontFamily:"'JetBrains Mono'"}}>{p[k]||"—"}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            {/* Pro charts section */}
            <div style={{marginTop:20}}>
              <ProGate user={currentUser} onUpgrade={handleUpgrade} feature="Team performance charts">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                  <div className="card" style={{padding:20}}>
                    <div className="section-title" style={{fontSize:16,marginBottom:16}}>RUNS PER TEAM</div>
                    <BarChart data={teams.map(t=>({val:players.filter(p=>p.team===t.name).reduce((a,p)=>a+p.runs,0),label:t.short}))} color="#00e5a0"/>
                  </div>
                  <div className="card" style={{padding:20}}>
                    <div className="section-title" style={{fontSize:16,marginBottom:16}}>WICKETS PER TEAM</div>
                    <BarChart data={teams.map(t=>({val:players.filter(p=>p.team===t.name).reduce((a,p)=>a+p.wickets,0),label:t.short}))} color="#60a5fa"/>
                  </div>
                </div>
              </ProGate>
            </div>
          </div>
        )}

        {/* ── SCORING TAB ── */}
        {tab==="scoring"&&(
          <div className="fadeIn">
            <h1 className="section-title" style={{marginBottom:24}}>LIVE SCORING</h1>
            {!CAN.scoreMatch(currentUser.role)&&<div style={{background:"#f59e0b15",border:"1px solid #f59e0b30",borderRadius:10,padding:"14px 18px",color:"#f59e0b",marginBottom:20,fontSize:13}}>⚠️ Your role (<b>{currentUser.role}</b>) cannot score matches. Contact an Admin to change your role.</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
              {matches.map(m=>(
                <div key={m.id} className="card" style={{padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span className={`tag ${m.status==="live"?"tag-red":m.status==="completed"?"tag-green":"tag-blue"}`}>{m.status==="live"&&<span className="live-dot" style={{width:6,height:6}}/>}{m.status.toUpperCase()}</span><span className="tag tag-purple">{m.format}</span></div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:22}}>{m.team1}</div>
                  {m.score1&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:18,color:"#00e5a0"}}>{m.score1} <span style={{fontSize:13,color:"#6b7280"}}>({m.overs1})</span></div>}
                  <div style={{color:"#6b7280",margin:"4px 0",fontSize:13}}>vs</div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:22}}>{m.team2}</div>
                  {m.score2&&<div style={{fontFamily:"'JetBrains Mono'",fontSize:18,color:"#60a5fa"}}>{m.score2} <span style={{fontSize:13,color:"#6b7280"}}>({m.overs2})</span></div>}
                  {m.winner&&<div style={{marginTop:8,color:"#00e5a0",fontWeight:700,fontSize:13}}>🏆 {m.winner}</div>}
                  <div style={{marginTop:10,fontSize:12,color:"#6b7280"}}>📍 {m.ground} · {fmtDate(m.date)}</div>
                  {CAN.scoreMatch(currentUser.role)&&m.status==="live"&&<button className="btn-primary" style={{marginTop:10,width:"100%"}} onClick={()=>setScoringMatch(m)}>▶ Open Scorer</button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ACCOUNT SETTINGS ── */}
        {tab==="settings"&&(
          <AccountSettings
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            users={users}
            setUsers={setUsers}
            notify={notify}
            logout={logout}
            onUpgrade={handleUpgrade}
          />
        )}

        {/* ── ADMIN PANEL ── */}
        {tab==="admin"&&currentUser.role===ROLES.ADMIN&&(
          <div className="fadeIn">
            <h1 className="section-title" style={{marginBottom:24}}>ADMIN PANEL</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:24}}>
              {Object.values(ROLES).map(r=><div key={r} className="stat-box"><div className="val" style={{fontSize:26}}>{users.filter(u=>u.role===r).length}</div><div className="lbl">{r}s</div></div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
              {[["Free Users",users.filter(u=>u.plan===PLANS.FREE).length,"#6b7280"],["Pro Users",users.filter(u=>u.plan===PLANS.PRO).length,"#f59e0b"],["Revenue",`₹${users.filter(u=>u.plan===PLANS.PRO).length*99}/mo`,"#00e5a0"]].map(([l,v,c])=>(
                <div key={l} className="card" style={{padding:20,textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue'",fontSize:36,color:c}}>{v}</div><div style={{color:"#9ca3af"}}>{l}</div></div>
              ))}
            </div>
            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid #1a2035",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div className="section-title" style={{fontSize:18}}>ALL USERS</div>
                <button className="btn-primary" onClick={()=>{setModal("addUser");setForm({role:ROLES.PLAYER,plan:PLANS.FREE});}}>+ Add User</button>
              </div>
              <table>
                <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Plan</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:avatarColor(u.name)+"30",color:avatarColor(u.name)}}>{initials(u.name)}</div><span style={{fontWeight:600}}>{u.name}{u.id===currentUser.id&&<span style={{fontSize:10,color:"#00e5a0"}}> (you)</span>}</span></div></td>
                      <td style={{color:"#9ca3af",fontSize:12}}>{u.email}</td>
                      <td><span className={`role-badge-${u.role}`}>{u.role.toUpperCase()}</span></td>
                      <td><span className={u.plan===PLANS.PRO?"tag-pro tag":"tag tag-blue"} style={{fontSize:10}}>{u.plan.toUpperCase()}</span></td>
                      <td style={{color:"#6b7280",fontSize:12}}>{fmtDate(u.joinedDate)}</td>
                      <td>
                        <div style={{display:"flex",gap:6}}>
                          <select value={u.role} onChange={e=>setUsers(us=>us.map(x=>x.id===u.id?{...x,role:e.target.value}:x))} style={{width:110,padding:"4px 8px",fontSize:11}}>{Object.values(ROLES).map(r=><option key={r} value={r}>{r}</option>)}</select>
                          <select value={u.plan} onChange={e=>setUsers(us=>us.map(x=>x.id===u.id?{...x,plan:e.target.value}:x))} style={{width:80,padding:"4px 8px",fontSize:11}}>{Object.values(PLANS).map(p=><option key={p} value={p}>{p}</option>)}</select>
                          {u.id!==currentUser.id&&<button className="btn-danger" style={{padding:"4px 10px",fontSize:11}} onClick={()=>setUsers(us=>us.filter(x=>x.id!==u.id))}>✕</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {modal&&(
        <div className="modal-overlay" onClick={e=>{if(e.target.className==="modal-overlay")closeModal();}}>
          <div className="modal">
            {modal==="addTeam"&&<>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:20}}>ADD TEAM</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input placeholder="Team Name" value={form.name||""} onChange={sf("name")}/>
                <div className="grid-2"><input placeholder="Short (e.g. RCB)" value={form.short||""} onChange={sf("short")}/><input placeholder="Logo Emoji 🔴" value={form.logo||""} onChange={sf("logo")}/></div>
                <input placeholder="Captain Name" value={form.captain||""} onChange={sf("captain")}/>
                <div className="grid-2"><input placeholder="City" value={form.city||""} onChange={sf("city")}/><input placeholder="Founded Year" value={form.founded||""} onChange={sf("founded")}/></div>
                <div className="grid-2"><input placeholder="Team Color (#hex)" value={form.color||""} onChange={sf("color")}/><input type="number" placeholder="Players" value={form.players||""} onChange={sf("players")}/></div>
                <div style={{display:"flex",gap:10,marginTop:8}}><button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.name)return notify("Name required","error");setTeams(ts=>[...ts,{id:uid(),wins:0,losses:0,players:parseInt(form.players)||11,...form}]);closeModal();notify("Team added!");}}>Add</button><button className="btn-ghost" onClick={closeModal}>Cancel</button></div>
              </div>
            </>}
            {modal==="addPlayer"&&<>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:20}}>{editItem?"EDIT PLAYER":"ADD PLAYER"}</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input placeholder="Player Name" value={form.name||""} onChange={sf("name")}/>
                <div className="grid-2"><select value={form.team||""} onChange={sf("team")}><option value="">Select Team</option>{teams.map(t=><option key={t.id}>{t.name}</option>)}</select><select value={form.role||"Batsman"} onChange={sf("role")}>{["Batsman","Bowler","All-rounder","WK-Batsman"].map(r=><option key={r}>{r}</option>)}</select></div>
                <textarea placeholder="Player bio" value={form.bio||""} onChange={sf("bio")} rows={2}/>
                <div className="grid-3"><input type="number" placeholder="Matches" value={form.matches||""} onChange={sf("matches")}/><input type="number" placeholder="Runs" value={form.runs||""} onChange={sf("runs")}/><input type="number" placeholder="Avg" value={form.avg||""} onChange={sf("avg")}/></div>
                <div className="grid-3"><input type="number" placeholder="Strike Rate" value={form.sr||""} onChange={sf("sr")}/><input type="number" placeholder="Wickets" value={form.wickets||""} onChange={sf("wickets")}/><input type="number" placeholder="Economy" value={form.economy||""} onChange={sf("economy")}/></div>
                <div className="grid-3"><input type="number" placeholder="Fifties" value={form.fifties||""} onChange={sf("fifties")}/><input type="number" placeholder="Hundreds" value={form.hundreds||""} onChange={sf("hundreds")}/><input type="number" placeholder="Catches" value={form.catches||""} onChange={sf("catches")}/></div>
                <div style={{display:"flex",gap:10,marginTop:8}}><button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.name)return notify("Required","error");const d={...form,matches:+form.matches||0,runs:+form.runs||0,avg:+form.avg||0,sr:+form.sr||0,wickets:+form.wickets||0,economy:+form.economy||0,catches:+form.catches||0,fifties:+form.fifties||0,hundreds:+form.hundreds||0,hs:+form.hs||0,ducks:+form.ducks||0,balls_faced:+form.balls_faced||0,fours:+form.fours||0,sixes:+form.sixes||0};if(editItem){setPlayers(ps=>ps.map(p=>p.id===editItem.id?{...p,...d}:p));notify("Updated!");}else{setPlayers(ps=>[...ps,{id:uid(),...d}]);notify("Added!");}closeModal();}}>Save</button><button className="btn-ghost" onClick={closeModal}>Cancel</button></div>
              </div>
            </>}
            {modal==="addMatch"&&<>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:20}}>SCHEDULE MATCH</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div className="grid-2"><select value={form.team1||""} onChange={sf("team1")}><option value="">Team 1</option>{teams.map(t=><option key={t.id}>{t.name}</option>)}</select><select value={form.team2||""} onChange={sf("team2")}><option value="">Team 2</option>{teams.filter(t=>t.name!==form.team1).map(t=><option key={t.id}>{t.name}</option>)}</select></div>
                <div className="grid-2"><input type="date" value={form.date||""} onChange={sf("date")}/><input type="time" value={form.time||""} onChange={sf("time")}/></div>
                <div className="grid-2"><select value={form.format||"T20"} onChange={sf("format")}>{["T20","50-Over","Test","T10"].map(f=><option key={f}>{f}</option>)}</select><select value={form.ground||""} onChange={sf("ground")}><option value="">Select Ground</option>{grounds.filter(g=>g.status!=="Maintenance").map(g=><option key={g.id}>{g.name}</option>)}</select></div>
                <select value={form.tournament||""} onChange={sf("tournament")}><option value="">No Tournament</option>{tournaments.map(t=><option key={t.id}>{t.name}</option>)}</select>
                <input placeholder="Notes (optional)" value={form.notes||""} onChange={sf("notes")}/>
                <div style={{display:"flex",gap:10,marginTop:8}}><button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.team1||!form.team2)return notify("Select both teams","error");setMatches(ms=>[...ms,{id:uid(),status:"upcoming",innings:1,...form}]);closeModal();notify("Scheduled!");}}>Schedule</button><button className="btn-ghost" onClick={closeModal}>Cancel</button></div>
              </div>
            </>}
            {modal==="addTournament"&&<>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:20}}>CREATE TOURNAMENT</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input placeholder="Tournament Name" value={form.name||""} onChange={sf("name")}/>
                <textarea placeholder="Description" value={form.description||""} onChange={sf("description")} rows={2}/>
                <div className="grid-2"><select value={form.format||"T20"} onChange={sf("format")}>{["T20","50-Over","T10","Test"].map(f=><option key={f}>{f}</option>)}</select><input type="number" placeholder="No. of Teams" value={form.teams||""} onChange={sf("teams")}/></div>
                <div className="grid-2"><input type="date" value={form.startDate||""} onChange={sf("startDate")}/><input type="date" value={form.endDate||""} onChange={sf("endDate")}/></div>
                <div className="grid-2"><input placeholder="Prize (e.g. ₹50,000)" value={form.prize||""} onChange={sf("prize")}/><select value={form.status||"Upcoming"} onChange={sf("status")}>{["Upcoming","Ongoing","Completed"].map(s=><option key={s}>{s}</option>)}</select></div>
                <div style={{fontSize:12,color:"#6b7280"}}>Register Teams:</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{teams.map(t=>{const sel=(form.registered||[]).includes(t.name);return <button key={t.id} onClick={()=>setForm(f=>({...f,registered:sel?(f.registered||[]).filter(x=>x!==t.name):[...(f.registered||[]),t.name]}))} style={{background:sel?"#00e5a0":"#111827",color:sel?"#0a0e1a":"#9ca3af",border:`1px solid ${sel?"#00e5a0":"#1a2035"}`,borderRadius:6,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.logo} {t.name}</button>;})}</div>
                <div style={{display:"flex",gap:10,marginTop:8}}><button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.name)return notify("Name required","error");setTournaments(ts=>[...ts,{id:uid(),registered:[],createdBy:currentUser.id,...form,teams:parseInt(form.teams)||8}]);closeModal();notify("Created!");}}>Create</button><button className="btn-ghost" onClick={closeModal}>Cancel</button></div>
              </div>
            </>}
            {modal==="addGround"&&<>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:20}}>ADD GROUND</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input placeholder="Ground Name" value={form.name||""} onChange={sf("name")}/>
                <div className="grid-2"><input placeholder="City" value={form.city||""} onChange={sf("city")}/><input type="number" placeholder="Capacity" value={form.capacity||""} onChange={sf("capacity")}/></div>
                <div className="grid-2"><select value={form.pitchType||"Balanced"} onChange={sf("pitchType")}>{["Batting","Bowling","Balanced","Pace","Spin"].map(p=><option key={p}>{p}</option>)}</select><select value={form.floodlights||"true"} onChange={sf("floodlights")}><option value="true">Floodlights ✓</option><option value="false">No Floodlights</option></select></div>
                <div className="grid-2"><input placeholder="Contact Number" value={form.contact||""} onChange={sf("contact")}/><select value={form.status||"Available"} onChange={sf("status")}>{["Available","Booked","Maintenance"].map(s=><option key={s}>{s}</option>)}</select></div>
                <div style={{display:"flex",gap:10,marginTop:8}}><button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.name)return notify("Name required","error");setGrounds(gs=>[...gs,{id:uid(),floodlights:form.floodlights!=="false",capacity:parseInt(form.capacity)||1000,facilities:[],...form}]);closeModal();notify("Added!");}}>Add</button><button className="btn-ghost" onClick={closeModal}>Cancel</button></div>
              </div>
            </>}
            {modal==="addUser"&&<>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,marginBottom:20}}>ADD USER</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input placeholder="Full Name" value={form.name||""} onChange={sf("name")}/>
                <input placeholder="Email" value={form.email||""} onChange={sf("email")}/>
                <input placeholder="Password" value={form.password||""} onChange={sf("password")}/>
                <div className="grid-2"><select value={form.role||ROLES.PLAYER} onChange={sf("role")}>{Object.values(ROLES).map(r=><option key={r} value={r}>{r}</option>)}</select><select value={form.plan||PLANS.FREE} onChange={sf("plan")}>{Object.values(PLANS).map(p=><option key={p} value={p}>{p}</option>)}</select></div>
                <div style={{display:"flex",gap:10,marginTop:8}}><button className="btn-primary" style={{flex:1}} onClick={()=>{if(!form.name||!form.email)return;setUsers(us=>[...us,{id:uid(),joinedDate:new Date().toISOString().split("T")[0],...form}]);closeModal();notify("User added!");}}>Add</button><button className="btn-ghost" onClick={closeModal}>Cancel</button></div>
              </div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ACCOUNT SETTINGS ──
function AccountSettings({ currentUser, setCurrentUser, users, setUsers, notify, logout, onUpgrade }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name:  currentUser.name  || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    city:  currentUser.city  || "",
    team:  currentUser.team  || "",
    bio:   currentUser.bio   || "",
  });
  const [pwForm, setPwForm] = useState({ current:"", newpw:"", confirm:"" });
  const [pwError, setPwError] = useState("");
  const [cancelModal, setCancelModal] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ matchStart:true, liveScore:true, teamUpdate:false, proRenewal:true, newTournament:true, weeklyDigest:false });

  const pro = isPro(currentUser);
  const joinDate = currentUser.joinedDate || "2026-01-01";
  // Simulate billing dates
  const joinMs   = new Date(joinDate).getTime();
  const nowMs    = Date.now();
  const cycleDay = Math.floor((nowMs - joinMs) / (30*24*60*60*1000));
  const nextBill = new Date(joinMs + (cycleDay+1)*30*24*60*60*1000);
  const daysLeft = Math.max(0, Math.ceil((nextBill - nowMs) / (24*60*60*1000)));
  const expiryDate = fmtDate(nextBill.toISOString().split("T")[0]);

  const PAYMENT_HISTORY = pro ? [
    {id:"INV-2026-003", date:"2026-03-01", amount:"₹99", plan:"Pro Monthly", method:"UPI · @okaxis",  status:"Paid"},
    {id:"INV-2026-002", date:"2026-02-01", amount:"₹99", plan:"Pro Monthly", method:"UPI · @okaxis",  status:"Paid"},
    {id:"INV-2026-001", date:"2026-01-01", amount:"₹99", plan:"Pro Monthly", method:"UPI · @okaxis",  status:"Paid"},
  ] : [];

  const sf  = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const spf = k => e => setPwForm(f => ({ ...f, [k]: e.target.value }));

  const saveProfile = () => {
    const patch = { name:form.name.trim(), email:form.email.trim(), phone:form.phone, city:form.city, team:form.team, bio:form.bio };
    const updated = { ...currentUser, ...patch };
    setCurrentUser(updated);
    setUsers(us => us.map(u => u.id === currentUser.id ? updated : u));
    DB.update(DB.KEYS.USERS, currentUser.id, patch);
    setEditMode(false);
    notify("Profile updated successfully!");
  };

  const changePassword = () => {
    if (pwForm.current !== currentUser.password) { setPwError("Current password is incorrect"); return; }
    if (pwForm.newpw.length < 6) { setPwError("New password must be at least 6 characters"); return; }
    if (pwForm.newpw !== pwForm.confirm) { setPwError("Passwords don't match"); return; }
    const updated = { ...currentUser, password: pwForm.newpw };
    setCurrentUser(updated);
    setUsers(us => us.map(u => u.id === currentUser.id ? updated : u));
    DB.update(DB.KEYS.USERS, currentUser.id, {password:pwForm.newpw});
    setPwForm({ current:"", newpw:"", confirm:"" });
    setPwError("");
    notify("Password changed successfully!");
  };

  const cancelSubscription = () => {
    const updated = { ...currentUser, plan: PLANS.FREE };
    setCurrentUser(updated);
    setUsers(us => us.map(u => u.id === currentUser.id ? updated : u));
    DB.update(DB.KEYS.USERS, currentUser.id, {plan:PLANS.FREE});
    setCancelModal(false);
    notify("Pro cancelled. Access continues until "+expiryDate, "error");
  };

  const STABS = [
    { id:"profile",    icon:"👤", label:"Profile" },
    { id:"membership", icon:"⭐", label:"Membership" },
    { id:"billing",    icon:"💳", label:"Billing & Payments" },
    { id:"security",   icon:"🔒", label:"Security" },
    { id:"notifs",     icon:"🔔", label:"Notifications" },
    { id:"danger",     icon:"⚠️", label:"Danger Zone", red:true },
  ];

  const Row = ({ label, children, value }) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:"1px solid #0f1623"}}>
      <span style={{color:"#6b7280",fontSize:13,minWidth:160,flexShrink:0}}>{label}</span>
      <div style={{flex:1,textAlign:"right"}}>{children ?? <span style={{fontWeight:600,fontSize:13}}>{value||"—"}</span>}</div>
    </div>
  );

  const Sect = ({ title, children, action }) => (
    <div className="card" style={{padding:24,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:1}}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );

  return (
    <div className="fadeIn">
      {/* Page header */}
      <div className="card" style={{padding:24,marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:180,height:180,background:avatarColor(currentUser.name),opacity:.05,borderRadius:"0 0 0 180px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
          <div style={{width:76,height:76,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",background:avatarColor(currentUser.name)+"30",color:avatarColor(currentUser.name),fontWeight:700,fontSize:28,flexShrink:0,border:`3px solid ${avatarColor(currentUser.name)}50`}}>
            {initials(currentUser.name)}
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:28,letterSpacing:1}}>{currentUser.name}</div>
            <div style={{color:"#9ca3af",fontSize:13,marginBottom:8}}>{currentUser.email}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <span className={`role-badge-${currentUser.role}`}>{currentUser.role.toUpperCase()}</span>
              {pro
                ? <span style={{display:"inline-flex",alignItems:"center",gap:5,background:"linear-gradient(135deg,#f59e0b,#fb923c)",color:"#0a0e1a",padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:800}}>⭐ PRO MEMBER</span>
                : <span className="tag tag-blue" style={{fontSize:11}}>FREE PLAN</span>}
              {currentUser.team && <span className="tag tag-green" style={{fontSize:11}}>🏏 {currentUser.team}</span>}
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:12,color:"#6b7280"}}>Member since</div>
            <div style={{fontWeight:700,fontSize:14,marginTop:2}}>{fmtDate(joinDate)}</div>
            {pro && <div style={{fontSize:12,color:"#f59e0b",marginTop:4}}>Renews {expiryDate}</div>}
          </div>
        </div>
      </div>

      <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
        {/* Left nav */}
        <div style={{width:190,flexShrink:0}}>
          <div className="card" style={{padding:6}}>
            {STABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:"none",
                  background:activeTab===t.id?"#00e5a010":"transparent",
                  color:activeTab===t.id?"#00e5a0":t.red?"#ff6b6b":"#9ca3af",
                  fontWeight:activeTab===t.id?600:400,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans'",transition:"all .15s",textAlign:"left"}}>
                <span style={{fontSize:16}}>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div style={{flex:1,minWidth:0}}>

          {/* ── PROFILE ── */}
          {activeTab==="profile" && (
            <Sect title="PERSONAL INFORMATION" action={
              editMode
                ? <div style={{display:"flex",gap:8}}>
                    <button className="btn-primary" style={{padding:"6px 16px",fontSize:12}} onClick={saveProfile}>Save Changes</button>
                    <button className="btn-ghost"   style={{padding:"6px 16px",fontSize:12}} onClick={()=>setEditMode(false)}>Cancel</button>
                  </div>
                : <button className="btn-ghost" style={{padding:"6px 16px",fontSize:12}} onClick={()=>setEditMode(true)}>✏ Edit Profile</button>
            }>
              {editMode ? (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="grid-2">
                    <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>Full Name</label><input value={form.name} onChange={sf("name")}/></div>
                    <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>Email Address</label><input value={form.email} onChange={sf("email")} type="email"/></div>
                  </div>
                  <div className="grid-2">
                    <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>Phone Number</label><input value={form.phone} onChange={sf("phone")} placeholder="+91 98000 00000"/></div>
                    <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>City</label><input value={form.city} onChange={sf("city")} placeholder="Your city"/></div>
                  </div>
                  <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>Cricket Team / Club</label><input value={form.team} onChange={sf("team")} placeholder="Your cricket team or club name"/></div>
                  <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>Bio</label><textarea value={form.bio} onChange={sf("bio")} placeholder="Tell other players about yourself..." rows={3}/></div>
                </div>
              ) : (
                <div>
                  <Row label="Full Name"        value={currentUser.name}/>
                  <Row label="Email Address"    value={currentUser.email}/>
                  <Row label="Phone Number"     value={currentUser.phone || "Not added"}/>
                  <Row label="City"             value={currentUser.city  || "Not added"}/>
                  <Row label="Cricket Team"     value={currentUser.team  || "Not linked"}/>
                  <Row label="Bio"              value={currentUser.bio   || "No bio yet"}/>
                  <Row label="Account Role"><span className={`role-badge-${currentUser.role}`}>{currentUser.role.toUpperCase()}</span></Row>
                  <Row label="Member Since"     value={fmtDate(joinDate)}/>
                  <Row label="Account ID"><span style={{fontFamily:"'JetBrains Mono'",fontSize:11,color:"#6b7280"}}>{currentUser.id}</span></Row>
                </div>
              )}
            </Sect>
          )}

          {/* ── MEMBERSHIP ── */}
          {activeTab==="membership" && (
            <div>
              {/* Plan card */}
              <div style={{background:pro?"linear-gradient(135deg,#1a1200,#100d00)":"#0d1221",border:`2px solid ${pro?"#f59e0b":"#1a2035"}`,borderRadius:16,padding:24,marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                  <div>
                    <div style={{fontSize:11,color:"#6b7280",letterSpacing:1,marginBottom:6}}>CURRENT PLAN</div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:36,color:pro?"#f59e0b":"#e8eaf6"}}>{pro?"⭐ PRO":"FREE"}</div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#9ca3af"}}>{pro?"₹99 / month":"₹0 / month"}</div>
                    {pro && <div style={{fontSize:12,color:"#6b7280",marginTop:6}}>Auto-renews on <b style={{color:"#f59e0b"}}>{expiryDate}</b></div>}
                  </div>
                  {pro ? (
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:12,color:"#6b7280"}}>Next billing date</div>
                      <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:"#f59e0b",marginTop:4}}>{expiryDate}</div>
                      <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>{daysLeft} days remaining in cycle</div>
                      <div style={{fontSize:12,color:"#00e5a0",marginTop:2}}>Auto-renewal is ON</div>
                    </div>
                  ) : (
                    <button className="btn-pro" onClick={onUpgrade} style={{padding:"12px 24px",fontSize:15}}>⭐ Upgrade to Pro</button>
                  )}
                </div>
                {pro && (
                  <div style={{marginTop:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12,color:"#6b7280"}}>
                      <span>Billing cycle progress</span><span style={{color:"#f59e0b"}}>{daysLeft} / 30 days left</span>
                    </div>
                    <div style={{height:6,background:"#1a2035",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min((daysLeft/30)*100,100)}%`,background:"linear-gradient(90deg,#f59e0b,#fb923c)",borderRadius:3,transition:"width 1s ease"}}/>
                    </div>
                  </div>
                )}
              </div>

              {/* Membership details */}
              {pro && (
                <Sect title="MEMBERSHIP DETAILS">
                  <Row label="Plan"              value="CricPro Pro — Monthly"/>
                  <Row label="Status"><span className="tag tag-green">Active</span></Row>
                  <Row label="Started On"        value={fmtDate(joinDate)}/>
                  <Row label="Current Period"    value={`${fmtDate(new Date(Date.now()-daysLeft*24*60*60*1000+(30-daysLeft)*24*60*60*1000-29*24*60*60*1000).toISOString().split("T")[0])} → ${expiryDate}`}/>
                  <Row label="Renewal Date"      value={expiryDate}/>
                  <Row label="Expiry (if cancelled)" value={expiryDate}/>
                  <Row label="Renewal Amount"    value="₹99"/>
                  <Row label="Billing Cycle"     value="Monthly (every 30 days)"/>
                  <Row label="Auto-Renewal"><span style={{color:"#00e5a0",fontWeight:600}}>✓ Enabled</span></Row>
                  <Row label="Payment Method"    value="UPI — linked account"/>
                  <div style={{display:"flex",gap:10,marginTop:16}}>
                    <button className="btn-ghost" style={{fontSize:13}} onClick={()=>notify("Redirecting to payment settings...")}>Change Payment Method</button>
                    <button style={{background:"transparent",color:"#ff6b6b",border:"1px solid #ff6b6b30",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer"}} onClick={()=>setCancelModal(true)}>Cancel Subscription</button>
                  </div>
                </Sect>
              )}

              {/* What's included */}
              <Sect title={`YOUR PLAN INCLUDES`}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {(pro
                    ? ["All matches & live scores","Innings-by-innings breakdown","Advanced batting & bowling analysis","Unlimited teams & tournaments","Performance charts & trends","Priority live scoring","Export stats to PDF","Career progression graphs","AI match insights"]
                    : ["All matches & live scores","Basic player stats","Join 1 team","Register for 1 tournament","Live score viewing"]
                  ).map(f=>(
                    <div key={f} style={{display:"flex",gap:8,alignItems:"center",padding:"8px 12px",background:"#111827",borderRadius:8,fontSize:13}}>
                      <span style={{color:pro?"#f59e0b":"#00e5a0",flexShrink:0}}>{pro?"⭐":"✓"}</span>
                      <span style={{color:"#e8eaf6"}}>{f}</span>
                    </div>
                  ))}
                </div>
                {!pro && (
                  <div style={{marginTop:16,padding:16,background:"#1a1200",border:"1px solid #f59e0b20",borderRadius:10}}>
                    <div style={{fontWeight:700,color:"#f59e0b",marginBottom:6}}>Upgrade to Pro — ₹99/month</div>
                    <div style={{fontSize:13,color:"#9ca3af",marginBottom:12}}>Unlock innings breakdowns, performance charts, unlimited teams, PDF export and more.</div>
                    <button className="btn-pro" onClick={onUpgrade}>⭐ Start 7-Day Free Trial</button>
                  </div>
                )}
              </Sect>
            </div>
          )}

          {/* ── BILLING & PAYMENTS ── */}
          {activeTab==="billing" && (
            <div>
              <Sect title="PAYMENT METHOD">
                {pro ? (
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"#111827",borderRadius:10,marginBottom:12,border:"1px solid #1a2035"}}>
                      <div style={{width:46,height:30,background:"linear-gradient(135deg,#f59e0b,#fb923c)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>💳</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:14}}>UPI — @okaxis</div>
                        <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>Primary · Auto-pay enabled · Verified</div>
                      </div>
                      <span className="tag tag-green" style={{fontSize:10}}>Active</span>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button className="btn-ghost" style={{fontSize:13}} onClick={()=>notify("Payment method update coming soon!")}>+ Add Method</button>
                      <button className="btn-ghost" style={{fontSize:13}} onClick={()=>notify("Redirecting to UPI settings...")}>Edit</button>
                    </div>
                  </div>
                ) : (
                  <div style={{textAlign:"center",padding:"20px 0",color:"#6b7280",fontSize:13}}>
                    No payment method on file.
                    <div style={{marginTop:12}}><button className="btn-pro" onClick={onUpgrade}>⭐ Add Method via Pro Upgrade</button></div>
                  </div>
                )}
              </Sect>

              <Sect title="PAYMENT HISTORY">
                {PAYMENT_HISTORY.length ? (
                  <div>
                    <table>
                      <thead><tr><th>Invoice</th><th>Date</th><th>Plan</th><th>Amount</th><th>Method</th><th>Status</th><th></th></tr></thead>
                      <tbody>
                        {PAYMENT_HISTORY.map(p=>(
                          <tr key={p.id}>
                            <td style={{fontFamily:"'JetBrains Mono'",fontSize:11,color:"#6b7280"}}>{p.id}</td>
                            <td style={{color:"#9ca3af",fontSize:12}}>{fmtDate(p.date)}</td>
                            <td><span className="tag tag-purple" style={{fontSize:10}}>{p.plan}</span></td>
                            <td style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"#00e5a0"}}>{p.amount}</td>
                            <td style={{fontSize:11,color:"#6b7280"}}>{p.method}</td>
                            <td><span className="tag tag-green" style={{fontSize:10}}>{p.status}</span></td>
                            <td>
                              <button className="btn-ghost" style={{padding:"3px 10px",fontSize:11}}
                                onClick={()=>notify(`Invoice ${p.id} PDF will be emailed to you`)}>↓ PDF</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{marginTop:14,padding:"12px 14px",background:"#111827",borderRadius:8,display:"flex",justifyContent:"space-between",fontSize:13}}>
                      <span style={{color:"#6b7280"}}>Total spent (all time)</span>
                      <span style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"#00e5a0"}}>₹{PAYMENT_HISTORY.length*99}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{textAlign:"center",padding:"28px 0"}}>
                    <div style={{fontSize:36,marginBottom:8}}>📄</div>
                    <div style={{color:"#6b7280",fontSize:13,marginBottom:12}}>No payment history yet.</div>
                    {!pro && <button className="btn-pro" onClick={onUpgrade}>⭐ Upgrade to Pro</button>}
                  </div>
                )}
              </Sect>

              {pro && (
                <Sect title="BILLING SUMMARY">
                  <Row label="Active since"          value={fmtDate(joinDate)}/>
                  <Row label="Current billing period" value={`...→ ${expiryDate}`}/>
                  <Row label="Next renewal date"     value={expiryDate}/>
                  <Row label="Next renewal amount"   value="₹99"/>
                  <Row label="Total invoices"        value={`${PAYMENT_HISTORY.length} payments`}/>
                  <Row label="Total paid"            value={`₹${PAYMENT_HISTORY.length*99}`}/>
                  <Row label="GST / Tax"             value="Included in ₹99"/>
                  <Row label="Billing cycle"         value="Monthly"/>
                </Sect>
              )}
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab==="security" && (
            <div>
              <Sect title="CHANGE PASSWORD">
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {pwError && <div style={{background:"#ff6b6b15",border:"1px solid #ff6b6b30",borderRadius:8,padding:"10px 14px",color:"#ff6b6b",fontSize:13}}>{pwError}</div>}
                  <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>Current Password</label><input type="password" placeholder="Enter current password" value={pwForm.current} onChange={spf("current")}/></div>
                  <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>New Password</label><input type="password" placeholder="Minimum 6 characters" value={pwForm.newpw} onChange={spf("newpw")}/></div>
                  <div><label style={{fontSize:12,color:"#6b7280",display:"block",marginBottom:5}}>Confirm New Password</label><input type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={spf("confirm")}/></div>
                  <button className="btn-primary" style={{width:180,marginTop:4}} onClick={changePassword}>Update Password</button>
                </div>
              </Sect>

              <Sect title="ACTIVE SESSIONS">
                {[
                  {device:"Chrome · Windows",  location:"Denton, TX",  time:"Now — active",  current:true},
                  {device:"Chrome · Android",  location:"Mumbai, IN",  time:"2 days ago"},
                  {device:"Safari · iPhone",   location:"Delhi, IN",   time:"5 days ago"},
                ].map((s,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #0f1623"}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <span style={{fontSize:24}}>{s.device.includes("Android")||s.device.includes("iPhone")?"📱":"💻"}</span>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{s.device}</div>
                        <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{s.location} · {s.time}</div>
                      </div>
                    </div>
                    {s.current
                      ? <span className="tag tag-green" style={{fontSize:10}}>This device</span>
                      : <button style={{background:"transparent",color:"#ff6b6b",border:"1px solid #ff6b6b30",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer"}} onClick={()=>notify("Session revoked")}>Revoke</button>}
                  </div>
                ))}
              </Sect>

              <Sect title="SECURITY SETTINGS">
                <Row label="Two-Factor Auth">
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{color:"#ff6b6b",fontSize:13}}>Not enabled</span>
                    <button className="btn-ghost" style={{padding:"4px 12px",fontSize:11}} onClick={()=>notify("2FA setup coming soon!")}>Enable 2FA</button>
                  </div>
                </Row>
                <Row label="Login method"      value="Email & Password"/>
                <Row label="Last password change" value="Never"/>
                <Row label="Account created"   value={fmtDate(joinDate)}/>
              </Sect>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab==="notifs" && (
            <Sect title="NOTIFICATION PREFERENCES">
              {[
                {key:"matchStart",    label:"Match Start Reminders",    desc:"Get notified 30 mins before your team's match"},
                {key:"liveScore",     label:"Live Score Updates",        desc:"Ball-by-ball score notifications during matches"},
                {key:"teamUpdate",    label:"Team Announcements",        desc:"Messages from your team captain or organizer"},
                {key:"proRenewal",    label:"Pro Renewal Reminder",      desc:"7 days before your Pro subscription renews"},
                {key:"newTournament", label:"New Tournament Alerts",     desc:"When a new tournament opens for registration"},
                {key:"weeklyDigest",  label:"Weekly Stats Digest",       desc:"Your performance summary every Monday morning"},
              ].map(n=>(
                <div key={n.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #0f1623"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{n.label}</div>
                    <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{n.desc}</div>
                  </div>
                  <button
                    onClick={()=>{
                      setNotifPrefs(p=>({...p,[n.key]:!p[n.key]}));
                      notify(`${n.label} ${notifPrefs[n.key]?"disabled":"enabled"}`);
                    }}
                    style={{width:46,height:26,borderRadius:13,border:"none",background:notifPrefs[n.key]?"#00e5a0":"#1a2035",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0,marginLeft:16}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:4,transition:"left .25s",left:notifPrefs[n.key]?"24px":"4px"}}/>
                  </button>
                </div>
              ))}
              <div style={{marginTop:16,display:"flex",gap:10}}>
                <button className="btn-primary" style={{fontSize:13}} onClick={()=>notify("Notification preferences saved!")}>Save Preferences</button>
                <button className="btn-ghost"   style={{fontSize:13}} onClick={()=>setNotifPrefs({matchStart:true,liveScore:true,teamUpdate:false,proRenewal:true,newTournament:true,weeklyDigest:false})}>Reset to Default</button>
              </div>
            </Sect>
          )}

          {/* ── DANGER ZONE ── */}
          {activeTab==="danger" && (
            <div>
              <Sect title="EXPORT YOUR DATA">
                <div style={{color:"#9ca3af",fontSize:13,marginBottom:14}}>Download a full copy of your CricPro data including profile, match history, and stats as a JSON file.</div>
                <button className="btn-ghost" onClick={()=>notify("Data export will be emailed within 24 hours")}>📦 Request Data Export</button>
              </Sect>

              <div className="card" style={{padding:24,border:"1px solid #ff6b6b20"}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:18,color:"#ff6b6b",letterSpacing:1,marginBottom:16}}>DANGER ZONE</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {[
                    {
                      title:"Deactivate Account",
                      desc:"Temporarily disable your account. You can reactivate by logging in again.",
                      action:"Deactivate",
                      onClick:()=>notify("Account deactivation request submitted","error"),
                    },
                    {
                      title:"Sign Out of All Devices",
                      desc:"Revoke all active sessions and sign out everywhere.",
                      action:"Sign Out All",
                      onClick:()=>{notify("Signed out of all devices");setTimeout(logout,800);},
                    },
                    {
                      title:"Delete Account Permanently",
                      desc:"Permanently delete your account and all data. This cannot be undone.",
                      action:"Delete Account",
                      danger:true,
                      onClick:()=>{if(window.confirm("This will permanently delete your account. Are you absolutely sure?"))logout();},
                    },
                  ].map((item,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"#0f0a0a",border:"1px solid #ff6b6b15",borderRadius:10,gap:12,flexWrap:"wrap"}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:item.danger?"#ff6b6b":"#e8eaf6"}}>{item.title}</div>
                        <div style={{fontSize:12,color:"#6b7280",marginTop:3}}>{item.desc}</div>
                      </div>
                      <button
                        onClick={item.onClick}
                        style={{background:"transparent",color:"#ff6b6b",border:"1px solid #ff6b6b40",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0,transition:"all .2s"}}
                        onMouseEnter={e=>{e.target.style.background="#ff6b6b15";}}
                        onMouseLeave={e=>{e.target.style.background="transparent";}}>
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Cancel subscription confirmation modal */}
      {cancelModal && (
        <div className="modal-overlay" onClick={e=>{if(e.target.className==="modal-overlay")setCancelModal(false);}}>
          <div className="modal" style={{maxWidth:420}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"#ff6b6b",marginBottom:8}}>CANCEL SUBSCRIPTION?</div>
            <div style={{color:"#9ca3af",fontSize:14,marginBottom:18}}>
              You'll lose Pro access on <b style={{color:"#e8eaf6"}}>{expiryDate}</b>. Your data will be saved but these features will be locked:
            </div>
            <div style={{background:"#111827",borderRadius:10,padding:14,marginBottom:20}}>
              {["Innings-by-innings breakdown","Performance charts & trends","Advanced analytics","PDF export"].map(f=>(
                <div key={f} style={{display:"flex",gap:8,fontSize:13,color:"#ff6b6b",marginBottom:6}}>
                  <span>✗</span><span>{f}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-pro"    style={{flex:1,padding:12}} onClick={()=>setCancelModal(false)}>Keep Pro ⭐</button>
              <button style={{flex:1,padding:12,background:"transparent",color:"#ff6b6b",border:"1px solid #ff6b6b40",borderRadius:8,fontWeight:700,cursor:"pointer"}}
                onClick={cancelSubscription}>Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SCORING ENGINE (inline) ──
function ScoringEngine({ match, currentUser, onClose }) {
  const [score, setScore] = useState({runs:parseInt(match.score2)||0,wickets:parseInt(match.score2?.split("/")[1])||0});
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState(0);
  const [history, setHistory] = useState([]);
  const [thisOver, setThisOver] = useState([]);
  const [partnership, setPartnership] = useState({runs:0,balls:0});
  const [striker, setStriker] = useState(0);
  const [batsmen, setBatsmen] = useState([{name:"Batsman 1",runs:0,balls:0,fours:0,sixes:0},{name:"Batsman 2",runs:0,balls:0,fours:0,sixes:0}]);
  const [bowler, setBowler] = useState({name:"Bowler 1",overs:0,runs:0,wickets:0});
  const target=parseInt(match.score1)+1, req=target-score.runs, ballsDone=overs*6+balls, reqBalls=120-ballsDone;
  const rrr=reqBalls>0&&req>0?((req/reqBalls)*6).toFixed(2):"—";
  const crr=ballsDone>0?(score.runs/(ballsDone/6)).toFixed(2):"0.00";
  const addBall=(runs,type="normal")=>{
    const isExtra=["wide","noball"].includes(type),isWicket=type==="wicket";
    setScore(s=>({runs:s.runs+runs+(isExtra?1:0),wickets:s.wickets+(isWicket?1:0)}));
    const ball=isWicket?"W":type==="wide"?"Wd":type==="noball"?"NB":String(runs);
    setHistory(h=>[...h,ball]);setThisOver(o=>[...o,ball]);
    if(!isExtra&&!isWicket){const u=[...batsmen];u[striker]={...u[striker],runs:u[striker].runs+runs,balls:u[striker].balls+1,fours:u[striker].fours+(runs===4?1:0),sixes:u[striker].sixes+(runs===6?1:0)};setBatsmen(u);if(runs%2!==0)setStriker(s=>1-s);}
    if(!isExtra){const nb=balls+1;if(nb===6){setBalls(0);setOvers(o=>o+1);setThisOver([]);if(runs%2===0)setStriker(s=>1-s);}else setBalls(nb);}
    setPartnership(p=>({runs:p.runs+runs,balls:p.balls+(isExtra?0:1)}));
    setBowler(b=>({...b,runs:b.runs+runs+(isExtra?1:0),wickets:b.wickets+(isWicket?1:0)}));
  };
  const BB=({label,onClick,bg="#111827",fg="#e8eaf6"})=><button onClick={onClick} style={{background:bg,color:fg,border:"none",borderRadius:8,padding:"13px 4px",fontFamily:"'Bebas Neue'",fontSize:22,cursor:"pointer",width:"100%"}} onMouseEnter={e=>e.target.style.opacity=.75} onMouseLeave={e=>e.target.style.opacity=1}>{label}</button>;
  return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><div style={{display:"flex",alignItems:"center",gap:8}}><span className="live-dot"/><span style={{fontFamily:"'Bebas Neue'",fontSize:13,color:"#ff4d4d",letterSpacing:2}}>LIVE SCORING</span></div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:26}}>{match.team1} vs {match.team2}</div>
          <div style={{fontSize:12,color:"#6b7280"}}>Scorer: <b style={{color:"#00e5a0"}}>{currentUser.name}</b></div>
        </div>
        <button className="btn-ghost" onClick={onClose}>← Back</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <div className="card" style={{padding:20,marginBottom:12}}>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:12,color:"#6b7280"}}>TARGET: <b style={{color:"#f59e0b"}}>{target}</b></div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:52,lineHeight:1}}>{score.runs}/{score.wickets}</div>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:"#9ca3af"}}>{overs}.{balls} Overs · {match.team2}</div>
              {score.runs>=target?<div style={{color:"#00e5a0",fontWeight:700,marginTop:6}}>🏆 TARGET ACHIEVED!</div>:<div style={{color:"#f59e0b",fontSize:13,marginTop:6}}>Need {req} off {reqBalls} · RRR {rrr}</div>}
            </div>
            <div style={{background:"#111827",borderRadius:8,padding:"10px 14px",marginBottom:10}}>
              <div style={{fontSize:10,color:"#6b7280",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>This Over</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {thisOver.map((b,i)=><div key={i} style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:b==="W"?"#ff4d4d":b==="6"?"#00e5a0":b==="4"?"#3b82f6":b.includes("d")||b.includes("B")?"#f59e0b":"#1a2035",color:b==="6"||b==="4"?"#0a0e1a":"#fff"}}>{b}</div>)}
                {Array(6-thisOver.length).fill(0).map((_,i)=><div key={i} style={{width:28,height:28,borderRadius:"50%",border:"1px dashed #1a2035"}}/>)}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {[["CRR",crr],["RRR",rrr],["P'ship",`${partnership.runs}(${partnership.balls})`],["Extras","0"]].map(([l,v])=><div key={l} style={{background:"#111827",borderRadius:8,padding:"6px",textAlign:"center"}}><div style={{fontFamily:"'JetBrains Mono'",fontSize:12,color:"#00e5a0"}}>{v}</div><div style={{fontSize:9,color:"#6b7280",marginTop:1}}>{l}</div></div>)}
            </div>
          </div>
          <div className="card" style={{padding:14,marginBottom:10}}>
            {batsmen.map((b,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i===0?"1px solid #0f1623":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>{striker===i&&<span style={{color:"#00e5a0",fontSize:14}}>🏏</span>}<input value={b.name} onChange={e=>{const u=[...batsmen];u[i]={...u[i],name:e.target.value};setBatsmen(u);}} style={{background:"transparent",border:"none",color:"#e8eaf6",fontWeight:600,width:120,fontSize:13}}/></div>
              <span style={{fontFamily:"'JetBrains Mono'",fontSize:12}}>{b.runs}({b.balls}) <span style={{color:"#3b82f6"}}>{b.fours}×4</span> <span style={{color:"#00e5a0"}}>{b.sixes}×6</span></span>
            </div>)}
          </div>
          <div className="card" style={{padding:12}}><div style={{display:"flex",justifyContent:"space-between"}}><input value={bowler.name} onChange={e=>setBowler(b=>({...b,name:e.target.value}))} style={{background:"transparent",border:"none",color:"#e8eaf6",fontWeight:600,fontSize:13}}/><span style={{fontFamily:"'JetBrains Mono'",fontSize:12}}>{bowler.wickets}/{bowler.runs}</span></div></div>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:10,color:"#6b7280",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>Score Ball</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:6}}>{[0,1,2,3].map(r=><BB key={r} label={r} onClick={()=>addBall(r)}/>)}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}><BB label="4" onClick={()=>addBall(4)} bg="#1e3a5f" fg="#60a5fa"/><BB label="6" onClick={()=>addBall(6)} bg="#0d2d20" fg="#00e5a0"/></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
            {[["Wide","wide"],["NoBall","noball"],["Bye","bye"],["LBye","legbye"]].map(([l,t])=><button key={t} onClick={()=>addBall(0,t)} style={{background:"#1a1200",color:"#f59e0b",border:"1px solid #f59e0b30",borderRadius:8,padding:"8px 4px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>)}
          </div>
          <button onClick={()=>addBall(0,"wicket")} style={{width:"100%",background:"#2d0a0a",color:"#ff6b6b",border:"1px solid #ff6b6b30",borderRadius:8,padding:12,fontSize:18,fontFamily:"'Bebas Neue'",letterSpacing:2,cursor:"pointer",marginBottom:12}} onMouseEnter={e=>e.target.style.background="#3d1010"} onMouseLeave={e=>e.target.style.background="#2d0a0a"}>⚡ WICKET</button>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {history.slice(-20).map((b,i)=><span key={i} style={{padding:"2px 6px",borderRadius:4,fontSize:11,fontWeight:700,background:b==="W"?"#ff4d4d15":b==="6"?"#00e5a015":"#111827",color:b==="W"?"#ff4d4d":b==="6"?"#00e5a0":b==="4"?"#60a5fa":"#9ca3af"}}>{b}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}