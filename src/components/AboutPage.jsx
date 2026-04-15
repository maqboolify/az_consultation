import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL CSS ─── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

@keyframes fadeIn      { from{opacity:0}              to{opacity:1} }
@keyframes fadeInLeft  { from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
@keyframes fadeInRight { from{opacity:0;transform:translateX(50px)}  to{opacity:1;transform:translateX(0)} }
@keyframes fadeInUp    { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
@keyframes shimmer     { from{background-position:-200% center} to{background-position:200% center} }
@keyframes goldPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.35)} 50%{box-shadow:0 0 0 14px rgba(212,175,55,0)} }
@keyframes rotateSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes marquee     { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes floatY {
  0%,100% { transform: translateY(0px) rotate(3deg); }
  50%     { transform: translateY(-20px) rotate(3deg); }
}
@keyframes phone-outer {
  0%,100%  { transform:scale(1);   box-shadow:0 0 0 0 rgba(212,175,55,0); }
  33%      { transform:scale(1.08);box-shadow:0 0 0 0 rgba(212,175,55,.3); }
  66%      { transform:scale(1);   box-shadow:0 0 0 .5em rgba(212,175,55,0); }
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
.wa-pulse::before       { color:#fff; font-size:34px; display:flex; align-items:center; justify-content:center; }

.testi-card {
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  transition:transform .35s cubic-bezier(.34,1.56,.64,1), background .3s, border-color .3s;
  position:relative; overflow:hidden;
}
.testi-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,transparent,#d4af37,transparent);
  transform:scaleX(0); transition:transform .4s ease;
}
.testi-card:hover::before { transform:scaleX(1); }
.testi-card:hover {
  transform:translateY(-6px);
  background:rgba(212,175,55,0.07);
  border-color:rgba(212,175,55,0.25);
}

.prose-section {
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(212,175,55,0.1);
  border-radius:16px;
  padding:2.5rem;
}

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#08111f; }
::-webkit-scrollbar-thumb { background:#d4af37; border-radius:10px; }
`;

/* ─── HOOKS ─── */
function useInView(threshold = 0.15) {
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

/* ─── ANIMATED COUNTER ─── */
function AnimatedCounter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView();
  useEffect(() => {
    if (!visible) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 1800 / steps);
    return () => clearInterval(timer);
  }, [visible, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── REVEAL WRAPPER ─── */
function Reveal({ children, anim = "fadeIn", delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `${anim} 0.85s cubic-bezier(.16,1,.3,1) ${delay}s both` : "none",
      }}>
      {children}
    </div>
  );
}

function Animate({ children, direction = "up", delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  const map = {
    up:    { h:"opacity-0 translate-y-10",  s:"opacity-100 translate-y-0" },
    left:  { h:"opacity-0 -translate-x-12", s:"opacity-100 translate-x-0" },
    right: { h:"opacity-0 translate-x-12",  s:"opacity-100 translate-x-0" },
    fade:  { h:"opacity-0",                 s:"opacity-100" },
  };
  const { h, s } = map[direction] ?? map.up;
  return (
    <div ref={ref}
      className={`transition-all duration-700 ${visible ? s : h} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── GOLD BADGE ─── */
function GoldBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      <span className="text-[#d4af37] text-[11px] font-semibold tracking-[0.22em] uppercase"
        style={{ fontFamily:"DM Sans, sans-serif" }}>{text}</span>
    </div>
  );
}

/* ─── TESTIMONIALS ─── */
const TESTIMONIALS = [
  { name:"Hamza Malik",      text:"AZ Consultations changed my life forever. They gave me hope for a better and brighter future. Ahmad Jalal Sir guided me throughout the entire process and I am now studying in France. I am proud to be a part of the AZ family." },
  { name:"Fatima Chaudhry",  text:"AZ Consultations helped me a lot in finding my dream university in France. The process was smooth and professional from start to finish." },
  { name:"Zara Hussain",     text:"I always wanted to study design abroad but was unsure how to go about my portfolio and applications. AZ Consultations really helped me with all of it. Ahmad Jalal Sir guided me every step of the way. I highly recommend AZ Consultations to any Pakistani student wanting to study in France." },
  { name:"Bilal Ahmed",      text:"AZ Consultations gave me the clarity and exposure I needed to decide my future and choose the right university. With their support I started a journey of self-growth and now I'm living my dream in Paris." },
  { name:"Sara Khan",        text:"I had the most amazing experience working with AZ Consultations. Their professional approach and genuine care for students made my admission process stress-free. I would definitely recommend them to every Pakistani student aspiring to study abroad." },
];

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [ref, visible] = useInView();
  const go = (next) => {
    setFading(true);
    setTimeout(() => { setIdx(next % TESTIMONIALS.length); setFading(false); }, 300);
  };
  useEffect(() => {
    const t = setInterval(() => go((idx + 2) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [idx]);
  const pair = [TESTIMONIALS[idx], TESTIMONIALS[(idx + 1) % TESTIMONIALS.length]];
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"
        style={{ opacity: fading ? 0 : 1, transition:"opacity 0.3s" }}>
        {pair.map((t, i) => (
          <div key={i} className="testi-card rounded-2xl p-7 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full glass-gold flex items-center justify-center text-[#d4af37] font-bold text-xl"
              style={{ fontFamily:"Cormorant Garamond, serif" }}>
              {t.name[0]}
            </div>
            <p className="text-white/60 text-sm leading-relaxed text-center italic">"{t.text}"</p>
            <p className="font-semibold text-[#d4af37] text-sm"
              style={{ fontFamily:"Cormorant Garamond, serif" }}>{t.name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-7">
        {TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            style={{
              height:"8px",
              width: i === idx ? "28px" : "8px",
              borderRadius:"4px", border:"none", cursor:"pointer", padding:0,
              background: i === idx ? "#d4af37" : "rgba(255,255,255,0.25)",
              transition:"all .35s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── FLOATING SOCIALS ─── */
const SOCIALS = [
  { title:"Facebook",  href:"https://www.facebook.com/azconsultations",     vb:"0 0 512 512", d:"M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" },
  { title:"Twitter",   href:"https://twitter.com/azconsultations",           vb:"0 0 512 512", d:"M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" },
  { title:"LinkedIn",  href:"https://www.linkedin.com/in/syed-ahmad-jalal",  vb:"0 0 448 512", d:"M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" },
  { title:"Instagram", href:"https://www.instagram.com/azconsultations/",    vb:"0 0 448 512", d:"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" },
];

function FloatingSocials() {
  return (
    <ul style={{ position:"fixed", top:"50%", transform:"translateY(-50%)", left:0, zIndex:9, margin:0, padding:0 }}>
      {SOCIALS.map(s => (
        <li key={s.title} style={{ listStyle:"none", marginBottom:3 }}>
          <a href={s.href} target="_blank" rel="noreferrer" title={s.title}
            style={{
              width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(212,175,55,0.12)", backdropFilter:"blur(10px)",
              border:"1px solid rgba(212,175,55,0.25)",
              transition:"all 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(212,175,55,0.25)"; e.currentTarget.style.width="52px"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(212,175,55,0.12)"; e.currentTarget.style.width="40px"; }}>
            <svg viewBox={s.vb} xmlns="http://www.w3.org/2000/svg"
              style={{ width:15, height:15, fill:"#d4af37" }}>
              <path d={s.d} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ─── FIXED CTAs ─── */
function CTABtn() {
  return (
    <div style={{ position:"fixed", bottom:25, left:20, zIndex:999 }}>
      <a href="../contact_us/contact_us.html"
        className="animate-gold-pulse"
        style={{
          background:"#d4af37", padding:"10px 16px", color:"#0a0e1a",
          borderRadius:10, fontSize:14, textDecoration:"none", fontWeight:600,
          fontFamily:"DM Sans, sans-serif", display:"block",
        }}>
        Request A Consultation
      </a>
    </div>
  );
}

function WhatsAppBtn() {
  return (
    <div style={{ position:"fixed", bottom:25, right:30, zIndex:999 }}>
      <a href="https://api.whatsapp.com/send?phone=33652722078" target="_blank" rel="noreferrer">
        <span className="wa-pulse" style={{
          position:"relative", display:"block", margin:0,
          width:"1em", height:"1em", fontSize:60, lineHeight:"60px",
          backgroundColor:"#34a94d", borderRadius:".5em",
          boxShadow:"0 0 0 0 rgba(52,219,52,0),0 .05em .1em rgba(0,0,0,.2)",
          transform:"translate3d(0,0,0) scale(1)",
        }}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            style={{ position:"absolute", top:".25em", left:".25em", width:".5em", height:".5em", fill:"#fff" }}>
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V20c0 .5-.5 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.5 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z" />
          </svg>
        </span>
      </a>
    </div>
  );
}

/* ─── FOOTER CHEVRON ─── */
function ChevronRight() {
  return (
    <svg viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg"
      className="inline-block mr-2 shrink-0" style={{ width:8, height:12, fill:"#d4af37", verticalAlign:"middle" }}>
      <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
    </svg>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  const footerSocials = [
    { href:"https://www.facebook.com/azconsultations/",     vb:"0 0 512 512", d:"M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" },
    { href:"https://www.youtube.com/@azconsultations",       vb:"0 0 576 512", d:"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" },
    { href:"https://www.instagram.com/azconsultations/",     vb:"0 0 448 512", d:"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" },
    { href:"https://www.linkedin.com/in/syed-ahmad-jalal/",  vb:"0 0 448 512", d:"M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" },
  ];
  return (
    <footer style={{ background:"#060f1c", borderTop:"1px solid rgba(212,175,55,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1 */}
        <div className="flex flex-col gap-4">
          <a href="https://azconsultants.com">
            <img src="/az_logo.png" alt="AZ Consultations"
              style={{ height:130, width:250 }} className="object-contain" />
          </a>
          <p className="text-sm text-white/50 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Established in 2020, AZ Consultations has helped hundreds of Pakistani students get admitted to reputed universities across France and Europe.
          </p>
          <div className="flex gap-3 flex-wrap">
            {footerSocials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:brightness-125 transition-all glass-gold">
                <svg viewBox={s.vb} xmlns="http://www.w3.org/2000/svg"
                  style={{ width:14, height:14, fill:"#d4af37" }}>
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        {/* Col 2 */}
        <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Study Abroad</h2>
          <ul className="flex flex-col gap-2.5">
            {[
              ["Study in France",          "/study-abroad-fr"],
              // ["Study in US",          "https://azconsultants.com/study-aborad-usa/"],
              // ["Study in Canada",      "../study_cannada/study_cannada.html"],
              // ["Study in New Zealand", "../study_nz/study_nz.html"],
              // ["Study in Australia",   "../study_australia/study_australia.html"],
              // ["Study in Hong Kong",   "https://azconsultants.com/study-abroad-hong-kong/"],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="text-white/45 text-sm hover:text-[#d4af37] transition-colors flex items-center"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>
                  <ChevronRight />{label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Col 3 */}
        <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Other Links</h2>
          <ul className="flex flex-col gap-2.5">
            {[
              ["Scholarships",    "../sucess_scholarship_secured/sucess_scholarship_secured.html"],
              ["Testimonials",    "../study_testimonials/study_testimonials.html"],
              ["Visa Assistance", "../visa_assist/visa_assist.html"],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="text-white/45 text-sm hover:text-[#d4af37] transition-colors flex items-center"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>
                  <ChevronRight />{label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Col 4 */}
        <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Contact Us</h2>
          <ul className="flex flex-col gap-3">
            {[
              { icon:"M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z", vb:"0 0 384 512", text:"77 Rue du Faubourg Saint-Martin, 75010 Paris, France" },
              { icon:"M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z", vb:"0 0 384 512", text:"Lahore Office, Pakistan" },
              { icon:"M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z", vb:"0 0 512 512", text:"[email protected]" },
              { icon:"M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z", vb:"0 0 512 512", text:"+33 1 83 96 57 23", href:"tel:+33183965723" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-white/45 text-sm" style={{ fontFamily:"DM Sans, sans-serif" }}>
                <svg viewBox={item.vb} xmlns="http://www.w3.org/2000/svg"
                  style={{ width:14, height:14, fill:"#d4af37", marginTop:2, flexShrink:0 }}>
                  <path d={item.icon} />
                </svg>
                {item.href
                  ? <a href={item.href} className="hover:text-[#d4af37] transition-colors">{item.text}</a>
                  : <span>{item.text}</span>
                }
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ background:"rgba(0,0,0,0.3)", borderTop:"1px solid rgba(255,255,255,0.04)" }}
        className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-white/30 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Copyright © 2026 AZ Consultations | Powered by EdNet
          </span>
          <a href="https://azconsultants.com/privacy-policy/"
            className="text-white/30 text-xs hover:text-[#d4af37] transition-colors"
            style={{ fontFamily:"DM Sans, sans-serif" }}>
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════ */
export default function AboutPage() {
  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior:"smooth" }); }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div id="about" style={{ fontFamily:"DM Sans, sans-serif", background:"#08111f", color:"#e5dcc8" }}>

        <FloatingSocials />
        <CTABtn />
        <WhatsAppBtn />

        <main>
          {/* ══ HERO IMAGE ══ */}
          <section className="relative w-full overflow-hidden">
            <img src="group.png" alt=""
              className="w-full object-cover block" style={{ height:500 }}
              fetchPriority="high" decoding="async" />
            <div className="absolute inset-0"
              style={{ background:"linear-gradient(to top, #08111f 0%, rgba(8,17,31,0.45) 50%, transparent 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background:"linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }} />
          </section>

          {/* ══ ABOUT INTRO ══ */}
          <section className="py-16 px-4 md:px-10 relative overflow-hidden"
            style={{ background:"linear-gradient(180deg,#08111f 0%,#0c1828 100%)" }}>
            <div className="absolute top-8 right-12 w-28 h-28 rounded-full border border-[#d4af37]/10 pointer-events-none animate-rotate" />
            <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full border border-white/5 pointer-events-none animate-rotate-rev" />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
              {/* Left image */}
              <Animate direction="left" className="w-full md:w-1/2">
                <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  style={{ border:"1px solid rgba(212,175,55,0.15)" }}>
                  <img src="mg.jpg" alt="" className="w-full" decoding="async" />
                  <div className="absolute inset-0"
                    style={{ background:"linear-gradient(to top, rgba(8,17,31,0.4) 0%, transparent 60%)" }} />
                </div>
              </Animate>

              {/* Right text */}
              <Animate direction="right" delay={100} className="w-full md:w-1/2 relative">
                {/* Floating decoration */}
                <img src="7d9efc478a7cc80df6d4ab152aff4a722a88b465ee36bd7e0ed0a7f45ea47310.png" alt=""
                  className="absolute pointer-events-none opacity-40"
                  style={{ top:-32, right:0, width:90, animation:"floatY 5s ease-in-out infinite", transform:"rotate(3deg)" }}
                  decoding="async" />
                <GoldBadge text="About Us" />
                <h1 className="font-bold leading-snug mb-5"
                  style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.6rem,3vw,2.4rem)" }}>
                  About AZ Consultations –
                  <span className="block gold-shimmer">Overseas Education Consultants in Paris</span>
                </h1>
                <p className="text-white/55 leading-relaxed text-justify text-sm">
                  AZ Consultations, founded in 2020, assists students from Pakistan by placing them in top universities across the globe, including leading European institutions, at both Undergraduate and Graduate levels. Each year, our students receive admission offers and significant scholarships to transform their career aspirations into reality.
                </p>
              </Animate>
            </div>
          </section>

          {/* ══ FOUNDER SECTION ══ */}
          <section className="py-16 px-4 md:px-10 relative overflow-hidden"
            style={{ background:"radial-gradient(ellipse at bottom right, rgba(212,175,55,0.07) 0%, transparent 55%), #0a1220" }}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
              {/* Left text */}
              <Animate direction="left" className="w-full md:w-1/2 flex flex-col gap-4">
                <GoldBadge text="Our Founder" />
                <h2 className="font-bold leading-snug"
                  style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
                  Meet our Founder & Director<br />
                  <span className="gold-shimmer">Syed Ahmad Jalal</span>
                </h2>
                <h3 className="font-semibold text-white/60"
                  style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.1rem" }}>
                  Redefining Education Counselling with Excellence
                </h3>
                <div className="h-px w-16"
                  style={{ background:"linear-gradient(90deg, #d4af37, transparent)" }} />
                <p className="text-white/55 leading-relaxed text-justify text-sm">
                  Syed Ahmad Jalal, with years of expertise in international education consultancy, is a dedicated professional guiding Pakistani students toward their academic goals in France and Europe. His establishment of AZ Consultations in 2020 is a testament to his commitment to providing exceptional educational opportunities for students from Pakistan. Based in Paris, Ahmad Jalal possesses an in-depth understanding of the French higher education landscape and the admission process for international students.
                </p>
                <p className="text-white/55 leading-relaxed text-justify text-sm">
                  Ahmad Jalal's vision, realized through AZ Consultations, showcases his student-first approach, drawing on his extensive experience and strong ties with universities across France and Europe. With a wide network of university engagements, he is dedicated to guiding Pakistani students in making well-informed decisions for university selection, ensuring a well-rounded approach to student success.
                </p>
              </Animate>

              {/* Right photo */}
              <Animate direction="right" delay={150} className="w-full md:w-1/2">
                <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] group"
                  style={{ border:"1px solid rgba(212,175,55,0.15)" }}>
                  <img src="ahmed.png" alt="" className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy" decoding="async" />
                  <div className="absolute inset-0"
                    style={{ background:"linear-gradient(to top, rgba(8,17,31,0.5) 0%, transparent 60%)" }} />
                </div>
                <a href="/contact"
                  className="inline-block mt-5 px-7 py-3 rounded-xl text-slate-950 text-sm font-semibold hover:brightness-110 hover:scale-[1.02] transition-all animate-gold-pulse"
                  style={{ background:"#d4af37", fontFamily:"DM Sans, sans-serif" }}>
                  Contact Us
                </a>
              </Animate>
            </div>
          </section>

          {/* ══ EXTENDED BIO ══ */}
          <section className="py-16 px-4 md:px-10"
            style={{ background:"linear-gradient(180deg,#0c1828 0%,#08111f 100%)" }}>
            <Animate direction="up" className="max-w-5xl mx-auto">
              <div className="prose-section">
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }} />
                <GoldBadge text="Director's Profile" />
                <div className="flex flex-col gap-5">
                  {[
                    "As a dedicated consultant, Ahmad Jalal actively supports Pakistani students in planning their educational trajectories, offering personalized guidance sessions to help craft impactful applications. He provides end-to-end support from university selection to visa preparation, ensuring every student is well-prepared for their journey to France.",
                    "Ahmad Jalal spearheads AZ Consultations' outreach initiatives, connecting Pakistani students with top French universities and grandes écoles. He works closely with students to identify programs that align with their academic background, career goals, and budget.",
                    "As the Founder and Director of AZ Consultations, he has guided numerous Pakistani students through successful admissions to prestigious institutions in France and across Europe. His students have secured admissions in universities across Paris, Lyon, Bordeaux, Toulouse, and beyond, pursuing programs in Engineering, Business, Arts, Sciences, and more.",
                    "Based in Paris with strong ties to Lahore, Ahmad Jalal bridges the gap between Pakistani students and French higher education. He works in close collaboration with French universities and educational institutions, maintaining an up-to-date knowledge of admission requirements, scholarship opportunities, and visa processes.",
                    "Ahmad Jalal is committed to transparency and professionalism. He ensures every student and family receives honest, clear guidance throughout the process — from the initial consultation to the final visa approval — making the dream of studying in France a reality for students from Pakistan.",
                  ].map((p, i) => (
                    <p key={i} className="text-white/55 leading-relaxed text-justify text-sm">{p}</p>
                  ))}
                </div>
              </div>
            </Animate>
          </section>

          {/* ══ OUR PHILOSOPHY ══ */}
          <section id="our-philosophy" className="py-16 px-4 md:px-10 relative overflow-hidden"
            style={{ background:"radial-gradient(ellipse at top left, rgba(212,175,55,0.06) 0%, transparent 55%), #060f1c" }}>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-28 h-28 opacity-10 pointer-events-none animate-rotate">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 6"/>
              </svg>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
              {/* Left photo */}
              <Animate direction="left" className="w-full md:w-1/2">
                <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] group"
                  style={{ border:"1px solid rgba(212,175,55,0.15)" }}>
                  <img src="/zahidd.png" alt="Syed Ahmad Jalal - AZ Consultations Director"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy" decoding="async" />
                  <div className="absolute inset-0"
                    style={{ background:"linear-gradient(to top, rgba(8,17,31,0.5) 0%, transparent 60%)" }} />
                </div>
              </Animate>

              {/* Right text */}
              <Animate direction="right" delay={150} className="w-full md:w-1/2 flex flex-col gap-4">
                <GoldBadge text="Our Philosophy" />
                <p className="text-[#d4af37] text-sm font-medium"
                  style={{ fontFamily:"Cormorant Garamond, serif" }}>
                  – Syed Zahid Muhammad, Assistant Director
                </p>
                <p className="text-white/40 text-sm italic">We work with the student and for the student</p>
                <h2 className="font-bold"
                  style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
                  Our <span className="gold-shimmer">Philosophy</span>
                </h2>
                <div className="h-px w-16"
                  style={{ background:"linear-gradient(90deg, #d4af37, transparent)" }} />
                <p className="text-white/55 leading-relaxed text-justify text-sm">
                  Syed Zahid Muhammad is dedicated to providing high-quality, personalized services to every student. He emphasizes transparency and ensures that the university admission process is smooth and effective for Pakistani students aspiring to study in France.
                </p>
                <p className="text-white/55 leading-relaxed text-justify text-sm">
                  "Every student can learn, just not on the same day, or the same way," says George Evans.
                </p>
                <p className="text-white/55 leading-relaxed text-justify text-sm">
                  Like Evans, Zahid Muhammad also believes that each student is unique and has individual needs. What works for one may not work for another and therefore, he primarily focuses on understanding each student and evaluating their strengths, weaknesses, interests and talents. Based on the analysis, he tailors solutions best suited for their profiles and parameters, ensuring they choose the right career path and the right university.
                </p>
              </Animate>
            </div>
          </section>

          {/* ══ TESTIMONIALS ══ */}
          <section className="py-16 px-4 md:px-10"
            style={{
              background:"radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 65%), #08111f",
              borderTop:"1px solid rgba(212,175,55,0.08)",
              borderBottom:"1px solid rgba(212,175,55,0.08)",
            }}>
            <div className="max-w-5xl mx-auto">
              <Animate direction="fade" className="text-center mb-10">
                <GoldBadge text="Testimonials" />
                <h2 className="font-bold mt-1"
                  style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
                  <span className="gold-shimmer">Success Stories</span>
                </h2>
              </Animate>
              <TestimonialCarousel />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}