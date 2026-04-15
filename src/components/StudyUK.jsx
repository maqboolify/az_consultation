import { useState, useEffect, useRef } from "react";

// ── Keyframes injected once ──────────────────────────────────────────────────
const GLOBAL_STYLES = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes phone-outer {
  0%,100%  { transform: translate3d(0,0,0) scale(1);   box-shadow: 0 0 0 0 rgba(52,152,219,0),   0 .05em .1em rgba(0,0,0,.2); }
  33.3333% { transform: translate3d(0,0,0) scale(1.1); box-shadow: 0 0 0 0 rgba(52,152,219,.3),  0 .05em .1em rgba(0,0,0,.5); }
  66.6666% { transform: translate3d(0,0,0) scale(1);   box-shadow: 0 0 0 .5em rgba(52,152,219,0),0 .05em .1em rgba(0,0,0,.2); }
}
@keyframes phone-inner {
  0%       { opacity:1; transform:translate3d(0,0,0) scale(0);  }
  33.3333% { opacity:1; transform:translate3d(0,0,0) scale(.9); }
  66.6666%,100% { opacity:0; transform:translate3d(0,0,0) scale(0); }
}
@keyframes phone-icon {
  0%,46%   { transform:translate3d(0,0,0); }
  2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42% { transform:translate3d(.01em,0,0); }
  4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44% { transform:translate3d(-.01em,0,0); }
}
.animate-phone-outer  { animation: phone-outer  3s infinite; }
.animate-phone-inner::before { animation: phone-inner 3s infinite; }
.animate-phone-icon::after   { animation: phone-icon  3s infinite; }
.fade-in-up { animation: fadeInUp 0.7s ease forwards; }
.scrollbar-custom::-webkit-scrollbar { width:8px; }
.scrollbar-custom::-webkit-scrollbar-track { background:#ebebeb; border-radius:10px; }
.scrollbar-custom::-webkit-scrollbar-thumb { background:#193393; border-radius:10px; }
`;

// ── Reusable animated section hook ──────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Check-circle SVG ────────────────────────────────────────────────────────
const CheckCircle = () => (
  <svg className="w-5 h-5 flex-shrink-0 text-[#0064b0]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
  </svg>
);

const AngleRight = () => (
  <svg className="w-3 h-4 fill-white" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
  </svg>
);

// ── AnimatedCard ─────────────────────────────────────────────────────────────
function AnimatedCard({ children, className = "", delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Testimonial Carousel ─────────────────────────────────────────────────────
const testimonials = [
  {
    text: "AZ Consultations gave me the much needed clarity and guidance I required to decide my future and choose the right university for myself. With Syed Ahmad Jalal's support, I started on a journey of self-growth and achieved my dream of studying in the UK.",
    name: "Fatima Malik",
    university: "University of the Arts London",
  },
  {
    text: "The process of applying to prestigious UK universities is challenging, but with AZ Consultations, I had a helping hand every step of the way. The help was extremely personal and individualized. Ahmad Jalal sir's personal touch to the application and constant support made it a truly beautiful experience for me.",
    name: "Usman Tariq",
    university: "LSE, University College London, Queen Mary University of London, King's College London",
  },
  {
    text: "AZ Consultations' support in the preparation of my application was nothing less than brilliant. I do not think it would have been possible to put my profile together the way Ahmad Jalal sir did for me. He made the entire application process painless and I sailed through it like a breeze.",
    name: "Hassan Raza",
    university: "Msc. Accounting & Finance; London School of Economics (LSE)",
  },
  {
    text: "I was very confused in the beginning but after contacting AZ Consultations and meeting Ahmad Jalal sir, I was able to make the right choice. The team was extremely cooperative and helpful throughout the process. It has been a truly pleasurable experience.",
    name: "Ayesha Siddiqui",
    university: "University of Warwick, Kings College London, University of Bath, City University London and University of Edinburgh",
  },
  {
    text: "Putting together an application to business school is a daunting task. Ahmad Jalal sir was instrumental in guiding me through the entire process and helping me prioritize. His expertise and second opinion on my personal statement made all the difference.",
    name: "Ali Hamza",
    university: "Oxford University, UK",
  },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);
  const t = testimonials[current];
  return (
    <div className="text-center max-w-2xl mx-auto px-4">
      <div
        key={current}
        className="fade-in-up"
        style={{ animation: "fadeInUp 0.5s ease forwards" }}
      >
        <p className="text-[#282828] text-base leading-relaxed mb-6 max-h-[170px] overflow-y-auto scrollbar-custom">
          {t.text}
        </p>
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-[#0064b0]">{t.name}</span>
          <span className="text-sm text-gray-500">{t.university}</span>
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-[#0064b0] scale-125" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#282828] hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-[#0064b0] flex-shrink-0">
              {open === i ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
              )}
            </span>
            {item.q}
          </button>
          {open === i && (
            <div className="px-4 pb-4 pt-1 text-sm text-[#282828] leading-relaxed bg-gray-50">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function StudyAZ() {
  // Floating CTA phone button
  const PhoneIcon = () => (
    <div className="fixed bottom-6 left-5 z-50 cursor-pointer">
      <a href="/contact_us" className="bg-[#0064b0] text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-[#00529a] transition-colors shadow-lg">
        Request A Consultation
      </a>
    </div>
  );

  const WhatsAppIcon = () => (
    <div className="fixed bottom-6 right-7 z-50 cursor-pointer">
      <a
        href="https://api.whatsapp.com/send?phone=33676903922"
        target="_blank"
        rel="noreferrer"
        className="animate-phone-outer block w-[60px] h-[60px] bg-[#34a94d] rounded-lg flex items-center justify-center shadow-lg"
        style={{ fontSize: 60, lineHeight: "60px" }}
      >
        <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );

  // Social floating icons
  const FloatingSocial = () => (
    <ul className="fixed top-1/2 left-0 -translate-y-1/2 z-50 m-0 p-0 list-none">
      {[
        { href: "http://www.facebook.com/azconsultations", icon: "facebook" },
        { href: "https://twitter.com/azconsultations", icon: "twitter" },
        { href: "https://www.linkedin.com/in/syed-ahmad-jalal", icon: "linkedin" },
        { href: "https://www.instagram.com/azconsultations/", icon: "instagram" },
      ].map(({ href, icon }) => (
        <li key={icon}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="block w-10 h-10 leading-10 bg-[#0064b0] text-white text-center mb-0.5 hover:bg-[#00529a] transition-colors z-50 relative"
          >
            <i className={`fa fa-${icon}`} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );

  // ── Why Study UK list items
  const whyStudyUK = [
    "When you study in the UK, courses are for a shorter period as compared to those of the US Universities, but they are intensive and save time and money of an extra year — a significant advantage for Pakistani students.",
    "If a student does not meet the eligibility criteria of the University, there is a wide range of foundation, vocational and bridging courses that one can choose from to study in the UK, in order to enter into a degree program.",
    "More than 370 scholarships on offer to international students, including dedicated awards for Pakistani students such as the Chevening Scholarship and Commonwealth Scholarship.",
    "Pakistani students can apply to study in the UK through UCAS where they could apply to multiple Universities in the same form, or directly through the 'application direct.'",
    "A strong student visa application requires meeting the points threshold, with 30 points coming from a confirmed offer of admission from your chosen university.",
    "The UK teaching module encourages interaction, debates and exchanges, combining lectures and seminars with high-tech learning methodologies — highly compatible with Pakistani students' academic backgrounds.",
    "Courses offer job placements and internships that add real-world value to your degree.",
    "UK offers a great lifestyle with beautiful landscape, art and culture, historical sites and urban life — with a welcoming Pakistani diaspora community to help you settle in.",
  ];

  const educationSystemUK = [
    "Undergraduate Courses and Postgraduate programs",
  ];

  const ugCourses = [
    "Honours degree: In-depth study of one subject. Duration – 3 to 4 years.",
    "Joint Honours degree: In-depth study of two subjects. Duration – 3 to 4 years.",
    "Combined honors degree: Where two or more subjects are studied at less advanced level. Duration is 3-4 years.",
    "Sandwich course: After 2 or 3 years, you can take one year off from the College or University to gain work experience and then join back to complete the final year. Duration is 4-5 years.",
    "Foundation course: It is a higher qualification directly related to employment such as design. Duration- 2 years.",
  ];

  // ── 8-Step Process cards
  const steps = [
    {
      title: "AZ Consultations' Career Assessment",
      desc: "We help you identify your strengths and shortcomings and come up with tailor-made career options, best-suited for you!",
    },
    {
      title: "Expert Counseling",
      desc: "Our unbiased and adroit counseling ensures that we find the best universities and courses for you, basis your aptitude, course eligibility criterion, and a scope for the most rewarding experiences.",
    },
    {
      title: "Plan of Action/Goal Setting",
      desc: "A customized planner is crafted by our team for each student, with deadlines and composition requirements for each step of the application process. This gives our students ample time to prepare a comprehensive and error-free application.",
    },
    {
      title: "Create Your Unique Story",
      desc: "We work diligently with you to help you realize your career goals. Together, we create a clear roadmap that creatively documents and showcases your aspirations and aptitude.",
    },
    {
      title: "Application Processing",
      desc: "Our proficient administration team relentlessly scrutinizes and reviews your application and ensures that a fool proof and accurate application reaches your dream school, well in time!",
    },
    {
      title: "Interview Preparation",
      desc: "We'll guide you and put you through a series of Mock Interviews to give you a real taste on how to crack your interviews. Our procedure and questions have been crystallized with years of experience through discussions with top alumni of diverse universities.",
    },
    {
      title: "Visa Guidance",
      desc: "Forms, documents, visa, interviews – Relax! We are with you in every way right until you fly off to your dream school.",
    },
    {
      title: "Pre-Departure Orientation",
      desc: "We provide our students with an interactive and thorough pre-departure counselling to familiarize them with what lies ahead – campus life, cultural integrations in a new country, educational policies, and what to expect from the journey ahead.",
    },
  ];

  // ── Why EdNet cards
  const whyEdNetCards = [
    {
      title: "AZ Career Assessment",
      desc: "Our expertly constructed Career Assessment helps analyse your strengths and shortcomings, and recognizes the best career options for you. This self-analysis helps in determining the right course, in the right school, and in the right country.",
    },
    {
      title: "Expert Counselors",
      desc: "Our internationally recognized counselors have extensive experience guiding Pakistani students to top UK universities, with a high success rate across hundreds of students from Pakistan over the past 5+ years.",
    },
    {
      title: "Goal",
      desc: "We realize that each student is unique and so is his/her potential, passion, skills, and ambitions. Our target is clear – to lead you to the school best fit for you. Our services are thus custom-made, dynamic, and streamlined.",
    },
    {
      title: "A Passionate and Driven Team",
      desc: "The team of AZ Consultations is well-known for being highly passionate and committed towards each student. Our team possesses the best of talent, knowledge, and skill-set. You will be in good hands.",
    },
    {
      title: "Higher Acceptance Rates",
      desc: "Our transparent and vigorous procedure involves multiple checkpoints throughout your application session, with quality assurance and guaranteed results. We value your time, energy, and effort – which is why our work is always immaculate and pertinent.",
    },
    {
      title: "Personalized Attention",
      desc: "When you join the AZ Consultations family, you become a member of our organization. We have garnered an impeccable reputation for providing the finest personalized services to Pakistani students seeking higher education abroad!",
    },
  ];

  // ── FAQ (University recommendations)
  const universityFAQs = [
    {
      q: "I want to learn Business. Where can I study in UK?",
      a: (
        <ul className="list-disc pl-5 space-y-1">
          {["London School of Economics", "University of Nottingham", "Lancaster University", "University of Bath", "University of Exeter", "University of Warwick", "University of Manchester", "University of Leeds", "University of Edinburgh", "Cass Business School"].map(u => <li key={u}>{u}</li>)}
        </ul>
      ),
    },
    {
      q: "I want to learn Information Technology. Where can I study in UK?",
      a: (
        <ul className="list-disc pl-5 space-y-1">
          {["University of Oxford", "University of Cambridge", "Imperial College", "University of Southampton", "University of Edinburgh", "University of Manchester", "University College London", "Loughborough University", "University of Birmingham", "University of Sheffield"].map(u => <li key={u}>{u}</li>)}
        </ul>
      ),
    },
    {
      q: "I want to learn Mechanical Engineering. Where can I study in UK?",
      a: (
        <ul className="list-disc pl-5 space-y-1">
          {["Imperial College", "Nottingham University", "University of Cardiff", "University of Manchester", "University of Bath", "University of Sheffield", "University of Southampton", "Loughborough University", "University of Bristol", "King's college, London"].map(u => <li key={u}>{u}</li>)}
        </ul>
      ),
    },
    {
      q: "I want to learn Medicine. Where can I study in UK?",
      a: (
        <ul className="list-disc pl-5 space-y-1">
          {["University of Oxford", "University of Manchester", "Cambridge University", "Glasgow Caledonian University", "University College London", "University of Dundee", "Imperial College", "King's College, London", "St. George's Hospital Medical School", "University of Leicester"].map(u => <li key={u}>{u}</li>)}
        </ul>
      ),
    },
    {
      q: "I want to learn Nursing. Where can I study in UK?",
      a: (
        <ul className="list-disc pl-5 space-y-1">
          {["University of Wales, Bangor", "University of Plymouth", "University College London", "St George's Hospital Medical School", "University of Edinburgh", "University of Manchester", "Northumbria University at Newcastle", "University of Cardiff", "University of Hertfordshire", "University of Wales, Swansea"].map(u => <li key={u}>{u}</li>)}
        </ul>
      ),
    },
  ];

  const generalFAQs = [
    {
      q: "Can I be sponsored for my education?",
      a: "Yes. A letter from your host or sponsor in the UK is required to say that she will support and accommodate you during your course of studies, together with evidence that s/he can do so.",
    },
    {
      q: "What is a sandwich program?",
      a: "The duration of a sandwich program is of 4 years. It is an integrated program of one year of Industrial experience with the 3 years of academics. Besides the money that you earn during this year, you also gain practical experience that can be invaluable when applying for jobs after graduating.",
    },
    {
      q: "What are the different scholarships and bursaries available for Pakistani students?",
      a: (
        <div>
          <p className="mb-2">Pakistani students have access to several prestigious scholarships for studying in the UK. Universities also offer merit-based awards. Key scholarships include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Chevening Scholarship:</strong> The UK government's flagship international award, fully funded and open to Pakistani students. Administered by the British Council in Pakistan.</li>
            <li><strong>Commonwealth Scholarship:</strong> Administered by the Commonwealth Scholarship Commission, available to Pakistani nationals for postgraduate study in the UK.</li>
            <li><strong>British Council Pakistan Scholarships:</strong> Various grants and partial funding opportunities managed through the British Council Pakistan office.</li>
            <li><strong>HEC (Higher Education Commission) Scholarships:</strong> The Government of Pakistan, through HEC, offers scholarships for Pakistani students to study abroad, including in the UK.</li>
            <li><strong>University Merit Awards:</strong> Many UK universities offer merit-based scholarships specifically for international students from Pakistan.</li>
          </ul>
        </div>
      ),
    },
    {
      q: "What is the difference between IELTS and TOEFL?",
      a: "IELTS is an English Language Testing system regulated by the Cambridge ESOL, the British Council and the International Development Program Education, Australia. The result of IELTS is valid for 2 years. The recommended score of IELTS is 6.5-7.5. TOEFL is the Test of English language as a foreign language set by ETS. The result of TOEFL is also valid for 2 years. Preferred score is 100+ IBT and above.",
    },
  ];

  const studyAbroadLinks = [
    { label: "Study in UK", href: "/study_uk" },
    { label: "Study in US", href: "https://azconsultants.com/study-aborad-usa/" },
    { label: "Study in Canada", href: "/study_cannada" },
    { label: "Study in New Zealand", href: "/study_nz" },
    { label: "Study in Australia", href: "/study_australia" },
    { label: "Study in Hong Kong", href: "https://azconsultants.com/study-abroad-hong-kong/" },
  ];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />

      {/* ── Floating CTAs ───────────────────────────────────────── */}
      

      <div className="font-sans text-[#282828]">

        {/* ── Hero Banner ─────────────────────────────────────────── */}
        <section className="w-full">
          <img
            src="uk.jpg"
            alt="Study UK Banner"
            className="w-full object-cover"
            style={{ maxHeight: 733 }}
          />
        </section>

        {/* ── Hero Content ─────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left: image */}
            <div className="relative flex-shrink-0 w-full lg:w-[420px]">
              <img
                src="studyuk.png"
                alt="decorative"
                className="absolute -top-4 -left-4 w-28 opacity-60 pointer-events-none"
              />
              <img
                src="studyuk.png"
                alt="UK Study"
                className="w-full object-cover rounded"
              />
            </div>
            {/* Right: letter */}
            <div className="flex-1">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-3 rounded"
                style={{ background: "#0064b0", color: "#fff" }}
              >
                AZ Consultations
              </span>
              <h1 className="text-3xl font-bold text-[#282828] mb-4 text-left">
                Message from Our Director
              </h1>
              <div className="bg-gray-50 border-l-4 border-[#0064b0] rounded p-5 text-base text-[#282828] leading-relaxed space-y-3">
                <p>Dear Student,</p>
                <p>Greetings from Paris.</p>
                <p>Thank you for your interest in studying abroad. We are pleased to offer our professional educational consultancy services for students from <strong>Pakistan</strong> who wish to pursue higher education abroad.</p>
                <p className="font-semibold text-[#0064b0]">Our Services</p>
                <p>We provide complete support for your admission process, including:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>University &amp; Program Selection</strong> – We identify suitable universities and study programs based on your academic background, career goals, and budget. University fees will be paid directly by the student to the university.</li>
                  <li><strong>Admission Process</strong> – We apply to universities on your behalf and secure your admission, providing the official Admission Letter and all related documents.</li>
                  <li><strong>Document Preparation</strong> – Preparation of your CV, writing of a professional Letter of Motivation, and translation of documents (translation fees are extra).</li>
                  <li><strong>Interview Preparation</strong> – Guidance and preparation for the Campus France and visa interview.</li>
                </ul>
                <p className="font-semibold text-[#0064b0]">Visa Application &amp; Disclaimer</p>
                <p className="text-sm">Please note that we do not sell, arrange, or guarantee visas. Our responsibility is limited to preparing your academic and admission file according to university requirements and Embassy standards. Translation fees and insurance costs are not included and must be paid separately.</p>
                <p className="mt-2 text-sm">Kind regards,</p>
                <p className="font-semibold">Ahmad Jalal Syed</p>
                <p className="text-sm text-gray-500">Education Consultant – France | Office: Paris / Lahore</p>
                <p className="text-sm text-gray-500">Office: <a href="tel:+33183965723" className="text-[#0064b0] hover:underline">+33 1 83 96 57 23</a> &nbsp;|&nbsp; Mobile: <a href="tel:+33676903922" className="text-[#0064b0] hover:underline">+33 6 76 90 39 22</a></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Study UK Intro ────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pb-4 pt-10">
          <div className="flex flex-col gap-3">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-1 rounded w-fit"
                style={{ background: "#0064b0", color: "#fff" }}
              >
                AZ Consultations
              </span>
              <h1 className="text-3xl font-bold text-[#282828] mb-4 text-left">
                Best UK Education Consultants in Paris for Pakistani Students
              </h1>
              <p className="text-base text-[#282828] text-justify mb-6 leading-relaxed">
                Higher Education in the UK is the most sought-after educational experience for Pakistani students seeking world-class qualifications. As a result, to assist profile-building and counselling Pakistani students to make the best decision when it comes to studying in the UK, AZ Consultations happens to be one of the best UK Education Consultants in Paris. We do not just assist and counsel you — we share your dreams and your journey. Here are some appealing reasons to dream about studying in the UK, before you actually take up the application process.
              </p>
              <h5 className="text-xl font-semibold text-[#0064b0] mb-2 text-left">Why Study in UK?</h5>
              <p className="text-base text-[#282828]">What makes it so appealing for Pakistani students to study in the UK?</p>
          </div>
        </section>

        {/* ── Why Study UK – checklist ──────────────────────────────── */}
        <section className="bg-gray-50 py-10">
          <div className="max-w-7xl mx-auto px-6">
            <ul className="space-y-3">
              {whyStudyUK.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#282828] text-base">
                  <CheckCircle />
                  <span className="text-justify">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Education System in UK ───────────────────────────────── */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Left: image */}
              <div className="relative flex-shrink-0 w-full lg:w-[360px]">
                {/* <img
                  src="uk.jpg"
                  alt="decorative"
                  className="absolute -top-4 -left-4 w-28 opacity-60 pointer-events-none"
                /> */}
                <img
                  src="uk1.jpg"
                  alt="Education in UK"
                  className="w-full h-[340px] object-cover rounded"
                />
              </div>
              {/* Right */}
              <div className="flex-1">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-3 rounded" style={{ background: "#0064b0", color: "#fff" }}>
                  AZ Consultations
                </span>
                <h5 className="text-xl font-semibold text-[#282828] mb-4 text-left">Education System in UK</h5>
                <ul className="space-y-2 mb-4">
                  {educationSystemUK.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-base">
                      <CheckCircle /><span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-base mb-3">The different types of undergraduate degree courses to study in UK are:</p>
                <ul className="space-y-2 mb-4">
                  {ugCourses.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-justify">
                      <CheckCircle /><span>{item}</span>
                    </li>
                  ))}
                </ul>
                <h5 className="text-lg font-semibold text-[#282828] mb-2 text-left">Other Courses</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-base">
                    <CheckCircle /><span>HND (Higher End Diploma)</span>
                  </li>
                </ul>
                <p className="text-base text-justify mt-2">This diploma is awarded by Vocational and Technical education councils. It is a 2 year course in subjects of Science and Business. It is the first step towards a degree program as the credits can be transferred.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── University FAQ ──────────────────────────────────────── */}
        <section className="bg-gray-50 py-10">
          <div className="max-w-5xl mx-auto px-6">
            <Accordion items={universityFAQs} />
          </div>
        </section>

        {/* ── Our 8-Step Process ────────────────────────────────────── */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h5 className="text-2xl font-bold text-[#282828] mb-8 text-left">Our Tested and Trusted 8-Step Process</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <AnimatedCard
                  key={i}
                  delay={i * 80}
                  className="bg-[#11346a] text-white p-5 rounded hover:-translate-y-2 hover:bg-[#2958a1] transition-all duration-300 cursor-default min-h-[200px] flex flex-col gap-3"
                >
                  <h4 className="text-base font-semibold text-left">{step.title}</h4>
                  <p className="text-sm leading-relaxed opacity-90 text-left">{step.desc}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why EdNet? ─────────────────────────────────────────────── */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h5 className="text-2xl font-bold text-[#282828] mb-8 text-center">Why AZ Consultations?</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyEdNetCards.map((card, i) => (
                <AnimatedCard
                  key={i}
                  delay={i * 100}
                  className="bg-white border border-gray-200 rounded p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-base font-bold text-[#282828] mb-3">{card.title}</h3>
                  <p className="text-sm text-[#282828] leading-relaxed text-justify">{card.desc}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────── */}
        <section className="py-14" style={{ background: "#0064b0" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-white opacity-70">Testimonials</span>
              <h5 className="text-2xl font-bold text-white mt-1">Our Pakistani Students Testimonials</h5>
            </div>
            <div className="bg-white rounded-lg py-8 px-4 shadow">
              <TestimonialCarousel />
            </div>
          </div>
        </section>

        {/* ── General FAQ ─────────────────────────────────────────── */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h5 className="text-xl font-bold text-[#282828] mb-6 text-left">Frequently Asked Questions</h5>
            <Accordion items={generalFAQs} />
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="bg-[#11346a] text-white py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Col 1 */}
            <div>
              <a href="https://azconsultants.com">
                <img
                  src="/logobg_.png"
                  alt="AZ  Logo"
                  className="h-35 mb-4"
                />
              </a>
              <p className="text-sm opacity-80 leading-relaxed">
                Established in 2020, AZ Consultations has helped hundreds of Pakistani students get admitted to reputed universities all over the world.
              </p>
              {/* Social icons */}
              <div className="flex gap-3 mt-4">
                {[
                  { href: "https://www.facebook.com/azconsultations/", label: "Facebook" },
                  { href: "https://www.youtube.com/azconsultations", label: "YouTube" },
                  { href: "https://www.instagram.com/azconsultations/", label: "Instagram" },
                  { href: "https://www.linkedin.com/in/syed-ahmad-jalal/", label: "LinkedIn" },
                ].map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors text-xs"
                    title={label}
                  >
                    {label[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Study Abroad */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">Study Abroad</h2>
              <ul className="space-y-2">
                {studyAbroadLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="flex items-center gap-2 text-sm hover:text-yellow-300 transition-colors opacity-80 hover:opacity-100">
                      <AngleRight />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">Get In Touch</h2>
              <ul className="space-y-3 text-sm opacity-80">
                <li className="flex items-start gap-2">
                  <i className="fa fa-map-marker mt-0.5" />
                  <span>AZ Consultations, 77 Rue du Faubourg Saint-Martin, 75010 Paris, France</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa fa-phone" />
                  <a href="tel:+33183965723" className="hover:text-yellow-300">+33 1 83 96 57 23</a>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa fa-phone" />
                  <a href="tel:+33676903922" className="hover:text-yellow-300">+33 6 76 90 39 22</a>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa fa-envelope" />
                  <a href="mailto:info@azconsultations.com" className="hover:text-yellow-300">info@azconsultations.com</a>
                </li>
              </ul>
              <a
                href="/contact_us"
                className="inline-block mt-5 bg-[#0064b0] hover:bg-[#00529a] transition-colors text-white text-sm px-5 py-2.5 rounded font-medium"
              >
                Request A Consultation
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs opacity-60">
            © {new Date().getFullYear()} AZ Consultations. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}