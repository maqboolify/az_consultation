import { useState, useEffect, useRef } from "react";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

@keyframes fadeIn {
  from { opacity:0; }
  to   { opacity:1; }
}
@keyframes fadeInLeft {
  from { opacity:0; transform:translateX(-60px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes fadeInRight {
  from { opacity:0; transform:translateX(60px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes fadeInUp {
  from { opacity:0; transform:translateY(40px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes heroSlide {
  from { opacity:0; transform:translateX(-30px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes counterBounce {
  0%,20%,53%,100% { transform:translateY(0) scaleY(1); }
  40%,43%         { transform:translateY(-10px) scaleY(1.06); }
  70%             { transform:translateY(-5px) scaleY(1.03); }
  80%             { transform:translateY(0) scaleY(0.97); }
  90%             { transform:translateY(-2px) scaleY(1.01); }
}
@keyframes floatY {
  0%,100% { transform:translateY(0px); }
  50%     { transform:translateY(-12px); }
}
@keyframes rotateSlow {
  from { transform:rotate(0deg); }
  to   { transform:rotate(360deg); }
}
@keyframes goldPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.35); }
  50%     { box-shadow: 0 0 0 14px rgba(212,175,55,0); }
}
@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position:  200% center; }
}
@keyframes lineGrow {
  from { width: 0; }
  to   { width: 100%; }
}

.animate-float       { animation: floatY 3s ease-in-out infinite; }
.animate-rotate      { animation: rotateSlow 14s linear infinite; }
.animate-rotate-rev  { animation: rotateSlow 14s linear infinite reverse; }
.animate-gold-pulse  { animation: goldPulse 2.8s ease-in-out infinite; }

.glass {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.09);
}
.glass-gold {
  background: rgba(212,175,55,0.07);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(212,175,55,0.2);
}
.card-lift {
  transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s ease;
}
.card-lift:hover { transform:translateY(-10px); box-shadow:0 20px 50px rgba(0,0,0,.45); }

.service-card {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.07);
  transition: transform .35s cubic-bezier(.34,1.56,.64,1), background .3s ease, border-color .3s;
}
.service-card:hover {
  transform: translateY(-8px);
  background: rgba(212,175,55,0.1);
  border-color: rgba(212,175,55,0.3);
}

.why-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  transition: transform .35s cubic-bezier(.34,1.56,.64,1), background .3s ease, border-color .3s, box-shadow .3s;
  position: relative;
  overflow: hidden;
}
.why-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  transform: scaleX(0);
  transition: transform .4s ease;
}
.why-card:hover::before {
  transform: scaleX(1);
}
.why-card:hover {
  transform: translateY(-6px);
  background: rgba(212,175,55,0.07);
  border-color: rgba(212,175,55,0.25);
  box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 30px rgba(212,175,55,0.05);
}

.gold-shimmer {
  background: linear-gradient(90deg, #d4af37 0%, #f5e27a 40%, #d4af37 60%, #a07c20 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

.swiper-btn {
  width:42px; height:42px; border-radius:50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  transition: background .2s, border-color .2s;
  backdrop-filter: blur(8px);
}
.swiper-btn:hover:not(:disabled) {
  background: rgba(212,175,55,0.2);
  border-color: rgba(212,175,55,0.5);
}
.swiper-btn:disabled { opacity:.25; cursor:default; }

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#0a0e1a; }
::-webkit-scrollbar-thumb { background:#d4af37; border-radius:10px; }
`;

const slides = [
  {
    bg: "/homebg.jpeg",
    heading: "Study abroad with\nconfidence, clarity, and class.",
    sub: "Unlock Global Opportunities through Study Abroad in Europe",
    btn: "Book a Consultation",
    href: "/contact",
  },
  {
    bg: "/homebg2.jpeg",
    heading: "Empowering Students\n to Study in Europe",
    desc: [
      "✦ Complete university admission support",
      "✦ Professional CV & motivation letter preparation",
      "✦ Campus France & visa interview coaching",
      "✦ Expert guidance from our Paris-based team",
    ],
    btn: "Contact Us",
    href: "/contact",
  },
];

const stats = [
  { to: 100, suffix: "%",           label: "Dedication to\nStudent Success Across Europe",          dur: 2400 },
  { to: 500, suffix: "+",           label: "Pakistani Students\nSuccessfully Placed Abroad",         dur: 2800 },
  { to: 50,  suffix: "+",           label: "Partner Universities\nin France and Europe",             dur: 2400 },
  { to: null, suffix: "Millions €", label: "Scholarships &\nFinancial Aid Secured",                 dur: 0    },
];

const programs = [
  { title:"PhD Programs",                      img:"https://www.ednetconsultants.com/wp-content/uploads/2024/04/phd.png",        href:"#" },
  { title:"Master of Business Administration", img:"https://www.ednetconsultants.com/wp-content/uploads/2024/04/mba.jpeg",       href:"#" },
  { title:"Post Graduate Courses",             img:"https://www.ednetconsultants.com/wp-content/uploads/2024/04/pg.png",         href:"#" },
  { title:"Under Graduate Courses",            img:"https://www.ednetconsultants.com/wp-content/uploads/2024/04/ug.png",         href:"#" },
  { title:"Engineering & Technology",          img:"https://www.ednetconsultants.com/wp-content/uploads/2024/04/research.jpeg",  href:"#" },
  { title:"Design & Architecture",             img:"https://www.ednetconsultants.com/wp-content/uploads/2024/04/design.jpeg",    href:"#" },
  { title:"Research Programs",                 img:"https://www.ednetconsultants.com/wp-content/uploads/2024/04/marquette.jpeg", href:"#" },
];

const services = [
  { title:"University & Program Selection",   desc:"We identify suitable universities and study programs based on your academic background, career goals, and budget across France and Europe." },
  { title:"Admission Processing",             desc:"We apply to universities on your behalf, secure your admission, and provide the official Admission Letter and all related documents." },
  { title:"CV Preparation",                   desc:"Professional CV crafted according to European university standards to maximise your chances of acceptance." },
  { title:"Letter of Motivation Writing",     desc:"Compelling, personalised motivation letters that highlight your strengths and align with your chosen program." },
  { title:"Document Translation",             desc:"Professional translation of your documents into French or other required languages." },
  { title:"Campus France Interview Prep",     desc:"Thorough guidance and mock sessions to prepare you confidently for your Campus France interview." },
  { title:"Visa Interview Coaching",          desc:"Step-by-step preparation for the French Embassy visa interview to maximise your approval chances." },
  { title:"Profile Building",                 desc:"Creating standout, compelling profiles tailored to impress admission officers at European universities." },
  { title:"Course & Career Counselling",      desc:"Personalised advice to align your academic choices with your long-term career goals in the global market." },
  { title:"Scholarship Guidance",             desc:"Every student is given the best possible chance to secure scholarships and financial aid at their chosen university." },
  { title:"Accommodation Assistance",         desc:"Support in arranging suitable accommodation at or near your university of study in Europe." },
  { title:"Pre-Departure Counselling",        desc:"Comprehensive sessions on how to prepare for life abroad, including cultural, financial, and practical advice." },
  { title:"File & Application Management",    desc:"End-to-end management of your complete academic file ensuring all documents meet university and embassy requirements." },
  { title:"Insurance Guidance",               desc:"Advice on required health and travel insurance coverage for your studies in France and Europe." },
  { title:"Post-Arrival Support",             desc:"Continued guidance once you arrive in Europe to ensure a smooth transition to student life." },
  { title:"Beyond Academics",                 desc:"Guidance on internships, part-time opportunities, and skill development to enhance your profile while studying abroad." },
];

const whyUs = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#d4af37" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    title: "Paris-Based Expertise",
    desc: "Our team lives and works in France — giving you insider knowledge of the French university system, culture, and application process that no remote consultant can match.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#d4af37" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    ),
    title: "Personalised, One-on-One Guidance",
    desc: "Every student receives a dedicated consultant who understands their background, goals, and budget — no generic packages, no one-size-fits-all approach.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#d4af37" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
    title: "Proven Track Record",
    desc: "Over 500 Pakistani students successfully placed at European universities since 2020, with millions in scholarships and financial aid secured on their behalf.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#d4af37" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
      </svg>
    ),
    title: "Dual-Country Presence",
    desc: "With offices in both Paris and Lahore, we are accessible to students across Pakistan while remaining deeply embedded in the European education ecosystem.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#d4af37" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: "Maximum Scholarship Access",
    desc: "We actively identify and apply for every scholarship and financial aid opportunity available — ensuring your studies are as affordable as possible.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="#d4af37" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
    title: "End-to-End Support",
    desc: "From your first consultation to post-arrival settlement — we are with you at every stage, handling documents, interviews, visas, accommodation, and more.",
  },
];

/* ── HOOKS ── */
function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, duration, trigger) {
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!trigger || !target) return;
    let raf, start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
      else { setVal(target); setDone(true); }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return { val, done };
}

/* ── SHARED ── */
function Reveal({ children, anim = "fadeIn", delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `${anim} 0.85s cubic-bezier(.16,1,.3,1) ${delay}s both` : "none",
      }}
    >{children}</div>
  );
}

function GoldBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      <span className="text-[#d4af37] text-[11px] font-semibold tracking-[0.22em] uppercase">{text}</span>
    </div>
  );
}

function StatCard({ to, suffix, label, dur, delay = 0 }) {
  const [ref, inView] = useInView(0.3);
  const { val, done } = useCounter(to, dur, inView);
  return (
    <div ref={ref}
      className="glass rounded-2xl px-5 pt-8 pb-6 min-h-[200px] flex flex-col items-center justify-between text-center"
      style={{ opacity: inView ? 1 : 0, animation: inView ? `fadeIn .7s ease ${delay}s both` : "none" }}
    >
      <p className="text-white/55 text-[12.5px] leading-relaxed whitespace-pre-line font-['DM_Sans']">{label}</p>
      <div className="mt-5">
        <div className="gold-shimmer font-bold tabular-nums"
          style={{
            fontSize:"clamp(1.8rem,3vw,2.4rem)",
            fontFamily:"Cormorant Garamond, serif",
            animation: done ? "counterBounce .6s ease" : "none",
          }}
        >
          {to != null ? val.toLocaleString() : ""}{suffix}
        </div>
      </div>
      <div className="mt-4 h-px w-10 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
    </div>
  );
}

/* ── HERO SLIDER ── */
function HeroSlider() {
  const [active, setActive] = useState(0);
  const [key, setKey] = useState(0);
  const total = slides.length;
  const go = (i) => { setActive(i); setKey((k) => k + 1); };
  const prev = () => go((active - 1 + total) % total);
  const next = () => go((active + 1) % total);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="relative w-full overflow-hidden select-none" style={{ height:"clamp(420px,58vw,640px)" }}>
      {slides.map((s, i) => (
        <div key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            zIndex: i === active ? 10 : 0,
            opacity: i === active ? 1 : 0,
            backgroundImage:`linear-gradient(105deg,rgba(8,17,31,.92) 0%,rgba(8,17,31,.65) 55%,rgba(8,17,31,.25) 100%), url(${s.bg})`,
            backgroundSize:"cover",
            backgroundPosition:"center",
          }}
        >
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize:"200px" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

          <div className="max-w-[1240px] mx-auto px-6 h-full flex items-center">
            {i === active && (
              <div key={key} className="max-w-[620px]">
                <div style={{ animation:"heroSlide .9s cubic-bezier(.16,1,.3,1) both" }}>
                  <GoldBadge text="AZ Consultations · Paris" />
                  <h1
                    className="font-bold leading-[1.1] mb-4 whitespace-pre-line"
                    style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem,4.5vw,3.4rem)" }}
                  >
                    {i === 0 ? (
                      <>
                        Study abroad with{"\n"}
                        <span style={{ color: "#f3d98c" }}>confidence</span>,{" "}
                        <span style={{ color: "#5ee9b5" }}>clarity</span>, and class.
                      </>
                    ) : (
                      s.heading
                    )}
                  </h1>
                  {s.sub && (
                    <p className="text-white/70 text-[16px] mb-6 font-['DM_Sans']"
                      style={{ animation:"fadeIn .8s ease .2s both" }}>{s.sub}</p>
                  )}
                </div>
                {s.desc && (
                  <div className="mb-7 space-y-2.5" style={{ animation:"fadeIn .8s ease .25s both" }}>
                    {s.desc.map((d, j) => (
                      <p key={j} className="text-white/80 text-[14.5px] font-['DM_Sans']">{d}</p>
                    ))}
                  </div>
                )}
                <a href={s.href}
                  className="inline-block px-8 py-3.5 rounded-xl bg-[#d4af37] text-slate-950 text-[14px] font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300 animate-gold-pulse"
                  style={{ animation:"fadeInUp .75s ease .35s both, goldPulse 2.8s ease-in-out 1.5s infinite" }}
                >
                  {s.btn}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}

      {[
        { cls:"left-5", label:"Prev", fn:prev, d:"M646 125C629 125 613 133 604 142L308 442C296 454 292 471 292 487 292 504 296 521 308 533L604 854C617 867 629 875 646 875 663 875 679 871 692 858 704 846 713 829 713 812 713 796 708 779 692 767L438 487 692 225C700 217 708 204 708 187 708 171 704 154 692 142 675 129 663 125 646 125Z" },
        { cls:"right-5", label:"Next", fn:next, d:"M696 533C708 521 713 504 713 487 713 471 708 454 696 446L400 146C388 133 375 125 354 125 338 125 325 129 313 142 300 154 292 171 292 187 292 204 296 221 308 233L563 492 304 771C292 783 288 800 288 817 288 833 296 850 308 863 321 871 338 875 354 875 371 875 388 867 400 854L696 533Z" },
      ].map(({ cls, label, fn, d }) => (
        <button key={cls} onClick={fn} aria-label={label}
          className={`hidden md:flex swiper-btn absolute top-1/2 -translate-y-1/2 z-20 ${cls}`}>
          <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 1000 1000">
            <path d={d} />
          </svg>
        </button>
      ))}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            style={{
              height:"8px",
              width: i === active ? "28px" : "8px",
              borderRadius:"4px",
              background: i === active ? "#d4af37" : "rgba(255,255,255,0.3)",
              transition:"all .35s ease",
              border:"none", cursor:"pointer", padding:0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── CAROUSEL ── */
function Carousel({ items, renderItem, cols = 3, autoMs = 3500 }) {
  const [start, setStart] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setStart((s) => (s + 1 + cols > items.length ? 0 : s + 1));
    }, autoMs);
    return () => clearInterval(t);
  }, [items.length, cols, autoMs]);

  const pages = Math.ceil(items.length / cols);
  const activePage = Math.floor(start / cols);
  const visible = items.slice(start, start + cols);
  const canPrev = start > 0;
  const canNext = start + cols < items.length;

  return (
    <div>
      <div className="grid gap-5" style={{ gridTemplateColumns:`repeat(${cols},minmax(0,1fr))` }}>
        {visible.map((item, i) => renderItem(item, i))}
      </div>
      <div className="flex justify-center items-center gap-3 mt-8">
        <button disabled={!canPrev} className="swiper-btn" onClick={() => setStart((s) => Math.max(0, s - 1))}>
          <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 1000 1000">
            <path d="M646 125C629 125 613 133 604 142L308 442C296 454 292 471 292 487 292 504 296 521 308 533L604 854C617 867 629 875 646 875 663 875 679 871 692 858 704 846 713 829 713 812 713 796 708 779 692 767L438 487 692 225C700 217 708 204 708 187 708 171 704 154 692 142 675 129 663 125 646 125Z" />
          </svg>
        </button>
        {Array.from({ length: pages }).map((_, pi) => (
          <button key={pi} onClick={() => setStart(pi * cols)}
            style={{
              width:"8px", height:"8px", borderRadius:"50%", border:"none", cursor:"pointer", padding:0,
              background: pi === activePage ? "#d4af37" : "rgba(255,255,255,0.2)",
              transition:"background .3s",
            }}
          />
        ))}
        <button disabled={!canNext} className="swiper-btn" onClick={() => setStart((s) => Math.min(items.length - cols, s + 1))}>
          <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 1000 1000">
            <path d="M696 533C708 521 713 504 713 487 713 471 708 454 696 446L400 146C388 133 375 125 354 125 338 125 325 129 313 142 300 154 292 171 292 187 292 204 296 221 308 233L563 492 304 771C292 783 288 800 288 817 288 833 296 850 308 863 321 871 338 875 354 875 371 875 388 867 400 854L696 533Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function AZConsultationsMainPage() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ fontFamily:"DM Sans, sans-serif" }} className="text-white bg-[#08111f]">

        {/* ━━━━ HERO ━━━━ */}
        <HeroSlider />
        <div className="w-full bg-[#08111f] border-b border-white/5 h-9 overflow-hidden relative">
        <div className="absolute whitespace-nowrap animate-[marquee_24s_linear_infinite] flex items-center h-full">
          <span className="text-[#d4af37]/80 text-[12px] tracking-wide px-4">
            AZ Consultants Collaborates with EMSP in Awarding French University
            Admissions in France. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AZ Consultants
            Collaborates with EMSP in Awarding French University Admissions in
            France. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AZ Consultants Collaborates
            with EMSP in Awarding French University Admissions in France.
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AZ Consultants Collaborates with EMSP
            in Awarding French University Admissions in France.
          </span>
        </div>
      </div>

        {/* ━━━━ STATS ━━━━ */}
        <section className="py-14 px-4"
          style={{ background:"radial-gradient(ellipse at top, rgba(212,175,55,0.06) 0%, transparent 60%), #08111f" }}>
          <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
          </div>
        </section>

        {/* ━━━━ ABOUT ━━━━ */}
        <section className="py-20 px-4 overflow-hidden"
          style={{ background:"linear-gradient(180deg,#08111f 0%,#0c1828 100%)" }}>
          <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-16 items-center">

            <Reveal anim="fadeInLeft">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full border border-[#d4af37]/15 animate-rotate pointer-events-none" />
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                  <img src="mainaz.jpg" alt="AZ Consultations"
                    className="w-full object-cover" style={{ maxHeight:"520px" }}
                    onError={(e) => { e.target.src="https://placehold.co/580x480/0c1828/d4af37?text=AZ+Consultations"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08111f]/60 via-transparent to-transparent" />
                </div>
              </div>
            </Reveal>

            <Reveal anim="fadeInRight">
              <GoldBadge text="About AZ Consultations" />
              <h2 className="font-bold leading-[1.15] mb-7"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.7rem,3vw,2.5rem)" }}>
                Leading Higher Education Consultants for Pakistani Students
                <span className="block gold-shimmer">Studying Abroad</span>
              </h2>
              <div className="space-y-4 text-white/60 text-[14.5px] leading-[1.85]">
                <p>Established in 2020 and headquartered in Paris, France, AZ Consultations is dedicated to helping Pakistani students gain access to world-class universities across Europe — particularly in France. We provide end-to-end support from university selection through to admission, document preparation, and pre-departure guidance.</p>
                <p>Our team understands the unique challenges faced by Pakistani students navigating international admissions. We work closely with each student to identify universities and programs that align with their academic background, career aspirations, and financial situation.</p>
                <p>Based in Paris with a liaison office in Lahore, we are uniquely positioned to bridge the gap between Pakistani students and European higher education.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ━━━━ FOUNDER ━━━━ */}
        {/* <section className="py-20 px-4 overflow-hidden"
          style={{ background:"radial-gradient(ellipse at bottom right, rgba(212,175,55,0.07) 0%, transparent 55%), #0a1220" }}>
          <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-16 items-center">

            <Reveal anim="fadeInLeft" className="flex flex-col gap-5">
              <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <img src="direct.jpeg" alt="Ahmad Jalal Syed"
                  className="w-full object-cover transition-transform duration-600 group-hover:scale-105"
                  onError={(e) => { e.target.src="https://placehold.co/600x420/0c1828/d4af37?text=Ahmad+Jalal+Syed"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08111f]/70 via-transparent to-transparent" />
              </div>
              <a href="/contact"
                className="self-start px-7 py-3 rounded-xl bg-[#d4af37] text-slate-950 text-[14px] font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300">
                Contact Us
              </a>
            </Reveal>

            <Reveal anim="fadeInRight">
              <GoldBadge text="Our Founder" />
              <h2 className="font-bold leading-tight mb-2"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
                Meet our Founder &amp; Education Consultant,
              </h2>
              <h2 className="font-bold leading-tight mb-6 gold-shimmer"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.3rem,2vw,1.9rem)" }}>
                Mr. Ahmad Jalal Syed
              </h2>
              <div className="space-y-4 text-white/60 text-[14.5px] leading-[1.85]">
                <p>Ahmad Jalal Syed is a Paris-based education consultant with extensive firsthand knowledge of the French and European higher education landscape. His personal experience of navigating international admissions drives his commitment to making the same journey seamless for every Pakistani student.</p>
                <p>With offices in both Paris and Lahore, Ahmad brings a dual perspective — understanding both the European university system in depth and the specific needs, strengths, and challenges of Pakistani students.</p>
              </div>

              <div className="mt-7 p-5 rounded-2xl glass border border-white/10">
                <p className="text-white text-[13px] font-semibold mb-3" style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1rem" }}>Contact Ahmad Jalal Syed directly:</p>
                {[
                  "📍 77 Rue du Faubourg Saint-Martin, 75010 Paris, France",
                  "📞 Office: +33 1 83 96 57 23",
                  "📱 Mobile: +33 6 76 90 39 22",
                  "🏢 Offices: Paris & Lahore",
                ].map((l) => (
                  <p key={l} className="text-white/55 text-[13px] leading-7">{l}</p>
                ))}
              </div>

              <a href="/about"
                className="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-xl glass-gold text-[#d4af37] text-[14px] font-semibold hover:brightness-110 transition-all duration-300">
                Read More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </Reveal>
          </div>
        </section> */}

        {/* ━━━━ WHY CHOOSE US ━━━━ */}
        <section className="py-20 px-4 relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,#060f1c 0%,#0e1e35 100%)" }}>
          {/* Decorative rings */}
          <div className="absolute top-8 right-12 w-32 h-32 rounded-full border border-[#d4af37]/10 pointer-events-none animate-rotate" />
          <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full border border-white/5 pointer-events-none animate-rotate-rev" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03] pointer-events-none" />
          {/* radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse at 70% 50%, rgba(212,175,55,0.05) 0%, transparent 60%)" }} />

          <div className="max-w-[1240px] mx-auto">
            <Reveal anim="fadeIn" className="text-center mb-14">
              <GoldBadge text="Why AZ Consultations" />
              <h2 className="font-bold mt-1 mb-4"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.7rem,3vw,2.5rem)" }}>
                Why Choose <span className="gold-shimmer">Us?</span>
              </h2>
              <p className="text-white/50 text-[14px] max-w-[560px] mx-auto leading-relaxed">
                We are not just consultants — we are your partners in one of the most important decisions of your life. Here is what sets us apart.
              </p>
            </Reveal>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-3 gap-6">
              {whyUs.map((item, i) => (
                <Reveal key={item.title} anim="fadeInUp" delay={i * 0.08}>
                  <div className="why-card rounded-2xl p-7 h-full flex flex-col gap-4">
                    {/* icon container */}
                    <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="text-white font-semibold leading-snug"
                      style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.05rem" }}>
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-[13px] leading-relaxed flex-1">{item.desc}</p>
                    {/* bottom gold dot */}
                    <div className="w-6 h-px bg-gradient-to-r from-[#d4af37]/60 to-transparent mt-1" />
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Mobile list */}
            <div className="md:hidden flex flex-col gap-3">
              {whyUs.map((item) => (
                <div key={item.title} className="why-card rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg glass-gold flex-shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-[13px] mb-1"
                      style={{ fontFamily:"Cormorant Garamond, serif" }}>{item.title}</h3>
                    <p className="text-white/50 text-[12px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <Reveal anim="fadeInUp" delay={0.3} className="text-center mt-12">
              <a href="/contact"
                className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-[#d4af37] text-slate-950 text-[14px] font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300 animate-gold-pulse">
                Start Your Journey Today
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ━━━━ PROGRAMS ━━━━ */}
        <section className="py-20 px-4 overflow-hidden"
          style={{ background:"#08111f" }}>
          <div className="max-w-[1240px] mx-auto">
            <Reveal anim="fadeIn" className="text-center mb-12">
              <GoldBadge text="AZ Consultations" />
              <h2 className="font-bold mt-1"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
                Programs We Support
              </h2>
            </Reveal>

            <div className="hidden md:block">
              <Carousel items={programs} cols={3} autoMs={3200} renderItem={(p, i) => (
                <Reveal key={p.title} anim="fadeInUp" delay={i * 0.08}>
                  <a href={p.href}
                    className="card-lift glass rounded-2xl overflow-hidden block">
                    <div className="overflow-hidden" style={{ height:"200px" }}>
                      <img src={p.img} alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 opacity-80"
                        onError={(e) => { e.target.src=`https://placehold.co/400x200/0c1828/d4af37?text=${encodeURIComponent(p.title)}`; }}
                      />
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
                    <div className="p-5">
                      <h3 className="text-white font-semibold text-[14px] mb-2 leading-snug"
                        style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1rem" }}>{p.title}</h3>
                      <span className="text-[#d4af37] text-[12px] font-semibold tracking-wide uppercase">Read More →</span>
                    </div>
                  </a>
                </Reveal>
              )} />
            </div>

            <div className="md:hidden flex flex-col gap-3">
              {programs.map((p) => (
                <a key={p.title} href={p.href}
                  className="flex gap-4 items-center p-3 rounded-xl glass hover:border-[#d4af37]/30 transition-colors">
                  <img src={p.img} alt={p.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 opacity-80"
                    onError={(e) => { e.target.src="https://placehold.co/80x80/0c1828/d4af37?text=P"; }}
                  />
                  <h3 className="text-white font-semibold text-[14px]"
                    style={{ fontFamily:"Cormorant Garamond, serif" }}>{p.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━ SERVICES ━━━━ */}
        <section className="py-20 px-4 relative overflow-hidden"
          style={{ background:"linear-gradient(180deg,#060f1c 0%,#08111f 100%)" }}>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-32 opacity-10 pointer-events-none animate-rotate">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 6"/>
            </svg>
          </div>

          <div className="max-w-[1240px] mx-auto">
            <Reveal anim="fadeIn">
              <GoldBadge text="What We Offer" />
              <h2 className="font-bold mb-2"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
                Our Services
              </h2>
            </Reveal>
            <Reveal anim="fadeIn" delay={0.1} className="mb-12">
              <p className="text-white/50 text-[14px] max-w-[600px] leading-relaxed mt-2">
                Since AZ Consultations understands that studying abroad is a life-changing opportunity, we provide complete, personalised support for every Pakistani student.
              </p>
            </Reveal>

            <div className="hidden md:block">
              <Carousel items={services} cols={3} autoMs={3200} renderItem={(s, i) => (
                <Reveal key={s.title} anim="fadeInUp" delay={i * 0.06}>
                  <div className="service-card rounded-2xl p-6 min-h-[200px] flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-xl glass-gold flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="#d4af37" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-[14px] leading-snug"
                      style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1rem" }}>{s.title}</h3>
                    <p className="text-white/50 text-[13px] leading-relaxed">{s.desc}</p>
                  </div>
                </Reveal>
              )} />
            </div>

            <div className="md:hidden flex flex-col gap-3">
              {services.map((s) => (
                <div key={s.title} className="service-card rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg glass-gold flex-shrink-0 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="#d4af37" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-[13px] mb-1">{s.title}</h3>
                    <p className="text-white/50 text-[12px] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━━ CONTACT STRIP ━━━━ */}
        <section className="py-16 px-4"
          style={{ background:"radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 65%), #08111f" }}>
          <div className="max-w-[1240px] mx-auto">
            <Reveal anim="fadeInUp">
              <div className="relative overflow-hidden rounded-3xl glass border border-[#d4af37]/20 p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

                <div>
                  <GoldBadge text="Get in Touch" />
                  <h2 className="font-bold mt-1 mb-3"
                    style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.4rem,2.4vw,2rem)" }}>
                    Ready to Study in Europe?
                  </h2>
                  <p className="text-white/55 text-[14px] max-w-[500px] leading-relaxed">
                    Contact our Paris or Lahore office today and take the first step toward your international education journey.
                  </p>
                  <div className="mt-5 space-y-1">
                    <p className="text-white/50 text-[13px]">📍 77 Rue du Faubourg Saint-Martin, 75010 Paris, France</p>
                    <p className="text-white/50 text-[13px]">📞 Office: <a href="tel:+33183965723" className="text-[#d4af37] hover:underline">+33 1 83 96 57 23</a></p>
                    <p className="text-white/50 text-[13px]">📱 Mobile: <a href="tel:+33676903922" className="text-[#d4af37] hover:underline">+33 6 76 90 39 22</a></p>
                  </div>
                </div>

                <a href="/contact"
                  className="animate-gold-pulse flex-shrink-0 px-10 py-4 rounded-2xl bg-[#d4af37] text-slate-950 text-[15px] font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300">
                  Contact Us Now
                </a>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </>
  );
}