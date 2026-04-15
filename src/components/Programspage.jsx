/**
 * ProgramsPage.jsx
 * -----------------
 * Programs data lives in programs.json (same folder).
 * Import it here and the component stays lean.
 *
 * Usage:
 *   import PROGRAMS from "./programs.json";
 *   import ProgramsPage from "./ProgramsPage";
 *
 * Or, if your bundler allows direct JSON imports:
 *   The import is already written below — just make sure
 *   your build tool (Vite, CRA, Next.js, etc.) supports
 *   JSON imports (all of them do out of the box).
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PROGRAMS from "./programs.json";

/* ─── GLOBAL CSS ─────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

@keyframes shimmer     { from{background-position:-200% center} to{background-position:200% center} }
@keyframes goldPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.35)} 50%{box-shadow:0 0 0 14px rgba(212,175,55,0)} }
@keyframes rotateSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes phone-outer {
  0%,100%  { transform:scale(1);    box-shadow:0 0 0 0 rgba(212,175,55,0); }
  33%      { transform:scale(1.08); box-shadow:0 0 0 0 rgba(212,175,55,.3); }
  66%      { transform:scale(1);    box-shadow:0 0 0 .5em rgba(212,175,55,0); }
}
@keyframes phone-inner {
  0%       { opacity:1; transform:scale(0); }
  33%      { opacity:1; transform:scale(.9); }
  66%,100% { opacity:0; transform:scale(0); }
}
@keyframes phone-icon {
  0%,46%  { transform:translate3d(0,0,0); }
  2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42% { transform:translate3d(.01em,0,0); }
  4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44% { transform:translate3d(-.01em,0,0); }
}

.gold-shimmer {
  background: linear-gradient(90deg,#d4af37 0%,#f5e27a 40%,#d4af37 60%,#a07c20 100%);
  background-size:200% auto;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  animation:shimmer 4s linear infinite;
}
.glass {
  background:rgba(255,255,255,0.04);
  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);
  border:1px solid rgba(255,255,255,0.09);
}
.glass-gold {
  background:rgba(212,175,55,0.07);
  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);
  border:1px solid rgba(212,175,55,0.2);
}
.animate-rotate     { animation:rotateSlow 14s linear infinite; }
.animate-rotate-rev { animation:rotateSlow 14s linear infinite reverse; }
.animate-gold-pulse { animation:goldPulse 2.8s ease-in-out infinite; }

.wa-pulse               { animation: 3s infinite phone-outer; }
.wa-pulse::before       { animation: 3s infinite phone-inner; }
.wa-pulse svg           { animation: 3s infinite phone-icon; }
.wa-pulse::before,
.wa-pulse::after        { position:absolute; content:""; }

.prog-card {
  background:rgba(0,0,0,0.6);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:20px;
  transition: border-color .3s;
  overflow:hidden;
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
}

.filter-pill {
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:30px;
  padding:5px 14px;
  color:rgba(255,255,255,0.5);
  font-size:12px;
  cursor:pointer;
  transition:all .2s ease;
  font-family:'DM Sans', sans-serif;
  white-space:nowrap;
}
.filter-pill:hover { background:rgba(212,175,55,0.1); border-color:rgba(212,175,55,0.3); color:#d4af37; }
.filter-pill.active { background:rgba(212,175,55,0.15); border-color:rgba(212,175,55,0.45); color:#d4af37; font-weight:600; }

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#08111f; }
::-webkit-scrollbar-thumb { background:#d4af37; border-radius:10px; }
`;

/* ─── LEVELS CONFIG ──────────────────────────────────────── */
const LEVELS = {
  "BAC+2":       { label:"BAC +2",                    color:"#4A90D9", desc:"2-year higher diploma programs" },
  "BAC+3":       { label:"BAC +3",                    color:"#3DB88A", desc:"Bachelor-level programs" },
  "BAC+5":       { label:"BAC +5",                    color:"#d4af37", desc:"Master-level programs" },
  "BAC+6":       { label:"BAC +6",                    color:"#9B59B6", desc:"Specialized Master programs" },
  "BACHELOR_EN": { label:"Bachelor's Degree (EN)",    color:"#E8854A", desc:"English-taught bachelor programs" },
  "MASTER_EN":   { label:"Master's Degree (EN)",      color:"#E74C3C", desc:"English-taught master programs" },
  "QUALIF":      { label:"Professional & Qualifying", color:"#1ABC9C", desc:"Vocational & continuing education" },
};

