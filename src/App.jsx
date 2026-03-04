import { useState, useEffect, useRef } from "react";

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

// ── DEMO DATA ──
const DEMO_USERS = [
  {id:"u1",name:"Admin User",email:"admin@cricpro.com",password:"admin123",role:ROLES.ADMIN,plan:PLANS.PRO,team:null,joinedDate:"2025-01-01"},
  {id:"u2",name:"Raj Organizer",email:"raj@cricpro.com",password:"raj123",role:ROLES.ORGANIZER,plan:PLANS.PRO,team:null,joinedDate:"2025-02-15"},
  {id:"u3",name:"Scorer Dev",email:"scorer@cricpro.com",password:"scorer123",role:ROLES.SCORER,plan:PLANS.FREE,team:null,joinedDate:"2025-03-01"},
  {id:"u4",name:"Virat Kumar",email:"virat@cricpro.com",password:"virat123",role:ROLES.PLAYER,plan:PLANS.FREE,team:"Royal Challengers",joinedDate:"2025-03-10"},
  {id:"u5",name:"Rohit Singh",email:"rohit@cricpro.com",password:"rohit123",role:ROLES.PLAYER,plan:PLANS.PRO,team:"Mumbai Kings",joinedDate:"2025-03-12"},
  {id:"u6",name:"Fan Viewer",email:"fan@cricpro.com",password:"fan123",role:ROLES.VIEWER,plan:PLANS.FREE,team:null,joinedDate:"2025-04-01"},
];

// Innings history per player (for drill-down)
const INNINGS_DATA = {
  p1: [ // Virat Kumar
    {id:"i1",match:"RCB vs MKG",date:"2026-02-10",opponent:"Mumbai Kings",runs:87,balls:52,fours:9,sixes:3,sr:167.3,out:"Caught",bowler:"Bumrah Jr.",ground:"Eden Gardens"},
    {id:"i2",match:"RCB vs SFC",date:"2026-02-03",opponent:"Sunrisers FC",runs:134,balls:89,fours:14,sixes:6,sr:150.6,out:"Not Out",bowler:"-",ground:"Wankhede Local"},
    {id:"i3",match:"RCB vs CHL",date:"2026-01-28",opponent:"Chennai Lions",runs:23,balls:18,fours:3,sixes:0,sr:127.8,out:"Bowled",bowler:"Ravindra Jadav",ground:"Chinnaswamy Mini"},
    {id:"i4",match:"RCB vs MKG",date:"2026-01-20",opponent:"Mumbai Kings",runs:67,balls:45,fours:7,sixes:2,sr:148.9,out:"LBW",bowler:"Hardik Dev",ground:"Eden Gardens"},
    {id:"i5",match:"RCB vs SFC",date:"2026-01-15",opponent:"Sunrisers FC",runs:0,balls:1,fours:0,sixes:0,sr:0,out:"Bowled",bowler:"Warner Jr.",ground:"Chepauk Ground"},
    {id:"i6",match:"RCB vs CHL",date:"2026-01-08",opponent:"Chennai Lions",runs:112,balls:71,fours:11,sixes:5,sr:157.7,out:"Caught",bowler:"Ravindra Jadav",ground:"Eden Gardens"},
    {id:"i7",match:"RCB vs MKG",date:"2025-12-20",opponent:"Mumbai Kings",runs:45,balls:38,fours:4,sixes:1,sr:118.4,out:"Run Out",bowler:"-",ground:"Wankhede Local"},
    {id:"i8",match:"RCB vs SFC",date:"2025-12-14",opponent:"Sunrisers FC",runs:78,balls:55,fours:8,sixes:2,sr:141.8,out:"Caught",bowler:"Warner Jr.",ground:"Eden Gardens"},
  ],
  p2: [
    {id:"i1",match:"MKG vs RCB",date:"2026-02-10",opponent:"Royal Challengers",runs:52,balls:40,fours:6,sixes:1,sr:130,out:"Caught",bowler:"Jasprit Bhai",ground:"Eden Gardens"},
    {id:"i2",match:"MKG vs SFC",date:"2026-02-03",opponent:"Sunrisers FC",runs:118,balls:82,fours:12,sixes:4,sr:143.9,out:"Not Out",bowler:"-",ground:"Wankhede Local"},
    {id:"i3",match:"MKG vs CHL",date:"2026-01-28",opponent:"Chennai Lions",runs:34,balls:28,fours:3,sixes:0,sr:121.4,out:"Bowled",bowler:"Ravindra Jadav",ground:"Chinnaswamy Mini"},
    {id:"i4",match:"MKG vs RCB",date:"2026-01-20",opponent:"Royal Challengers",runs:71,balls:50,fours:7,sixes:2,sr:142,out:"Caught",bowler:"Jasprit Bhai",ground:"Wankhede Local"},
    {id:"i5",match:"MKG vs SFC",date:"2026-01-15",opponent:"Sunrisers FC",runs:88,balls:65,fours:9,sixes:3,sr:135.4,out:"Run Out",bowler:"-",ground:"Eden Gardens"},
  ],
  p3: [
    {id:"i1",match:"RCB vs MKG",date:"2026-02-10",opponent:"Mumbai Kings",runs:8,balls:5,fours:1,sixes:0,sr:160,out:"Caught",bowler:"Bumrah Jr.",ground:"Eden Gardens",wickets:2,runsConceded:22,oversBowled:4},
    {id:"i2",match:"RCB vs SFC",date:"2026-02-03",opponent:"Sunrisers FC",runs:0,balls:0,fours:0,sixes:0,sr:0,out:"DNB",bowler:"-",ground:"Wankhede Local",wickets:3,runsConceded:18,oversBowled:4},
  ],
  p4: [
    {id:"i1",match:"CHL vs SFC",date:"2026-02-27",opponent:"Sunrisers FC",runs:68,balls:42,fours:6,sixes:4,sr:161.9,out:"Not Out",bowler:"-",ground:"Chinnaswamy Mini"},
    {id:"i2",match:"CHL vs RCB",date:"2026-02-15",opponent:"Royal Challengers",runs:95,balls:58,fours:8,sixes:5,sr:163.8,out:"Caught",bowler:"Jasprit Bhai",ground:"Eden Gardens"},
    {id:"i3",match:"CHL vs MKG",date:"2026-02-05",opponent:"Mumbai Kings",runs:44,balls:35,fours:4,sixes:2,sr:125.7,out:"LBW",bowler:"Hardik Dev",ground:"Wankhede Local"},
  ],
};

