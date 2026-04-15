import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "emailjs-com";

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_t9wyhci";
const EMAILJS_TEMPLATE_ID = "template_fb4tzs8";
const EMAILJS_PUBLIC_KEY  = "09iZyP_yUrwHYvgmS";
const GOOGLE_SHEETS_WEBHOOK = "";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

@keyframes phone-outer {
  0%,100%{ transform:translate3d(0,0,0) scale(1); box-shadow:0 0 0 0 rgba(212,175,55,0),0 .05em .1em rgba(0,0,0,.3); }
  33.3333%{ transform:translate3d(0,0,0) scale(1.1); box-shadow:0 0 0 0 rgba(212,175,55,.4),0 .05em .1em rgba(0,0,0,.5); }
  66.6666%{ transform:translate3d(0,0,0) scale(1); box-shadow:0 0 0 .5em rgba(212,175,55,0),0 .05em .1em rgba(0,0,0,.3); }
}
@keyframes phone-inner {
  0%{ opacity:1; transform:translate3d(0,0,0) scale(0); }
  33.3333%{ opacity:1; transform:translate3d(0,0,0) scale(.9); }
  66.6666%,100%{ opacity:0; transform:translate3d(0,0,0) scale(0); }
}
@keyframes phone-icon {
  0%,46%{ transform:translate3d(0,0,0); }
  2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42%{ transform:translate3d(.01em,0,0); }
  4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44%{ transform:translate3d(-.01em,0,0); }
}
@keyframes fadeInUp {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position:  200% center; }
}
@keyframes goldPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); }
  50%     { box-shadow: 0 0 0 14px rgba(212,175,55,0); }
}

