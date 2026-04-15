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
@keyframes testi-fade  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

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

.org-card {
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(212,175,55,0.12);
  border-radius:16px;
  transition:transform .35s cubic-bezier(.34,1.56,.64,1), border-color .3s, background .3s;
  position:relative; overflow:hidden;
}
.org-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,transparent,#d4af37,transparent);
  transform:scaleX(0); transition:transform .4s ease;
}
.org-card:hover::before { transform:scaleX(1); }
.org-card:hover {
  transform:translateY(-6px);
  background:rgba(212,175,55,0.06);
  border-color:rgba(212,175,55,0.3);
}

.testi-enter { animation: testi-fade .5s ease both; }

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#08111f; }
::-webkit-scrollbar-thumb { background:#d4af37; border-radius:10px; }
`;

/* ─── HOOKS ─── */
function useReveal(threshold = 0.15) {
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

/* ─── SHARED UI ─── */
function GoldBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      <span className="text-[#d4af37] text-[11px] font-semibold tracking-[0.22em] uppercase"
        style={{ fontFamily:"DM Sans, sans-serif" }}>{text}</span>
    </div>
  );
}

function Reveal({ children, anim = "fadeInUp", delay = 0, className = "" }) {
  const [ref, inView] = useReveal();
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

function CheckGold() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="#d4af37" viewBox="0 0 512 512">
      <path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM227 387l184-184c6-6 6-17 0-23l-23-22c-6-7-16-7-22 0L216 308l-70-70c-6-6-17-6-23 0l-22 23c-6 6-6 17 0 22l104 104c6 7 16 7 23 0z"/>
    </svg>
  );
}

/* ─── FLOATING UI ─── */
const SOCIALS = [
  { title:"Facebook",  href:"https://www.facebook.com/azconsultations",    vb:"0 0 512 512", d:"M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" },
  { title:"Twitter",   href:"https://twitter.com/azconsultations",          vb:"0 0 512 512", d:"M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" },
  { title:"LinkedIn",  href:"https://www.linkedin.com/in/ahmad-jalal-syed", vb:"0 0 448 512", d:"M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" },
  { title:"Instagram", href:"https://www.instagram.com/azconsultations/",   vb:"0 0 448 512", d:"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" },
  { title:"YouTube",   href:"https://www.youtube.com/channel/UCh9nP3CXwg6r0acTajGGhiQ", vb:"0 0 576 512", d:"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" },
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
              border:"1px solid rgba(212,175,55,0.25)", transition:"all 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(212,175,55,0.25)"; e.currentTarget.style.width="52px"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(212,175,55,0.12)"; e.currentTarget.style.width="40px"; }}>
            <svg viewBox={s.vb} style={{ width:14, height:14, fill:"#d4af37" }}>
              <path d={s.d} />
            </svg>
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
        <a href="/contact"
          className="animate-gold-pulse"
          style={{
            background:"#d4af37", padding:"10px 16px", color:"#0a0e1a",
            borderRadius:10, fontSize:14, fontWeight:600,
            fontFamily:"DM Sans, sans-serif", display:"block", textDecoration:"none",
          }}>
          Request A Consultation
        </a>
      </div>
      <div style={{ position:"fixed", bottom:25, right:30, zIndex:999 }}>
        <a href="https://api.whatsapp.com/send?phone=33676903922" target="_blank" rel="noreferrer">
          <span className="wa-pulse" style={{
            position:"relative", display:"block",
            width:"1em", height:"1em", fontSize:60, lineHeight:"60px",
            backgroundColor:"#34a94d", borderRadius:".5em",
          }}>
            <svg viewBox="0 0 24 24" style={{ position:"absolute", top:".25em", left:".25em", width:".5em", height:".5em", fill:"#fff" }}>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V20c0 .5-.5 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.5 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z"/>
            </svg>
          </span>
        </a>
      </div>
    </>
  );
}

/* ─── FOOTER CHEVRON ─── */
function ChevronRight() {
  return (
    <svg viewBox="0 0 256 512" style={{ width:8, height:12, fill:"#d4af37", display:"inline-block", marginRight:6, verticalAlign:"middle", flexShrink:0 }}>
      <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/>
    </svg>
  );
}

/* ─── DATA ─── */
const aims = [
  {
    title: "Provide a research platform to high school students",
    body: "Every year we interact with enthusiastic students from Pakistan who are bursting with intellectual curiosity and are eager to contribute to society. Their ideas need not wait for an institutionalized induction into collegiate research. Through E.R.I.A.L., they can channel opinions, observations, and conclusions, in high school itself and get a head start to their journey in academic exploration!",
  },
  {
    title: "Connect them to eminent professors and academicians around the world",
    body: "Research is a collaborative effort between a student and their guide. Hence, AZ Consultations has partnered with a team of eminent scholars, professionals and faculty members from universities in France and the US. E.R.I.A.L. will allow students and professors to connect as mentors and mentees, coordinating between them to endure mutually beneficial interactions.",
  },
  {
    title: "Encourage independent research endeavors with our in-house guidance",
    body: "E.R.I.A.L. does not limit students to working only under the instruction of a supervisor. If the student is confident about their research capabilities, AZ Consultations allows them to work on their chosen topic independently. Of course, they will always find guidance from our team who provide round-the-clock assistance, guide materials, insights and lessons on academic writing, references and citations, and so on.",
  },
  {
    title: "Help students grow in knowledge, learn and build their profile",
    body: "It is our ardent belief that such research work will not only give an adequate boost to students' profiles for college admission, but would also continue to be a remarkable feat within the ambit of their future accomplishments. Therefore, E.R.I.A.L.'s ultimate goal is to help students from Pakistan acquaint themselves with a higher form of learning by inculcating varied research methodologies, citation styles and the specificities of academic writing.",
  },
];

const organisations = [
  {
    title: "Cambridge Centre for International Research",
    subtitle: "Cambridge | Oxford",
    logo: "0cc7df6678759a6f8e49cea0dfdf25aafdcf90577ba6c3d504eb770a734e57f8.jpeg",
    description: "CCIR is a social enterprise, registered at Cambridge, whose overarching mission is to benefit the public by increasing the accessibility of knowledge. In our collaboration with them, we bring students the opportunity to participate in educational programs which are tailored to their higher education needs. For the summer programmes which begin in June 2021, students can select from an array of subject areas from Art History to Data Science! What's more, you can work in close collaboration with Oxbridge researchers and gain college-level experience on topics of global interest and relevance. CCIR offers three modules:",
    modules: [
      { title:"Cambridge Centre for International Research", body:"A highly-selective online research programme designed and taught by top Oxbridge faculty for gifted high school students around the world, it mirrors one semester's worth of material of the undergraduate syllabus at Oxford and Cambridge." },
      { title:"1-on-1 Research Mentorship", body:"A fully-customizable mentorship program where your supervisor will be committed to maintaining the highest academic standards while working directly with you on the research topic of your choice." },
      { title:"1-on-1 The Future Entrepreneur Programme", body:"This is an industry-focused program that will enhance your knowledge as well as your professional skills. Taught by Dr. Tom McClelland, a lecturer at the University of Cambridge. Additionally, it includes a Cambridge AI start-up as your consultant team while helping you publish a Whitepaper that provides unique industry insights." },
    ],
  },
  {
    title: "Lumiere Education",
    subtitle: "Harvard | Yale | Oxford",
    logo: "5c303d343f411ef6ebfa171634805242a8344f9df484e083a927a890e70d26c9.png",
    description: "The Lumiere Research Scholar Program aims to train the next generation of scholars and leaders. Founded by a pair of Harvard alumni, the program is designed to aid talented high school students stand out in an increasingly competitive college admissions process. Along with prospects of conducting an individualized study under the mentorship of researchers from top universities like Harvard, Yale and Oxford, you stand to develop significant critical thinking skills and problem-solving ability. Work with Rhodes Scholars, Stanford PhDs and researchers whose work has been cited in publications like The Economist and BBC. The modules offered by Lumiere are listed below.",
    modules: [
      { title:"Topic-focused Research Program", body:"The topic-focused program helps you understand what research at a top-level university entails as you assist researchers in their area of expertise." },
      { title:"1-on-1 Individual Research Program", body:"Work 1-on-1 with a research mentor to create an independent research paper interest in the topic of your interest." },
      { title:"Premium Research and Publication Program", body:"Write a high-quality research paper and publish research in a prestigious high-school or college-level journal." },
    ],
  },
  {
    title: "Inspirit AI",
    subtitle: "Stanford | MIT",
    logo: "d3c40f954567b44ded630735b664aa0792742cf307915a35159d4cfdbe4f4abf.png",
    description: "INSPIRIT AI introduces AI Scholars Live Online, a pre-college enrichment program developed by Stanford alumni and graduate students. The program aims to familiarize students with the applications of Artificial Intelligence through live online classes that have global reach. Recognizing that AI is all around us today, this educational journey extends beyond STEM fields, also engaging students who are inclined towards disciplines such as law, economics, healthcare and art. Led by a team built out of Stanford and MIT graduates, the program guides students through a series of lectures and workshops to complete a group project that has an impact on areas of healthcare, transportation, and communication. INSPIRIT AI offers four Social Good Project tracks:",
    modules: [
      { title:"Social Good Project Tracks", body:["AI + Healthcare", "AI + Sustainability", "AI + Mobility", "AI + Ethics"] },
      { title:"", body:"Apart from these established specializations, students are free to avail of the diverse experiences within the mentor pool and conduct applied AI projects in any discipline!" },
    ],
  },
  {
    title: "International Partnership of Education Research and Communication",
    subtitle: "IPERC",
    logo: "f3a05bae4e6364ebdb59e44e3e401e0d538413443ef5d96903c832b6e95c8012.png",
    description: "IPERC (International Partnership for Education Research and Communication) is a non profit organization headquartered in Ohio. As the name suggests, IPERC is partnered with multiple educational institutions such as schools and universities across the globe in the US, UK and Canada. Their aim is to make high quality education affordable to students around the world from the comfort of their homes while providing them opportunity as well as access to high quality places of learning such as EMSP University, University of San Francisco, Nevada, SCAD, Western University among many others. Alongside our above aims IPERC intends to bridge the gap between North American education and education in Pakistan particularly in the research segment. A program like ISTAR for example allows students of diverse academic backgrounds as well as different academic levels to engage in top level research under the guidance of highly renowned faculty from Ivy League institutions such as Harvard, Stanford and NYU.",
    modules: [],
  },
];

const tableData = [
  { name:"Fatima Malik",    paper:"THE DIGITAL PAKISTAN INITIATIVE AS AN ELEARNING SCHEME FOR DISADVANTAGED STUDENTS DURING THE COVID-19 PANDEMIC", status:"Published (IJAR)" },
  { name:"Ali Rehman",      paper:"IMPACT OF COVID-19 ON THE PAKISTANI ECONOMY", status:"Published (IJAR)" },
  { name:"Zara Ahmed",      paper:"PSYCHOLOGICAL EFFECTS OF COLOR ON CHILDRENS CREATIVITY: DO COOL COLORS HAVE STRONGER IMPACT?", status:"" },
  { name:"Hania Siddiqui",  paper:"THE PSYCHOLOGICAL EFFECT OF SOCIAL DISTANCING AMONG ADOLESCENTS IN PAKISTAN", status:"Published (IJAR)" },
  { name:"Omar Qureshi",    paper:"A COMPARATIVE STUDY ON PRISON SYSTEMS: PAKISTAN AND NORWAY", status:"Published (IJAR)" },
  { name:"Sana Tariq",      paper:"SUSTAINABILITY IN THE TEXTILE AND APPAREL INDUSTRY OF PAKISTAN", status:"Published (IJAR)" },
  { name:"Bilal Hassan",    paper:"EUTHANASIA: A STUDY INTO THE ETHICAL AND LEGAL DIMENSIONS", status:"" },
  { name:"Noor Baig",       paper:"BARRIERS TO ACCESS MENSTRUAL HYGIENE IN RURAL PAKISTAN", status:"Published (IJAR)" },
  { name:"Usman Farooq",    paper:"FINANCIAL LITERACY: A COMPARISON BETWEEN THE YOUTH OF PAKISTAN AND FRANCE", status:"" },
  { name:"Ayesha Chaudhry", paper:"IMPACT OF COVID-19 ON THE HOSPITALITY SECTOR: A STUDY INTO THE PLIGHT OF RESTAURANTS IN LAHORE", status:"Published (IJAR)" },
  { name:"Sara Nawaz",      paper:"IMPACT OF COVID-19 PANDEMIC ON MENTAL AND PHYSICAL HEALTH OF FEMALE ATHLETES (11 TO 19 YEARS)", status:"Published (IJAR)" },
  { name:"Hamza Butt",      paper:"THE IMPACT OF INCREASING NUMBER OF EDUCATED BUT UNEMPLOYED WOMEN ON THE PAKISTANI ECONOMY", status:"Published (IJAR)" },
  { name:"Maryam Iqbal",    paper:"IMPACT OF CLIMATE CHANGE ON AGRICULTURAL OUTPUT IN PAKISTAN", status:"Published (IJAR)" },
  { name:"Anas Sheikh",     paper:"SLEEP AND ACADEMIC PERFORMANCE AMONG STUDENTS IN PAKISTAN", status:"Published (IJAR)" },
  { name:"Hira Javed",      paper:"HR POLICIES AND THEIR IMPLEMENTATION IN LEADING CORPORATIONS IN PAKISTAN", status:"Published (IJAR)" },
];

const testimonials = [
  {
    text:"It was very convenient to conduct research under ERIAL and Prof. Ahmad's guidance. They helped me at every step of the process which made it quite easy for me as it was my first time conducting and writing a research paper.",
    name:"Omar Qureshi",
    img:"a3ffc9d50662a5188f2064249b522054261353bed701f6bef666d16779149607.jpeg",
  },
  {
    text:"Working with the ERIAL team was a delight. They helped me give my research article structure and make my analysis concrete. The team also proofread my article and suggested changes which proved to be very valuable and insightful.",
    name:"Fatima Malik",
    img:"24729863fdc372e347b924439bc36378598d4a96fcd7befbf85218fc7ee4a9b3.jpeg",
  },
];

/* ═══════════════════════════════
   SECTIONS
═══════════════════════════════ */

/* ── HERO ── */
function Hero() {
  const [leftRef, leftVis] = useReveal(0.1);
  const [rightRef, rightVis] = useReveal(0.1);
  return (
    <section>
      {/* Banner */}
      <div className="w-full overflow-hidden relative">
        <img src="reesearch.png" alt="Research banner"
          className="w-full object-cover block" style={{ maxHeight:427 }} />
        <div className="absolute inset-0"
          style={{ background:"linear-gradient(to top, #08111f 0%, rgba(8,17,31,0.4) 55%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)" }} />
      </div>

      {/* Hero content */}
      <div className="py-16 px-4 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,#08111f 0%,#0c1828 100%)" }}>
        <div className="absolute top-8 right-12 w-28 h-28 rounded-full border border-[#d4af37]/10 pointer-events-none animate-rotate" />
        <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full border border-white/5 pointer-events-none animate-rotate-rev" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          {/* Left */}
          <div ref={leftRef}
            style={{ opacity: leftVis ? 1 : 0, animation: leftVis ? "fadeInLeft 0.85s cubic-bezier(.16,1,.3,1) both" : "none" }}
            className="flex-1">
            <GoldBadge text="E.R.I.A.L." />
            <h1 className="font-bold leading-snug mb-4"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.7rem,3.5vw,2.8rem)" }}>
              AZ Consultations Research Initiative
              <span className="block gold-shimmer">for Advanced Learning</span>
            </h1>
            <p className="text-white/50 text-sm mb-4" style={{ fontFamily:"DM Sans, sans-serif" }}>
              <span className="text-[#d4af37] font-semibold">Director:</span> Syed Ahmad Jalal &nbsp;|&nbsp;
              <span className="text-[#d4af37] font-semibold">Est. 2020</span>
            </p>
            <p className="text-white/60 text-sm leading-relaxed text-justify" style={{ fontFamily:"DM Sans, sans-serif" }}>
              As one of the best study abroad consultants in Paris with over 5 years of dedicated service, AZ Consultations
              understands the challenges faced by international students from Pakistan. Therefore, we are continuously
              encouraging them to step up to challenges in a manner that imbibes versatility. Taking this approach forward,
              we are now launching the AZ Consultations Research Initiative for Advanced Learning (E.R.I.A.L.). Through
              E.R.I.A.L., AZ Consultations is starting the next phase of its journey in providing a sophisticated range of
              services to our students from Pakistan.
            </p>
          </div>

          {/* Right */}
          <div ref={rightRef}
            style={{ opacity: rightVis ? 1 : 0, animation: rightVis ? "fadeInRight 0.85s cubic-bezier(.16,1,.3,1) both" : "none" }}
            className="flex-1 flex justify-center">
            <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              style={{ border:"1px solid rgba(212,175,55,0.15)" }}>
              <img src="rr.jpeg" alt="Research" className="w-full max-w-md h-auto" />
              <div className="absolute inset-0"
                style={{ background:"linear-gradient(to top, rgba(8,17,31,0.4) 0%, transparent 60%)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── DIRECTOR LETTER ── */
function StudentLetter() {
  const [ref, visible] = useReveal(0.1);
  return (
    <section className="py-14 px-4"
      style={{ background:"radial-gradient(ellipse at top, rgba(212,175,55,0.05) 0%, transparent 55%), #0a1220" }}>
      <div ref={ref} className="max-w-4xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          animation: visible ? "fadeInUp 0.85s cubic-bezier(.16,1,.3,1) both" : "none",
        }}>
        <div className="relative overflow-hidden rounded-2xl p-8 md:p-10"
          style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(212,175,55,0.2)", boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background:"linear-gradient(90deg,transparent,#d4af37,transparent)" }} />
          <GoldBadge text="A Message from Our Director" />
          <p className="text-sm text-white/55 mb-3 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>Dear Student,</p>
          <p className="text-sm text-white/55 mb-5 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Greetings from Paris. Thank you for your interest in studying abroad. We are pleased to offer our professional
            educational consultancy services for students from <strong className="text-white/80">Pakistan</strong> who wish to
            pursue higher education abroad.
          </p>

          <h2 className="font-bold text-[#d4af37] mb-3"
            style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.15rem" }}>Our Services</h2>
          <p className="text-sm text-white/50 mb-4 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
            We provide complete support for your admission process, including:
          </p>

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
                    <li key={i} className="flex gap-2 text-sm text-white/50 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
                      <CheckGold /><span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="h-px w-full mb-5"
            style={{ background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.25),transparent)" }} />

          <h2 className="font-bold text-[#d4af37] mb-2"
            style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.1rem" }}>Visa Application & Disclaimer</h2>
          <p className="text-sm text-white/50 mb-5 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Please note that we do not sell, arrange, or guarantee visas. Our responsibility is limited to preparing your
            academic and admission file according to university requirements and Embassy standards. Our service covers
            university search, admission processing, CV preparation, motivation letter, and complete file preparation.
            Translation fees and insurance costs are not included and must be paid separately by the student.
          </p>

          <h2 className="font-bold text-[#d4af37] mb-2"
            style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.1rem" }}>Our Responsibility</h2>
          <ul className="space-y-2 mb-6">
            {["Finding suitable universities","Securing admission","Preparing your complete academic file (CV, motivation letter, documents)"].map((r,i) => (
              <li key={i} className="flex gap-2 text-sm text-white/50 items-start" style={{ fontFamily:"DM Sans, sans-serif" }}>
                <CheckGold /><span>{r}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/5 pt-5">
            <p className="text-sm text-white/45" style={{ fontFamily:"DM Sans, sans-serif" }}>Kind regards,</p>
            <p className="font-bold text-[#d4af37] mt-1"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.05rem" }}>Ahmad Jalal Syed</p>
            <p className="text-xs text-white/35" style={{ fontFamily:"DM Sans, sans-serif" }}>Education Consultant – France</p>
            <p className="text-xs text-white/35" style={{ fontFamily:"DM Sans, sans-serif" }}>Office: Paris / Lahore</p>
            <p className="text-xs text-white/35 mt-1" style={{ fontFamily:"DM Sans, sans-serif" }}>
              Office: +33 1 83 96 57 23 &nbsp;|&nbsp; Mobile: +33 6 76 90 39 22
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── OUR AIM ── */
function OurAim() {
  const [ref, visible] = useReveal();
  return (
    <section className="py-14 px-4"
      style={{ background:"linear-gradient(180deg,#0c1828 0%,#08111f 100%)" }}>
      <div className="max-w-4xl mx-auto" ref={ref}>
        <Reveal anim="fadeInUp">
          <GoldBadge text="Our Mission" />
          <h2 className="font-bold mb-8"
            style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
            Our aim is to:
          </h2>
        </Reveal>
        <div className="space-y-6">
          {aims.map((aim, i) => (
            <div key={i}
              style={{
                opacity: visible ? 1 : 0,
                animation: visible ? `fadeInUp 0.7s cubic-bezier(.16,1,.3,1) ${i * 0.12}s both` : "none",
              }}>
              <div className="org-card p-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckGold />
                  <span className="font-semibold text-white/90 text-sm"
                    style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1rem" }}>{aim.title}</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed text-justify ml-7"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>{aim.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ORG CARD ── */
function OrgCard({ title, subtitle, logo, description, modules }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} className="max-w-4xl mx-auto py-8 px-4"
      style={{
        opacity: visible ? 1 : 0,
        animation: visible ? "fadeInUp 0.85s cubic-bezier(.16,1,.3,1) both" : "none",
      }}>
      <div className="org-card p-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
          {logo && (
            <div className="w-16 h-16 rounded-xl glass-gold flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src={logo} alt={title} className="w-12 h-12 object-contain" />
            </div>
          )}
          <div>
            <h2 className="font-bold text-white/90"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.15rem" }}>{title}</h2>
            {subtitle && (
              <span className="text-[#d4af37] text-xs font-semibold tracking-wider uppercase"
                style={{ fontFamily:"DM Sans, sans-serif" }}>{subtitle}</span>
            )}
          </div>
        </div>

        <p className="text-white/55 text-sm leading-relaxed text-justify mb-5"
          style={{ fontFamily:"DM Sans, sans-serif" }}>{description}</p>

        {modules && modules.length > 0 && (
          <div className="space-y-4">
            {modules.map((mod, i) => (
              <div key={i}>
                {mod.title && (
                  <h3 className="font-semibold text-[#d4af37] mb-1.5"
                    style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"0.95rem" }}>{mod.title}</h3>
                )}
                {mod.body && (
                  Array.isArray(mod.body)
                    ? (
                      <ul className="space-y-1.5 ml-4">
                        {mod.body.map((b, j) => (
                          <li key={j} className="flex gap-2 text-sm text-white/50 items-start"
                            style={{ fontFamily:"DM Sans, sans-serif" }}>
                            <CheckGold /><span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )
                    : (
                      <p className="text-white/50 text-sm leading-relaxed text-justify"
                        style={{ fontFamily:"DM Sans, sans-serif" }}>{mod.body}</p>
                    )
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-white/5">
          <p className="text-sm text-white/50" style={{ fontFamily:"DM Sans, sans-serif" }}>
            <strong className="text-white/70">Interested?{" "}</strong>
            <a href="/contact" className="text-[#d4af37] hover:underline">Click here</a>
            {" "}to schedule an appointment with a counselor to learn more OR email{" "}
            <a href="mailto:azconsultations@gmail.com" className="text-[#d4af37] hover:underline">
              azconsultations@gmail.com
            </a>
            {" "}for queries.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── ORGANISATIONS ── */
function Organisations() {
  const [ref, visible] = useReveal(0.1);
  return (
    <section style={{ background:"radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 60%), #060f1c" }}>
      <div ref={ref} className="max-w-4xl mx-auto pt-14 pb-4 px-4"
        style={{
          opacity: visible ? 1 : 0,
          animation: visible ? "fadeInUp 0.85s cubic-bezier(.16,1,.3,1) both" : "none",
        }}>
        <GoldBadge text="Partner Organisations" />
        <h2 className="font-bold"
          style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.4rem,2.5vw,2rem)" }}>
          E.R.I.A.L. is associated with the following
          <span className="block gold-shimmer">international research organisations</span>
        </h2>
      </div>
      {organisations.map((org, i) => (
        <OrgCard key={i} {...org} />
      ))}
    </section>
  );
}

/* ── RESEARCH TABLE ── */
function ResearchTable() {
  const [ref, visible] = useReveal(0.05);
  return (
    <section className="py-14 px-4 relative overflow-hidden"
      style={{ background:"linear-gradient(135deg,#060f1c 0%,#0e1e35 100%)" }}>
      <div className="absolute top-8 right-12 w-24 h-24 rounded-full border border-[#d4af37]/10 pointer-events-none animate-rotate" />
      <div ref={ref} className="max-w-5xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          animation: visible ? "fadeInUp 0.85s cubic-bezier(.16,1,.3,1) both" : "none",
        }}>
        <div className="text-center mb-8">
          <GoldBadge text="Research Scholars" />
          <h2 className="font-bold"
            style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.4rem,2.5vw,2rem)" }}>
            Research Students Associated with <span className="gold-shimmer">E.R.I.A.L.</span>
          </h2>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          style={{ border:"1px solid rgba(212,175,55,0.15)" }}>
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ background:"rgba(212,175,55,0.12)", borderBottom:"1px solid rgba(212,175,55,0.2)" }}>
                <th className="px-5 py-4 font-semibold text-[#d4af37]"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>Name of The Student</th>
                <th className="px-5 py-4 font-semibold text-[#d4af37]"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>Research Papers</th>
                <th className="px-5 py-4 font-semibold text-[#d4af37] whitespace-nowrap"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>Status of Publication</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}
                  style={{
                    borderBottom:"1px solid rgba(255,255,255,0.04)",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                    transition:"background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(212,175,55,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)"}>
                  <td className="px-5 py-3 text-white/80 font-medium whitespace-nowrap"
                    style={{ fontFamily:"DM Sans, sans-serif" }}>{row.name}</td>
                  <td className="px-5 py-3 text-white/50"
                    style={{ fontFamily:"DM Sans, sans-serif" }}>{row.paper}</td>
                  <td className="px-5 py-3">
                    {row.status
                      ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background:"rgba(212,175,55,0.15)", color:"#d4af37", border:"1px solid rgba(212,175,55,0.3)", fontFamily:"DM Sans, sans-serif" }}>
                          {row.status}
                        </span>
                      : <span className="text-white/25 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const t = setInterval(() => { setCurrent(c => (c + 1) % testimonials.length); setKey(k => k + 1); }, 5000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[current];
  return (
    <section className="py-16 px-4"
      style={{
        background:"radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 65%), #08111f",
        borderTop:"1px solid rgba(212,175,55,0.08)",
      }}>
      <div className="max-w-3xl mx-auto text-center">
        <GoldBadge text="Testimonials" />
        <h2 className="font-bold mb-10"
          style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.5rem,2.5vw,2.2rem)" }}>
          Students' <span className="gold-shimmer">Testimonials</span>
        </h2>
        <div key={key} className="testi-enter rounded-2xl p-8"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(212,175,55,0.15)" }}>
          <p className="text-white/60 text-sm leading-relaxed italic mb-6"
            style={{ fontFamily:"DM Sans, sans-serif" }}>"{t.text}"</p>
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full glass-gold flex items-center justify-center text-[#d4af37] font-bold text-xl overflow-hidden"
              style={{ fontFamily:"Cormorant Garamond, serif" }}>
              {t.img
                ? <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                : t.name[0]
              }
            </div>
            <span className="text-white font-semibold text-sm"
              style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1rem" }}>{t.name}</span>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button key={i}
              onClick={() => { setCurrent(i); setKey(k => k + 1); }}
              style={{
                height:"8px", width: i === current ? "28px" : "8px",
                borderRadius:"4px", border:"none", cursor:"pointer", padding:0,
                background: i === current ? "#d4af37" : "rgba(255,255,255,0.25)",
                transition:"all .35s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  const footerSocials = [
    { href:"https://www.facebook.com/azconsultations/",  vb:"0 0 512 512", d:"M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" },
    { href:"https://www.youtube.com/@azconsultations",   vb:"0 0 576 512", d:"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" },
    { href:"https://www.instagram.com/azconsultations/", vb:"0 0 448 512", d:"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" },
    { href:"https://www.linkedin.com/in/ahmad-jalal-syed/", vb:"0 0 448 512", d:"M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" },
  ];
  return (
    <footer style={{ background:"#060f1c", borderTop:"1px solid rgba(212,175,55,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <a href="/">
            <img src="5e30e28cf2e00ecfa06dad825a441ae8beda87fbcd82c2bb8f69ef0ec2fa097a.png"
              alt="AZ Consultations" style={{ height:70, width:186 }} className="object-contain" />
          </a>
          <p className="text-sm text-white/45 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Established in 2020, AZ Consultations has helped hundreds of students from Pakistan get admitted to reputed universities all over the world.
          </p>
          <div className="flex gap-3 flex-wrap">
            {footerSocials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:brightness-125 transition-all glass-gold">
                <svg viewBox={s.vb} style={{ width:13, height:13, fill:"#d4af37" }}><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>
        {/* Study Abroad */}
        <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Study Abroad</h2>
          <ul className="flex flex-col gap-2.5">
            {[["Study in france","/study-abroad-fr"]
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="text-white/40 text-sm hover:text-[#d4af37] transition-colors flex items-center"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>
                  <ChevronRight />{label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Other Links */}
        {/* <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Other Links</h2>
          <ul className="flex flex-col gap-2.5">
            {[["Scholarships","/scholarships"],["Testimonials","/testimonials"],
              ["Visa Assistance","/visa-assistance"],["Privacy Policy","/privacy-policy"]
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="text-white/40 text-sm hover:text-[#d4af37] transition-colors flex items-center"
                  style={{ fontFamily:"DM Sans, sans-serif" }}>
                  <ChevronRight />{label}
                </a>
              </li>
            ))}
          </ul>
        </div> */}
        {/* Contact */}
        <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]"
            style={{ fontFamily:"DM Sans, sans-serif" }}>Contact Us</h2>
          <ul className="flex flex-col gap-3">
            {[
              { vb:"0 0 384 512", d:"M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z", text:"77 Rue du Faubourg Saint-Martin, 75010 Paris, France" },
              { vb:"0 0 512 512", d:"M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z", text:"+33 1 83 96 57 23", href:"tel:+33183965723" },
              { vb:"0 0 512 512", d:"M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z", text:"+33 6 76 90 39 22", href:"tel:+33676903922" },
              { vb:"0 0 512 512", d:"M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z", text:"azconsultations@gmail.com", href:"mailto:azconsultations@gmail.com" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-white/40 text-sm" style={{ fontFamily:"DM Sans, sans-serif" }}>
                <svg viewBox={item.vb} style={{ width:13, height:13, fill:"#d4af37", marginTop:2, flexShrink:0 }}><path d={item.d} /></svg>
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
          <span className="text-white/25 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Copyright © 2026 AZ consultants
          </span>
          <span className="text-white/25 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Powered by AZ consultants
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT
═══════════════════════════════════════════ */
export default function ResearchPage() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ fontFamily:"DM Sans, sans-serif", background:"#08111f", color:"#e5dcc8" }}>
        <FloatingSocials />
        <FloatingCTAs />
        <Hero />
        {/* <StudentLetter /> */}
        <OurAim />
        {/* <Organisations /> */}
        <ResearchTable />
        {/* <Testimonials /> */}
        <Footer />
      </div>
    </>
  );
}