const TEAMS0 = [
  {id:"t1",name:"Royal Challengers",short:"RCB",color:"#e83b3b",captain:"Virat Kumar",players:15,wins:8,losses:3,logo:"🔴",city:"Bangalore",founded:"2020",homeGround:"Eden Gardens Arena"},
  {id:"t2",name:"Mumbai Kings",short:"MKG",color:"#1e90ff",captain:"Rohit Singh",players:14,wins:7,losses:4,logo:"🔵",city:"Mumbai",founded:"2019",homeGround:"Wankhede Local"},
  {id:"t3",name:"Sunrisers FC",short:"SFC",color:"#ff9900",captain:"David Warner Jr.",players:13,wins:6,losses:5,logo:"🟡",city:"Hyderabad",founded:"2021",homeGround:"Chepauk Ground"},
  {id:"t4",name:"Chennai Lions",short:"CHL",color:"#f7c900",captain:"MS Dhoni Jr.",players:15,wins:9,losses:2,logo:"🟡",city:"Chennai",founded:"2018",homeGround:"Chinnaswamy Mini"},
];

const PLAYERS0 = [
  {id:"p1",name:"Virat Kumar",team:"Royal Challengers",role:"Batsman",matches:22,runs:780,avg:46.2,sr:142.1,wickets:0,economy:0,catches:8,fifties:6,hundreds:2,hs:134,ducks:1,balls_faced:548,fours:82,sixes:24,bio:"Aggressive right-hand batsman and captain of Royal Challengers."},
  {id:"p2",name:"Rohit Singh",team:"Mumbai Kings",role:"Batsman",matches:20,runs:650,avg:38.5,sr:135.4,wickets:0,economy:0,catches:6,fifties:5,hundreds:1,hs:118,ducks:2,balls_faced:480,fours:70,sixes:18,bio:"Elegant opener known for big scores."},
  {id:"p3",name:"Jasprit Bhai",team:"Royal Challengers",role:"Bowler",matches:22,runs:45,avg:8.1,sr:90.5,wickets:28,economy:7.2,catches:5,fifties:0,hundreds:0,hs:18,ducks:5,balls_faced:50,fours:3,sixes:1,bio:"Express pace bowler, death-over specialist."},
  {id:"p4",name:"MS Dhoni Jr.",team:"Chennai Lions",role:"WK-Batsman",matches:25,runs:620,avg:52.0,sr:148.2,wickets:0,economy:0,catches:22,fifties:4,hundreds:1,hs:95,ducks:0,balls_faced:418,fours:55,sixes:28,bio:"Wicket-keeper batsman, cool-headed finisher."},
  {id:"p5",name:"Ravindra Jadav",team:"Chennai Lions",role:"All-rounder",matches:20,runs:340,avg:28.3,sr:145.6,wickets:18,economy:7.8,catches:10,fifties:2,hundreds:0,hs:76,ducks:2,balls_faced:234,fours:30,sixes:12,bio:"Crafty left-arm spinner and capable batsman."},
  {id:"p6",name:"David Warner Jr.",team:"Sunrisers FC",role:"Batsman",matches:18,runs:720,avg:44.5,sr:153.2,wickets:0,economy:0,catches:7,fifties:5,hundreds:2,hs:141,ducks:1,balls_faced:470,fours:88,sixes:30,bio:"Explosive left-handed opener."},
  {id:"p7",name:"Hardik Dev",team:"Mumbai Kings",role:"All-rounder",matches:18,runs:310,avg:25.8,sr:152.4,wickets:15,economy:8.4,catches:8,fifties:1,hundreds:0,hs:67,ducks:3,balls_faced:203,fours:28,sixes:16,bio:"Hard-hitting all-rounder."},
  {id:"p8",name:"Bumrah Jr.",team:"Mumbai Kings",role:"Bowler",matches:18,runs:20,avg:4.0,sr:66.7,wickets:24,economy:6.8,catches:4,fifties:0,hundreds:0,hs:12,ducks:6,balls_faced:30,fours:2,sixes:0,bio:"World-class death bowler with yorker mastery."},
];

