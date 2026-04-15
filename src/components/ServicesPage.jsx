import { useEffect, useRef, useState } from "react";

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

@keyframes fadeIn {
  from { opacity:0; } to { opacity:1; }
}
@keyframes fadeInUp {
  from { opacity:0; transform:translateY(40px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes fadeInLeft {
  from { opacity:0; transform:translateX(-40px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position:  200% center; }
}
@keyframes goldPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.35); }
  50%     { box-shadow: 0 0 0 14px rgba(212,175,55,0); }
}
@keyframes rotateSlow {
  from { transform:rotate(0deg); } to { transform:rotate(360deg); }
}
@keyframes floatY {
  0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); }
}
@keyframes lineExpand {
  from { transform: scaleX(0); } to { transform: scaleX(1); }
}
@keyframes particleFloat {
  0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
}
@keyframes cardReveal {
  from { opacity:0; transform: translateY(30px) scale(0.97); }
  to   { opacity:1; transform: translateY(0) scale(1); }
}
@keyframes borderGlow {
  0%,100% { border-color: rgba(212,175,55,0.15); }
  50%     { border-color: rgba(212,175,55,0.45); }
}
@keyframes countUp {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes phoneOuter {
  0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52,180,80,0); }
  33%     { transform: scale(1.1); box-shadow: 0 0 0 0 rgba(52,180,80,.4); }
  66%     { transform: scale(1); box-shadow: 0 0 0 12px rgba(52,180,80,0); }
}

.gold-shimmer {
  background: linear-gradient(90deg, #d4af37 0%, #f5e27a 40%, #d4af37 60%, #a07c20 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}
.glass {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.09);
}
.glass-gold {
  background: rgba(212,175,55,0.08);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(212,175,55,0.22);
}
.service-card {
  position: relative;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  transition: transform .4s cubic-bezier(.34,1.56,.64,1), background .3s ease, border-color .3s, box-shadow .3s;
}
.service-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform .4s ease;
}
.service-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top left, rgba(212,175,55,0.07) 0%, transparent 60%);
  opacity: 0;
  transition: opacity .4s ease;
}
.service-card:hover::before { transform: scaleX(1); }
.service-card:hover::after  { opacity: 1; }
.service-card:hover {
  transform: translateY(-10px) scale(1.02);
  background: rgba(212,175,55,0.06);
  border-color: rgba(212,175,55,0.28);
  box-shadow: 0 24px 60px rgba(0,0,0,.5), 0 0 40px rgba(212,175,55,0.06);
}
.icon-box {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: rgba(212,175,55,0.1);
  border: 1px solid rgba(212,175,55,0.22);
  display: flex; align-items: center; justify-content: center;
  transition: background .3s, transform .3s;
  position: relative;
  z-index: 1;
}
.service-card:hover .icon-box {
  background: rgba(212,175,55,0.18);
  transform: rotate(-5deg) scale(1.1);
}
.swiper-btn {
  width:40px; height:40px; border-radius:50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  transition: background .25s, border-color .25s, transform .25s;
  backdrop-filter: blur(8px);
}
.swiper-btn:hover:not(:disabled) {
  background: rgba(212,175,55,0.18);
  border-color: rgba(212,175,55,0.5);
  transform: scale(1.08);
}
.swiper-btn:disabled { opacity:.2; cursor:default; }

