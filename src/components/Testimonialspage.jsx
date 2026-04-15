import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position:  200% center; }
}
@keyframes goldPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.35); }
  50%     { box-shadow: 0 0 0 14px rgba(212,175,55,0); }
}
@keyframes rotateSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes floatY {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-10px); }
}
@keyframes phone-outer {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52,169,73,0), 0 .05em .1em rgba(0,0,0,.2); }
  33%      { transform: scale(1.1); box-shadow: 0 0 0 0 rgba(52,169,73,0.3), 0 .05em .1em rgba(0,0,0,.5); }
  66%      { transform: scale(1); box-shadow: 0 0 0 .5em rgba(52,169,73,0), 0 .05em .1em rgba(0,0,0,.2); }
}
@keyframes phone-icon {
  0%,46%                                           { transform: translate3d(0,0,0); }
  2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42%       { transform: translate3d(.05em,0,0); }
  4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44%       { transform: translate3d(-.05em,0,0); }
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
  background: rgba(212,175,55,0.07);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(212,175,55,0.2);
}
.animate-rotate     { animation: rotateSlow 18s linear infinite; }
.animate-rotate-rev { animation: rotateSlow 22s linear infinite reverse; }
.animate-float      { animation: floatY 4s ease-in-out infinite; }
.animate-gold-pulse { animation: goldPulse 2.8s ease-in-out infinite; }

.wa-btn { animation: 3s infinite phone-outer; }
.wa-btn-icon { animation: 3s infinite phone-icon; }

::-webkit-scrollbar       { width: 6px; }
::-webkit-scrollbar-track { background: #08111f; }
::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    text: "AZ Consultations gave me the clarity and direction I needed to choose the right university and program in France. With Ahmad Jalal sir's guidance, I started a journey of real self-growth and professional development.",
    name: "Fatima Malik",
    title: "Université Paris-Saclay",
    img: "",
  },
  {
    text: "When I first reached out to AZ Consultations, I had no idea how to apply abroad. They changed everything for me — from university selection to visa preparation. I am proud to be one of their success stories.",
    name: "Hassan Raza",
    title: "Sciences Po Paris",
    img: "",
  },
  {
    text: "I always wanted to study in France but was unsure about the process. Ahmad Jalal sir and his team helped me with every step — my CV, motivation letter, and Campus France interview. I strongly recommend AZ Consultations to every Pakistani student dreaming of studying abroad.",
    name: "Ayesha Tariq",
    title: "ESCP Business School, Paris",
    img: "",
  },
  {
    text: "The team at AZ Consultations was incredibly professional and patient. They helped me secure admissions at multiple universities in France and walked me through the entire visa documentation process. Highly recommended!",
    name: "Usman Farooq",
    title: "Université de Strasbourg · Lyon 2 · Bordeaux",
    img: "",
  },
  {
    text: "AZ Consultations helped me find my dream university in France. Ahmad Jalal sir's personal attention and expert advice made the whole process smooth and stress-free.",
    name: "Zara Khalid",
    title: "Institut Polytechnique de Paris",
    img: "",
  },
  {
    text: "As someone working full-time in Lahore who couldn't manage the complexities of applying abroad, AZ Consultations was a lifesaver. Their dedicated team handled everything meticulously and I secured admission from top French universities.",
    name: "Bilal Ahmed",
    title: "Université Paris 1 Panthéon-Sorbonne",
    img: "",
  },
  {
    text: "AZ Consultations has been an absolute game-changer in my journey of applying to universities in France. Ahmad Jalal sir's expertise and dedication have been nothing short of exceptional. I'm now on the path to my dream university.",
    name: "Mehwish Siddiqui",
    title: "",
    img: "",
  },
  {
    text: "AZ Consultations really helped me out in finding the right program for my post-graduate studies in France. The support was professional and thorough.",
    name: "Kamran Yousuf",
    title: "",
    img: "",
  },
  {
    text: "Ahmad Jalal sir guided me through my complete application with full commitment. The motivation letter and CV they prepared for me were excellent. I got through all the universities I applied to!",
    name: "Sana Bashir",
    title: "",
    img: "",
  },
  {
    text: "A HUGE thank you to Ahmad Jalal sir and the entire AZ Consultations team. I got into all 4 universities I applied to, including my top choice in Paris! I would recommend anyone looking to study in France to reach out to them without hesitation.",
    name: "Hamza Nawaz",
    title: "",
    img: "",
  },
  {
    text: "AZ Consultations is the best place in Pakistan for students wanting to study in France. Their help is truly commendable — from IELTS and TCF preparation guidance to submission of applications. The consultants are dedicated and promising.",
    name: "Nadia Iqbal",
    title: "",
    img: "",
  },
  {
    text: "AZ Consultations has been a great support. I came without a clear view of my goals, and Ahmad Jalal sir helped me visualize my career and guided me toward the right courses for my future in France.",
    name: "Omer Sheikh",
    title: "Université Grenoble Alpes · Université de Montpellier",
    img: "",
  },
  {
    text: "From the very first call, Ahmad Jalal sir treated me like family and took care of every detail of my application. I do not have words to thank the AZ Consultations team for their invaluable support throughout this process.",
    name: "Rida Hussain",
    title: "Université de Lille",
    img: "",
  },
  {
    text: "AZ Consultations helped me find direction and pursue my goals of studying in France. The professional guidance I received was fantastic and I have learned so much through this journey. 10/10 recommended.",
    name: "Ali Imran",
    title: "",
    img: "",
  },
  {
    text: "The best consultancy for France admissions! Very professional, very responsive, and truly committed to the student's success.",
    name: "Maham Zahid",
    title: "",
    img: "",
  },
  {
    text: "My experience with AZ Consultations has been extraordinary. They assisted me through the entire application process with utmost commitment and professionalism. I am grateful for the impact they had on my journey.",
    name: "Saad Rehman",
    title: "",
    img: "",
  },
  {
    text: "I always wanted to study in Europe but had no idea where to start. AZ Consultations made it simple and achievable. Ahmad Jalal sir's personal guidance and the team's hard work got me into my dream program in France.",
    name: "Hira Qureshi",
    title: "Université Paris-Est Créteil",
    img: "",
  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function GoldBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      <span className="text-[#d4af37] text-[11px] font-semibold tracking-[0.22em] uppercase">
        {text}
      </span>
    </div>
  );
}

