import { useState, useEffect, useRef } from "react";

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ── Intersection observer hook ─────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Check-circle SVG ───────────────────────────────────────────────────────
const CheckCircle = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0 text-[#0064b0]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" fill="currentColor" />
  </svg>
);

// ── Counter card ───────────────────────────────────────────────────────────
function CounterCard({ target, suffix = "+", label, start }) {
  const count = useCounter(target, 2000, start);
  return (
    <div className="bg-[#174183] rounded-xl px-4 pt-10 pb-5 min-h-[230px] flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-2">
      <div className="text-white text-4xl font-bold mb-2">{count}{suffix}</div>
      <div className="text-white text-sm font-medium leading-tight">{label}</div>
    </div>
  );
}

// ── Testimonial carousel ───────────────────────────────────────────────────
const testimonials = [
  {
    text: "AZ Consultations changed my life. The process of applying to universities in France felt overwhelming, but Ahmad Jalal Sir guided me through every step personally. The support was extremely professional and individualized. I got answers to all my questions, which made my journey smooth. I am now studying in Paris and couldn't be happier!",
    name: "Zainab Malik",
    img: "https://ui-avatars.com/api/?name=Zainab+Malik&background=0064b0&color=fff",
  },
  {
    text: "When I came to AZ Consultations, it changed my future forever. It gave me hope for a better, brighter and more hopeful career abroad. Ahmad Jalal Sir and his team are very professional and made me feel confident throughout my application process. I am proud to have chosen AZ Consultations.",
    name: "Hassan Raza",
    img: "https://ui-avatars.com/api/?name=Hassan+Raza&background=0064b0&color=fff",
  },
  {
    text: "AZ Consultations helped me a lot in finding my dream university in France. The team is highly responsive and supportive at every stage.",
    name: "Ayesha Siddiqui",
    img: "https://ui-avatars.com/api/?name=Ayesha+Siddiqui&background=0064b0&color=fff",
  },
  {
    text: "I always wanted to study design abroad but was unsure about portfolios and admissions. AZ Consultations really helped me with all of it. Ahmad Jalal Sir and the team helped me complete my application. I strongly recommend AZ Consultations if you want to get into top universities of France.",
    name: "Fatima Noor",
    img: "https://ui-avatars.com/api/?name=Fatima+Noor&background=0064b0&color=fff",
  },
  {
    text: "AZ Consultations gave me the much needed clarity and exposure that I required to decide my future and choose the right university and career for myself. With the AZ Consultations family I started on a journey of self-evolution and self-growth.",
    name: "Umar Farooq",
    img: "https://ui-avatars.com/api/?name=Umar+Farooq&background=0064b0&color=fff",
  },
];