/* ─── SCHOOL CONFIG ──────────────────────────────────────── */
// Maps school name → accent colour + short label
const SCHOOLS = {
  "ESIIA":       { color:"#7B6CF6", label:"ESIIA" },
  "ISMOD Paris": { color:"#E91E8C", label:"ISMOD Paris" },
   "ESUV":        { color:"#E8854A", label:"ESUV" },
};

/* ─── DERIVED DATA ───────────────────────────────────────── */
const ALL_FIELDS  = ["All", ...Array.from(new Set(PROGRAMS.map(p => p.field))).sort()];
const ALL_SCHOOLS = ["All", ...Array.from(new Set(PROGRAMS.map(p => p.school).filter(Boolean))).sort()];

/* ─── HOOKS ─────────────────────────────────────────────── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── SHARED UI ──────────────────────────────────────────── */
function GoldBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      <span className="text-[#d4af37] text-[11px] font-semibold tracking-[0.22em] uppercase"
        style={{ fontFamily:"DM Sans, sans-serif" }}>{text}</span>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:28 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.7, delay, ease:[0.16,1,0.3,1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── FLOATING UI ────────────────────────────────────────── */
const SOCIALS = [
  { title:"Facebook",  href:"https://www.facebook.com/azconsultations",    vb:"0 0 512 512", d:"M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" },
  { title:"Twitter",   href:"https://twitter.com/azconsultations",          vb:"0 0 512 512", d:"M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" },
  { title:"LinkedIn",  href:"https://www.linkedin.com/in/ahmad-jalal-syed", vb:"0 0 448 512", d:"M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" },
  { title:"Instagram", href:"https://www.instagram.com/azconsultations/",   vb:"0 0 448 512", d:"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" },
];

function FloatingSocials() {
  return (
    <ul style={{ position:"fixed", top:"50%", transform:"translateY(-50%)", left:0, zIndex:9, margin:0, padding:0 }}>
      {SOCIALS.map(s => (
        <li key={s.title} style={{ listStyle:"none", marginBottom:3 }}>
          <a href={s.href} target="_blank" rel="noreferrer" title={s.title}
            style={{ width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(212,175,55,0.12)", backdropFilter:"blur(10px)",
              border:"1px solid rgba(212,175,55,0.25)", transition:"all 0.3s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,175,55,0.25)";e.currentTarget.style.width="52px";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,175,55,0.12)";e.currentTarget.style.width="40px";}}>
            <svg viewBox={s.vb} style={{ width:14, height:14, fill:"#d4af37" }}><path d={s.d}/></svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

function FloatingCTAs() {
  return (
    <>
      <div style={{ position:"fixed", bottom:25, left:20, zIndex:999 }}>
        <a href="/contact" className="animate-gold-pulse"
          style={{ background:"#d4af37", padding:"10px 16px", color:"#0a0e1a", borderRadius:10,
            fontSize:14, fontWeight:600, fontFamily:"DM Sans, sans-serif", display:"block", textDecoration:"none" }}>
          Request A Consultation
        </a>
      </div>
      <div style={{ position:"fixed", bottom:25, right:30, zIndex:999 }}>
        <a href="https://api.whatsapp.com/send?phone=33676903922" target="_blank" rel="noreferrer">
          <span className="wa-pulse" style={{ position:"relative", display:"block", width:"1em", height:"1em",
            fontSize:60, lineHeight:"60px", backgroundColor:"#34a94d", borderRadius:".5em" }}>
            <svg viewBox="0 0 24 24" style={{ position:"absolute", top:".25em", left:".25em", width:".5em", height:".5em", fill:"#fff" }}>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V20c0 .5-.5 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.5 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z"/>
            </svg>
          </span>
        </a>
      </div>
    </>
  );
}

/* ─── LEVEL BADGE ────────────────────────────────────────── */
function LevelBadge({ level }) {
  const l = LEVELS[level];
  if (!l) return null;
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background:`${l.color}18`, border:`1px solid ${l.color}35`, color:l.color,
        fontFamily:"DM Sans, sans-serif" }}>
      {l.label}
    </span>
  );
}

/* ─── SCHOOL BADGE ───────────────────────────────────────── */
// Only rendered if the program has a `school` field present in SCHOOLS config
function SchoolBadge({ school }) {
  if (!school) return null;
  const s = SCHOOLS[school];
  if (!s) return null;
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background:`${s.color}18`, border:`1px solid ${s.color}40`, color:s.color,
        fontFamily:"DM Sans, sans-serif" }}>
      🏛 {s.label}
    </span>
  );
}

/* ─── PROGRAM CARD ───────────────────────────────────────── */
function ProgramCard({ program, delay = 0 }) {
  const [ref, inView] = useReveal(0.06);
  const lvl = LEVELS[program.level];
  const applyHref   = program.source_url || "/contact";
  const applyTarget = program.source_url ? "_blank" : "_self";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:24 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.55, delay, ease:[0.16,1,0.3,1] }}
    >
      <motion.div
        className="prog-card flex flex-col h-full"
        whileHover={{ scale:1.015, borderColor:`${lvl?.color}50`,
          boxShadow:`0 20px 50px -10px rgba(0,0,0,0.6), 0 0 25px -5px ${lvl?.color}20` }}
        transition={{ type:"spring", stiffness:260, damping:22 }}
      >
        {/* Top colour strip */}
        <div className="h-0.5 w-full"
          style={{ background:`linear-gradient(90deg, transparent, ${lvl?.color}, transparent)` }} />

        <div className="p-5 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap gap-1.5">
              <LevelBadge level={program.level} />
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white/40"
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
                  fontFamily:"DM Sans, sans-serif" }}>
                {program.field}
              </span>
              {/* School badge — only appears for programs with a school property */}
              <SchoolBadge school={program.school} />
            </div>
            <motion.a
              href={applyHref} target={applyTarget} rel="noreferrer"
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background:"#d4af37" }}
              whileHover={{ scale:1.15, boxShadow:"0 0 14px rgba(212,175,55,0.6)" }}
              whileTap={{ scale:0.9 }}
              title="View / Apply"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#0a0e1a"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
              </svg>
            </motion.a>
          </div>

          {/* Program names */}
          <h3 className="font-bold leading-snug mb-1 text-white/90"
            style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1rem" }}>
            {program.name_en}
          </h3>
          <p className="text-[#d4af37] text-[10px] font-medium tracking-wide mb-3 uppercase"
            style={{ fontFamily:"DM Sans, sans-serif" }}>
            {program.name}
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full text-white/45"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)",
                fontFamily:"DM Sans, sans-serif" }}>
              ⏱ {program.duration}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full text-white/45"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)",
                fontFamily:"DM Sans, sans-serif" }}>
              {program.mode}
            </span>
          </div>

          {/* Description */}
          <p className="text-white/45 text-xs leading-relaxed flex-1 mb-4"
            style={{ fontFamily:"DM Sans, sans-serif" }}>
            {program.description}
          </p>

          {/* Apply button */}
          <motion.a
            href="/contact"
            className="block w-full text-center py-2 rounded-xl text-slate-950 text-xs font-semibold mt-auto"
            style={{ background:"#d4af37", fontFamily:"DM Sans, sans-serif" }}
            whileHover={{ scale:1.02, boxShadow:"0 0 18px rgba(212,175,55,0.4)" }}
            whileTap={{ scale:0.97 }}
          >
            Apply via AZ Consultations →
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background:"#060f1c", borderTop:"1px solid rgba(212,175,55,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="text-xl font-bold gold-shimmer mb-3"
            style={{ fontFamily:"Cormorant Garamond, serif" }}>AZ Consultations</div>
          <p className="text-sm text-white/40 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Paris-based education consultants guiding Pakistani students to top French universities since 2020.
          </p>
        </div>
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-4"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Programs</h3>
          <ul className="space-y-2">
            {Object.entries(LEVELS).map(([k,v]) => (
              <li key={k} className="text-white/35 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>
                <span style={{ color:v.color }}>▪</span> {v.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-4"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Contact</h3>
          <div className="space-y-2 text-white/35 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>
            <p>📍 77 Rue du Faubourg Saint-Martin, 75010 Paris, France</p>
            <p>📞 <a href="tel:+33183965723" className="hover:text-[#d4af37] transition-colors">+33 1 83 96 57 23</a></p>
            <p>📱 <a href="tel:+33676903922" className="hover:text-[#d4af37] transition-colors">+33 6 76 90 39 22</a></p>
          </div>
          <a href="/contact"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl text-slate-950 text-xs font-semibold hover:brightness-110 transition-all animate-gold-pulse"
            style={{ background:"#d4af37", fontFamily:"DM Sans, sans-serif" }}>
            Request A Consultation
          </a>
        </div>
      </div>
      <div style={{ background:"rgba(0,0,0,0.3)", borderTop:"1px solid rgba(255,255,255,0.04)" }}
        className="px-6 py-4 text-center text-white/20 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>
        © {new Date().getFullYear()} AZ Consultations · DCG Formations Partner
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════ */
export default function ProgramsPage() {
  const [activeLevel,  setActiveLevel]  = useState("All");
  const [activeField,  setActiveField]  = useState("All");
  const [activeSchool, setActiveSchool] = useState("All");
  const [search, setSearch]             = useState("");

  const countPerLevel  = (lk) => PROGRAMS.filter(p => p.level === lk).length;
  const countPerSchool = (sk) => PROGRAMS.filter(p => p.school === sk).length;

  const filtered = PROGRAMS.filter(p => {
    const matchLevel  = activeLevel  === "All" || p.level  === activeLevel;
    const matchField  = activeField  === "All" || p.field  === activeField;
    const matchSchool = activeSchool === "All" || p.school === activeSchool;
    const q           = search.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.name_en.toLowerCase().includes(q) ||
      p.field.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchLevel && matchField && matchSchool && matchSearch;
  });

  const isDefaultView = activeLevel === "All" && activeField === "All" && activeSchool === "All" && !search;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ fontFamily:"DM Sans, sans-serif", background:"#08111f", color:"#e5dcc8" }}>
        <FloatingSocials />
        <FloatingCTAs />

        {/* ══ HERO ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-20 px-6"
          style={{ background:"linear-gradient(135deg,#060f1c 0%,#0e1e35 100%)" }}>
          <div className="absolute top-8 right-16 w-36 h-36 rounded-full border border-[#d4af37]/10 pointer-events-none animate-rotate" />
          <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full border border-white/5 pointer-events-none animate-rotate-rev" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Reveal>
              <GoldBadge text="DCG Formations · AZ Consultations Partner" />
              <h1 className="font-bold leading-tight mb-4"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(2rem,5vw,3.4rem)" }}>
                Programs & Formations
                <span className="block gold-shimmer">Available in France</span>
              </h1>
              <p className="text-white/50 text-sm max-w-2xl mx-auto leading-relaxed mb-2"
                style={{ fontFamily:"DM Sans, sans-serif" }}>
                Over <strong className="text-white/70">{PROGRAMS.length} programs</strong> spanning law,
                accounting, management, HR, digital, fashion, luxury, and languages — from BAC+2 to BAC+6,
                English-taught tracks included.
                AZ Consultations guides Pakistani students through the full admission process.
              </p>
            </Reveal>

            {/* Stats row */}
            <Reveal delay={0.15} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { n: PROGRAMS.length,            label:"Total Programs"  },
                { n: Object.keys(LEVELS).length,  label:"Study Levels"   },
                { n: ALL_FIELDS.length - 1,       label:"Subject Fields"  },
                { n: ALL_SCHOOLS.length - 1,      label:"Partner Schools" },
              ].map((s, i) => (
                <div key={i} className="glass rounded-xl px-3 py-4 text-center">
                  <div className="gold-shimmer font-bold text-2xl"
                    style={{ fontFamily:"Cormorant Garamond, serif" }}>{s.n}</div>
                  <div className="text-white/35 text-xs mt-1"
                    style={{ fontFamily:"DM Sans, sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ══ LEVEL OVERVIEW CARDS ═══════════════════════════ */}
        <section className="py-12 px-6"
          style={{ background:"radial-gradient(ellipse at top, rgba(212,175,55,0.04) 0%, transparent 55%), #0a1220" }}>
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-8">
              <GoldBadge text="Study Levels" />
              <h2 className="font-bold"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.4rem,2.5vw,2rem)" }}>
                Choose Your <span className="gold-shimmer">Level of Study</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
              {Object.entries(LEVELS).map(([k, v], i) => (
                <Reveal key={k} delay={i * 0.06}>
                  <motion.button
                    onClick={() => { setActiveLevel(activeLevel === k ? "All" : k); setActiveField("All"); setActiveSchool("All"); }}
                    className="w-full text-left rounded-2xl p-4"
                    style={{
                      background: activeLevel === k ? `${v.color}15` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${activeLevel === k ? v.color + "50" : "rgba(255,255,255,0.07)"}`,
                    }}
                    whileHover={{ scale:1.04, borderColor:`${v.color}40` }}
                    whileTap={{ scale:0.97 }}
                    transition={{ type:"spring", stiffness:300, damping:20 }}
                  >
                    <div className="text-xl font-bold mb-1 gold-shimmer"
                      style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.3rem" }}>
                      {countPerLevel(k)}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                      style={{ color:v.color, fontFamily:"DM Sans, sans-serif" }}>{v.label}</div>
                    <div className="text-white/30 text-[10px] leading-snug"
                      style={{ fontFamily:"DM Sans, sans-serif" }}>{v.desc}</div>
                  </motion.button>
                </Reveal>
              ))}
            </div>

            {/* ── Partner School quick-filters ── */}
            {/* {ALL_SCHOOLS.length > 1 && (
              <Reveal delay={0.1} className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#d4af37] font-semibold mb-3"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>Filter by Partner School</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`filter-pill ${activeSchool === "All" ? "active" : ""}`}
                    onClick={() => setActiveSchool("All")}>
                    All Schools
                  </button>
                  {ALL_SCHOOLS.filter(s => s !== "All").map(sk => {
                    const sc = SCHOOLS[sk];
                    return (
                      <button key={sk}
                        className={`filter-pill ${activeSchool === sk ? "active" : ""}`}
                        style={activeSchool === sk && sc ? { borderColor:`${sc.color}60`, color:sc.color } : {}}
                        onClick={() => setActiveSchool(activeSchool === sk ? "All" : sk)}>
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            )} */}
          </div>
        </section>

        {/* ══ STICKY FILTERS + SEARCH ════════════════════════ */}
        <div className="sticky top-0 z-20 py-4 px-6"
          style={{ background:"rgba(8,17,31,0.95)", backdropFilter:"blur(20px)",
            borderBottom:"1px solid rgba(212,175,55,0.1)" }}>
          <div className="max-w-6xl mx-auto">
            {/* Search */}
            <div className="relative max-w-sm mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search programs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width:"100%", background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,255,255,0.1)", borderRadius:8,
                  padding:"7px 12px 7px 30px", color:"rgba(255,255,255,0.7)",
                  fontSize:12, fontFamily:"DM Sans, sans-serif", outline:"none",
                }}
                onFocus={e => e.target.style.borderColor="rgba(212,175,55,0.4)"}
                onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Level pills */}
            <div className="flex gap-2 flex-wrap mb-2">
  <button
    className={`filter-pill ${activeLevel === "All" ? "active" : ""}`}
    onClick={() => { setActiveLevel("All"); setActiveField("All"); setActiveSchool("All"); }}
  >
    All Levels
  </button>

  {Object.entries(LEVELS).map(([k, v]) => (
    <button
      key={k}
      className={`filter-pill ${activeLevel === k ? "active" : ""}`}
      onClick={() => { setActiveLevel(activeLevel === k ? "All" : k); setActiveField("All"); }}
    >
      {v.label}
    </button>
  ))}
</div>

            {/* Field pills */}
            {/* <div className="flex gap-2 flex-wrap overflow-x-auto pb-1">
              {ALL_FIELDS.map(f => (
                <button key={f}
                  className={`filter-pill text-[11px] ${activeField === f ? "active" : ""}`}
                  onClick={() => setActiveField(f)}>
                  {f}
                </button>
              ))}
            </div> */}

            {/* <p className="text-white/25 text-xs mt-2" style={{ fontFamily:"DM Sans, sans-serif" }}>
              Showing <span className="text-white/50 font-medium">{filtered.length}</span> of {PROGRAMS.length} programs
            </p> */}
          </div>
        </div>

        {/* ══ PROGRAM GRID ════════════════════════════════════ */}
        <section className="py-10 px-6" style={{ background:"#08111f" }}>
          <div className="max-w-6xl mx-auto">
            {isDefaultView
              ? /* Grouped by level */
                Object.entries(LEVELS).map(([levelKey, levelMeta]) => {
                  const group = filtered.filter(p => p.level === levelKey);
                  if (!group.length) return null;
                  return (
                    <div key={levelKey} className="mb-14">
                      <Reveal className="mb-6 flex items-center gap-4">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-1"
                            style={{ color:levelMeta.color, fontFamily:"DM Sans, sans-serif" }}>
                            {levelMeta.desc}
                          </div>
                          <h2 className="font-bold"
                            style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.3rem,2vw,1.8rem)" }}>
                            {levelMeta.label}
                          </h2>
                        </div>
                        <div className="flex-1 h-px"
                          style={{ background:`linear-gradient(90deg, ${levelMeta.color}40, transparent)` }} />
                        <span className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ background:`${levelMeta.color}15`, color:levelMeta.color,
                            border:`1px solid ${levelMeta.color}35`, fontFamily:"DM Sans, sans-serif" }}>
                          {group.length} programs
                        </span>
                      </Reveal>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.map((p, i) => (
                          <ProgramCard key={p.id} program={p} delay={i * 0.04} />
                        ))}
                      </div>
                    </div>
                  );
                })
              : /* Flat filtered view */
                <div>
                  {filtered.length === 0
                    ? (
                      <div className="text-center py-24">
                        <p className="text-white/30 text-sm" style={{ fontFamily:"DM Sans, sans-serif" }}>
                          No programs found. Try adjusting your filters.
                        </p>
                      </div>
                    )
                    : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((p, i) => (
                          <ProgramCard key={p.id} program={p} delay={i * 0.03} />
                        ))}
                      </div>
                    )
                  }
                </div>
            }
          </div>
        </section>

        {/* ══ CTA STRIP ═══════════════════════════════════════ */}
        <section className="py-14 px-6"
          style={{ background:"radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 65%), #060f1c" }}>
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 glass"
                style={{ border:"1px solid rgba(212,175,55,0.2)" }}>
                <div className="absolute top-0 left-1/4 w-1/2 h-px"
                  style={{ background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)" }} />
                <div>
                  <GoldBadge text="Apply Now" />
                  <h2 className="font-bold mt-1 mb-3"
                    style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.4rem,2.4vw,2rem)" }}>
                    Interested in Any of These Programs?
                  </h2>
                  <p className="text-white/50 text-sm max-w-[480px] leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
                    AZ Consultations handles your entire application — from program selection and document preparation to
                    Campus France registration and visa support. All at our Paris office.
                  </p>
                  <div className="mt-4 text-white/35 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>
                    📍 77 Rue du Faubourg Saint-Martin, 75010 Paris &nbsp;|&nbsp;
                    📞 <a href="tel:+33183965723" className="hover:text-[#d4af37] transition-colors">+33 1 83 96 57 23</a>
                  </div>
                </div>
                <a href="/contact"
                  className="animate-gold-pulse flex-shrink-0 px-9 py-4 rounded-2xl text-slate-950 text-sm font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
                  style={{ background:"#d4af37", fontFamily:"DM Sans, sans-serif" }}>
                  Start Your Application →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}