const MATCHES0 = [
  {id:"m1",team1:"Royal Challengers",team2:"Mumbai Kings",date:"2026-02-28",time:"19:00",ground:"Eden Gardens Arena",format:"T20",status:"live",score1:"142/4",overs1:"15.2",score2:"98/3",overs2:"12.0",innings:2,tournament:"City T20 Premier 2026",toss:"Royal Challengers won toss",mom:null,notes:"Exciting chase underway"},
  {id:"m2",team1:"Chennai Lions",team2:"Sunrisers FC",date:"2026-02-27",time:"14:00",ground:"Chinnaswamy Mini",format:"T20",status:"completed",score1:"186/4",overs1:"20.0",score2:"179/8",overs2:"20.0",winner:"Chennai Lions",tournament:"City T20 Premier 2026",toss:"Chennai Lions won toss",mom:"MS Dhoni Jr.",notes:"Thriller — Chennai won by 7 runs"},
  {id:"m3",team1:"Mumbai Kings",team2:"Sunrisers FC",date:"2026-03-02",time:"18:30",ground:"Wankhede Local",format:"T20",status:"upcoming",tournament:"City T20 Premier 2026"},
  {id:"m4",team1:"Royal Challengers",team2:"Chennai Lions",date:"2026-03-04",time:"19:30",ground:"Eden Gardens Arena",format:"T20",status:"upcoming",tournament:"City T20 Premier 2026"},
];

const GROUNDS0 = [
  {id:"g1",name:"Eden Gardens Arena",city:"Kolkata",capacity:5000,pitchType:"Batting",floodlights:true,status:"Available",facilities:["Pavilion","Parking","Cafeteria"],contact:"9800001111"},
  {id:"g2",name:"Chinnaswamy Mini",city:"Bangalore",capacity:2000,pitchType:"Balanced",floodlights:true,status:"Booked",facilities:["Parking","Cafeteria"],contact:"9800002222",nextBooked:"2026-03-05"},
  {id:"g3",name:"Wankhede Local",city:"Mumbai",capacity:3000,pitchType:"Pace",floodlights:false,status:"Available",facilities:["Pavilion","Dressing Rooms"],contact:"9800003333"},
  {id:"g4",name:"Chepauk Ground",city:"Chennai",capacity:2500,pitchType:"Spin",floodlights:true,status:"Maintenance",facilities:["Pavilion","Parking"],contact:"9800004444"},
];