.hero-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(212,175,55,0.4);
  animation: particleFloat 4s ease-in-out infinite;
}
.footer-link:hover { color: #d4af37 !important; padding-left: 6px !important; }
.footer-link { transition: color .25s ease, padding-left .25s ease; }
.social-icon {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center;
  color: white; transition: background .25s, border-color .25s, transform .25s;
}
.social-icon:hover {
  background: rgba(212,175,55,0.18);
  border-color: rgba(212,175,55,0.5);
  transform: translateY(-3px);
}
.whatsapp-btn { animation: phoneOuter 3s ease-in-out infinite; }

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#0a0e1a; }
::-webkit-scrollbar-thumb { background:#d4af37; border-radius:10px; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const services = [
  { title: "One-on-one Counselling",        desc: "Personalised guidance for Pakistani students based on their academic background, career goals, and budget to find the right path abroad.", icon: "🎯" },
  { title: "University & Program Selection", desc: "We identify suitable universities and study programs in France and Europe based on your profile and budget.", icon: "🏛️" },
  { title: "CV Preparation",                desc: "Professional CV prepared according to French and European academic standards to maximise your chances of admission.", icon: "📄" },
  { title: "Motivation Letter Writing",     desc: "Compelling, professionally written Letter of Motivation tailored to your chosen university and program.", icon: "✍️" },
  { title: "Admission Processing",          desc: "We apply to universities on your behalf and secure your admission, providing the official Admission Letter and all related documents.", icon: "🎓" },
  { title: "Document Preparation",          desc: "Complete preparation and organisation of your academic file in accordance with university and Embassy requirements.", icon: "📋" },
  { title: "Document Translation",          desc: "Translation of your academic documents into French or other required languages.", icon: "🌐" },
  { title: "Campus France Interview Prep",  desc: "Structured guidance and mock sessions to prepare you for the Campus France interview process.", icon: "🎤" },
  { title: "Visa Interview Preparation",    desc: "Comprehensive coaching for the French Embassy visa interview — questions, documentation, and confidence building.", icon: "🛂" },
  { title: "Pre-Departure Counselling",     desc: "Practical sessions on life in France — accommodation, banking, transport, culture, and student life.", icon: "✈️" },
  { title: "Scholarship Guidance",          desc: "Information on available scholarships and funding options for Pakistani students studying in France and Europe.", icon: "💰" },
  { title: "Complete File Management",      desc: "End-to-end management of your application file — from university selection through to admission confirmation.", icon: "🗂️" },
  { title: "Accommodation Assistance",      desc: "Guidance on finding suitable student accommodation in France upon arrival.", icon: "🏠" },
  { title: "Insurance Guidance",            desc: "Advice on student health insurance requirements for France.", icon: "🛡️" },
  { title: "Post-Admission Support",        desc: "Continued assistance after admission — enrolment steps, arrival checklist, and settling into French student life.", icon: "🤝" },
  { title: "Paris Office Support",          desc: "Local support available through our Paris office — convenient in-person consultations for enrolled students.", icon: "🗼" },
];

const studyAbroadLinks = [
  { label: "Study in France",      href: "#" },
  // { label: "Study in UK",          href: "#" },
  // { label: "Study in Germany",     href: "#" },
  // { label: "Study in Canada",      href: "#" },
  // { label: "Study in Australia",   href: "#" },
  // { label: "Study in New Zealand", href: "#" },
];

const otherLinks = [
  { label: "Scholarships",   href: "#" },
  { label: "Testimonials",   href: "#" },
  { label: "Visa Assistance",href: "#" },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
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

// ─── Shared components ────────────────────────────────────────────────────────
function GoldBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      <span className="text-[#d4af37] text-[11px] font-semibold tracking-[0.22em] uppercase"
        style={{ fontFamily: "DM Sans, sans-serif" }}>{text}</span>
    </div>
  );
}

function Reveal({ children, anim = "fadeInUp", delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `${anim} 0.8s cubic-bezier(.16,1,.3,1) ${delay}s both` : "none",
      }}
    >{children}</div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ title, desc, icon, index }) {
  const [ref, inView] = useInView(0.08);
  const col = index % 3;
  const delays = [0, 0.1, 0.2];
  return (
    <div ref={ref}
      className="service-card rounded-2xl p-6 flex flex-col gap-4"
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `cardReveal 0.7s cubic-bezier(.16,1,.3,1) ${delays[col]}s both` : "none",
        minHeight: "220px",
      }}
    >
      {/* Icon */}
      <div className="icon-box">
        <span style={{ fontSize: "22px" }}>{icon}</span>
      </div>

      {/* Gold accent number */}
      <div className="absolute top-4 right-5 text-[11px] font-semibold text-[#d4af37]/30"
        style={{ fontFamily: "Cormorant Garamond, serif" }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-white font-semibold leading-snug"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem" }}>
          {title}
        </h3>
        <p className="text-white/50 text-[13px] leading-relaxed">{desc}</p>
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-8 bg-gradient-to-r from-[#d4af37]/60 to-transparent" />
    </div>
  );
}

// ─── Floating CTA buttons ─────────────────────────────────────────────────────
function FloatingCTAs() {
  return (
    <>
      <div className="fixed bottom-6 left-5 z-50">
        <a href="/contact"
          className="block px-4 py-2.5 rounded-xl text-slate-950 font-semibold text-[13px] hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
          style={{ background: "#d4af37", animation: "goldPulse 2.8s ease-in-out infinite" }}>
          Request A Consultation
        </a>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <a href="https://api.whatsapp.com/send?phone=33652722078" target="_blank" rel="noreferrer">
          <div className="whatsapp-btn w-[58px] h-[58px] rounded-2xl flex items-center justify-center text-white text-[28px] cursor-pointer"
            style={{ background: "#25d366" }}>
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>
      </div>
    </>
  );
}

