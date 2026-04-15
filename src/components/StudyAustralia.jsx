import { useState, useEffect, useRef } from "react";

// ── Keyframe animations injected once ──────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@300;400;600&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes phone-outer {
    0%,100% { transform: translate3d(0,0,0) scale(1);   box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
    33.3333% { transform: translate3d(0,0,0) scale(1.1); box-shadow: 0 0 0 0 rgba(52,152,219,.3), 0 .05em .1em rgba(0,0,0,.5); }
    66.6666% { transform: translate3d(0,0,0) scale(1);  box-shadow: 0 0 0 .5em rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
  }
  @keyframes phone-inner {
    0%       { opacity:1; transform:translate3d(0,0,0) scale(0); }
    33.3333% { opacity:1; transform:translate3d(0,0,0) scale(.9); }
    66.6666%,100% { opacity:0; transform:translate3d(0,0,0) scale(0); }
  }
  @keyframes phone-icon {
    0%,46% { transform:translate3d(0,0,0); }
    2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42% { transform:translate3d(.04em,0,0); }
    4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44% { transform:translate3d(-.04em,0,0); }
  }
  .is-animating        { animation: 3s infinite phone-outer; }
  .is-animating::before{ animation: 3s infinite phone-inner; }
  .is-animating::after { animation: 3s infinite phone-icon; }

  .animate-fade-in-up { animation: fadeInUp .7s ease both; }

  .overlay { position: relative; overflow: hidden; }
  .overlay img { transition: transform .5s ease; }
  .overlay:hover img { transform: scale(1.06); }

  .service-card {
    background: #11346a;
    padding: 16px;
    min-height: 180px;
    transition: transform .3s ease, background .3s ease;
  }
  .service-card:hover { transform: translateY(-10px); background: #2958a1; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #ebebeb; border-radius: 10px; }
  ::-webkit-scrollbar-thumb { background: #193393; border-radius: 10px; }

  .check-icon path { fill: #0064b0; }

  .accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height .4s ease, padding .3s ease;
  }
  .accordion-content.open { max-height: 1000px; }

  .testimonial-slide { display: none; }
  .testimonial-slide.active { display: block; }

  .floating-social { position: fixed; top: 50%; left: 0; transform: translateY(-50%); z-index: 9; }

  .cta-phone-btn {
    position: relative; display: block; margin: 0;
    width: 1em; height: 1em; font-size: 60px; line-height: 60px;
    border-radius: .5em;
    box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    transform: translate3d(0,0,0) scale(1);
  }
  .cta-phone-btn::before, .cta-phone-btn::after { position: absolute; content: ""; }
  .cta-phone-btn::before {
    color: #fff; font-size: 34px;
    display: flex; align-items: center; justify-content: center;
    top: 0; left: 0; width: 100%; height: 100%;
  }
  .cta-phone-btn::after {
    top: .25em; left: .25em; width: .5em; height: .5em;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTYuNiAxMC44YzEuNCAyLjggMy44IDUuMSA2LjYgNi42bDIuMi0yLjJjLjMtLjMuNy0uNCAxLS4yIDEuMS40IDIuMy42IDMuNi42LjUgMCAxIC40IDEgMVYyMGMwIC41LS41IDEtMSAxLTkuNCAwLTE3LTcuNi0xNy0xNyAwLS42LjQtMSAxLTFoMy41Yy41IDAgMSAuNCAxIDEgMCAxLjIuMiAyLjUuNiAzLjYuMS40IDAgLjctLjIgMWwtMi4zIDIuMnoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=") 50% 50% / cover no-repeat;
    transform: translate3d(0,0,0);
  }
`;

// ── SVG icons ─────────────────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 check-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>
  </svg>
);

const AngleRightIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0 mt-1" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg" fill="#0064b0">
    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/>
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/>
  </svg>
);

const MinusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/>
  </svg>
);

// ── Scroll-triggered animation hook ───────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Animated card wrapper ──────────────────────────────────────────────────
function AnimatedCard({ children, delay = 0, className = "" }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Accordion item ─────────────────────────────────────────────────────────
function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 mb-2 rounded">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span className="text-[#0064b0] flex-shrink-0">{open ? <MinusIcon /> : <PlusIcon />}</span>
        <span className="text-sm">{title}</span>
      </button>
      <div className={`accordion-content ${open ? "open" : ""}`}>
        <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ── Testimonial Carousel ───────────────────────────────────────────────────
const testimonials = [
  {
    text: "The process of applying to such prestigious universities is hard, but with EdNet, I had a helping hand to guide me through the hardships. The help was extremely personal and individualized. I got answers to all my questions, which made my journey smooth. Niharika ma'am's personal touch to the application and Jaspreet ma'am's constant support made it a beautiful experience for me.",
    name: "Aanchal Bhardwaj",
    img: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/Anchal-Bhardwaj-85x85-1-1.jpeg",
  },
  {
    text: "When I came into EdNet, it changed my life forever, it gave me hope for a better, brighter and hopeful future. The teachers and students are very friendly and made me feel special. I am proud to be a part of EdNet.",
    name: "Ranveer Narula",
    img: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/Ranveer-Narula.png",
  },
  {
    text: "EdNet helped me a lot in finding my dream college.",
    name: "Nischay Agarwal",
    img: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/Nischay-Agarwal.png",
  },
  {
    text: "I always wanted to go to a fashion college but was always unsure about how to go about my portfolio and EdNet really helped me with all of it. My mentor, Samrah ma'am and all the art teachers really helped me to complete my application. I really recommend Ednet if you want to get into top art colleges of the world.",
    name: "Aasmi Bandha",
    img: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/Aasmi-Bandha.png",
  },
];

function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[active];
  return (
    <div className="relative">
      <div className="text-center px-6 py-8">
        <p className="text-gray-700 text-sm leading-relaxed max-h-40 overflow-y-auto mb-6 text-justify">{t.text}</p>
        <div className="flex flex-col items-center gap-2">
          <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full object-cover" onError={(e) => { e.target.src = "https://www.ednetconsultants.com/wp-content/uploads/2024/05/Anchal-Bhardwaj-85x85-1-1.jpeg"; }} />
          <span className="font-semibold text-gray-800 text-sm">{t.name}</span>
        </div>
      </div>
      <div className="flex justify-center gap-2 pb-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${i === active ? "bg-[#0064b0]" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Process step data ──────────────────────────────────────────────────────
const processSteps = [
  { icon: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/career-assessment.png", title: "EdNet's Proprietary Career Assessment Test", desc: "We help you identify your strengths and shortcomings and come up with tailor-made career options, best-suited for you!" },
  { icon: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/expert-counseling.png", title: "Expert Counseling", desc: "Our unbiased and adroit counseling ensures that we find the best universities and courses for you, basis your aptitude, course eligibility criterion, and a scope for the most rewarding experiences." },
  { icon: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/plan-of-action.png", title: "Plan of Action/Goal Setting", desc: "A customized planner is crafted by our team for each student, with deadlines and composition requirements for each step of the application process." },
  { icon: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/create-unique-story.png", title: "Create Your Unique Story", desc: "We work diligently with you to help you realize your career goals. Together, we create a clear roadmap that creatively documents and showcases your aspirations and aptitude." },
  { icon: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/application-processing.png", title: "Application Processing", desc: "Our proficient administration team relentlessly scrutinizes and reviews your application and ensures that a fool proof and accurate application reaches your dream school, well in time!" },
  { icon: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/interview-preparation.png", title: "Interview Preparation", desc: "We'll guide you and put you through a series of Mock Interviews to give you a real taste on how to crack your interviews." },
  { icon: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/visa-guidance.png", title: "Visa Guidance", desc: "Forms, documents, visa, interviews – Relax! We are with you in every way right until you fly off to your dream school." },
  { icon: "https://www.ednetconsultants.com/wp-content/uploads/2024/05/pre-departure.png", title: "Pre-Departure Orientation", desc: "We provide our students with an interactive and thorough pre-departure counselling to familiarize them with what lies ahead." },
];

const whyEdnetCards = [
  { img: "https://www.ednetconsultants.com/wp-content/uploads/2024/04/career-test.png", title: "EdNet Career Aptitude Test", desc: "Our proprietary, expertly constructed Career Test helps analyse your strengths and shortcomings, and recognizes the best career options for you. This self-analysis helps in determining the right course, in the right school, and in the right country." },
  { img: "https://www.ednetconsultants.com/wp-content/uploads/2024/04/expert-counselors.png", title: "Expert Counselors", desc: "Our internationally recognized counselors have over 100 years of combined experience, who have a 100% success rate for more than 2,500 students over the past 15 years." },
  { img: "https://www.ednetconsultants.com/wp-content/uploads/2024/04/goal.png", title: "Goal", desc: "We realize that each student is unique and so is his/her potential, passion, skills, and ambitions. Our target is clear – to lead you to the school best fit for you." },
  { img: "https://www.ednetconsultants.com/wp-content/uploads/2024/04/passionate-team.png", title: "A Passionate and Driven Team", desc: "The team of EdNet is well-known in our industry to be highly passionate and committed towards each student. Our team possesses the best of talent, knowledge, and skill-set." },
  { img: "https://www.ednetconsultants.com/wp-content/uploads/2024/04/higher-acceptance.png", title: "Higher Acceptance Rates", desc: "Our transparent and vigorous procedure involves multiple checkpoints throughout your application session, with quality assurance and guaranteed results." },
  { img: "https://www.ednetconsultants.com/wp-content/uploads/2024/04/personalized.png", title: "Personalized Attention", desc: "When you join the EdNet family, you become a member of our organization. We have garnered an impeccable reputation for providing the finest personalized services." },
];

const reasonsLeft = [
  "Australia ranks third in the list of most popular countries in the world for international students with a University system ranking of 9, and thus study in Australia will put you on the global map immediately.",
  "With 22,000 courses in over 1,100 institutions, Australia offers a plethora of opportunities and options across all streams.",
  "Worried about financial aid? Don't be. The Australian government estimates approximately $200,000,000 for international student scholarships.",
];

const reasonsRight = [
  "Research in Australia is a most coveted option, for it is home to some of the major discoveries of the world, including penicillin, black box, Wi-Fi, IVF technology, and the Cervical Cancer vaccine. Who knows, your innovation could be next!",
  "The Australian education system is recognized worldwide for its quality education, stellar faculty, impressive course curriculum, and diversity in academics. This is why study in Australia is most sought after.",
  "The expenses of living and tuition in Australia are comparatively and conspicuously lower than that of the United Kingdom or the United States. International students can conveniently work part-time as they study.",
  "It is a well-known fact that Australians are the most friendly and cooperative people to be around. With wide, open, and beautiful expanses and warm and welcoming hosts.",
  "Australia Education has grown to be a popular experience amongst international students who look for a home away from home.",
  "As an international student, you would wish to work abroad after investing your resources in international education. Australia is a wonderful place to be in, if you seek good opportunities for work after graduation.",
];

const educationSystemItems = [
  { label: "Primary and secondary schools:", text: "This is equivalent to the 10+2 education in France. Certification at the end of schooling is by continuous assessment within the schools or by a combination of internal assessment and public examinations." },
  { label: "Foundation Studies:", text: "Foundation studies give international students the knowledge and skills necessary for a smooth transition from the learning in their home country to undergraduate studies in Australian universities. Foundation Studies last for one year in duration." },
  { label: "English Language Schools (ELICOS):", text: "These are specifically for students who come to Australia to study English. The Australian system of English language training is known as English Language Intensive Courses for Overseas Students (ELICOS)." },
  { label: "Vocational Education and Training Institutes:", text: "Vocational education and training (VET) gives students practical skills for their careers. TAFE is the largest provider of tertiary education courses in Australia with about 250 institutes and over a million students." },
  { label: "Universities:", text: "There are 40 public universities, two international universities, and one private specialty university in Australia that offer both undergraduate and postgraduate programs across diverse fields." },
];

const universitiesByState = [
  { state: "Australian Capital Territory", unis: [{ name: "Australian National University", url: "https://www.anu.edu.au/" }, { name: "University of Canberra", url: "https://www.canberra.edu.au/" }] },
  { state: "New South Wales", unis: [{ name: "Australian Catholic University", url: "https://www.acu.edu.au/" }, { name: "Charles Sturt University", url: "https://www.csu.edu.au/" }, { name: "Macquarie University", url: "https://www.mq.edu.au/" }, { name: "University of New South Wales", url: "https://www.unsw.edu.au/" }, { name: "University of Sydney", url: "https://www.sydney.edu.au/" }, { name: "University of Technology, Sydney", url: "https://www.uts.edu.au/" }, { name: "University of Wollongong", url: "https://www.uow.edu.au/" }] },
  { state: "Northern Territory", unis: [{ name: "Charles Darwin University", url: "https://www.cdu.edu.au/" }] },
  { state: "Queensland", unis: [{ name: "Bond University", url: "https://bond.edu.au/" }, { name: "Griffith University", url: "https://www.griffith.edu.au" }, { name: "Queensland University of Technology", url: "https://www.qut.edu.au" }, { name: "University of Queensland", url: "https://www.uq.edu.au" }] },
  { state: "South Australia", unis: [{ name: "Flinders University", url: "https://www.flinders.edu.au/" }, { name: "University of Adelaide", url: "https://www.adelaide.edu.au" }, { name: "University of South Australia", url: "https://www.unisa.edu.au" }] },
  { state: "Tasmania", unis: [{ name: "University of Tasmania", url: "https://www.utas.edu.au" }] },
  { state: "Victoria", unis: [{ name: "Deakin University", url: "https://www.deakin.edu.au" }, { name: "La Trobe University", url: "https://www.latrobe.edu.au" }, { name: "Monash University", url: "https://www.monash.edu" }, { name: "University of Melbourne", url: "https://www.unimelb.edu.au" }] },
  { state: "Western Australia", unis: [{ name: "Curtin University", url: "https://www.curtin.edu.au" }, { name: "Murdoch University", url: "https://www.murdoch.edu.au" }, { name: "University of Western Australia", url: "https://www.uwa.edu.au" }] },
];

const faqItems = [
  {
    q: "What is the eligibility criterion for enrolling into an undergraduate or Bachelor level program?",
    a: (<>
      <p className="mb-2">Apart from the English language requirements, there are two points to consider:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>12 year qualification and equivalent:</strong> The Australian Universities recognize a wide range of secondary school certificates including the successful completion of 10+2 in France as a legitimate equivalent.</li>
        <li><strong>Pre-requisite subjects:</strong> Some courses such as Bachelor of Commerce might require pre-requisites of certain subjects like Mathematics.</li>
      </ul>
    </>),
  },
  {
    q: "What is the admission criterion for a Master's Degree in Australia?",
    a: "To apply for a Masters Degree in Australia, you normally need a recognized bachelor's degree or equivalent qualification. Some programs may also require relevant work experience or prerequisite subjects.",
  },
  {
    q: "What are the English language requirements for studying in Australia?",
    a: "Most Australian universities require IELTS (Academic) scores of at least 6.0–6.5 overall, or equivalent TOEFL/PTE scores. Requirements vary by institution and course level.",
  },
  {
    q: "Can international students work while studying in Australia?",
    a: "Yes. International students on a valid student visa can work up to 48 hours per fortnight while their course is in session, and unlimited hours during scheduled course breaks.",
  },
];

// ── Floating Social Icons ─────────────────────────────────────────────────
function FloatingSocial() {
  const links = [
    { icon: "fa-facebook", url: "http://www.facebook.com/ednetconsultants" },
    { icon: "fa-twitter", url: "https://twitter.com/ednetconsultant" },
    { icon: "fa-linkedin", url: "https://in.linkedin.com/in/niharikasondhi" },
    { icon: "fa-instagram", url: "https://www.instagram.com/ednetconsultants/" },
    { icon: "fa-youtube", url: "https://www.youtube.com/channel/ednetconsultants" },
  ];
  return (
    <ul className="floating-social list-none m-0 p-0">
      {links.map((l, i) => (
        <li key={i} className="mb-0.5">
          <a href={l.url} target="_blank" rel="noreferrer"
            className="flex items-center justify-center w-10 h-10 text-white transition-all duration-500 hover:w-12"
            style={{ background: "rgb(0,100,176)", zIndex: 99 }}>
            <i className={`fa ${l.icon}`} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

// ── CTA Buttons ───────────────────────────────────────────────────────────
function CTAButtons() {
  return (
    <>
      {/* Consult CTA — bottom left */}
      <div style={{ position: "fixed", bottom: 25, left: 20, zIndex: 999 }}>
        <a href="/contact" style={{ background: "#0064b0", padding: "10px", color: "#fff", borderRadius: "5px", fontSize: "15px", textDecoration: "none" }}>
          Request A Consultation
        </a>
      </div>
      {/* WhatsApp CTA — bottom right */}
      <div style={{ position: "fixed", bottom: 25, right: 30, zIndex: 999 }}>
        <a href="https://api.whatsapp.com/send?phone=33652722078" target="_blank" rel="noreferrer">
          <i className="cta-phone-btn is-animating" style={{ background: "#34a94d", display: "block", width: "1em", height: "1em", fontSize: "60px", lineHeight: "60px", borderRadius: ".5em" }} />
        </a>
      </div>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function StudyAustralia() {
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <FloatingSocial />
      <CTAButtons />

      <div className="font-serif text-gray-800" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>

        {/* ── Hero Banner Image ─────────────────────────────────────────── */}
        <div className="w-full">
          <img
            src="aus.png"
            alt="Study in Australia"
            className="w-full object-cover"
            style={{ maxHeight: 420 }}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1400&q=80"; }}
          />
        </div>

        {/* ── Intro Section ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
          {/* Left: image */}
          <div className="relative overflow-hidden rounded">
            <img
              src="https://www.ednetconsultants.com/wp-content/uploads/2024/07/Untitled-design-3.jpg"
              alt="Australia"
              className="w-full h-72 object-cover rounded"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"; }}
            />
          </div>
          {/* Right: text */}
          <div>
            <h6 className="text-[#0064b0] font-semibold uppercase tracking-widest text-xs mb-2">AZ Consultations</h6>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Best Australia Education Consultants in Paris
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed text-justify mb-6">
              Under the guidance of one of the best Australia education consultants in Paris, you can fulfill your higher education aspirations in the down-under. One of the most sought-after educational abodes, the study in Australia experience will provide you with unique and unparalleled opportunities in your professional life.
            </p>
            <h5 className="font-bold text-lg text-gray-800 mb-3">Study in Australia! Here's Why?</h5>
            <ul className="space-y-2">
              {reasonsLeft.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <CheckCircleIcon /><span className="text-justify">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── More Reasons ──────────────────────────────────────────────── */}
        <div className="bg-gray-50 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="space-y-3">
              {reasonsRight.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <CheckCircleIcon /><span className="text-justify">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Education System ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="overlay rounded overflow-hidden">
              <img
                src="https://www.ednetconsultants.com/wp-content/uploads/2024/05/20.png"
                alt="Education System"
                className="w-full object-contain rounded"
                style={{ maxHeight: 360 }}
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"; }}
              />
            </div>
          </div>
          <div>
            <h6 className="text-[#0064b0] font-semibold uppercase tracking-widest text-xs mb-2">AZ Consultations</h6>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-gray-900 mb-1">Education System in Australia</h2>
            <h4 className="font-semibold text-gray-700 mb-4">What's it like to study in Australia?</h4>
            <ul className="space-y-3">
              {educationSystemItems.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <CheckCircleIcon />
                  <span className="text-justify"><strong>{item.label}</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Universities Accordion ────────────────────────────────────── */}
        <div className="bg-gray-50 py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative mb-2">
              <img
                src="https://www.ednetconsultants.com/wp-content/uploads/2024/04/cap.png"
                alt="cap"
                className="absolute -top-8 right-4 opacity-40 hidden md:block"
                style={{ width: 80, transform: "rotate(3deg)" }}
              />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-gray-900 mb-6">Universities and Colleges</h2>
            {universitiesByState.map((s, i) => (
              <AccordionItem key={i} title={s.state}>
                <ul className="space-y-1 list-disc pl-4">
                  {s.unis.map((u, j) => (
                    <li key={j}><a href={u.url} target="_blank" rel="noreferrer" className="text-[#0064b0] hover:underline">{u.name}</a></li>
                  ))}
                </ul>
              </AccordionItem>
            ))}
          </div>
        </div>

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
          {/* Left: static img placeholder */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: 300 }}>
            <img
              src="https://www.ednetconsultants.com/wp-content/uploads/2024/05/testimonials-australia.jpg"
              alt="Testimonials"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
          {/* Right: carousel */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <TestimonialCarousel />
          </div>
        </div>

        {/* ── 8-Step Process ────────────────────────────────────────────── */}
        <div className="py-12" style={{ background: "#f7f9fc" }}>
          <div className="max-w-7xl mx-auto px-4">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-gray-900 text-center mb-10">Our Tested and Trusted 8-Step Process</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <AnimatedCard key={i} delay={i * 0.08} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-14 h-14 object-contain mb-3"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <h4 className="font-bold text-gray-800 text-sm mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed text-justify">{step.desc}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>

        {/* ── Why EdNet ─────────────────────────────────────────────────── */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-2">
              <div className="inline-block bg-[#0064b0] text-white text-xs font-semibold px-3 py-1 rounded mb-2">AZ Consultations</div>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-center text-gray-900 mb-10">Why EdNet?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyEdnetCards.map((card, i) => (
                <AnimatedCard key={i} delay={i * 0.08}
                  className="text-center p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-16 h-16 mx-auto object-contain mb-4"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <h3 className="font-bold text-gray-800 text-sm mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed text-justify">{card.desc}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative">
              <img
                src="https://www.ednetconsultants.com/wp-content/uploads/2024/04/cap.png"
                alt="cap"
                className="absolute -top-6 right-0 opacity-40 hidden md:block"
                style={{ width: 70, transform: "rotate(3deg)" }}
              />
              <div className="inline-block bg-[#0064b0] text-white text-xs font-semibold px-3 py-1 rounded mb-3">AZ Consultations</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            </div>
            {faqItems.map((faq, i) => (
              <AccordionItem key={i} title={faq.q}>
                <div className="text-sm text-gray-700 leading-relaxed">{faq.a}</div>
              </AccordionItem>
            ))}
          </div>
        </div>

        {/* ── Footer Links ──────────────────────────────────────────────── */}
        <div className="py-10 bg-[#11346a] text-white">
          <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Study Abroad */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-blue-500 pb-2">Study Abroad</h2>
              <ul className="space-y-2 text-sm">
                {[["Study in UK", "/study-uk"], ["Study in US", "/study-us"], ["Study in Canada", "/study-canada"], ["Study in New Zealand", "/study-nz"], ["Study in Australia", "/study-australia"], ["Study in Hong Kong", "/study-hong-kong"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                      <AngleRightIcon />{label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Other Links */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-blue-500 pb-2">Other Links</h2>
              <ul className="space-y-2 text-sm">
                {[["Scholarships", "/scholarships"], ["External Scholarships", "/external-scholarships"], ["Testimonials", "/testimonials"], ["Visa Assistance", "/visa-assistance"], ["Contact Us", "/contact"], ["Careers", "/careers"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
                      <AngleRightIcon />{label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact info placeholder */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-blue-500 pb-2">Get In Touch</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                EdNet Consultants<br />
                Paris, France<br />
                <a href="tel:+33652722078" className="text-blue-300 hover:underline">+33 6 52 72 20 78</a><br />
                <a href="mailto:info@ednetconsultants.com" className="text-blue-300 hover:underline">info@ednetconsultants.com</a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}