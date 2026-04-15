import { useState, useEffect, useRef } from "react";

// ─── Check Circle SVG ───────────────────────────────────────────────
const CheckCircle = () => (
  <svg aria-hidden="true" className="w-5 h-5 text-[#0064b0] flex-shrink-0 mt-0.5" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" fill="currentColor"/>
  </svg>
);

// ─── Plus/Minus SVGs ─────────────────────────────────────────────────
const PlusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" fill="currentColor"/>
  </svg>
);
const MinusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" fill="currentColor"/>
  </svg>
);

// ─── useInView hook ───────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated section wrapper ────────────────────────────────────────
function FadeInUp({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Accordion Item ───────────────────────────────────────────────────
function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#282828] font-medium hover:bg-gray-50 transition-colors"
      >
        <span className="text-[#0064b0] flex-shrink-0">{open ? <MinusIcon /> : <PlusIcon />}</span>
        <span className="text-sm">{title}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 pb-4 pt-1 text-sm text-[#282828] text-justify leading-relaxed border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Testimonial Carousel ─────────────────────────────────────────────
const testimonials = [
  {
    text: "I am totally satisfied by the effort made by Syed Ahmad Jalal and his team at AZ Consultations. He took special care and interest in my application process. He is very dedicated in his work. I will be extremely thankful to him as he facilitated my admission to a top university in France.",
    name: "Muhammad Usman",
    title: "",
    img: null,
  },
  {
    text: "Getting admission in France would have not been possible without the unconditional support from AZ Consultations. Their professional guidance is their pillar of strength.",
    name: "Fatima Malik",
    title: "",
    img: null,
  },
  {
    text: "It was a wonderful journey with AZ Consultations, student and counselor work side by side to achieve goals. AZ Consultations is no doubt the most reliable consultancy for Pakistani students aspiring to study in France. The entire team makes sure that work is completed before deadlines. If you are aiming to fulfil your dreams then AZ Consultations is the right place for it!",
    name: "Ali Hassan Siddiqui",
    title: "",
    img: null,
  },
  {
    text: "Universities admitted: Université Paris-Saclay, Sorbonne Université, Université de Lyon, and ESCP Business School, France\n\nMy experience with AZ Consultations was absolutely amazing. I was guided at every step of the way. I always felt comfortable while applying to one of the top universities and I think I have got through the top universities only because of the impeccable professionalism of the consultants at AZ Consultations.",
    name: "Hamza Tariq",
    title: "Business Management",
    img: null,
  },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => { setCurrent(i); startTimer(); };

  const t = testimonials[current];

  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="min-h-[160px] transition-all duration-500">
        <div className="text-gray-700 text-sm leading-relaxed mb-6 italic text-left md:text-center whitespace-pre-line">
          "{t.text}"
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 rounded-full bg-[#0064b0]/20 flex items-center justify-center text-[#0064b0] font-bold text-xl">
            {t.name.charAt(0)}
          </div>
          <p className="font-semibold text-[#282828] text-sm mt-1">{t.name}</p>
          {t.title && <p className="text-xs text-gray-500">{t.title}</p>}
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-[#0064b0] scale-125" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Why Reasons list ─────────────────────────────────────────────────
const whyCanadaPoints = [
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

// ─── 8-step Process ──────────────────────────────────────────────────
const processSteps = [
  {
    num: "01",
    title: "AZ Consultations Career Assessment",
    desc: "We help you identify your strengths and goals and come up with tailor-made course and university options, best-suited for your academic background and career aspirations.",
  },
  {
    num: "02",
    title: "Expert Counseling",
    desc: "Our experienced counseling ensures that we find the best universities and programs for you, based on your academic profile, eligibility criteria, and future career goals.",
  },
  {
    num: "03",
    title: "Plan of Action / Goal Setting",
    desc: "A customized plan is crafted by our team for each student, with clear deadlines and requirements for each step of the admission and visa process.",
  },
  {
    num: "04",
    title: "Create Your Unique Story",
    desc: "We work closely with you to craft a compelling Motivation Letter and CV that showcase your aspirations, achievements, and suitability for your chosen program.",
  },
  {
    num: "05",
    title: "Application Processing",
    desc: "Our dedicated team carefully prepares and submits your application, ensuring a complete and accurate file reaches your dream university well within deadlines.",
  },
  {
    num: "06",
    title: "Interview Preparation",
    desc: "We guide you and conduct mock sessions to prepare you for the Campus France interview and embassy visa interview with full confidence.",
  },
  {
    num: "07",
    title: "Visa File Preparation",
    desc: "Documents, translations, insurance, Campus France – Relax! We are with you at every step preparing a complete visa-ready file for the French embassy.",
  },
  {
    num: "08",
    title: "Pre-Departure Orientation",
    desc: "We provide our students with thorough pre-departure guidance to help them prepare for life in France – accommodation, banking, transport, and more.",
  },
];

// ─── Why EdNet cards ──────────────────────────────────────────────────
const whyEdnetCards = [
  {
    title: "AZ Consultations Career Assessment",
    desc: "Our expertly designed career assessment helps analyse your academic background, strengths, and goals to identify the right course, university, and city in France best suited for you.",
    icon: "🎯",
  },
  {
    title: "Expert Consultants",
    desc: "Our France-based consultant, Syed Ahmad Jalal, has years of hands-on experience guiding Pakistani students through the French admission and Campus France visa process, with a high success rate.",
    icon: "👨‍🏫",
  },
  {
    title: "Recognized by Pakistani Students",
    desc: "AZ Consultations is trusted by Pakistani students across Lahore, Karachi, Islamabad, and beyond for reliable, transparent, and professional guidance to study in France.",
    icon: "🏆",
  },
  {
    title: "A Passionate and Driven Team",
    desc: "Our team is known for being highly committed to every student's journey. We bring knowledge, dedication, and personal attention to each case — from Lahore to Paris.",
    icon: "💪",
  },
  {
    title: "Higher Acceptance Rates",
    desc: "Our thorough and systematic process — from university shortlisting to motivation letter writing and Campus France preparation — ensures strong applications and high admission success rates.",
    icon: "📈",
  },
  {
    title: "Personalized Attention",
    desc: "Every student is unique. We provide one-on-one personalized guidance tailored to your academic profile, budget, and career goals, ensuring the best possible outcome for your future in France.",
    icon: "🤝",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Are any scholarships / financial aid provided by French universities?",
    a: "Yes, many French public universities offer scholarships for international students. Additionally, the French government provides Eiffel Excellence Scholarships for outstanding international students at the Master's and PhD level. Some universities also offer partial fee waivers based on academic merit.",
  },
  {
    q: "Can I work and study in France?",
    a: "Yes. International students in France are allowed to work up to 964 hours per year (approximately 20 hours per week) alongside their studies. This is a legal right for students holding a valid French student residence permit.",
  },
  {
    q: "What is Campus France and why is it important for Pakistani students?",
    a: "Campus France is the official French agency managing higher education admissions for international students. Pakistani students must register through the Campus France platform, attend an interview at the French Institute in Pakistan, and obtain a Campus France clearance before applying for a student visa.",
  },
  {
    q: "What happens when I arrive in France?",
    a: "Upon arrival, you must validate your student visa online through the OFII (Office Français de l'Immigration et de l'Intégration) portal within 3 months. You will also need to register with your university, open a French bank account, and arrange your accommodation and health insurance.",
  },
  {
    q: "What is the duration of an undergraduate program in France and can I apply after Intermediate (FSc/FA)?",
    a: "Most undergraduate (Licence) programs in France are 3 years. Pakistani students who have completed their Intermediate (12 years of education – FSc, FA, or A-Levels) are generally eligible to apply, subject to the specific university's requirements.",
  },
  {
    q: "What are the academic session timings and application deadlines?",
    a: "The French academic year typically begins in September/October. Application deadlines for international students via Campus France vary but generally fall between January and April for the September intake. Some universities also offer a January intake with earlier deadlines.",
  },
  {
    q: "What language do I need to study in France?",
    a: "Many programs, especially at Master's level, are offered in English. However, for programs taught in French, you will need to provide proof of French language proficiency (DELF/DALF or TCF). AZ Consultations will guide you on language requirements based on your chosen program.",
  },
  {
    q: "Will I need to attend a visa interview?",
    a: "Yes. After obtaining your Campus France clearance and university admission letter, you will attend a visa interview at the French Embassy or Consulate in Pakistan. AZ Consultations provides full guidance and preparation for both the Campus France and visa interviews.",
  },
  {
    q: "Can I bring my family to France as a student?",
    a: "Students enrolled in programs of at least one academic year may apply for family reunification after one year of legal residence in France. Spouses and dependent children may be eligible to join under certain conditions.",
  },
  {
    q: "Can I stay and work in France after completing my studies?",
    a: "Yes. After completing a Master's degree or higher in France, international graduates can apply for a 'Autorisation Provisoire de Séjour' (APS) — a temporary residence permit of up to 2 years — allowing them to seek employment or start a business in France.",
  },
  {
    q: "What documents are required for the French student visa application?",
    a: "Key documents include your university admission letter, Campus France acceptance, valid passport, proof of financial resources, accommodation proof, academic transcripts, language proficiency certificate, and health insurance. AZ Consultations assists in preparing your complete visa file.",
  },
  {
    q: "How much does it cost to study in France?",
    a: "Public university tuition fees in France are very low — approximately €170–€380 per year for Licence and Master's programs. Living costs vary by city, with Paris being the most expensive. On average, students budget €800–€1,200 per month for living expenses.",
  },
];

// ─── Social floating sidebar ──────────────────────────────────────────
const socialLinks = [
  { href: "https://www.facebook.com/azconsultations", label: "Facebook", icon: "f" },
  { href: "https://twitter.com/azconsultations", label: "Twitter", icon: "𝕏" },
  { href: "https://www.linkedin.com/in/syedahmadjalal", label: "LinkedIn", icon: "in" },
  { href: "https://www.instagram.com/azconsultations/", label: "Instagram", icon: "ig" },
];

// ─── Phone CTA animation (matches original keyframes) ────────────────
const PhoneAnimStyle = () => (
  <style>{`
    @keyframes phone-outer {
      0%, 100% { transform: translate3d(0,0,0) scale(1); box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
      33.3333%  { transform: translate3d(0,0,0) scale(1.1); box-shadow: 0 0 0 0 rgba(52,152,219,.3), 0 .05em .1em rgba(0,0,0,.5); }
      66.6666%  { transform: translate3d(0,0,0) scale(1); box-shadow: 0 0 0 .5em rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
    }
    .phone-pulse { animation: phone-outer 3s infinite; }

    @keyframes whatsapp-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52,219,52,0); }
      33.3333%  { transform: scale(1.1); box-shadow: 0 0 0 0 rgba(52,219,52,.3); }
      66.6666%  { transform: scale(1); box-shadow: 0 0 0 .4em rgba(52,219,52,0); }
    }
    .whatsapp-pulse { animation: whatsapp-pulse 3s infinite; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #ebebeb; border-radius: 10px; }
    ::-webkit-scrollbar-thumb { border-radius: 10px; background: #193393; }
  `}</style>
);

// ─── Footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#11346a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-2xl font-bold text-white mb-3">AZ Consultations</div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Established in 2020, AZ Consultations has helped Pakistani students gain admission to reputed universities across France and Europe.
          </p>
          <div className="flex gap-3 mt-4">
            {socialLinks.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-[#0064b0] flex items-center justify-center text-white text-xs font-bold rounded hover:bg-blue-500 transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Study Abroad</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            {["France", "United Kingdom", "Germany", "Belgium"].map(c => (
              <li key={c}><a href="#" className="hover:text-white transition-colors">Study Abroad {c}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
          <p className="text-sm text-gray-300">77 Rue du Faubourg Saint-Martin</p>
          <p className="text-sm text-gray-300">75010 Paris, France</p>
          <p className="text-sm text-gray-300 mt-1">Office: +33 1 83 96 57 23</p>
          <p className="text-sm text-gray-300">Mobile: +33 6 76 90 39 22</p>
          <a href="/contact" className="inline-block mt-3 bg-[#0064b0] text-white text-sm px-4 py-2 rounded hover:bg-blue-500 transition-colors">
            Request A Consultation
          </a>
        </div>
      </div>
      <div className="border-t border-[#193393] text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} AZ Consultations. All rights reserved.
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function StudyFrance() {
  return (
    <div className="font-sans text-[#282828] relative">
      <PhoneAnimStyle />

      {/* ── Fixed Social Sidebar ────────────────────────────────── */}
      <ul className="fixed top-1/2 left-0 -translate-y-1/2 z-50 m-0 p-0 list-none">
        {socialLinks.map(s => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer"
              className="block w-10 h-10 leading-10 text-center text-white text-xs font-bold bg-[#0064b0] mb-[3px]
                         transition-all duration-500 hover:w-14 hover:bg-blue-500 hover:pl-2">
              {s.icon}
            </a>
          </li>
        ))}
      </ul>

      {/* ── Fixed CTA: Phone ────────────────────────────────────── */}
      <a href="/contact"
        className="fixed bottom-6 left-5 z-[999] bg-[#0064b0] text-white text-sm font-medium px-4 py-2.5 rounded phone-pulse shadow-lg hover:bg-blue-600 transition-colors">
        Request A Consultation
      </a>

      {/* ── Fixed CTA: WhatsApp ─────────────────────────────────── */}
      <a href="https://api.whatsapp.com/send?phone=33676903922" target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-8 z-[999] w-[60px] h-[60px] bg-[#34a94d] rounded-lg flex items-center justify-center whatsapp-pulse shadow-lg hover:bg-green-500 transition-colors"
        aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ══════════════════════════════════════════════════════════
          HERO IMAGE
      ══════════════════════════════════════════════════════════ */}
      <div className="w-full overflow-hidden">
        <img
          src="1d94dcf2d80593311dd05f22d0b0db6ef120b5d3ad7f3a0d5a5e64bc62522354.jpeg"
          alt="Study in France"
          className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          DIRECTOR LETTER / INTRO BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#f5f7fa] py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <FadeInUp>
            <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-[#0064b0]">
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">Dear Student,</p>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed font-medium text-[#11346a]">Greetings from Paris.</p>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                Thank you for your interest in studying abroad. We are pleased to offer our professional educational consultancy services for students from <strong>Pakistan</strong> who wish to pursue higher education abroad.
              </p>

              <h3 className="text-base font-semibold text-[#0064b0] mb-4">Our Services</h3>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">We provide complete support for your admission process, including:</p>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-semibold text-[#282828] mb-1">1. University &amp; Program Selection</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>We identify suitable universities and study programs (formations) based on your academic background, career goals, and budget.</li>
                    <li>University tuition fees depend on the selected formation, university, and city.</li>
                    <li>After signing our consultancy contract, we will share full details of available universities, programs, and their respective tuition fees.</li>
                    <li>University fees will be paid directly by the student to the university.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#282828] mb-1">2. Admission Process</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>We apply to universities on your behalf.</li>
                    <li>We secure your admission and provide the official Admission Letter and all related documents.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#282828] mb-1">3. Document Preparation</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Preparation of your CV according to French university standards.</li>
                    <li>Writing of a professional Letter of Motivation.</li>
                    <li>Translation of documents (translation fees are extra and depend on the number and language of documents).</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#282828] mb-1">4. Interview Preparation</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Guidance and preparation for the Campus France and visa interview.</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-base font-semibold text-[#0064b0] mb-3">Visa Application &amp; Disclaimer</h3>
              <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                Please note that we <strong>do not sell, arrange, or guarantee visas</strong>. Our responsibility is limited to preparing your academic and admission file according to university requirements and Embassy standards.
              </p>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                Our service covers university search, admission processing, CV preparation, motivation letter, and complete file preparation. Translation fees and insurance costs are not included and must be paid separately by the student.
              </p>

              <h3 className="text-base font-semibold text-[#0064b0] mb-3">Our Responsibility</h3>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc mb-6">
                <li>Finding suitable universities</li>
                <li>Securing admission</li>
                <li>Preparing your complete academic file (CV, motivation letter, documents)</li>
              </ul>

              <h3 className="text-base font-semibold text-[#0064b0] mb-3">Office Address</h3>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                <strong>AZ Consultations</strong><br />
                77 Rue du Faubourg Saint-Martin, 75010 Paris, France
              </p>

              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                If you wish to begin your application or need further information, please feel free to contact us. We look forward to assisting you in achieving your educational goals in France.
              </p>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-[#282828]">Kind regards,</p>
                <p className="text-sm font-bold text-[#0064b0] mt-1">Ahmad Jalal Syed</p>
                <p className="text-xs text-gray-500">Education Consultant – France</p>
                <p className="text-xs text-gray-500">Office: Paris / Lahore</p>
                <p className="text-xs text-gray-500 mt-1">Office: +33 1 83 96 57 23 &nbsp;|&nbsp; Mobile: +33 6 76 90 39 22</p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HERO CONTENT – title + why canada list
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        {/* Left – flag image area */}
        <FadeInUp>
          <div className="relative flex justify-center">
            <img
              src="1fbb76adf0ffd6c3d69440068ef3b9a56df7e1b172ea30fd50b9b8dae57b29a1.png"
              alt="Canada"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </FadeInUp>

        {/* Right – text */}
        <FadeInUp delay={150}>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#282828] mb-4 leading-snug">
            Best France Education Consultants for Pakistani Students
          </h1>
          <h5 className="text-lg font-semibold text-[#0064b0] mb-2">Why Study in France?</h5>
          <p className="text-sm text-gray-600 mb-4 text-justify">
            What makes studying in France such an appealing prospect for Pakistani students?
          </p>
          <ul className="space-y-2">
            {whyCanadaPoints.slice(0, 6).map((point, i) => (
              <li key={i} className="flex gap-2 items-start text-sm text-[#282828]">
                <CheckCircle />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </FadeInUp>
      </section>

      {/* ── More Why Canada points ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <FadeInUp>
          <ul className="grid md:grid-cols-2 gap-3">
            {whyCanadaPoints.slice(6).map((point, i) => (
              <li key={i} className="flex gap-2 items-start text-sm text-[#282828]">
                <CheckCircle />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </FadeInUp>

        {/* Location & Climate */}
        <FadeInUp delay={100} className="mt-8 bg-gray-50 rounded-lg p-5">
          <div className="flex gap-2 items-start text-sm font-semibold mb-1">
            <CheckCircle />
            <span>Location</span>
          </div>
          <p className="text-sm text-gray-600 mb-4 ml-7">
            Western Europe, bordering the Bay of Biscay, English Channel, and Mediterranean Sea, sharing borders with Belgium, Luxembourg, Germany, Switzerland, Italy, Monaco, Andorra, and Spain
          </p>
          <div className="flex gap-2 items-start text-sm font-semibold mb-1">
            <CheckCircle />
            <span>Climate</span>
          </div>
          <p className="text-sm text-gray-600 ml-7 mb-1">Generally temperate; cool winters and mild summers in the north; Mediterranean climate in the south</p>
          <p className="text-sm text-gray-600 ml-7">
            France has four distinct seasons: spring (March–May); summer (June–August); autumn (September–November); and winter (December–February), offering a pleasant climate for Pakistani students.
          </p>
        </FadeInUp>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CANADA MAP / IMAGE SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#f5f7fa] py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <FadeInUp>
            <div className="relative flex justify-center">
              <img
                src="1fbb76adf0ffd6c3d69440068ef3b9a56df7e1b172ea30fd50b9b8dae57b29a1.png"
                alt="Canada map"
                className="max-w-full h-auto"
              />
            </div>
          </FadeInUp>
          <FadeInUp delay={150}>
            <img
              src="7d9efc478a7cc80df6d4ab152aff4a722a88b465ee36bd7e0ed0a7f45ea47310.png"
              alt="AZ  Canada"
              className="max-w-[176px] mx-auto block mb-4"
            />
            <h5 className="text-xl font-semibold text-[#282828] mb-6">Frequently Asked Questions</h5>
            <div>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} title={faq.q}>
                  <p>{faq.a}</p>
                </AccordionItem>
              ))}
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#11346a] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <FadeInUp>
            <div className="text-center mb-8">
              <h6 className="uppercase text-xs tracking-[0.2em] text-blue-300 mb-2">Testimonials</h6>
              <h5 className="text-xl font-semibold text-white">Our Students' Testimonials</h5>
            </div>
          </FadeInUp>
          <FadeInUp delay={100}>
            <div className="text-white">
              <TestimonialCarousel />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8-STEP PROCESS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeInUp>
            <h5 className="text-xl font-semibold text-[#282828] text-center mb-10">
              Our Tested and Trusted 8-Step Process
            </h5>
          </FadeInUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <FadeInUp key={i} delay={i * 80}>
                <div className="border border-gray-200 rounded-lg p-5 h-full hover:-translate-y-2 transition-transform duration-300 bg-white shadow-sm hover:shadow-md group">
                  <div className="text-3xl font-bold text-[#0064b0] mb-3 group-hover:text-[#11346a] transition-colors">
                    {step.num}
                  </div>
                  <h4 className="font-semibold text-sm text-[#282828] mb-2 leading-snug">{step.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">{step.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHY EDNET
      ══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-[#f5f7fa]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeInUp>
            <h5 className="text-xl font-semibold text-[#282828] text-center mb-10">Why AZ Consultations?</h5>
          </FadeInUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyEdnetCards.map((card, i) => (
              <FadeInUp key={i} delay={i * 80}>
                <div className="bg-white rounded-lg p-6 h-full shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 text-center">
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <h3 className="font-semibold text-[#282828] mb-2 text-sm">{card.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">{card.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}