import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL CSS (mirrors main page palette + animations) ─── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

@keyframes fadeIn      { from{opacity:0}              to{opacity:1} }
@keyframes fadeInLeft  { from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
@keyframes fadeInRight { from{opacity:0;transform:translateX(50px)}  to{opacity:1;transform:translateX(0)} }
@keyframes fadeInUp    { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
@keyframes shimmer     { from{background-position:-200% center} to{background-position:200% center} }
@keyframes goldPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.35)} 50%{box-shadow:0 0 0 14px rgba(212,175,55,0)} }
@keyframes rotateSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes phone-outer {
  0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(212,175,55,0)}
  33%    {transform:scale(1.08);box-shadow:0 0 0 0 rgba(212,175,55,.3)}
  66%    {transform:scale(1);box-shadow:0 0 0 .5em rgba(212,175,55,0)}
}
@keyframes whatsapp-pulse {
  0%,100%{transform:scale(1)} 33%{transform:scale(1.08)} 66%{transform:scale(1)}
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
.phone-pulse   { animation:phone-outer 3s ease-in-out infinite; }
.wa-pulse      { animation:whatsapp-pulse 3s ease-in-out infinite; }
.animate-gold-pulse { animation:goldPulse 2.8s ease-in-out infinite; }

.why-card {
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.07);
  transition:transform .35s cubic-bezier(.34,1.56,.64,1),background .3s,border-color .3s,box-shadow .3s;
  position:relative;overflow:hidden;
}
.why-card::before {
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,#d4af37,transparent);
  transform:scaleX(0);transition:transform .4s ease;
}
.why-card:hover::before { transform:scaleX(1); }
.why-card:hover {
  transform:translateY(-6px);
  background:rgba(212,175,55,0.07);
  border-color:rgba(212,175,55,0.25);
  box-shadow:0 16px 40px rgba(0,0,0,.4),0 0 30px rgba(212,175,55,.05);
}

.step-card {
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  transition:transform .35s cubic-bezier(.34,1.56,.64,1),background .3s,border-color .3s;
}
.step-card:hover {
  transform:translateY(-8px);
  background:rgba(212,175,55,0.09);
  border-color:rgba(212,175,55,0.3);
}

