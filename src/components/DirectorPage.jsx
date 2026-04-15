import { useState, useEffect, useRef } from "react";

// ── Keyframe animations injected once via a <style> tag ──────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

  /* Marquee */
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* Phone outer ring pulse */
  @keyframes phone-outer {
    0%,100% {
      transform: translate3d(0,0,0) scale(1);
      box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    }
    33.3333% {
      transform: translate3d(0,0,0) scale(1.1);
      box-shadow: 0 0 0 0 rgba(52,152,219,.3), 0 .05em .1em rgba(0,0,0,.5);
    }
    66.6666% {
      transform: translate3d(0,0,0) scale(1);
      box-shadow: 0 0 0 .5em rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    }
  }

  /* Phone inner ripple */
  @keyframes phone-inner {
    0%         { opacity:1; transform:translate3d(0,0,0) scale(0); }
    33.3333%   { opacity:1; transform:translate3d(0,0,0) scale(.9); }
    66.6666%,100% { opacity:0; transform:translate3d(0,0,0) scale(0); }
  }

  /* Phone icon shake */
  @keyframes phone-icon {
    0%,46% { transform:translate3d(0,0,0); }
    2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42% { transform:translate3d(.01em,0,0); }
    4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44% { transform:translate3d(-.01em,0,0); }
  }

  /* WhatsApp / green button outer */
  @keyframes wa-outer {
    0%,100% {
      transform: translate3d(0,0,0) scale(1);
      box-shadow: 0 0 0 0 rgba(52,219,100,0), 0 .05em .1em rgba(0,0,0,.2);
    }
    33.3333% {
      transform: translate3d(0,0,0) scale(1.1);
      box-shadow: 0 0 0 0 rgba(52,219,100,.3), 0 .05em .1em rgba(0,0,0,.5);
    }
    66.6666% {
      transform: translate3d(0,0,0) scale(1);
      box-shadow: 0 0 0 .5em rgba(52,219,100,0), 0 .05em .1em rgba(0,0,0,.2);
    }
  }

  /* Fade-in from left */
  @keyframes fadeInLeft {
    from { opacity:0; transform:translateX(-60px); }
    to   { opacity:1; transform:translateX(0); }
  }

  /* Fade-in from right */
  @keyframes fadeInRight {
    from { opacity:0; transform:translateX(60px); }
    to   { opacity:1; transform:translateX(0); }
  }

  /* Image hover zoom */
  .overlay-img { transition: transform 0.5s ease; }
  .overlay-wrap:hover .overlay-img { transform: scale(1.06); }

  /* Phone CTA button animation classes */
  .phone-btn-animating {
    animation: phone-outer 3s infinite;
  }
  .phone-btn-animating::before {
    animation: phone-inner 3s infinite;
  }
  .phone-btn-animating::after {
    animation: phone-icon 3s infinite;
  }

  /* WhatsApp button animation */
  .wa-btn-animating {
    animation: wa-outer 3s infinite;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background-color:#ebebeb; border-radius:10px; }
  ::-webkit-scrollbar-thumb { border-radius:10px; background:#193393; }
`;

// ── Helper: intersection-observer hook ───────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Small reusable components ─────────────────────────────────────────────────

function AngleRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-current">
      <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/>
    </svg>
  );
}

function FooterLinkList({ title, links }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-bold tracking-widest text-white uppercase border-b border-white/20 pb-2">{title}</h2>
      <ul className="flex flex-col gap-2">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors duration-200">
              <span className="text-[#0064b0]"><AngleRightIcon /></span>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DirectorPage() {
  const [imgRef, imgInView] = useInView();
  const [txtRef, txtInView] = useInView();

  return (
    <>
    <div id="director-message">
      {/* Inject global keyframes once */}
      <style>{GLOBAL_STYLES}</style>

      <div className="font-['Source_Serif_4',serif] bg-white">

        {/* ── Marquee Banner ─────────────────────────────────────────────────
        <div className="relative w-full h-10 overflow-hidden bg-[#0064b0]">
          <div
            className="absolute whitespace-nowrap will-change-transform"
            style={{ animation: "marquee 24s linear infinite" }}
          >
            <span className="text-white text-sm">
              AZ Consultations – Helping Pakistani Students Achieve Their Dream of Studying in France &amp; Europe.&nbsp;&nbsp;
              AZ Consultations – Helping Pakistani Students Achieve Their Dream of Studying in France &amp; Europe.&nbsp;&nbsp;
              AZ Consultations – Helping Pakistani Students Achieve Their Dream of Studying in France &amp; Europe.&nbsp;&nbsp;
              AZ Consultations – Helping Pakistani Students Achieve Their Dream of Studying in France &amp; Europe.&nbsp;&nbsp;
            </span>
          </div>
        </div> */}

        {/* ── Award Banner ─────────────────────────────────────────────────── */}
        <div className="bg-[#11346a] py-4 px-6 text-center">
          <h2 className="text-white text-lg font-semibold font-['Playfair_Display',serif]">Our Director was Awarded</h2>
          <p className="text-gray-200 text-sm mt-1">
            Best Education Consultant for Pakistani Students – France<br />
            at the Pakistan International Education Excellence Awards (PIEEA)
          </p>
        </div>

        {/* ── Main Section: Image + Text ────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col lg:flex-row gap-10 items-center">

          {/* Director Photo – fadeInLeft */}
          <div
            ref={imgRef}
            className="lg:w-5/12 w-full rounded-lg overflow-hidden shadow-2xl overlay-wrap"
            style={{
              opacity: imgInView ? 1 : 0,
              transform: imgInView ? "translateX(0)" : "translateX(-60px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <img
              src="director.jpeg"
              alt="Director Syed Ahmad Jalal"
              className="w-full h-auto object-cover overlay-img"
            />
          </div>

          {/* Text Block – fadeInRight */}
          <div
            ref={txtRef}
            className="lg:w-7/12 w-full relative"
            style={{
              opacity: txtInView ? 1 : 0,
              transform: txtInView ? "translateX(0)" : "translateX(60px)",
              transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
            }}
          >
            {/* Label pill */}
            <span className="inline-block bg-[#0064b0] text-white text-xs font-semibold tracking-widest uppercase px-4 py-1 rounded-full mb-4">
              Director Message
            </span>

            <h1
              className="text-3xl lg:text-4xl font-['Playfair_Display',serif] font-bold text-[#11346a] leading-tight mb-5"
            >
              Meet Syed Ahmad Jalal –<br />
              <span className="text-[#0064b0]">Top Education Consultant</span> in Paris
            </h1>

            <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">
              Dear Student,<br /><br />
              Greetings from Paris. Thank you for your interest in studying abroad. Since 2020, I have been
              dedicated to offering professional educational consultancy services for students from Pakistan
              who wish to pursue higher education abroad. Founding AZ Consultations sparked my vision to
              empower Pakistani students with access to the world's finest universities, fostering a global
              mindset and knowledge base. Today, AZ Consultations has become a trusted guide for future
              leaders, thinkers, scientists, and researchers from Pakistan.
            </p>

            <p className="text-gray-700 text-base leading-relaxed mb-6 text-justify">
              Over the years, AZ Consultations has evolved into a comprehensive solution for both students
              and parents, adapting continuously to meet the dynamic demands of universities and industry
              benchmarks. Our team has grown to provide a wide spectrum of services, encompassing profile
              building, document preparation, and complete admission support for superior outcomes.
            </p>

            {/* Services Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-[#11346a] mb-3">Our Services</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-3 text-justify">
                We provide complete support for your admission process, including:
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-[#0064b0] mb-1">1. University &amp; Program Selection</h3>
                  <p className="text-gray-700 text-sm leading-relaxed text-justify">
                    We identify suitable universities and study programs based on your academic background,
                    career goals, and budget. University tuition fees depend on the selected program,
                    university, and city. After signing our consultancy contract, we will share full details
                    of available universities, programs, and their respective tuition fees. University fees
                    will be paid directly by the student to the university.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0064b0] mb-1">2. Admission Process</h3>
                  <p className="text-gray-700 text-sm leading-relaxed text-justify">
                    We apply to universities on your behalf, secure your admission, and provide the official
                    Admission Letter and all related documents.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0064b0] mb-1">3. Document Preparation</h3>
                  <p className="text-gray-700 text-sm leading-relaxed text-justify">
                    Preparation of your CV according to international standards, writing of a professional
                    Letter of Motivation, and translation of documents (translation fees are extra and depend
                    on the number and language of documents).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0064b0] mb-1">4. Interview Preparation</h3>
                  <p className="text-gray-700 text-sm leading-relaxed text-justify">
                    Guidance and preparation for the Campus France and visa interview.
                  </p>
                </div>
              </div>
            </div>

            {/* Visa Disclaimer */}
            <div className="bg-blue-50 border-l-4 border-[#0064b0] p-4 rounded mb-6">
              <h2 className="text-[#11346a] font-bold mb-1">Visa Application &amp; Disclaimer</h2>
              <p className="text-gray-700 text-sm leading-relaxed text-justify">
                Please note that we do not sell, arrange, or guarantee visas. Our responsibility is limited
                to preparing your academic and admission file according to university requirements and Embassy
                standards. Our service covers university search, admission processing, CV preparation,
                motivation letter, and complete file preparation. Translation fees and insurance costs are
                not included and must be paid separately by the student.
              </p>
            </div>

            {/* Contact Info */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong className="text-[#11346a]">Kind regards,</strong><br />
                <span className="font-semibold text-[#0064b0]">Ahmad Jalal Syed</span><br />
                Education Consultant – France<br />
                Office: Paris / Lahore<br />
                Office: <a href="tel:+33183965723" className="hover:text-[#0064b0] transition-colors">+33 1 83 96 57 23</a><br />
                Mobile: <a href="tel:+33676903922" className="hover:text-[#0064b0] transition-colors">+33 6 76 90 39 22</a>
              </p>
            </div>

            {/* Decorative floating dot graphic (matches the original absolute image) */}
            <div
              className="absolute -bottom-6 -right-6 w-28 h-28 opacity-20 pointer-events-none select-none"
              style={{ transform: "rotate(3deg)" }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 176 168" fill="none" xmlns="http://www.w3.org/2000/svg">
                {[...Array(6)].map((_, row) =>
                  [...Array(6)].map((_, col) => (
                    <circle
                      key={`${row}-${col}`}
                      cx={14 + col * 30}
                      cy={14 + row * 28}
                      r="6"
                      fill="#0064b0"
                    />
                  ))
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* ── Office Address Section ────────────────────────────────────────── */}
        <div className="bg-gray-50 py-8 px-6 text-center border-t border-gray-200">
          <h2 className="text-[#11346a] font-bold font-['Playfair_Display',serif] text-xl mb-2">Office Address</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong>AZ Consultations</strong><br />
            77 Rue du Faubourg Saint-Martin, 75010 Paris, France
          </p>
          <p className="text-gray-600 text-sm mt-3">
            If you wish to begin your application or need further information, please feel free to contact us.<br />
            We look forward to assisting you in achieving your educational goals in France.
          </p>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="bg-[#11346a] text-white">
          <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand column */}
            <div className="flex flex-col gap-4">
              <img
                src="logobg_.png"
                alt="AZ Consultations Logo"
                className="h-34 object-contain brightness-0 invert"
              />
              <p className="text-gray-300 text-sm leading-relaxed">
                Established in 2020, AZ Consultations has helped hundreds of Pakistani students get admitted to reputed universities in France and Europe.
              </p>
              {/* Social icons */}
              <div className="flex gap-3 mt-2">
                {[
                  { href: "https://www.facebook.com/AZConsultations/", icon: "fa-facebook" },
                  { href: "https://www.youtube.com/", icon: "fa-youtube" },
                  { href: "https://www.instagram.com/azconsultations/", icon: "fa-instagram" },
                  { href: "https://www.linkedin.com/in/ahmadjalalsyed/", icon: "fa-linkedin" },
                ].map(({ href, icon }) => (
                  <a
                    key={icon}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0064b0] flex items-center justify-center transition-colors duration-300"
                  >
                    <i className={`fa ${icon} text-white text-sm`} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <FooterLinkList
              title="Study Abroad"
              links={[
                { label: "Study in France", href: "#" },
                { label: "Study in UK", href: "#" },
                { label: "Study in Germany", href: "#" },
                { label: "Study in Canada", href: "#" },
                { label: "Study in Australia", href: "#" },
                { label: "Study in Europe", href: "#" },
              ]}
            />

            <FooterLinkList
              title="Other Links"
              links={[
                { label: "Scholarships", href: "#" },
                { label: "Testimonials", href: "#" },
                { label: "Visa Assistance", href: "#" },
              ]}
            />

            {/* Contact column */}
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-bold tracking-widest text-white uppercase border-b border-white/20 pb-2">Contact Us</h2>
              <ul className="flex flex-col gap-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 fill-[#0064b0]" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                  </svg>
                  <span>77 Rue du Faubourg Saint-Martin, 75010 Paris, France</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 fill-[#0064b0]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/>
                  </svg>
                  <span>info@azconsultations.fr</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 fill-[#0064b0]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
                  </svg>
                  <a href="tel:+33183965723" className="hover:text-white transition-colors">+33 1 83 96 57 23</a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 fill-[#0064b0]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
                  </svg>
                  <a href="tel:+33676903922" className="hover:text-white transition-colors">+33 6 76 90 39 22</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="border-t border-white/10 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 max-w-6xl mx-auto w-full">
            <span>Copyright © 2026 AZ Consultations | Paris, France</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </footer>

        {/* ── Floating Social Sidebar ──────────────────────────────────────── */}
        <ul className="fixed top-1/2 left-0 -translate-y-1/2 z-50 m-0 p-0 list-none">
          {[
            { href: "https://www.facebook.com/AZConsultations/", icon: "fa-facebook" },
            { href: "https://twitter.com/azconsultations", icon: "fa-twitter" },
            { href: "https://www.linkedin.com/in/ahmadjalalsyed/", icon: "fa-linkedin" },
            { href: "https://www.instagram.com/azconsultations/", icon: "fa-instagram" },
          ].map(({ href, icon }) => (
            <li key={icon} className="list-none mb-[3px]">
              <a href={href} target="_blank" rel="noreferrer">
                <span
                  className="flex items-center justify-center w-10 h-10 text-white transition-all duration-500 hover:w-14"
                  style={{ background: "rgb(0,100,176)" }}
                >
                  <i className={`fa ${icon}`} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* ── Fixed CTA: "Request A Consultation" (bottom-left) ────────────── */}
        <div className="fixed bottom-6 left-5 z-[999]">
          <a
            href="../contact_us/contact_us.html"
            className="bg-[#0064b0] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#00519a] transition-colors shadow-lg"
          >
            Request A Consultation
          </a>
        </div>

        {/* ── Fixed CTA: WhatsApp (bottom-right) ───────────────────────────── */}
        <div className="fixed bottom-6 right-8 z-[999]">
          <a href="https://api.whatsapp.com/send?phone=33676903922" target="_blank" rel="noreferrer">
            <PhoneButton color="#34a94d" animationClass="wa-btn-animating" iconClass="fa-whatsapp" />
          </a>
        </div>

      </div>
      </div>
    </>
  );
}

// ── Animated phone/WhatsApp button ───────────────────────────────────────────
function PhoneButton({ color, animationClass, iconClass }) {
  return (
    <span
      className={`relative block w-[60px] h-[60px] rounded-lg text-white flex items-center justify-center text-2xl cursor-pointer ${animationClass}`}
      style={{
        backgroundColor: color,
        fontSize: "60px",
        lineHeight: "60px",
        width: "1em",
        height: "1em",
        borderRadius: ".5em",
      }}
    >
      <i className={`fa ${iconClass}`} style={{ fontSize: "34px", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }} aria-hidden="true" />
    </span>
  );
}