function StarRow() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" fill="#d4af37" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Initials avatar
function Avatar({ name }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(name.length - 1) * 13) % 360;
  return (
    <div
      className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white border-2 border-[#d4af37]/40"
      style={{ background: `hsl(${hue},45%,28%)` }}
    >
      {initials}
    </div>
  );
}

// ─── TESTIMONIAL CARD ─────────────────────────────────────────────────────────

function TestimonialCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      className="relative flex flex-col h-full rounded-2xl overflow-hidden group cursor-default"
      style={{
        background: "rgba(255,255,255,0.035)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Top gold line on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
        style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)", transformOrigin: "left" }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle at top right, rgba(212,175,55,0.15), transparent 70%)" }}
      />

      <div className="p-6 flex flex-col h-full gap-4">
        {/* Quote mark */}
        <div
          className="text-[48px] leading-none font-bold select-none"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            background: "linear-gradient(135deg, #d4af37 0%, #a07c20 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: "0.8",
          }}
        >
          &ldquo;
        </div>

        <StarRow />

        {/* Text */}
        <p
          className="text-white/60 text-[13.5px] leading-[1.85] flex-1"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          {item.text}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />

        {/* Author */}
        <div className="flex items-center gap-3">
          <Avatar name={item.name} />
          <div>
            <span
              className="block font-semibold text-[#d4af37] text-sm"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
            >
              {item.name}
            </span>
            {item.title && (
              <span
                className="block text-white/40 text-[11.5px] mt-0.5"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {item.title}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CAROUSEL ─────────────────────────────────────────────────────────────────

const CARDS_PER_VIEW = 2;

function TestimonialCarousel({ items }) {
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  const totalPages = Math.ceil(items.length / CARDS_PER_VIEW);

  useEffect(() => {
    if (isPaused || !inView) return;
    const t = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(t);
  }, [isPaused, inView, totalPages]);

  const visibleItems = items.slice(page * CARDS_PER_VIEW, page * CARDS_PER_VIEW + CARDS_PER_VIEW);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="wait">
          {visibleItems.map((item, i) => (
            <TestimonialCard key={`${page}-${i}`} item={item} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        {/* Prev */}
        <motion.button
          onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 1000 1000">
            <path d="M646 125C629 125 613 133 604 142L308 442C296 454 292 471 292 487 292 504 296 521 308 533L604 854C617 867 629 875 646 875 663 875 679 871 692 858 704 846 713 829 713 812 713 796 708 779 692 767L438 487 692 225C700 217 708 204 708 187 708 171 704 154 692 142 675 129 663 125 646 125Z" />
          </svg>
        </motion.button>

        {/* Dots */}
        <div className="flex gap-2 items-center">
          {Array.from({ length: totalPages }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setPage(i)}
              animate={{
                width: i === page ? 28 : 8,
                background: i === page ? "#d4af37" : "rgba(255,255,255,0.2)",
              }}
              transition={{ duration: 0.35 }}
              style={{ height: 8, borderRadius: 4, border: "none", cursor: "pointer", padding: 0 }}
            />
          ))}
        </div>

        {/* Next */}
        <motion.button
          onClick={() => setPage((p) => (p + 1) % totalPages)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 1000 1000">
            <path d="M696 533C708 521 713 504 713 487 713 471 708 454 696 446L400 146C388 133 375 125 354 125 338 125 325 129 313 142 300 154 292 171 292 187 292 204 296 221 308 233L563 492 304 771C292 783 288 800 288 817 288 833 296 850 308 863 321 871 338 875 354 875 371 875 388 867 400 854L696 533Z" />
          </svg>
        </motion.button>
      </div>

      {/* Page indicator */}
      <p
        className="text-center text-white/25 text-[12px] mt-3"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        {page * CARDS_PER_VIEW + 1}–{Math.min((page + 1) * CARDS_PER_VIEW, items.length)} of {items.length} stories
      </p>
    </div>
  );
}

// ─── STATS STRIP ─────────────────────────────────────────────────────────────

const stats = [
  { value: "500+", label: "Students Placed" },
  { value: "50+",  label: "Partner Universities" },
  { value: "100%", label: "Dedication" },
  { value: "M€",   label: "Scholarships Secured", prefix: "Millions" },
];

function StatsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-2xl px-5 py-7 flex flex-col items-center text-center gap-2"
        >
          <span
            className="gold-shimmer font-bold"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.8rem,3vw,2.4rem)" }}
          >
            {s.prefix ? <span className="text-[1.2rem]">Millions €</span> : s.value}
          </span>
          <span
            className="text-white/50 text-[12px] leading-snug"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            {s.label}
          </span>
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mt-1" />
        </motion.div>
      ))}
    </div>
  );
}