const TOURNAMENTS0 = [
  {id:"tn1",name:"City T20 Premier 2026",format:"T20",teams:8,startDate:"2026-03-01",endDate:"2026-04-15",status:"Ongoing",registered:["Royal Challengers","Mumbai Kings","Sunrisers FC","Chennai Lions"],createdBy:"u2",prize:"₹50,000",description:"Premier city-level T20 tournament"},
  {id:"tn2",name:"Club Cricket Championship",format:"50-Over",teams:16,startDate:"2026-05-01",endDate:"2026-07-01",status:"Upcoming",registered:["Royal Challengers","Chennai Lions"],createdBy:"u2",prize:"₹1,00,000",description:"Annual 50-over club championship"},
];

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

// ── AUTH PAGE (Login + Signup) ──
function AuthPage({ users, setUsers, onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup | pricing
  const [form, setForm] = useState({role:ROLES.PLAYER,plan:PLANS.FREE});
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1=details, 2=plan

  const sf = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const handleLogin = () => {
    const u = users.find(u=>u.email===form.email&&u.password===form.password);
    if(u) onLogin(u);
    else setError("Invalid email or password.");
  };

  const handleSignup = () => {
    if(!form.name||!form.email||!form.password) return setError("Fill in all fields");
    if(users.find(u=>u.email===form.email)) return setError("Email already registered");
    if(form.password.length<6) return setError("Password must be 6+ characters");
    const newUser = {id:uid(),name:form.name,email:form.email,password:form.password,role:ROLES.PLAYER,plan:form.plan||PLANS.FREE,team:null,joinedDate:new Date().toISOString().split("T")[0]};
    setUsers(us=>[...us,newUser]);
    onLogin(newUser);
  };

  if(mode==="pricing") return <PricingPage user={null} onUpgrade={()=>{setForm(f=>({...f,plan:PLANS.PRO}));setMode("signup");}} onClose={()=>setMode("signup")}/>;

  return (
    <div style={{minHeight:"100vh",background:"#0a0e1a",display:"flex",padding:20}}>
      {/* Left panel */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
        <div style={{width:"100%",maxWidth:420}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:52,letterSpacing:4,color:"#00e5a0"}}>CRICPRO</div>
            <div style={{fontSize:12,color:"#6b7280",letterSpacing:3,marginTop:4}}>CRICKET MANAGEMENT PLATFORM</div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",background:"#111827",borderRadius:10,padding:4,marginBottom:24}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}} style={{flex:1,padding:"10px",border:"none",borderRadius:8,background:mode===m?"#0d1221":"transparent",color:mode===m?"#00e5a0":"#6b7280",fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer",textTransform:"capitalize",transition:"all .2s"}}>
                {m==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          {error&&<div style={{background:"#ff6b6b15",border:"1px solid #ff6b6b30",borderRadius:8,padding:"10px 14px",color:"#ff6b6b",fontSize:13,marginBottom:16}}>{error}</div>}

          {mode==="login"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <input placeholder="Email address" value={form.email||""} onChange={sf("email")} type="email"/>
              <div style={{position:"relative"}}>
                <input placeholder="Password" value={form.password||""} onChange={sf("password")} type={showPass?"text":"password"} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
                <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6b7280",cursor:"pointer"}}>
                  {showPass?"🙈":"👁"}
                </button>
              </div>
              <button className="btn-primary" style={{padding:14,fontSize:15}} onClick={handleLogin}>Sign In →</button>
              <div style={{textAlign:"center",fontSize:13,color:"#6b7280"}}>Don't have an account? <span onClick={()=>setMode("signup")} style={{color:"#00e5a0",cursor:"pointer",fontWeight:600}}>Sign up free</span></div>
            </div>
          )}

          {mode==="signup"&&(
            <>
              {signupStep===1&&(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <input placeholder="Full Name" value={form.name||""} onChange={sf("name")}/>
                  <input placeholder="Email address" value={form.email||""} onChange={sf("email")} type="email"/>
                  <div style={{position:"relative"}}>
                    <input placeholder="Password (min 6 characters)" value={form.password||""} onChange={sf("password")} type={showPass?"text":"password"}/>
                    <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6b7280",cursor:"pointer"}}>{showPass?"🙈":"👁"}</button>
                  </div>
                  <select value={form.role||ROLES.PLAYER} onChange={sf("role")}>
                    <option value={ROLES.PLAYER}>Player</option>
                    <option value={ROLES.SCORER}>Scorer / Umpire</option>
                    <option value={ROLES.ORGANIZER}>Tournament Organizer</option>
                    <option value={ROLES.VIEWER}>Fan / Viewer</option>
                  </select>
                  <button className="btn-primary" style={{padding:14}} onClick={()=>{if(!form.name||!form.email||!form.password)return setError("Fill all fields");setError("");setSignupStep(2);}}>Next — Choose Plan →</button>
                  <div style={{textAlign:"center",fontSize:13,color:"#6b7280"}}>Already have an account? <span onClick={()=>setMode("login")} style={{color:"#00e5a0",cursor:"pointer",fontWeight:600}}>Sign in</span></div>
                </div>
              )}
              {signupStep===2&&(
                <div>
                  <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                    <button onClick={()=>setSignupStep(1)} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:20}}>←</button>
                    <span style={{fontWeight:600}}>Choose Your Plan</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
                    {[{plan:PLANS.FREE,label:"Free",price:"₹0/month",desc:"Basic access · View matches & stats",color:"#1a2035",border:"#2a3045"},{plan:PLANS.PRO,label:"Pro ★",price:"₹99/month",desc:"Full access · All Pro features unlocked",color:"#1a1500",border:"#f59e0b60"}].map(p=>(
                      <div key={p.plan} onClick={()=>setForm(f=>({...f,plan:p.plan}))} style={{background:p.color,border:`2px solid ${form.plan===p.plan?p.plan===PLANS.PRO?"#f59e0b":"#00e5a0":p.border}`,borderRadius:12,padding:16,cursor:"pointer",transition:"all .2s"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontWeight:700,color:p.plan===PLANS.PRO?"#f59e0b":"#e8eaf6"}}>{p.label}</div>
                            <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{p.desc}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:p.plan===PLANS.PRO?"#f59e0b":"#e8eaf6"}}>{p.price}</div>
                            {form.plan===p.plan&&<div style={{fontSize:11,color:p.plan===PLANS.PRO?"#f59e0b":"#00e5a0",fontWeight:700}}>✓ SELECTED</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button style={{width:"100%",textAlign:"left",background:"none",border:"none",color:"#6b7280",fontSize:12,cursor:"pointer",marginBottom:16,padding:"4px 0"}} onClick={()=>setMode("pricing")}>See full feature comparison →</button>
                  <button className={form.plan===PLANS.PRO?"btn-pro":"btn-primary"} style={{width:"100%",padding:14,fontSize:15}} onClick={handleSignup}>
                    {form.plan===PLANS.PRO?"Start Pro Trial — ₹99/mo →":"Create Free Account →"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Demo accounts */}
          {mode==="login"&&(
            <div style={{marginTop:28}}>
              <div style={{fontSize:11,color:"#374151",textAlign:"center",marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>Quick Demo Login</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {DEMO_USERS.map(u=>(
                  <button key={u.id} onClick={()=>onLogin(u)} style={{background:"#0d1221",border:"1px solid #1a2035",borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"border-color .2s",textAlign:"left"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#00e5a040"} onMouseLeave={e=>e.currentTarget.style.borderColor="#1a2035"}>
                    <div className="avatar" style={{width:30,height:30,fontSize:11,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:avatarColor(u.name)+"30",color:avatarColor(u.name),fontWeight:700,flexShrink:0}}>{initials(u.name)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#e8eaf6"}}>{u.name}</div>
                      <div style={{fontSize:10,color:"#4b5563"}}>{u.email}</div>
                    </div>
                    <div style={{display:"flex",gap:4,flexShrink:0}}>
                      <span className={`role-badge-${u.role}`}>{u.role.toUpperCase()}</span>
                      {u.plan===PLANS.PRO&&<span className="tag-pro tag" style={{fontSize:9}}>PRO</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right panel — visual */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40,background:"#0d1221",borderLeft:"1px solid #1a2035"}}>
        <div style={{maxWidth:400,width:"100%"}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:32,marginBottom:24,color:"#fff",letterSpacing:1}}>EVERYTHING CRICKET NEEDS</div>
          {[["🏏","Live Ball-by-Ball Scoring","Score matches in real-time with full stats"],["📊","Deep Player Analytics","Innings history, performance charts, trends"],["🏆","Tournament Management","Create leagues, generate fixtures, track points"],["👥","Team & Player Profiles","Full squad management with role-based access"],["🌿","Ground Booking","Manage venues, availability and scheduling"]].map(([icon,title,desc])=>(
            <div key={title} style={{display:"flex",gap:14,marginBottom:20,alignItems:"flex-start"}}>
              <div style={{fontSize:24,flexShrink:0,marginTop:2}}>{icon}</div>
              <div><div style={{fontWeight:700,marginBottom:2}}>{title}</div><div style={{fontSize:13,color:"#6b7280"}}>{desc}</div></div>
            </div>
          ))}
          <div style={{marginTop:32,padding:16,background:"#111827",borderRadius:12,border:"1px solid #1a2035"}}>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:8}}>TRUSTED BY</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:"#00e5a0"}}>500+ CLUBS · 10,000+ PLAYERS</div>
            <div style={{fontSize:12,color:"#4b5563",marginTop:4}}>Across India · Free to start</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── INNINGS DETAIL DRILL-DOWN ──
function InningsDetail({ player, innings, onBack, currentUser, onUpgrade }) {
  const [selectedInning, setSelectedInning] = useState(null);
  const data = INNINGS_DATA[player.id] || [];

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
  const data = INNINGS_DATA[player.id] || [];
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
  const data = INNINGS_DATA[player.id] || [];
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
    {id:"innings",label:`Innings (${(INNINGS_DATA[player.id]||[]).length})`,pro:true},
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
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(DEMO_USERS);
  const [tab, setTab] = useState("dashboard");
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
  const [deepView, setDeepView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [inningsData, setInningsData] = useState({});

  const notify = (msg,type="success") => { const id=uid(); setNotifs(n=>[...n,{id,msg,type}]); setTimeout(()=>setNotifs(n=>n.filter(x=>x.id!==id)),3000); };
  const sf = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const closeModal = () => { setModal(null); setEditItem(null); setForm({}); };
  const openDeep = (type,item) => setDeepView({type,item});
  const closeDeep = () => setDeepView(null);

  const handleUpgrade = () => setShowPayment(true);
  const handleUpgradeSuccess = () => {
    setCurrentUser(u=>({...u,plan:PLANS.PRO}));
    setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,plan:PLANS.PRO}:u));
    setShowPayment(false);
    setShowPricing(false);
    notify("🎉 Welcome to CricPro Pro! All features unlocked.");
  };

  const logout = () => { setCurrentUser(null); setTab("dashboard"); setDeepView(null); setScoringMatch(null); };

  if(!currentUser) return <AuthPage users={users} setUsers={setUsers} onLogin={u=>{setCurrentUser(u);notify(`Welcome, ${u.name}!`)}}/>;

  if(showPricing) return <><PricingPage user={currentUser} onUpgrade={handleUpgrade} onClose={()=>setShowPricing(false)}/>{showPayment&&<PaymentModal user={currentUser} onSuccess={handleUpgradeSuccess} onClose={()=>setShowPayment(false)}/>}</>;

  if(showPayment) return <PaymentModal user={currentUser} onSuccess={handleUpgradeSuccess} onClose={()=>setShowPayment(false)}/>;

  if(scoringMatch) return (
    <ScoringEngine match={scoringMatch} currentUser={currentUser} onClose={()=>setScoringMatch(null)}/>
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
        <div style={{padding:"12px 14px",borderTop:"1px solid #1a2035"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:avatarColor(currentUser.name)+"30",color:avatarColor(currentUser.name),fontWeight:700,fontSize:12,flexShrink:0}}>{initials(currentUser.name)}</div>
            {sidebarOpen&&<div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.name}</div>
              <div style={{display:"flex",gap:4,marginTop:2}}>
                <span className={`role-badge-${currentUser.role}`}>{currentUser.role.toUpperCase()}</span>
                {isPro(currentUser)&&<span className="tag-pro tag" style={{fontSize:9,padding:"1px 6px"}}>PRO</span>}
              </div>
            </div>}
            {sidebarOpen&&<button onClick={logout} title="Logout" style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16}}>↩</button>}
          </div>
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