// ─── Social icons ─────────────────────────────────────────────────────────────
function SocialIcons() {
  const socials = [
    { href: "https://www.facebook.com/EdNetConsultants/", label: "Facebook",
      svg: <svg viewBox="0 0 512 512" className="w-3.5 h-3.5 fill-current"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg> },
    { href: "https://www.instagram.com/ednetconsultants/", label: "Instagram",
      svg: <svg viewBox="0 0 448 512" className="w-3.5 h-3.5 fill-current"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z"/></svg> },
    { href: "https://www.linkedin.com/in/syedahmadjalal/", label: "LinkedIn",
      svg: <svg viewBox="0 0 448 512" className="w-3.5 h-3.5 fill-current"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg> },
    { href: "https://www.youtube.com/channel/UCh9nP3CXwg6r0acTajGGhiQ/", label: "YouTube",
      svg: <svg viewBox="0 0 576 512" className="w-3.5 h-3.5 fill-current"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg> },
  ];
  return (
    <div className="flex gap-2.5">
      {socials.map((s) => (
        <a key={s.href} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="social-icon">
          {s.svg}
        </a>
      ))}
    </div>
  );
}

// ─── Footer link ──────────────────────────────────────────────────────────────
function FooterLink({ href, label }) {
  return (
    <li className="flex items-center gap-2">
      <span className="text-[#d4af37]/50 text-[10px]">▶</span>
      <a href={href} className="footer-link text-white/60 text-[13px]">{label}</a>
    </li>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ fontFamily: "DM Sans, sans-serif", background: "#08111f" }} className="text-white min-h-screen">

        <FloatingCTAs />

        {/* ── Hero Banner ── */}
        <section className="relative w-full overflow-hidden py-24 px-4"
          style={{ background: "linear-gradient(135deg, #060f1c 0%, #0e1e35 60%, #08111f 100%)" }}>

          {/* Decorative rings */}
          <div className="absolute top-8 right-16 w-36 h-36 rounded-full border border-[#d4af37]/10 pointer-events-none"
            style={{ animation: "rotateSlow 18s linear infinite" }} />
          <div className="absolute bottom-8 left-12 w-20 h-20 rounded-full border border-white/5 pointer-events-none"
            style={{ animation: "rotateSlow 14s linear infinite reverse" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03] pointer-events-none" />

          {/* Floating particles */}
          {[
            { top: "15%", left: "8%",  w: 6,  delay: "0s" },
            { top: "70%", left: "5%",  w: 4,  delay: "1s" },
            { top: "30%", right: "8%", w: 5,  delay: "2s" },
            { top: "80%", right: "6%", w: 3,  delay: "0.5s" },
          ].map((p, i) => (
            <div key={i} className="hero-particle absolute"
              style={{ top: p.top, left: p.left, right: p.right, width: p.w, height: p.w, animationDelay: p.delay }} />
          ))}

          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

          <div className="max-w-[860px] mx-auto text-center relative">
            <Reveal anim="fadeIn">
              <GoldBadge text="AZ Consultations · Paris" />
            </Reveal>
            <Reveal anim="fadeInUp" delay={0.1}>
              <h1 className="font-bold leading-[1.1] mb-5"
                style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.2rem,5vw,3.6rem)" }}>
                Our <span className="gold-shimmer">Services</span>
              </h1>
            </Reveal>
            <Reveal anim="fadeInUp" delay={0.2}>
              <p className="text-white/60 text-[15px] md:text-[16px] leading-[1.85] max-w-[680px] mx-auto">
                AZ Consultations understands that studying abroad is a life-changing opportunity. Since 2020, we have been providing professional educational consultancy services to Pakistani students seeking higher education in France and across Europe.
              </p>
            </Reveal>
            <Reveal anim="fadeInUp" delay={0.3} className="mt-8">
              <a href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-slate-950 font-semibold text-[14px] hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
                style={{ background: "#d4af37", animation: "goldPulse 2.8s ease-in-out 1s infinite" }}>
                Start Your Journey
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ── Section intro ── */}
        <section className="py-4 px-4"
          style={{ background: "radial-gradient(ellipse at top, rgba(212,175,55,0.05) 0%, transparent 55%), #08111f" }}>
          <div className="max-w-[1280px] mx-auto">
            <Reveal anim="fadeIn" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pt-8 border-b border-white/[0.06] pb-8">
              <div>
                <GoldBadge text="What We Offer" />
                <h2 className="font-bold mt-1"
                  style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.6rem,2.8vw,2.3rem)" }}>
                  Complete Study Abroad Support
                </h2>
              </div>
              <p className="text-white/45 text-[13.5px] max-w-[380px] leading-relaxed">
                Every Pakistani student receives personalised, end-to-end support — from the first consultation to settling into life in Europe.
              </p>
            </Reveal>

            {/* ── Services Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
              {services.map((s, i) => (
                <ServiceCard key={s.title} {...s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Strip ── */}
        <section className="py-16 px-4"
          style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 65%), #060f1c" }}>
          <div className="max-w-[1280px] mx-auto">
            <Reveal anim="fadeInUp">
              <div className="relative overflow-hidden rounded-3xl glass border border-[#d4af37]/20 p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
                <div className="absolute bottom-0 right-1/4 w-1/3 h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
                {/* decorative ring */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border border-[#d4af37]/10 pointer-events-none"
                  style={{ animation: "rotateSlow 20s linear infinite" }} />

                <div>
                  <GoldBadge text="Get in Touch" />
                  <h2 className="font-bold mt-1 mb-3"
                    style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.4rem,2.4vw,2rem)" }}>
                    Ready to Study in Europe?
                  </h2>
                  <p className="text-white/55 text-[14px] max-w-[480px] leading-relaxed mb-5">
                    Contact our Paris or Lahore office today and take the first step toward your international education journey.
                  </p>
                  <div className="space-y-1">
                    {[
                      "📍 77 Rue du Faubourg Saint-Martin, 75010 Paris, France",
                      "📞 +33 1 83 96 57 23",
                      "📱 +33 6 76 90 39 22",
                    ].map((l) => (
                      <p key={l} className="text-white/45 text-[13px]">{l}</p>
                    ))}
                  </div>
                </div>
                <a href="/contact"
                  className="flex-shrink-0 px-10 py-4 rounded-2xl text-slate-950 font-semibold text-[15px] hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
                  style={{ background: "#d4af37", animation: "goldPulse 2.8s ease-in-out infinite" }}>
                  Contact Us Now
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="pt-14 pb-8 px-4"
          style={{ background: "linear-gradient(180deg, #060f1c 0%, #04090f 100%)", borderTop: "1px solid rgba(212,175,55,0.12)" }}>
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

              {/* Logo + About */}
              <div>
                <div className="mb-4">
                  <span className="gold-shimmer font-bold text-[1.4rem]"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    AZ Consultations
                  </span>
                  <p className="text-[#d4af37]/60 text-[10px] tracking-[0.2em] uppercase mt-0.5">Paris · Lahore</p>
                </div>
                <p className="text-white/45 text-[13px] leading-relaxed mb-5">
                  Established in 2020, AZ Consultations has helped Pakistani students gain admission to reputed universities in France and across Europe.
                </p>
                <SocialIcons />
              </div>

              {/* Study Abroad */}
              <div>
                <p className="text-white/80 text-[12px] font-semibold tracking-[0.18em] uppercase mb-4">Study Abroad</p>
                <ul className="space-y-2">
                  {studyAbroadLinks.map((l) => <FooterLink key={l.label} {...l} />)}
                </ul>
              </div>

              {/* Other Links */}
              <div>
                <p className="text-white/80 text-[12px] font-semibold tracking-[0.18em] uppercase mb-4">Other Links</p>
                <ul className="space-y-2">
                  {otherLinks.map((l) => <FooterLink key={l.label} {...l} />)}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <p className="text-white/80 text-[12px] font-semibold tracking-[0.18em] uppercase mb-4">Contact Us</p>
                <div className="space-y-3">
                  {[
                    { icon: "📍", text: "77 Rue du Faubourg Saint-Martin, 75010 Paris, France" },
                    { icon: "📞", text: "+33 1 83 96 57 23" },
                    { icon: "📱", text: "+33 6 76 90 39 22" },
                    { icon: "✉️", text: "info@azconsultations.fr" },
                  ].map((c) => (
                    <div key={c.text} className="flex gap-2.5 items-start">
                      <span className="text-[14px] mt-0.5 flex-shrink-0">{c.icon}</span>
                      <span className="text-white/50 text-[13px] leading-relaxed">{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-white/30 text-[12px]">© {new Date().getFullYear()} AZ Consultations. All rights reserved.</p>
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent hidden md:block" />
              <p className="text-white/30 text-[12px]">Paris, France · Lahore, Pakistan</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}