// ─── HERO BANNER ─────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: "clamp(300px, 40vw, 520px)",
        backgroundImage:
          "linear-gradient(105deg,rgba(8,17,31,.94) 0%,rgba(8,17,31,.7) 55%,rgba(8,17,31,.35) 100%), url(testimonial.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      {/* Decorative rings */}
      <div className="absolute top-8 right-16 w-28 h-28 rounded-full border border-[#d4af37]/10 pointer-events-none animate-rotate" />
      <div className="absolute bottom-6 left-10 w-16 h-16 rounded-full border border-white/5 pointer-events-none animate-rotate-rev" />

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <GoldBadge text="AZ Consultations · Paris" />
          <h1
            className="text-white font-bold leading-[1.1] mt-2"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
            }}
          >
            Student{" "}
            <span className="gold-shimmer">Success Stories</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/55 mt-4 text-[15px] max-w-lg mx-auto leading-relaxed"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Hundreds of Pakistani students have transformed their futures through AZ Consultations. Read their journeys.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div id="testimonials"
        className="text-white min-h-screen"
        style={{ fontFamily: "DM Sans, sans-serif", background: "#08111f" }}
      >
        {/* ━━━━ HERO ━━━━ */}
        <HeroBanner />

        {/* ━━━━ STATS ━━━━ */}
        <section
          className="py-14 px-4"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(212,175,55,0.06) 0%, transparent 60%), #08111f",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <StatsStrip />
          </div>
        </section>

        {/* ━━━━ TESTIMONIALS ━━━━ */}
        <section
          ref={sectionRef}
          className="py-20 px-4 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #060f1c 0%, #0c1828 50%, #08111f 100%)",
          }}
        >
          {/* Decorative background rings */}
          <div className="absolute top-12 right-10 w-40 h-40 rounded-full border border-[#d4af37]/8 pointer-events-none animate-rotate" />
          <div className="absolute bottom-16 left-8 w-24 h-24 rounded-full border border-white/4 pointer-events-none animate-rotate-rev" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 60%, rgba(212,175,55,0.04) 0%, transparent 55%)",
            }}
          />

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Section heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-14"
            >
              <GoldBadge text="Testimonials" />
              <h2
                className="font-bold mt-1 mb-3"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "clamp(1.9rem,3.5vw,3rem)",
                }}
              >
                What Our{" "}
                <span className="gold-shimmer">Students Say</span>
              </h2>
              <p className="text-white/45 text-[14px] max-w-[500px] mx-auto leading-relaxed">
                Real words from real students who trusted AZ Consultations with one of the most important journeys of their lives.
              </p>
              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={sectionInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="mt-6 mx-auto h-px max-w-xs"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #d4af37, transparent)",
                  transformOrigin: "center",
                }}
              />
            </motion.div>

            {/* Carousel */}
            <TestimonialCarousel items={testimonials} />
          </div>
        </section>

        {/* ━━━━ CTA STRIP ━━━━ */}
        <section
          className="py-16 px-4"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 65%), #08111f",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="relative overflow-hidden rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(18px)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                {/* Top line */}
                <div
                  className="absolute top-0 left-1/4 w-1/2 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
                  }}
                />

                <div>
                  <GoldBadge text="Begin Your Journey" />
                  <h2
                    className="font-bold mt-1 mb-3"
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "clamp(1.4rem,2.4vw,2rem)",
                    }}
                  >
                    Ready to Write Your Own Success Story?
                  </h2>
                  <p className="text-white/50 text-[14px] max-w-[460px] leading-relaxed">
                    Join hundreds of Pakistani students who chose AZ Consultations and are now studying at top European universities.
                  </p>
                  <div className="mt-5 space-y-1">
                    <p className="text-white/45 text-[13px]">📍 77 Rue du Faubourg Saint-Martin, 75010 Paris</p>
                    <p className="text-white/45 text-[13px]">
                      📞 Office:{" "}
                      <a href="tel:+33183965723" className="text-[#d4af37] hover:underline">
                        +33 1 83 96 57 23
                      </a>
                    </p>
                    <p className="text-white/45 text-[13px]">
                      📱 Mobile:{" "}
                      <a href="tel:+33676903922" className="text-[#d4af37] hover:underline">
                        +33 6 76 90 39 22
                      </a>
                    </p>
                  </div>
                </div>

                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.04, brightness: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  className="animate-gold-pulse flex-shrink-0 px-10 py-4 rounded-2xl bg-[#d4af37] text-slate-950 text-[15px] font-semibold transition-all duration-300"
                >
                  Request a Consultation
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ━━━━ FIXED: Request Consultation (bottom-left) ━━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-6 left-5 z-50"
        >
          <a
            href="/contact"
            className="inline-block bg-[#d4af37] text-slate-950 px-4 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all shadow-lg animate-gold-pulse"
          >
            Request A Consultation
          </a>
        </motion.div>

        {/* ━━━━ FIXED: WhatsApp (bottom-right) ━━━━ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
          className="fixed bottom-6 right-8 z-50"
        >
          <a
            href="https://api.whatsapp.com/send?phone=33676903922"
            target="_blank"
            rel="noreferrer"
          >
            <span
              className="wa-btn relative block rounded-[0.5em] text-[60px]"
              style={{
                width: "1em",
                height: "1em",
                background: "#34a94d",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="wa-btn-icon absolute"
                style={{ top: "0.25em", left: "0.25em", width: "0.5em", height: "0.5em" }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </span>
          </a>
        </motion.div>

        {/* ━━━━ FLOATING SOCIAL ICONS (left sidebar) ━━━━ */}
        <motion.ul
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="fixed top-1/2 left-0 -translate-y-1/2 m-0 p-0 z-10 hidden sm:block"
        >
          {[
            {
              href: "https://www.facebook.com/azconsultations",
              icon: (
                <svg viewBox="0 0 320 512" fill="white" className="w-4 h-4">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                </svg>
              ),
            },
            {
              href: "https://twitter.com/azconsultations",
              icon: (
                <svg viewBox="0 0 512 512" fill="white" className="w-4 h-4">
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                </svg>
              ),
            },
            {
              href: "https://www.linkedin.com/in/syedahmadjalal",
              icon: (
                <svg viewBox="0 0 448 512" fill="white" className="w-4 h-4">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 01107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                </svg>
              ),
            },
            {
              href: "https://www.instagram.com/azconsultations",
              icon: (
                <svg viewBox="0 0 448 512" fill="white" className="w-4 h-4">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              ),
            },
          ].map((social, i) => (
            <li key={i} className="list-none">
              <motion.a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <span
                  className="relative block w-10 h-10 mb-[3px] flex items-center justify-center transition-all duration-300"
                  style={{ background: "rgb(0,100,176)" }}
                >
                  <span className="absolute inset-0 flex items-center justify-center">
                    {social.icon}
                  </span>
                </span>
              </motion.a>
            </li>
          ))}
        </motion.ul>
      </div>
    </>
  );
}