.wa-btn-anim        { animation: 3s infinite phone-outer; }
.wa-btn-anim::before{ animation: 3s infinite phone-inner; }
.wa-btn-anim::after { animation: 3s infinite phone-icon; }
.cta-wa-icon {
  position:relative; display:flex; align-items:center; justify-content:center;
  width:1em; height:1em; font-size:60px; line-height:60px;
  background: linear-gradient(135deg,#25d366,#128c7e);
  border-radius:.5em;
  box-shadow:0 0 0 0 rgba(212,175,55,0),0 .05em .1em rgba(0,0,0,.3);
  transform:translate3d(0,0,0) scale(1);
}
.cta-wa-icon::before,.cta-wa-icon::after { position:absolute; content:""; }

.glass {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.09);
}
.glass-gold {
  background: rgba(212,175,55,0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(212,175,55,0.22);
}
.gold-shimmer {
  background: linear-gradient(90deg, #d4af37 0%, #f5e27a 40%, #d4af37 60%, #a07c20 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

.gl-input {
  width:100%; padding:11px 15px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.gl-input::placeholder { color: rgba(255,255,255,0.25); }
.gl-input:focus {
  border-color: rgba(212,175,55,0.6);
  box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
}
select.gl-input option { background: #0c1828; color:#fff; }

.file-drop-active {
  border-color: rgba(212,175,55,0.7) !important;
  background: rgba(212,175,55,0.06) !important;
}

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#08111f; }
::-webkit-scrollbar-thumb { background:#d4af37; border-radius:10px; }
`;

// ─── Confetti ────────────────────────────────────────────────────────────────
function useConfetti() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.confetti) { ref.current = window.confetti; return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
    s.onload = () => { ref.current = window.confetti; };
    document.head.appendChild(s);
  }, []);
  return useCallback((ox, oy) => {
    const fn = ref.current; if (!fn) return;
    const colors = ["#d4af37","#f5e27a","#ffffff","#a07c20"];
    fn({ particleCount:80, spread:70, origin:{x:ox,y:oy}, colors, startVelocity:45, ticks:120, zIndex:9999 });
    fn({ particleCount:30, angle:60,  spread:55, startVelocity:60, origin:{x:0,y:0.6}, colors });
    fn({ particleCount:30, angle:120, spread:55, startVelocity:60, origin:{x:1,y:0.6}, colors });
  }, []);
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const MapMarkerIcon   = () => <svg viewBox="0 0 384 512" className="w-4 h-4 fill-current"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>;
const PhoneIconSVG    = () => <svg viewBox="0 0 512 512" className="w-4 h-4 fill-current"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/></svg>;
const EnvelopeIconSVG = () => <svg viewBox="0 0 512 512" className="w-4 h-4 fill-current"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg>;
const AngleRightIcon  = () => <svg viewBox="0 0 256 512" className="w-2.5 h-2.5 fill-current flex-shrink-0 mt-0.5"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/></svg>;
const FacebookIcon    = () => <svg viewBox="0 0 512 512" className="w-4 h-4 fill-current"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>;
const InstagramIcon   = () => <svg viewBox="0 0 448 512" className="w-4 h-4 fill-current"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>;
const LinkedinIcon    = () => <svg viewBox="0 0 448 512" className="w-4 h-4 fill-current"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>;
const YoutubeIcon     = () => <svg viewBox="0 0 576 512" className="w-4 h-4 fill-current"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>;
const TwitterIcon     = () => <svg viewBox="0 0 512 512" className="w-4 h-4 fill-current"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>;
const WhatsappIconSVG = () => <svg viewBox="0 0 448 512" className="w-8 h-8 fill-white"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.1-115-65.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>;
const XIcon           = () => <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
const FileIconSVG     = () => <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#d4af37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const UploadIconSVG   = () => <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8"><path d="M12 15V3m0 0L8 7m4-4l4 4" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 15v3a2 2 0 002 2h14a2 2 0 002-2v-3" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/45">
        {label}{required && <span className="text-[#d4af37] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function GlInput({ name, value, onChange, type="text", placeholder, required }) {
  return (
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      className="gl-input"
    />
  );
}

function GlSelect({ name, value, onChange, required, children }) {
  return (
    <div className="relative">
      <select name={name} value={value} onChange={onChange} required={required}
        className="gl-input appearance-none pr-9 cursor-pointer">
        {children}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  );
}

// ─── Resume upload ─────────────────────────────────────────────────────────────
function ResumeUpload({ file, onFileChange }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const fmt = (b) => b < 1024*1024 ? (b/1024).toFixed(1)+" KB" : (b/(1024*1024)).toFixed(1)+" MB";

  return file ? (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
      style={{ background:"rgba(212,175,55,0.08)", border:"1px solid rgba(212,175,55,0.3)" }}>
      <div className="flex items-center gap-3 min-w-0">
        <FileIconSVG />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate text-[#d4af37]" style={{ maxWidth:160 }}>{file.name}</p>
          <p className="text-xs text-white/40">{fmt(file.size)}</p>
        </div>
      </div>
      <button type="button" onClick={() => { onFileChange(null); if(inputRef.current) inputRef.current.value=""; }}
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
        <XIcon />
      </button>
    </div>
  ) : (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-xl cursor-pointer transition-all duration-200 ${dragging ? "file-drop-active" : ""}`}
      style={{ border:"1.5px dashed rgba(255,255,255,0.12)", background: dragging ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)" }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f) onFileChange(f); }}
      onClick={() => inputRef.current?.click()}
    >
      <UploadIconSVG />
      <p className="text-sm font-semibold text-[#d4af37]">Drop your resume here</p>
      <p className="text-xs text-white/30">or click to browse — PDF, DOC, DOCX (max 5 MB)</p>
      <input ref={inputRef} type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden" onChange={(e) => { if(e.target.files[0]) onFileChange(e.target.files[0]); }}
      />
    </div>
  );
}

// ─── Info box ─────────────────────────────────────────────────────────────────
function InfoBox({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl glass-gold flex items-center justify-center text-[#d4af37]">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-white text-[13px] mb-0.5">{title}</h4>
        <p className="text-white/45 text-[12.5px] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Footer link list ─────────────────────────────────────────────────────────
function FooterLinkList({ title, links }) {
  return (
    <div>
      <h2 className="text-white/70 font-semibold text-[11px] uppercase tracking-[0.18em] mb-4">{title}</h2>
      <ul className="space-y-2">
        {links.map(({ label, href }, i) => (
          <li key={i} className="flex items-center gap-2 text-white/40 hover:text-[#d4af37] transition-colors text-[13px]">
            <AngleRightIcon />
            <a href={href} className="hover:text-[#d4af37] transition-colors">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Floating sidebar ─────────────────────────────────────────────────────────
function FloatingSidebar() {
  const items = [
    { href:"https://www.facebook.com/AZConsultationsParis/", icon:<FacebookIcon /> },
    { href:"https://twitter.com/azconsultations",            icon:<TwitterIcon /> },
    { href:"https://www.linkedin.com/in/syedahmadjalal/",    icon:<LinkedinIcon /> },
    { href:"https://www.instagram.com/azconsultations/",     icon:<InstagramIcon /> },
  ];
  return (
    <ul className="fixed top-1/2 left-0 -translate-y-1/2 z-50 m-0 p-0 list-none">
      {items.map(({ href, icon }, i) => (
        <li key={i} className="list-none mb-[2px]">
          <a href={href} target="_blank" rel="noreferrer">
            <span className="relative flex items-center justify-center w-9 h-9 text-white/70 hover:text-[#d4af37] transition-all duration-300 hover:w-12"
              style={{ background:"rgba(255,255,255,0.07)", backdropFilter:"blur(8px)", borderRight:"1px solid rgba(255,255,255,0.1)" }}>
              {icon}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// ─── CTA fixed buttons ────────────────────────────────────────────────────────
function CTAButtons() {
  return (
    <>
      <div className="fixed bottom-6 left-5 z-[999]">
        <a href="#contact-form"
          className="inline-block px-5 py-2.5 text-slate-950 text-[13px] font-semibold rounded-xl transition-all hover:brightness-110 hover:scale-[1.02]"
          style={{ background:"#d4af37", boxShadow:"0 4px 20px rgba(212,175,55,0.35)", animation:"goldPulse 2.8s ease-in-out infinite" }}>
          Request A Consultation
        </a>
      </div>
      <div className="fixed bottom-6 right-8 z-[999]">
        <a href="https://api.whatsapp.com/send?phone=33652722078" target="_blank" rel="noreferrer">
          <i className="cta-wa-icon wa-btn-anim"><WhatsappIconSVG /></i>
        </a>
      </div>
    </>
  );
}

// ─── Gold badge ───────────────────────────────────────────────────────────────
function GoldBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      <span className="text-[#d4af37] text-[11px] font-semibold tracking-[0.22em] uppercase">{text}</span>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ContactUs() {
  const EMPTY = { firstName:"", lastName:"", email:"", phone:"", studyLevel:"", fieldOfStudy:"", message:"" };
  const [form, setForm]             = useState(EMPTY);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const fireConfetti                = useConfetti();
  const btnRef                      = useRef(null);
  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        ...form,
        fullName:    `${form.firstName} ${form.lastName}`,
        resumeName:  resumeFile ? resumeFile.name : "No resume uploaded",
        resumeSize:  resumeFile ? `${(resumeFile.size/1024).toFixed(1)} KB` : "",
        submittedAt: new Date().toLocaleString("en-GB", { timeZone:"Europe/Paris" }),
      }, EMAILJS_PUBLIC_KEY);
      if (GOOGLE_SHEETS_WEBHOOK) {
        await fetch(GOOGLE_SHEETS_WEBHOOK, { method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ ...form, fullName:`${form.firstName} ${form.lastName}`, resumeName: resumeFile?.name||"", submittedAt:new Date().toISOString(), source:"website-contact-form" }) });
      }
      if (btnRef.current) {
        const r = btnRef.current.getBoundingClientRect();
        fireConfetti((r.left+r.width/2)/window.innerWidth, (r.top+r.height/2)/window.innerHeight);
      }
      setSubmitted(true); setForm(EMPTY); setResumeFile(null);
      setTimeout(() => setSubmitted(false), 5000);
    } catch(err) {
      console.error(err);
      setError("Something went wrong. Please try again or contact us directly.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="w-full bg-[#08111f] text-white" style={{ fontFamily:"DM Sans, sans-serif" }}>

        <FloatingSidebar />
        <CTAButtons />

        {/* ── Hero Banner ── */}
        <div className="relative w-full overflow-hidden" style={{ maxHeight:380 }}>
          <img src="contact.jpg" alt="Contact Us Banner" className="w-full object-cover opacity-50"
            style={{ maxHeight:380 }}
            onError={(e)=>{ e.target.style.display="none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08111f]/40 via-transparent to-[#08111f]" />
          {/* grain */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize:"200px" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        </div>

        {/* ── Contact Section ── */}
        <div id="contact-form" className="max-w-6xl mx-auto px-4 py-14">

          {/* Heading */}
          <div className="text-center mb-12" style={{ animation:"fadeInUp .7s ease both" }}>
            <GoldBadge text="Get in Touch" />
            <h2 className="font-bold mb-3"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(26px,4vw,42px)", lineHeight:1.2 }}>
              Start Your{" "}
              <span className="gold-shimmer">Study Journey</span> Today
            </h2>
            <p className="text-white/45 text-[14px] max-w-xl mx-auto leading-[1.8]">
              Fill out the form and our expert counselors will map out your personalised pathway — within 24 hours. We specialize in helping Pakistani students study in France and Europe.
            </p>
          </div>

          {/* ── Info letter card ── */}
          <div className="glass rounded-3xl mb-10 p-8 xl:p-10"
            style={{ animation:"fadeInUp .75s ease .1s both" }}>
            {/* <p className="text-[14px] leading-[1.85] mb-6 text-white/65">
              <strong className="text-white">Dear Student,</strong><br /><br />
              Greetings from Paris.<br /><br />
              Thank you for your interest in studying abroad. We are pleased to offer our professional educational consultancy services for students from <strong className="text-[#d4af37]">Pakistan</strong> who wish to pursue higher education abroad.
            </p>

            <h3 className="font-semibold text-base mb-4 text-white"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.1rem" }}>Our Services</h3>
            <p className="text-[13.5px] mb-4 text-white/55">We provide complete support for your admission process, including:</p> */}

            {/* <div className="space-y-5 mb-7">
              {[
                { num:"1", title:"University & Program Selection", points:[
                  "We identify suitable universities and study programs based on your academic background, career goals, and budget.",
                  "University tuition fees depend on the selected formation, university, and city.",
                  "After signing our consultancy contract, we will share full details of available universities, programs, and their respective tuition fees.",
                  "University fees will be paid directly by the student to the university.",
                ]},
                { num:"2", title:"Admission Process", points:[
                  "We apply to universities on your behalf.",
                  "We secure your admission and provide the official Admission Letter and all related documents.",
                ]},
                { num:"3", title:"Document Preparation", points:[
                  "Preparation of your CV according to international standards.",
                  "Writing of a professional Letter of Motivation.",
                  "Translation of documents (translation fees are extra and depend on the number and language of documents).",
                ]},
                { num:"4", title:"Interview Preparation", points:[
                  "Guidance and preparation for the Campus France and visa interview.",
                ]},
              ].map(({ num, title, points }) => (
                <div key={num} className="flex gap-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full glass-gold flex items-center justify-center text-[#d4af37] text-xs font-bold">
                    {num}
                  </div>
                  <div>
                    <p className="font-semibold text-[13.5px] mb-2 text-white">{title}</p>
                    <ul className="space-y-1.5">
                      {points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-white/50">
                          <AngleRightIcon /><span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Visa disclaimer */}
            <div className="rounded-2xl p-5 mb-5"
              style={{ background:"rgba(212,175,55,0.07)", border:"1px solid rgba(212,175,55,0.25)" }}>
              <h3 className="font-semibold text-[13px] mb-2 text-[#d4af37]">Visa Application & Disclaimer</h3>
              <p className="text-[13px] text-white/55 leading-[1.75]">
                Please note that <strong className="text-white/80">we do not sell, arrange, or guarantee visas.</strong> Our responsibility is limited to preparing your academic and admission file according to university requirements and Embassy standards. Our fee covers university search, admission processing, CV preparation, motivation letter, and complete file preparation. <em>Translation fees and insurance costs are not included and must be paid separately by the student.</em>
              </p>
            </div>

            {/* Responsibility */}
            {/* <div className="rounded-2xl p-5 mb-5 glass">
              <h3 className="font-semibold text-[13px] mb-3 text-white">Our Responsibility</h3>
              <div className="space-y-1.5">
                {["Finding suitable universities","Securing admission","Preparing your complete academic file (CV, motivation letter, documents)"].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2 text-[13px] text-white/50">
                    <AngleRightIcon /><span>{item}</span>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Address */}
            {/* <div className="rounded-2xl p-5 mb-6 glass">
              <h3 className="font-semibold text-[13px] mb-2 text-white">Office Address</h3>
              <p className="text-[13px] text-white/50">
                <strong className="text-white/80">AZ Consultations</strong><br />
                77 Rue du Faubourg Saint-Martin, 75010 Paris, France
              </p>
            </div> */}

            {/* <p className="text-[13.5px] leading-[1.85] text-white/55">
              If you wish to begin your application or need further information, please feel free to contact us. We look forward to assisting you in achieving your educational goals in France.<br /><br />
              Kind regards,<br />
              <strong className="text-white">Syed Ahmad Jalal</strong><br />
              <span className="text-white/40">Education Consultant – France</span><br />
              <span className="text-white/40">Office: Paris / Lahore</span><br />
              <span className="text-white/40">Office: +33 1 83 96 57 23 · Mobile: +33 6 76 90 39 22</span>
            </p> */}
          </div>

          {/* ── Contact Card ── */}
          <div className="glass rounded-3xl overflow-hidden"
            style={{ boxShadow:"0 30px 80px rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.09)", animation:"fadeInUp .8s ease .15s both" }}>
            <div className="flex flex-col lg:flex-row">

              {/* Left — Contact Info */}
              <div className="lg:w-5/12 p-8 xl:p-10 flex flex-col justify-between relative overflow-hidden"
                style={{ background:"linear-gradient(135deg,rgba(212,175,55,0.1) 0%,rgba(8,17,31,0.8) 60%)", borderRight:"1px solid rgba(255,255,255,0.07)" }}>
                {/* decorative ring */}
                <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full border border-[#d4af37]/10 pointer-events-none" />
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full border border-white/5 pointer-events-none" />

                <div className="relative">
                  <h1 className="font-bold text-white mb-2"
                    style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.9rem" }}>
                    Contact info
                  </h1>
                  <p className="text-white/40 mb-8 text-[13px] leading-relaxed">
                    Wish to book an appointment with our experts?<br/>Schedule it here.
                  </p>
                  {/* gold rule */}
                  <div className="h-px w-12 bg-gradient-to-r from-[#d4af37]/60 to-transparent mb-8" />

                  <InfoBox icon={<MapMarkerIcon />} title="Address — Paris Office"
                    description="77 Rue du Faubourg Saint-Martin, 75010 Paris, France" />
                  
                  <InfoBox icon={<PhoneIconSVG />} title="Call Us"
                    description="Office: +33 1 83 96 57 23 · Mobile: +33 6 76 90 39 22" />
                  <InfoBox icon={<EnvelopeIconSVG />} title="Email Us"
                    description="info@azconsultations.fr" />
                </div>

                {/* Social */}
                <div className="mt-8 relative">
                  <h4 className="text-white/45 font-semibold mb-3 text-[11px] uppercase tracking-[0.18em]">Follow us</h4>
                  <div className="flex gap-2">
                    {[
                      { icon:<FacebookIcon />, href:"https://www.facebook.com/AZConsultationsParis/" },
                      { icon:<InstagramIcon />, href:"https://www.instagram.com/azconsultations/" },
                      { icon:<LinkedinIcon />,  href:"https://www.linkedin.com/in/syedahmadjalal/" },
                      { icon:<YoutubeIcon />,   href:"https://www.youtube.com/@azconsultations" },
                    ].map(({ icon, href }, i) => (
                      <a key={i} href={href} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-[#d4af37] transition-all hover:scale-110 glass">
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Form */}
              <div className="lg:w-7/12 p-7 xl:p-10 overflow-y-auto" style={{ maxHeight:"90vh" }}>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                    <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold glass-gold text-[#d4af37]">✓</div>
                    <p className="font-bold text-xl mb-2 text-white"
                      style={{ fontFamily:"Cormorant Garamond, serif" }}>Message Sent!</p>
                    <p className="text-sm text-white/40">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <p className="font-bold mb-6 text-white"
                      style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.3rem" }}>
                      Request a Free Consultation
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name" required>
                          <GlInput name="firstName" value={form.firstName} onChange={onChange} placeholder="Ahmad" required />
                        </Field>
                        <Field label="Last Name" required>
                          <GlInput name="lastName"  value={form.lastName}  onChange={onChange} placeholder="Syed"  required />
                        </Field>
                      </div>

                      <Field label="Email Address" required>
                        <GlInput type="email" name="email" value={form.email} onChange={onChange} placeholder="your@email.com" required />
                      </Field>

                      <Field label="WhatsApp / Phone">
                        <GlInput type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="+33 or your country code" />
                      </Field>

                      <Field label="Study Level" required>
                        <GlSelect name="studyLevel" value={form.studyLevel} onChange={onChange} required>
                          <option value="">Select Level</option>
                          <option>Bachelor's (Licence)</option>
                          <option>Master's</option>
                          <option>PhD / Doctorate</option>
                          <option>Grande École Prep</option>
                          <option>Language Course Only</option>
                        </GlSelect>
                      </Field>

                      <Field label="Field of Study" required>
                        <GlSelect name="fieldOfStudy" value={form.fieldOfStudy} onChange={onChange} required>
                          <option value="">Select Field</option>
                          <option>Business &amp; Management</option>
                          <option>Engineering &amp; Tech</option>
                          <option>Medicine &amp; Health</option>
                          <option>Law &amp; Political Science</option>
                          <option>Arts &amp; Humanities</option>
                          <option>Sciences &amp; Research</option>
                          <option>Architecture &amp; Design</option>
                        </GlSelect>
                      </Field>

                      <Field label="Message (optional)">
                        <textarea name="message" value={form.message} onChange={onChange}
                          placeholder="Tell us about your goals, questions, or current situation…"
                          rows={3}
                          className="gl-input resize-none"
                        />
                      </Field>

                      <Field label="Upload Resume / CV">
                        <ResumeUpload file={resumeFile} onFileChange={setResumeFile} />
                        <p className="text-[11.5px] text-white/30 mt-1">Accepted: PDF, DOC, DOCX · Max 5 MB</p>
                      </Field>

                      {error && (
                        <p className="text-xs px-4 py-2.5 rounded-xl text-red-400"
                          style={{ background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.2)" }}>
                          {error}
                        </p>
                      )}

                      <button ref={btnRef} type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-xl font-semibold text-[14px] transition-all duration-200 hover:brightness-110 active:scale-95"
                        style={{
                          background: loading ? "rgba(255,255,255,0.1)" : "#d4af37",
                          color: loading ? "rgba(255,255,255,0.4)" : "#08111f",
                          cursor: loading ? "not-allowed" : "pointer",
                          boxShadow: loading ? "none" : "0 8px 28px rgba(212,175,55,0.3)",
                          fontFamily:"DM Sans, sans-serif",
                        }}
                      >
                        {loading ? "Sending…" : "Get My Free Consultation →"}
                      </button>

                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="pt-14 pb-0"
          style={{ background:"linear-gradient(180deg,#08111f 0%,#060d17 100%)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto px-4">
            {/* gold top rule */}
            <div className="h-px w-full mb-12 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">

              {/* Brand */}
              <div>
                <img src="az_logo.png" alt="AZ Logo" className="h-44 mb-4 opacity-90"
                  onError={(e)=>{ e.target.style.display="none"; }} />
                <p className="text-white/40 text-[13px] leading-[1.85] mb-5">
                  Established in 2020, AZ Consultations has helped thousands of Pakistani students get admitted to reputed universities all over the world.
                </p>
                <div className="flex gap-2">
                  {[
                    { icon:<FacebookIcon />, href:"https://www.facebook.com/AZConsultationsParis/" },
                    { icon:<YoutubeIcon  />, href:"https://www.youtube.com/@azconsultations" },
                    { icon:<InstagramIcon/>, href:"https://www.instagram.com/azconsultations/" },
                    { icon:<LinkedinIcon />, href:"https://www.linkedin.com/in/syedahmadjalal/" },
                  ].map(({ icon, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noreferrer"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-[#d4af37] transition-all hover:scale-110 glass">
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              <FooterLinkList title="Study Abroad" links={[
                // { label:"Study in UK",          href:"/study-abroad-uk" },
                { label:"Study in France",       href:"/study-abroad-fr" },
                // { label:"Study in New Zealand",  href:"/study-abroad-new-zealand" },
                // { label:"Study in Australia",    href:"/study-abroad-australia" },
              ]} />

              <FooterLinkList title="Other Links" links={[
                { label:"Scholarships",    href:"/scholarships-secured" },
                { label:"Testimonials",    href:"/testimonials" },
                { label:"Visa Assistance", href:"/visa-assistance" },
                { label:"Research",        href:"/research" },
              ]} />

              <div>
                <h2 className="text-white/70 font-semibold text-[11px] uppercase tracking-[0.18em] mb-4">Contact Us</h2>
                <ul className="space-y-3 text-[13px] text-white/40">
                  <li className="flex items-start gap-2"><MapMarkerIcon /><span>77 Rue du Faubourg Saint-Martin, 75010 Paris, France</span></li>
                  <li className="flex items-start gap-2"><MapMarkerIcon /><span>Lahore Office — Pakistan</span></li>
                  <li className="flex items-center gap-2"><EnvelopeIconSVG /><span>info@azconsultations.fr</span></li>
                  <li className="flex items-center gap-2"><PhoneIconSVG />
                    <a href="tel:+33183965723" className="hover:text-[#d4af37] transition-colors">+33 1 83 96 57 23</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="py-5 mt-2" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-white/25 text-[12.5px]">Copyright © 2026 AZ Consultations | Director: Syed Ahmad Jalal</span>
              <a href="https://azconsultants.com/privacy-policy/" className="text-white/25 text-[12.5px] hover:text-[#d4af37] transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}