.accordion-item { border:1px solid rgba(255,255,255,0.08); border-radius:10px; margin-bottom:8px; overflow:hidden; }
.accordion-btn  { width:100%;display:flex;align-items:center;gap:12px;padding:14px 16px;
                  text-align:left;background:transparent;border:none;cursor:pointer;
                  color:#e5dcc8;font-size:13px;font-weight:500;transition:background .2s; }
.accordion-btn:hover { background:rgba(212,175,55,0.06); }
.accordion-body { padding:0 16px 16px;font-size:13px;line-height:1.8;
                  color:rgba(255,255,255,0.55);border-top:1px solid rgba(255,255,255,0.06);padding-top:12px; }

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#08111f; }
::-webkit-scrollbar-thumb { background:#d4af37;border-radius:10px; }
`;

/* ─── HELPERS ─── */
function useInView(threshold = 0.15) {
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

function GoldBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      <span className="text-[#d4af37] text-[11px] font-semibold tracking-[0.22em] uppercase"
        style={{ fontFamily:"DM Sans, sans-serif" }}>{text}</span>
    </div>
  );
}

function CheckGold() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="#d4af37" viewBox="0 0 512 512">
      <path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM227 387l184-184c6-6 6-17 0-23l-23-22c-6-7-16-7-22 0L216 308l-70-70c-6-6-17-6-23 0l-22 23c-6 6-6 17 0 22l104 104c6 7 16 7 23 0z"/>
    </svg>
  );
}

/* ─── ACCORDION ─── */
function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-btn" onClick={() => setOpen(!open)}>
        <span className="text-[#d4af37] text-lg flex-shrink-0">{open ? "−" : "+"}</span>
        <span>{title}</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
}

/* ─── TESTIMONIAL CAROUSEL ─── */
const testimonials = [
  {
    text: "I am totally satisfied by the effort made by Syed Ahmad Jalal and his team at AZ Consultations. He took special care and interest in my application process. He is very dedicated in his work. I will be extremely thankful to him as he facilitated my admission to a top university in France.",
    name: "Muhammad Usman",
    title: "",
  },
  {
    text: "Getting admission in France would have not been possible without the unconditional support from AZ Consultations. Their professional guidance is their pillar of strength.",
    name: "Fatima Malik",
    title: "",
  },
  {
    text: "It was a wonderful journey with AZ Consultations, student and counselor work side by side to achieve goals. AZ Consultations is no doubt the most reliable consultancy for Pakistani students aspiring to study in France. The entire team makes sure that work is completed before deadlines. If you are aiming to fulfil your dreams then AZ Consultations is the right place for it!",
    name: "Ali Hassan Siddiqui",
    title: "",
  },
  {
    text: "Universities admitted: Université Paris-Saclay, Sorbonne Université, Université de Lyon, and ESCP Business School, France\n\nMy experience with AZ Consultations was absolutely amazing. I was guided at every step of the way. I always felt comfortable while applying to one of the top universities and I think I have got through the top universities only because of the impeccable professionalism of the consultants at AZ Consultations.",
    name: "Hamza Tariq",
    title: "Business Management",
  },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const timer = useRef(null);
  const go = (i) => {
    setCurrent(i);
    clearInterval(timer.current);
    timer.current = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000);
  };
  useEffect(() => {
    timer.current = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(timer.current);
  }, []);
  const t = testimonials[current];
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="min-h-[180px]">
        <p className="text-white/65 text-sm leading-relaxed mb-6 italic text-left md:text-center whitespace-pre-line"
          style={{ fontFamily:"DM Sans, sans-serif" }}>
          "{t.text}"
        </p>
        <div className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 rounded-full glass-gold flex items-center justify-center text-[#d4af37] font-bold text-xl"
            style={{ fontFamily:"Cormorant Garamond, serif" }}>
            {t.name.charAt(0)}
          </div>
          <p className="font-semibold text-white text-sm mt-1" style={{ fontFamily:"Cormorant Garamond, serif" }}>{t.name}</p>
          {t.title && <p className="text-xs text-white/40">{t.title}</p>}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            style={{
              width: i === current ? "28px" : "8px", height:"8px",
              borderRadius:"4px", border:"none", cursor:"pointer", padding:0,
              background: i === current ? "#d4af37" : "rgba(255,255,255,0.25)",
              transition:"all .35s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── DATA ─── */
const whyFrancePoints = [
  "France is home to some of the world's oldest and most prestigious universities, offering world-class education recognized globally",
  "France is the 4th most popular destination for international students worldwide, hosting over 400,000 international students each year",
  "France is one of the most culturally rich and diverse countries in the world, offering an enriching experience for Pakistani students",
  "Degrees and diplomas from French institutions are among the most widely recognized and sought-after globally, especially in engineering, business, and arts",
  "Tuition fees at French public universities are among the lowest in Europe, making France one of the most affordable study destinations for Pakistani students",
  "Part-time work up to 964 hours per year is allowed when you study in France on a student visa",
  "France invests heavily in research and innovation, consistently ranking among the top countries in scientific publications and academic excellence",
  "The French educational system encourages critical thinking, independent research, and the development of transferable skills valued by global employers",
  "France offers an unparalleled quality of life with its rich cuisine, art, culture, and travel access to over 26 Schengen countries",
  "France is a world leader in aerospace, fashion, luxury goods, nuclear energy, telecommunications, and the pharmaceutical industry.",
];

const processSteps = [
  { num:"01", title:"AZ Consultations Career Assessment", desc:"We help you identify your strengths and goals and come up with tailor-made course and university options, best-suited for your academic background and career aspirations." },
  { num:"02", title:"Expert Counseling", desc:"Our experienced counseling ensures that we find the best universities and programs for you, based on your academic profile, eligibility criteria, and future career goals." },
  { num:"03", title:"Plan of Action / Goal Setting", desc:"A customized plan is crafted by our team for each student, with clear deadlines and requirements for each step of the admission and visa process." },
  { num:"04", title:"Create Your Unique Story", desc:"We work closely with you to craft a compelling Motivation Letter and CV that showcase your aspirations, achievements, and suitability for your chosen program." },
  { num:"05", title:"Application Processing", desc:"Our dedicated team carefully prepares and submits your application, ensuring a complete and accurate file reaches your dream university well within deadlines." },
  { num:"06", title:"Interview Preparation", desc:"We guide you and conduct mock sessions to prepare you for the Campus France interview and embassy visa interview with full confidence." },
  { num:"07", title:"Visa File Preparation", desc:"Documents, translations, insurance, Campus France – Relax! We are with you at every step preparing a complete visa-ready file for the French embassy." },
  { num:"08", title:"Pre-Departure Orientation", desc:"We provide our students with thorough pre-departure guidance to help them prepare for life in France – accommodation, banking, transport, and more." },
];



const faqs = [
  { q:"Are any scholarships / financial aid provided by French universities?", a:"Yes, many French public universities offer scholarships for international students. Additionally, the French government provides Eiffel Excellence Scholarships for outstanding international students at the Master's and PhD level. Some universities also offer partial fee waivers based on academic merit." },
  { q:"Can I work and study in France?", a:"Yes. International students in France are allowed to work up to 964 hours per year (approximately 20 hours per week) alongside their studies. This is a legal right for students holding a valid French student residence permit." },
  { q:"What is Campus France and why is it important for Pakistani students?", a:"Campus France is the official French agency managing higher education admissions for international students. Pakistani students must register through the Campus France platform, attend an interview at the French Institute in Pakistan, and obtain a Campus France clearance before applying for a student visa." },
  { q:"What happens when I arrive in France?", a:"Upon arrival, you must validate your student visa online through the OFII (Office Français de l'Immigration et de l'Intégration) portal within 3 months. You will also need to register with your university, open a French bank account, and arrange your accommodation and health insurance." },
  { q:"What is the duration of an undergraduate program in France and can I apply after Intermediate (FSc/FA)?", a:"Most undergraduate (Licence) programs in France are 3 years. Pakistani students who have completed their Intermediate (12 years of education – FSc, FA, or A-Levels) are generally eligible to apply, subject to the specific university's requirements." },
  { q:"What are the academic session timings and application deadlines?", a:"The French academic year typically begins in September/October. Application deadlines for international students via Campus France vary but generally fall between January and April for the September intake. Some universities also offer a January intake with earlier deadlines." },
  { q:"What language do I need to study in France?", a:"Many programs, especially at Master's level, are offered in English. However, for programs taught in French, you will need to provide proof of French language proficiency (DELF/DALF or TCF). AZ Consultations will guide you on language requirements based on your chosen program." },
  { q:"Will I need to attend a visa interview?", a:"Yes. After obtaining your Campus France clearance and university admission letter, you will attend a visa interview at the French Embassy or Consulate in Pakistan. AZ Consultations provides full guidance and preparation for both the Campus France and visa interviews." },
  { q:"Can I bring my family to France as a student?", a:"Students enrolled in programs of at least one academic year may apply for family reunification after one year of legal residence in France. Spouses and dependent children may be eligible to join under certain conditions." },
  { q:"Can I stay and work in France after completing my studies?", a:"Yes. After completing a Master's degree or higher in France, international graduates can apply for a 'Autorisation Provisoire de Séjour' (APS) — a temporary residence permit of up to 2 years — allowing them to seek employment or start a business in France." },
  { q:"What documents are required for the French student visa application?", a:"Key documents include your university admission letter, Campus France acceptance, valid passport, proof of financial resources, accommodation proof, academic transcripts, language proficiency certificate, and health insurance. AZ Consultations assists in preparing your complete visa file." },
  { q:"How much does it cost to study in France?", a:"Public university tuition fees in France are very low — approximately €170–€380 per year for Licence and Master's programs. Living costs vary by city, with Paris being the most expensive. On average, students budget €800–€1,200 per month for living expenses." },
];

const socialLinks = [
  { href:"https://www.facebook.com/azconsultations",       label:"Facebook",  icon:"f"  },
  { href:"https://twitter.com/azconsultations",            label:"Twitter",   icon:"𝕏"  },
  { href:"https://www.linkedin.com/in/syedahmadjalal",     label:"LinkedIn",  icon:"in" },
  { href:"https://www.instagram.com/azconsultations/",     label:"Instagram", icon:"ig" },
];

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background:"#060f1c", borderTop:"1px solid rgba(212,175,55,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="text-2xl font-bold mb-3 gold-shimmer"
            style={{ fontFamily:"Cormorant Garamond, serif" }}>AZ Consultations</div>
          <p className="text-sm text-white/50 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Established in 2020, AZ Consultations has helped Pakistani students gain admission to reputed universities across France and Europe.
          </p>
          <div className="flex gap-3 mt-5">
            {socialLinks.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="w-9 h-9 glass-gold flex items-center justify-center text-[#d4af37] text-xs font-bold rounded-lg hover:brightness-125 transition-all">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Study Abroad</h4>
          <ul className="space-y-2 text-sm text-white/50" style={{ fontFamily:"DM Sans, sans-serif" }}>
            {["France","United Kingdom","Germany","Belgium"].map(c => (
              <li key={c}><a href="#" className="hover:text-[#d4af37] transition-colors">Study Abroad {c}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Contact</h4>
          <p className="text-sm text-white/50">77 Rue du Faubourg Saint-Martin</p>
          <p className="text-sm text-white/50">75010 Paris, France</p>
          <p className="text-sm text-white/50 mt-1">Office: +33 1 83 96 57 23</p>
          <p className="text-sm text-white/50">Mobile: +33 6 76 90 39 22</p>
          <a href="/contact"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#d4af37] text-slate-950 text-sm font-semibold hover:brightness-110 transition-all animate-gold-pulse"
            style={{ fontFamily:"DM Sans, sans-serif" }}>
            Request A Consultation
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 text-center py-4 text-xs text-white/30"
        style={{ fontFamily:"DM Sans, sans-serif" }}>
        © {new Date().getFullYear()} AZ Consultations. All rights reserved.
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function StudyFrance() {
  return (
    <div style={{ fontFamily:"DM Sans, sans-serif", background:"#08111f", color:"#e5dcc8" }} className="relative">
      <style>{GLOBAL_CSS}</style>

      {/* ── Fixed Social Sidebar ── */}
      <ul className="fixed top-1/2 left-0 -translate-y-1/2 z-50 m-0 p-0 list-none">
        {socialLinks.map(s => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer"
              className="block w-10 h-10 leading-10 text-center text-[#d4af37] text-xs font-bold glass-gold mb-[3px]
                         transition-all duration-500 hover:w-14 hover:brightness-125"
              style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              {s.icon}
            </a>
          </li>
        ))}
      </ul>

      {/* ── Fixed CTA: Consultation ── */}
      <a href="/contact"
        className="phone-pulse fixed bottom-6 left-5 z-[999] text-slate-950 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:brightness-110 transition-all"
        style={{ background:"#d4af37" }}>
        Request A Consultation
      </a>

      {/* ── Fixed CTA: WhatsApp ── */}
      <a href="https://api.whatsapp.com/send?phone=33676903922" target="_blank" rel="noreferrer"
        className="wa-pulse fixed bottom-6 right-8 z-[999] w-[60px] h-[60px] bg-[#34a94d] rounded-xl flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
        aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ══ HERO IMAGE ══ */}
      {/* ══ HERO IMAGE ══ */}
<section className="relative h-[90vh] w-full overflow-hidden">

  {/* Background Image */}
  <img
    src="studyfr.png"
    alt="Study in France"
    className="absolute inset-0 w-full h-210 object-center"
  />

  {/* Dark Overlay */}
  {/* <div className="absolute inset-0 bg-black/50" /> */}

  {/* Gradient Blend */}
  <div className="absolute inset-0 bg-gradient-to-t from-[#08111f] via-transparent to-transparent" />

  {/* Content */}
  {/* <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">

    <h1
      className="text-white font-bold leading-tight"
      style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "clamp(2.5rem, 6vw, 5rem)",
      }}
    >
      Study in <span className="gold-shimmer">France</span>
    </h1>

    <p className="mt-4 text-white/70 max-w-xl text-sm md:text-base">
      A land with prestigious universities and rich academic life
    </p>

    <a
      href="/contact"
      className="mt-6 px-6 py-3 rounded-xl bg-[#d4af37] text-slate-950 font-semibold hover:brightness-110 transition"
    >
      Request A Consultation
    </a>

  </div> */}

</section>

      {/* ══ DIRECTOR LETTER ══ */}
      

      {/* ══ WHY STUDY IN FRANCE ══ */}
      <section className="py-16 overflow-hidden"
        style={{ background:"radial-gradient(ellipse at top, rgba(212,175,55,0.05) 0%, transparent 55%), #0a1220" }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <Reveal anim="fadeInLeft">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full border border-[#d4af37]/15 animate-rotate pointer-events-none" />
              <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                style={{ border:"1px solid rgba(212,175,55,0.15)" }}>
                <img src="/meetingg.png"  alt="Study in France" className="w-full object-cover" />
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(8,17,31,0.5) 0%, transparent 60%)" }} />
              </div>
            </div>
          </Reveal>
          <Reveal anim="fadeInRight" delay={0.1}>
            <GoldBadge text="Why Study in France" />
            <h1 className="font-bold leading-snug mb-4"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.6rem,3vw,2.4rem)" }}>
              Best France Education Consultants for
              <span className="block gold-shimmer">Pakistani Students</span>
            </h1>
            <p className="text-sm text-white/50 mb-5 leading-relaxed">
              What makes studying in France such an appealing prospect for Pakistani students?
            </p>
            <ul className="space-y-3">
              {whyFrancePoints.slice(0, 6).map((point, i) => (
                <li key={i} className="flex gap-2 items-start text-sm text-white/65">
                  <CheckGold /><span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── More Why France points ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <Reveal anim="fadeInUp">
          <ul className="grid md:grid-cols-2 gap-3">
            {whyFrancePoints.slice(6).map((point, i) => (
              <li key={i} className="flex gap-2 items-start text-sm text-white/65">
                <CheckGold /><span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Location & Climate */}
        <Reveal anim="fadeInUp" delay={0.1} className="mt-8 rounded-2xl p-6"
          style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(212,175,55,0.12)" }}>
          <div className="flex gap-2 items-start mb-2">
            <CheckGold />
            <span className="text-sm font-semibold text-[#d4af37]"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"0.95rem" }}>Location</span>
          </div>
          <p className="text-sm text-white/50 mb-5 ml-6 leading-relaxed">
            Western Europe, bordering the Bay of Biscay, English Channel, and Mediterranean Sea, sharing borders with Belgium, Luxembourg, Germany, Switzerland, Italy, Monaco, Andorra, and Spain
          </p>
          <div className="flex gap-2 items-start mb-2">
            <CheckGold />
            <span className="text-sm font-semibold text-[#d4af37]"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"0.95rem" }}>Climate</span>
          </div>
          <p className="text-sm text-white/50 ml-6 leading-relaxed mb-1">Generally temperate; cool winters and mild summers in the north; Mediterranean climate in the south</p>
          <p className="text-sm text-white/50 ml-6 leading-relaxed">
            France has four distinct seasons: spring (March–May); summer (June–August); autumn (September–November); and winter (December–February), offering a pleasant climate for Pakistani students.
          </p>
        </Reveal>
      </section>
      <section className="py-14" style={{ background:"linear-gradient(180deg,#08111f 0%,#0c1828 100%)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Reveal anim="fadeInUp">
            <div className="relative overflow-hidden rounded-2xl p-8 md:p-10"
              style={{
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(212,175,55,0.2)",
                boxShadow:"0 20px 60px rgba(0,0,0,0.4)",
              }}>
              {/* top gold line */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background:"linear-gradient(90deg,transparent,#d4af37,transparent)" }} />

              {/* <GoldBadge text="A Message from Our Director" /> */}
              <p className="text-sm text-white/60 mb-3 leading-relaxed">Dear Student,</p>
              <p className="text-sm font-semibold text-[#d4af37] mb-4"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1rem" }}>Greetings from Paris.</p>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Thank you for your interest in studying abroad. We are pleased to offer our professional educational consultancy services for students from <strong className="text-white/80">Pakistan</strong> who wish to pursue higher education abroad.
              </p>

              <h3 className="text-base font-semibold text-[#d4af37] mb-4"
                style={{ fontFamily:"Cormorant Garamond, serif" }}>Our Services</h3>
              <p className="text-sm text-white/55 mb-4 leading-relaxed">We provide complete support for your admission process, including:</p>

              <div className="space-y-5 mb-6">
                {[
                  { title:"1. University & Program Selection", items:[
                    "We identify suitable universities and study programs (formations) based on your academic background, career goals, and budget.",
                    "University tuition fees depend on the selected formation, university, and city.",
                    "After signing our consultancy contract, we will share full details of available universities, programs, and their respective tuition fees.",
                    "University fees will be paid directly by the student to the university.",
                  ]},
                  { title:"2. Admission Process", items:[
                    "We apply to universities on your behalf.",
                    "We secure your admission and provide the official Admission Letter and all related documents.",
                  ]},
                  { title:"3. Document Preparation", items:[
                    "Preparation of your CV according to French university standards.",
                    "Writing of a professional Letter of Motivation.",
                    "Translation of documents (translation fees are extra and depend on the number and language of documents).",
                  ]},
                  { title:"4. Interview Preparation", items:[
                    "Guidance and preparation for the Campus France and visa interview.",
                  ]},
                ].map(sec => (
                  <div key={sec.title}>
                    <p className="text-sm font-semibold text-white/80 mb-2"
                      style={{ fontFamily:"Cormorant Garamond, serif" }}>{sec.title}</p>
                    <ul className="space-y-1.5 ml-4">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-white/50 leading-relaxed">
                          <CheckGold /><span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="h-px w-full mb-6"
                style={{ background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.25),transparent)" }} />

              <h3 className="text-base font-semibold text-[#d4af37] mb-3"
                style={{ fontFamily:"Cormorant Garamond, serif" }}>Visa Application & Disclaimer</h3>
              <p className="text-sm text-white/55 mb-2 leading-relaxed">
                Please note that we <strong className="text-white/75">do not sell, arrange, or guarantee visas</strong>. Our responsibility is limited to preparing your academic and admission file according to university requirements and Embassy standards.
              </p>
              <p className="text-sm text-white/55 mb-6 leading-relaxed">
                Our service covers university search, admission processing, CV preparation, motivation letter, and complete file preparation. Translation fees and insurance costs are not included and must be paid separately by the student.
              </p>

              <h3 className="text-base font-semibold text-[#d4af37] mb-3"
                style={{ fontFamily:"Cormorant Garamond, serif" }}>Our Responsibility</h3>
              <ul className="space-y-2 mb-6">
                {["Finding suitable universities","Securing admission","Preparing your complete academic file (CV, motivation letter, documents)"].map((r,i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/55 items-start">
                    <CheckGold /><span>{r}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/5 pt-5">
                <p className="text-sm text-white/50">Kind regards,</p>
                <p className="text-base font-bold text-[#d4af37] mt-1"
                  style={{ fontFamily:"Cormorant Garamond, serif" }}>Ahmad Jalal Syed</p>
                <p className="text-xs text-white/35">Education Consultant – France</p>
                <p className="text-xs text-white/35">Office: Paris / Lahore</p>
                <p className="text-xs text-white/35 mt-1">Office: +33 1 83 96 57 23 &nbsp;|&nbsp; Mobile: +33 6 76 90 39 22</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      

      {/* ══ TESTIMONIALS ══ */}
      {/* <section className="py-16"
        style={{ background:"radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 65%), #060f1c",
                 borderTop:"1px solid rgba(212,175,55,0.08)", borderBottom:"1px solid rgba(212,175,55,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal anim="fadeIn">
            <div className="text-center mb-10">
              <GoldBadge text="Testimonials" />
              <h2 className="font-bold mt-1"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
                Our Students' <span className="gold-shimmer">Testimonials</span>
              </h2>
            </div>
          </Reveal>
          <Reveal anim="fadeInUp" delay={0.1}>
            <TestimonialCarousel />
          </Reveal>
        </div>
      </section> */}

      {/* ══ 8-STEP PROCESS ══ */}
      <section className="py-16 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,#060f1c 0%,#0e1e35 100%)" }}>
        <div className="absolute top-8 right-12 w-28 h-28 rounded-full border border-[#d4af37]/10 pointer-events-none animate-rotate" />
        <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full border border-white/5 pointer-events-none animate-rotate-rev" />
        <div className="max-w-6xl mx-auto px-6">
          <Reveal anim="fadeIn" className="text-center mb-12">
            <GoldBadge text="Our Process" />
            <h2 className="font-bold mt-1"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
              Our Tested and Trusted <span className="gold-shimmer">8-Step Process</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, i) => (
              <Reveal key={i} anim="fadeInUp" delay={i * 0.07}>
                <div className="step-card rounded-2xl p-6 h-full">
                  <div className="text-3xl font-bold mb-3 gold-shimmer"
                    style={{ fontFamily:"Cormorant Garamond, serif" }}>
                    {step.num}
                  </div>
                  <h4 className="font-semibold text-white/90 text-sm mb-2 leading-snug"
                    style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"0.95rem" }}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-white/45 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY AZ CONSULTATIONS ══ */}
      
<section className="py-16"
        style={{ background:"linear-gradient(180deg,#0c1828 0%,#08111f 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          <Reveal anim="fadeInLeft">
            <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              style={{ border:"1px solid rgba(212,175,55,0.15)" }}>
              <img src="https://www.mandgworld.com/wp-content/uploads/2023/06/study-in-france.jpg" alt="France" className="w-full object-cover" />
              <div className="absolute inset-0"
                style={{ background:"linear-gradient(to top, rgba(8,17,31,0.6) 0%, transparent 60%)" }} />
            </div>
          </Reveal>
          <Reveal anim="fadeInRight" delay={0.1}>
            <GoldBadge text="Common Questions" />
            <h2 className="font-bold mb-8"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2rem)" }}>
              Frequently Asked Questions
            </h2>
            <div>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} title={faq.q}>
                  {faq.a}
                </AccordionItem>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      {/* ══ CTA STRIP ══ */}
      <section className="py-14 px-4"
        style={{ background:"radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 65%), #060f1c" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal anim="fadeInUp">
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 glass"
              style={{ border:"1px solid rgba(212,175,55,0.2)" }}>
              <div className="absolute top-0 left-1/4 w-1/2 h-px"
                style={{ background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)" }} />
              <div>
                <GoldBadge text="Get in Touch" />
                <h2 className="font-bold mt-1 mb-3"
                  style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.4rem,2.4vw,2rem)" }}>
                  Ready to Study in France?
                </h2>
                <p className="text-white/50 text-sm max-w-[480px] leading-relaxed">
                  Contact our Paris or Lahore office today and take the first step toward your international education journey.
                </p>
                <div className="mt-4 space-y-1">
                  <p className="text-white/45 text-xs">📍 77 Rue du Faubourg Saint-Martin, 75010 Paris, France</p>
                  <p className="text-white/45 text-xs">📞 Office: <a href="tel:+33183965723" className="text-[#d4af37] hover:underline">+33 1 83 96 57 23</a></p>
                  <p className="text-white/45 text-xs">📱 Mobile: <a href="tel:+33676903922" className="text-[#d4af37] hover:underline">+33 6 76 90 39 22</a></p>
                </div>
              </div>
              <a href="/contact"
                className="animate-gold-pulse flex-shrink-0 px-9 py-4 rounded-2xl text-slate-950 text-sm font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
                style={{ background:"#d4af37", fontFamily:"DM Sans, sans-serif" }}>
                Contact Us Now
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      

      {/* ══ FOOTER ══ */}
      {/* <Footer /> */}
    </div>
  );
}