function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {testimonials.map((t, i) => (
          <div key={i} className="min-w-full flex flex-col items-center text-center px-4">
            <p className="text-gray-700 text-base leading-relaxed max-h-44 overflow-y-auto mb-6">{t.text}</p>
            <img
              src={t.img}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover mb-2"
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(t.name) + "&background=0064b0&color=fff"; }}
            />
            <span className="font-semibold text-gray-800">{t.name}</span>
          </div>
        ))}
      </div>
      {/* Bullet dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${i === active ? "bg-[#0064b0] scale-125" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── FAQ accordion ──────────────────────────────────────────────────────────
const faqs = [
  { q: "What is the structure of the education system in New Zealand?", a: "The levels of the education system for study in New Zealand: Early Education, Primary or Intermediate Schooling, Secondary Schooling, Tertiary Education." },
  { q: "Do I need a student Visa in NZ? For how long can I study there?", a: "If you wish to study in New Zealand for a period longer than three months, you need to get a Student Visa, which can be extended according to the duration of your course." },
  { q: "What is a tertiary institution?", a: "A tertiary institution is any university or polytechnic college in New Zealand that offers courses to students for education post secondary schooling." },
  { q: "Are degrees from New Zealand institutions internationally recognised?", a: "Yes, New Zealand educational institutions offer degrees that are internationally recognized and accepted worldwide." },
  { q: "Can I avail public health services in New Zealand?", a: "Unfortunately, most international students are not eligible for public health services in NZ. You would require medical insurance and AZ Consultations advises you to apply for one while processing your application for admission in any university there." },
  { q: "What kinds of accommodation are available in New Zealand for students?", a: "International students can find several reasonable accommodation options like hostels, apartments on sharing/private basis, or even private boarding, where the student can stay with a local family." },
  { q: "What kinds of working opportunities are available for international students in NZ during and after tertiary education?", a: "Once you graduate with a degree or diploma, you are eligible for a one-year job search visa in New Zealand. If you are successful in gaining employment, you can apply for a work permit and continue your stay for two years as you work. The NZ immigration system is quite efficient and smooth and post two years as a professional, you qualify for a NZ resident visa under the skilled migrant category." },
  { q: "Can I work while I study in New Zealand?", a: "On student visa, you are eligible to work for 20 hours per week on vacation break during your semester and full-time study in New Zealand. If you are a Masters/PhD student, you may be allowed to work full-time both during the semester and holidays." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-gray-200">
      {faqs.map((f, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center gap-3 py-4 text-left text-gray-800 font-medium hover:text-[#0064b0] transition-colors"
          >
            <span className="flex-shrink-0 w-5 h-5 text-[#0064b0]">
              {open === i ? (
                <svg viewBox="0 0 448 512" fill="currentColor"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
              ) : (
                <svg viewBox="0 0 448 512" fill="currentColor"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
              )}
            </span>
            {f.q}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-600 text-sm leading-relaxed ${open === i ? "max-h-96 pb-4 px-8" : "max-h-0"}`}
          >
            {f.a}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── FadeInUp wrapper ────────────────────────────────────────────────────────
function FadeInUp({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Universities list ──────────────────────────────────────────────────────
const colleges1 = [
  { name: "Abacus Institute of Studies, Christchurch", url: "http://www.abacus.ac.nz/" },
  { name: "Cornell Institute of Business and Technology, Auckland", url: "https://cornell.ac.nz/" },
  { name: "Crown Institute of Studies, Auckland", url: "https://crown.ac.nz/" },
  { name: "Design and Arts College of New Zealand, Christchurch", url: "https://www.dac.ac.nz/" },
  { name: "Eastern Institute of Technology, Napier", url: "https://www.eit.ac.nz/" },
  { name: "Edenz Colleges, Auckland", url: "https://www.edenz.ac.nz/" },
  { name: "ICL Business School, Auckland", url: "https://icl.ac.nz/" },
  { name: "Information Technology Training Institute, Auckland", url: "https://www.ittinstitute.ac.nz/" },
  { name: "Institute of Commercial Education New Zealand, Auckland", url: "https://www.ice.ac.nz/" },
  { name: "International Academy of New Zealand, Auckland", url: "https://www.ianz.ac.nz/" },
];

const colleges2 = [
  { name: "Southern Institute of Technology, Invercargill", url: "https://www.sit.ac.nz/" },
  { name: "Tai Poutini Polytechnic, Auckland", url: "https://tpp.ac.nz/" },
  { name: "Techtorium Computer Training Institute, Auckland", url: "https://www.techt.co.nz/" },
  { name: "TOI Whakaari New Zealand Drama School, Wellington", url: "https://www.toiwhakaari.ac.nz/" },
  { name: "Travel Careers & Training, Auckland", url: "https://www.travelcareers.co.nz/" },
  { name: "UC International College, Christchurch", url: "https://www.ucic.ac.nz/" },
  { name: "Unitec Institute of Technology, Auckland", url: "https://www.unitec.ac.nz/" },
  { name: "Universal College of Learning, Palmerston", url: "https://www.ucol.ac.nz/" },
  { name: "University of Auckland, Auckland (World ranking 82)", url: "https://www.auckland.ac.nz/en.html" },
  { name: "University of Canterbury, Christchurch (World Ranking 214)", url: "https://www.canterbury.ac.nz/" },
  { name: "University of Otago, Dunedin (World Ranking 151)", url: "https://www.otago.ac.nz/" },
  { name: "University of Waikato, Hamilton (World Ranking 292)", url: "https://www.waikato.ac.nz/" },
  { name: "UUNZ Institute of Business, Auckland", url: "https://www.uunz.ac.nz/" },
  { name: "Victoria University of Wellington, Wellington (World Ranking 219)", url: "https://www.wgtn.ac.nz/" },
  { name: "Vision College, Hamilton", url: "https://www.visioncollege.ac.nz/" },
  { name: "Waiariki Institute of Technology, Rotorua", url: "https://www.toiohomai.ac.nz/" },
  { name: "Waikato Institute of Technology, Hamilton", url: "https://www.wintec.ac.nz/" },
  { name: "Wellington Institute of Technology, Wellington", url: "https://www.weltec.ac.nz/" },
  { name: "Western Institute of Technology at Taranaki, New Plymouth", url: "https://www.witt.ac.nz/" },
  { name: "Whitecliffe College of Arts & Design, Auckland", url: "https://www.whitecliffe.ac.nz/" },
  { name: "Whitireia New Zealand, Wellington", url: "https://www.whitireiaweltec.ac.nz/" },
  { name: "Yoobee School of Design", url: "https://www.yoobee.ac.nz/" },
];

// ── Why AZ Consultations cards ─────────────────────────────────────────────
const whyEdnetCards = [
  {
    img: "7a69858cc87f6c10bb09d67a4a68b4a369fd550dd62678e28b01a9f7da765854.png",
    title: "AZ Career Aptitude Assessment",
    desc: "Our expertly constructed Career Assessment helps analyse your strengths and shortcomings, and recognizes the best career options for you. This self-analysis helps in determining the right course, in the right school, and in the right country — tailored for Pakistani students."
  },
  {
    img: "9086cfe39ed64d1f4eb0eaecfedd8b5c8c08aece7abe3845579177fa9c4e162d.png",
    title: "Expert Counselors",
    desc: "Our internationally recognized counselors, led by Syed Ahmad Jalal, have years of combined experience working specifically with Pakistani students. We have a proven track record of successful placements in top universities across France and abroad since 2020."
  },
  {
    img: "e98f92ef5216f6b741959f3195666a45560a6689a7643ac1e3e29c5739614b98.png",
    title: "Our Goal",
    desc: "We realize that each student is unique and so is his/her potential, passion, skills, and ambitions. Our target is clear – to lead you to the school best fit for you. Our services are custom-made, dynamic, and streamlined for Pakistani students pursuing education in France."
  },
  {
    img: "8287ebbd1f5e4587786ccc6d41bb1868bd9622045c762e48dcf60af237aa4297.png",
    title: "A Passionate and Driven Team",
    desc: "The team of AZ Consultations is highly passionate and committed towards each student. Based in Paris with strong ties to Lahore, our team possesses the best talent, knowledge, and skill-set. You will be in the best hands for your study abroad journey."
  },
  {
    img: "3ff28a1c20ca9071261658d6a30429cb5c45ccd6c0545e04152af056f18dd1e9.png",
    title: "Higher Acceptance Rates",
    desc: "Our transparent and rigorous procedure involves multiple checkpoints throughout your application process, with quality assurance and exceptional results. We value your time, energy, and effort – which is why our work is always immaculate and pertinent to each Pakistani student's profile."
  },
  {
    img: "8cde7b8a2755ac82542e4f5e0a0ea29315a3d084a5ed77cb203dd63492db6fdd.png",
    title: "Personalized Attention",
    desc: "When you join the AZ Consultations family, you become a member of our organization. We have garnered an impeccable reputation for providing the finest personalized services to students from Pakistan, guiding them from initial counselling all the way to their pre-departure orientation."
  },
];

// ── 8-Step Process ─────────────────────────────────────────────────────────
const steps = [
  {
    img: "549017a7b55a49be70266456eb93cdc3f36df95e39c5643755da5a1c6ef2e636.png",
    title: "AZ Career Assessment",
    desc: "We help you identify your strengths and shortcomings and come up with tailor-made career options, best-suited for Pakistani students who wish to pursue higher education abroad!"
  },
  {
    img: "20f85dc12d9af4d767f0377695ac6ac766aa71923be40679c40136bb6ce226e9.png",
    title: "Expert Counseling",
    desc: "Our unbiased and expert counseling ensures that we find the best universities and courses for you in France and beyond, based on your aptitude, eligibility, academic background, career goals, and budget."
  },
  {
    img: "33be2e5013a06c92f032cecb52336a669107fdc69d75a3be3b0ce0c85c7d2b91.png",
    title: "University & Program Selection",
    desc: "We identify suitable universities and study programs based on your academic background and goals. University tuition fees depend on the selected program, university, and city. After signing our consultancy contract, we share full details of available programs and tuition fees."
  },
  {
    img: "a371c0ef68b1c9ef72bcf134321e93b512aab1a9e538d3a68e24d9fb4a5e0316.png",
    title: "Document Preparation",
    desc: "We prepare your CV according to French university standards, write a professional Letter of Motivation, and handle translation of your documents. Translation fees are extra and depend on the number and language of documents."
  },
  {
    img: "ea6fe7584f1b9edb6e40343351d39124eca6221f25c5499c2bbb302c07184001.png",
    title: "Application Processing",
    desc: "We apply to universities on your behalf. Our proficient team scrutinizes and reviews your application to ensure a complete and accurate file reaches your dream school well in time. We secure your admission and provide the official Admission Letter and all related documents."
  },
  {
    img: "31f21fcb6885870a5d59d74bcbf39e3dbe3a3c98378c8d070e869ad4c21aa2c6.png",
    title: "Interview Preparation",
    desc: "We guide you through a series of mock interviews to prepare you for Campus France and visa interviews. Our preparation methodology has been refined through years of experience working with Pakistani students applying to French universities."
  },
  {
    img: "153db55010a4f6f2c613181dcdb07dd55b739a4dcc797d0c4abff43553000318.png",
    title: "Visa Guidance",
    desc: "Please note that we do not sell, arrange, or guarantee visas. Our responsibility is preparing your complete academic and admission file according to university requirements and Embassy standards. We guide you through every document and step of the visa application process."
  },
  {
    img: "6f87b0709bf80356e767fd0fd6f19ebac9c676a58dd78bdb9c0b28aa98961449.png",
    title: "Pre-Departure Orientation",
    desc: "We provide our students with a thorough pre-departure counselling to familiarize them with what lies ahead – campus life, cultural integration in France, educational policies, accommodation options, and everything to expect from their new journey in Europe."
  },
];

// ── Why Study NZ list ──────────────────────────────────────────────────────
const whyStudyNZ = [
  "New Zealand is one of the least corrupt nations in the World, according to Transparency International's Corruption Perception Index and ranks second among the most peaceful countries in the World according to the Global Peace Index — making it an extremely safe destination for Pakistani students.",
  "Nature reserves, marine reserves, and protected parks and green lands make up one-third of the nation. Nature lovers, adventure junkies, and scenic beauty admirers from Pakistan are in for a treat while studying in New Zealand!",
  "New Zealand is home to eight world ranking universities that offer diverse courses. Pakistani students will benefit from an internationally recognized education that opens doors globally.",
  "New Zealand is relatively accessible regarding entry requirements for standardized tests such as TOEFL, IELTS, GRE, and GMAT — with requirements generally more attainable than universities in the US or UK, making it a great pathway for Pakistani students.",
  "The cost of living, tuition fees, and accessibility fees are moderate and more affordable in comparison to other popular countries for international students. Pakistan students can receive a high-quality British-influenced education at a fraction of the cost compared to studying in the UK.",
  "The cities in NZ are very student-friendly, safe, and the natives are welcoming and progressive. Pakistan students will find NZ's diverse, multicultural population makes settling in much easier — you will fit right in.",
  "Work opportunities – Pakistani students on a student visa are allowed to work up to 20 hours per week during the semester in NZ! This can be convenient to supplement your education abroad. Additionally, you can gain a 'work permit' besides your visa for two years after your course ends.",
];

// ── Main Component ─────────────────────────────────────────────────────────
export default function StudyNZ() {
  const [counterRef, counterInView] = useInView(0.2);

  return (
    <>
      {/* Global keyframe animations */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes phone-outer {
          0%, 100% { transform: translate3d(0,0,0) scale(1); box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
          33.3333% { transform: translate3d(0,0,0) scale(1.1); box-shadow: 0 0 0 0 rgba(52,152,219,.3), 0 .05em .1em rgba(0,0,0,.5); }
          66.6666% { transform: translate3d(0,0,0) scale(1); box-shadow: 0 0 0 .5em rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
        }
        @keyframes phone-inner {
          0% { opacity:1; transform: translate3d(0,0,0) scale(0); }
          33.3333% { opacity:1; transform: translate3d(0,0,0) scale(.9); }
          66.6666%, 100% { opacity:0; transform: translate3d(0,0,0) scale(0); }
        }
        @keyframes phone-icon {
          0%,46% { transform: translate3d(0,0,0); }
          2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42% { transform: translate3d(.01em,0,0); }
          4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44% { transform: translate3d(-.01em,0,0); }
        }
        .phone-btn-blue { animation: 3s infinite phone-outer; }
        .phone-btn-blue::before { animation: 3s infinite phone-inner; }
        .phone-btn-blue::after { animation: 3s infinite phone-icon; }
        .phone-btn-green { animation: 3s infinite phone-outer; }
        .overlay-img { transition: transform 0.5s; }
        .overlay:hover .overlay-img { transform: scale(1.06); }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background-color: #ebebeb; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { border-radius: 10px; background: #193393; }
      `}</style>

      <div className="font-sans text-[#282828]">

        

        {/* ── Hero Image ─────────────────────────────────────────────── */}
        <div className="w-full">
          <img
            src="studynz.png"
            alt="Study in New Zealand"
            className="w-full object-cover"
          />
        </div>

        {/* ── Hero Content: NZ map + intro text ──────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: map image */}
            <div className="md:w-1/2 relative overflow-hidden overlay">
              <img
                src="nz.png"
                alt="New Zealand map"
                className="w-full overlay-img"
              />
            </div>
            {/* Right: text */}
            <div className="md:w-1/2">
              <h6 className="text-[#0064b0] font-semibold mb-2">AZ Consultations</h6>
              <h1 className="text-2xl md:text-3xl font-bold text-[#11346a] mb-4 leading-snug">
                Best New Zealand Education Consultants in Paris for Pakistani Students
              </h1>
              <p className="text-justify text-gray-700 leading-relaxed mb-4">
                The land of the Kiwis, New Zealand, is a stunningly beautiful country. Recently, it has emerged as a hub for tourists and students. More and more Pakistani students are choosing to study in New Zealand owing to the vast opportunities for strong careers, a quality education system, and the colourful experiences it offers.
              </p>
              <p className="text-justify text-gray-700 leading-relaxed">
                Need more convincing? Contact AZ Consultations — one of the best New Zealand Education Consultants in Paris for Pakistani students. We have experience helping numerous successful candidates from Pakistan study in New Zealand and other dream destinations. Led by <strong>Syed Ahmad Jalal</strong>, our Paris-based team is dedicated to helping you achieve your academic goals abroad.
              </p>
            </div>
          </div>
        </div>

        {/* ── Letter / Intro Section ──────────────────────────────────── */}
        <div className="bg-[#f0f5ff] py-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h5 className="text-xl font-bold text-[#11346a] mb-4">Dear Student,</h5>
              <p className="text-gray-700 leading-relaxed mb-4">
                Greetings from Paris. Thank you for your interest in studying abroad. We are pleased to offer our professional educational consultancy services for students from Pakistan who wish to pursue higher education abroad.
              </p>

              <h6 className="text-[#0064b0] font-bold mb-3 mt-6">Our Services</h6>
              <p className="text-gray-700 leading-relaxed mb-3">We provide complete support for your admission process, including:</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-[#11346a]">1. University &amp; Program Selection</p>
                  <ul className="ml-4 mt-2 space-y-1 text-gray-600 text-sm">
                    <li className="flex gap-2 items-start"><CheckCircle /><span>We identify suitable universities and study programs based on your academic background, career goals, and budget.</span></li>
                    <li className="flex gap-2 items-start"><CheckCircle /><span>University tuition fees depend on the selected formation, university, and city.</span></li>
                    <li className="flex gap-2 items-start"><CheckCircle /><span>After signing our consultancy contract, we will share full details of available universities, programs, and their respective tuition fees.</span></li>
                    <li className="flex gap-2 items-start"><CheckCircle /><span>University fees will be paid directly by the student to the university.</span></li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#11346a]">2. Admission Process</p>
                  <ul className="ml-4 mt-2 space-y-1 text-gray-600 text-sm">
                    <li className="flex gap-2 items-start"><CheckCircle /><span>We apply to universities on your behalf.</span></li>
                    <li className="flex gap-2 items-start"><CheckCircle /><span>We secure your admission and provide the official Admission Letter and all related documents.</span></li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#11346a]">3. Document Preparation</p>
                  <ul className="ml-4 mt-2 space-y-1 text-gray-600 text-sm">
                    <li className="flex gap-2 items-start"><CheckCircle /><span>Preparation of your CV according to standards.</span></li>
                    <li className="flex gap-2 items-start"><CheckCircle /><span>Writing of a professional Letter of Motivation.</span></li>
                    <li className="flex gap-2 items-start"><CheckCircle /><span>Translation of documents (translation fees are extra and depend on the number and language of documents).</span></li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#11346a]">4. Interview Preparation</p>
                  <ul className="ml-4 mt-2 space-y-1 text-gray-600 text-sm">
                    <li className="flex gap-2 items-start"><CheckCircle /><span>Guidance and preparation for the Campus France and visa interview.</span></li>
                  </ul>
                </div>
              </div>

              <h6 className="text-[#0064b0] font-bold mb-3 mt-6">Visa Application &amp; Disclaimer</h6>
              <p className="text-gray-700 leading-relaxed text-sm mb-2">
                Please note that <strong>we do not sell, arrange, or guarantee visas.</strong> Our responsibility is limited to preparing your academic and admission file according to university requirements and Embassy standards. Our service covers university search, admission processing, CV preparation, motivation letter, and complete file preparation. Translation fees and insurance costs are not included and must be paid separately by the student.
              </p>

              <h6 className="text-[#0064b0] font-bold mb-3 mt-6">Our Responsibility</h6>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li className="flex gap-2 items-start"><CheckCircle /><span>Finding suitable universities</span></li>
                <li className="flex gap-2 items-start"><CheckCircle /><span>Securing admission</span></li>
                <li className="flex gap-2 items-start"><CheckCircle /><span>Preparing your complete academic file (CV, motivation letter, documents)</span></li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  If you wish to begin your application or need further information, please feel free to contact us. We look forward to assisting you in achieving your educational goals in France.
                </p>
                <div className="mt-4">
                  <p className="font-bold text-[#11346a]">Kind regards,</p>
                  <p className="font-semibold text-gray-800">Ahmad Jalal Syed</p>
                  <p className="text-gray-600 text-sm">Education Consultant – France</p>
                  <p className="text-gray-600 text-sm">Office: Paris / Lahore</p>
                  <p className="text-gray-600 text-sm">Office: <a href="tel:+33183965723" className="text-[#0064b0] hover:underline">+33 1 83 96 57 23</a></p>
                  <p className="text-gray-600 text-sm">Mobile: <a href="tel:+33676903922" className="text-[#0064b0] hover:underline">+33 6 76 90 39 22</a></p>
                  <p className="text-gray-600 text-sm mt-1">77 Rue du Faubourg Saint-Martin, 75010 Paris, France</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Why Study in NZ ────────────────────────────────────────── */}
        <div className="bg-white py-10">
          <div className="max-w-6xl mx-auto px-4">
            <h5 className="text-xl font-bold text-[#11346a] mb-6">Why Study in New Zealand?</h5>
            <ul className="space-y-4">
              {whyStudyNZ.map((item, i) => (
                <FadeInUp key={i} delay={i * 80}>
                  <li className="flex gap-3 items-start text-gray-700 text-justify leading-relaxed">
                    <CheckCircle />
                    <span>{item}</span>
                  </li>
                </FadeInUp>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Universities & Colleges ─────────────────────────────────── */}
        <div className="bg-[#f5f8ff] py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-start gap-4 mb-6">
              <div>
                <h4 className="text-xl font-bold text-[#11346a]">Universities and Colleges</h4>
                <h4 className="text-lg font-semibold text-[#0064b0]">Where to study in New Zealand?</h4>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
              {[...colleges1, ...colleges2].map((c, i) => (
                <a
                  key={i}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 py-2 text-gray-700 hover:text-[#0064b0] transition-colors text-sm group"
                >
                  <CheckCircle />
                  <span className="group-hover:underline">{c.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Counter Stats ───────────────────────────────────────────── */}
        <div ref={counterRef} className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CounterCard target={5} suffix="+" label="Years of Experience" start={counterInView} />
              <CounterCard target={200} suffix="+" label="Pakistani Students Placed" start={counterInView} />
              <CounterCard target={100} suffix="%" label="Success Rate" start={counterInView} />
              <CounterCard target={30} suffix="+" label="University Partners" start={counterInView} />
            </div>
          </div>
        </div>

        {/* ── Testimonials ───────────────────────────────────────────── */}
        <div className="bg-[#f0f5ff] py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <span className="inline-block bg-[#0D5EF42B] text-[#0064b0] font-semibold text-sm px-6 py-1 rounded mb-3">testimonials</span>
              <h5 className="text-2xl font-bold text-[#11346a]">Our Students from Pakistan</h5>
            </div>
            <TestimonialCarousel />
          </div>
        </div>

        {/* ── 8-Step Process ──────────────────────────────────────────── */}
        <div className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h5 className="text-2xl font-bold text-[#11346a] mb-8 text-center">Our Tested and Trusted 8-Step Process</h5>
            <div className="grid md:grid-cols-2 gap-6">
              {steps.map((s, i) => (
                <FadeInUp key={i} delay={i * 100}>
                  <div className="flex gap-4 items-start p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="w-14 h-14 object-contain flex-shrink-0"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div>
                      <h4 className="font-bold text-[#11346a] mb-1">{s.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed text-justify">{s.desc}</p>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>

        {/* ── Why AZ Consultations ────────────────────────────────────── */}
        <div className="bg-[#f5f8ff] py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h5 className="text-2xl font-bold text-[#11346a] mb-8 text-center">Why AZ Consultations?</h5>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {whyEdnetCards.map((c, i) => (
                <FadeInUp key={i} delay={i * 100}>
                  <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-default">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-16 h-16 object-contain mx-auto mb-4"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <h3 className="font-bold text-[#11346a] mb-2">{c.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-justify">{c.desc}</p>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <div className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-6">
              <span className="inline-block bg-[#0D5EF42B] text-[#0064b0] font-semibold text-sm px-6 py-1 rounded mb-3">AZ Consultations</span>
              <h5 className="text-2xl font-bold text-[#11346a]">Frequently Asked Questions</h5>
            </div>
            <FAQ />
          </div>
        </div>

        {/* ── Fixed Social Icons (left) ───────────────────────────────── */}
        <ul className="fixed top-1/2 left-0 -translate-y-1/2 z-50 m-0 p-0 list-none hidden md:block">
          {[
            { href: "https://www.facebook.com/", icon: "fab fa-facebook-f", label: "Facebook" },
            { href: "https://twitter.com/", icon: "fab fa-twitter", label: "Twitter" },
            { href: "https://www.linkedin.com/", icon: "fab fa-linkedin-in", label: "LinkedIn" },
            { href: "https://www.instagram.com/", icon: "fab fa-instagram", label: "Instagram" },
          ].map((s, i) => (
            <li key={i} className="mb-[3px]">
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="block w-10 h-10 leading-10 bg-[#0064b0] text-white text-center transition-all duration-500 hover:pl-2 hover:w-14"
                title={s.label}
              >
                <span className="flex items-center justify-center h-full text-sm font-bold">
                  {s.label[0]}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* ── Fixed CTA buttons ───────────────────────────────────────── */}
        <div className="fixed bottom-6 left-5 z-[999] cursor-pointer">
          <a
            href="../contact_us/contact_us.html"
            className="bg-[#0064b0] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#004e8c] transition-colors shadow-lg"
          >
            Request A Consultation
          </a>
        </div>

        {/* WhatsApp button – bottom right */}
        <div className="fixed bottom-6 right-7 z-[999] cursor-pointer">
          <a
            href="https://api.whatsapp.com/send?phone=33676903922"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#34a94d] text-white text-2xl shadow-lg"
            style={{ animation: "3s infinite phone-outer" }}
            title="WhatsApp"
          >
            <svg viewBox="0 0 448 512" fill="white" className="w-7 h-7">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
          </a>
        </div>

      </div>
    </>
  );
}