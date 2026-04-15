import { useEffect } from "react";

/* ─────────────────────────────────────────────
   Keyframes injected once via a <style> tag.
   Tailwind doesn't ship every keyframe we need,
   so we define them inline here.
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

  /* Phone CTA animations */
  @keyframes phone-outer {
    0%,100% { transform: translate3d(0,0,0) scale(1); box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
    33.3333% { transform: translate3d(0,0,0) scale(1.1); box-shadow: 0 0 0 0 rgba(52,152,219,.3), 0 .05em .1em rgba(0,0,0,.5); }
    66.6666% { transform: translate3d(0,0,0) scale(1); box-shadow: 0 0 0 .5em rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2); }
  }
  @keyframes phone-inner {
    0%   { opacity:1; transform: translate3d(0,0,0) scale(0); }
    33.3333% { opacity:1; transform: translate3d(0,0,0) scale(.9); }
    66.6666%,100% { opacity:0; transform: translate3d(0,0,0) scale(0); }
  }
  @keyframes phone-icon {
    0%,46% { transform: translate3d(0,0,0); }
    2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42% { transform: translate3d(.01em,0,0); }
    4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44% { transform: translate3d(-.01em,0,0); }
  }

  .phone-cta-icon.is-animating { animation: 3s infinite phone-outer; }
  .phone-cta-icon.is-animating::before { animation: 3s infinite phone-inner; }
  .phone-cta-icon.is-animating::after  { animation: 3s infinite phone-icon; }

  /* Floating social icons */
  .floating-icon { position:fixed; top:50%; left:0; transform:translateY(-50%); margin:0; padding:0; z-index:9; }
  .floating-icon li { list-style:none; }
  .wpfm-icon-block {
    position:relative; top:0; width:40px; line-height:40px;
    background:rgb(0 100 176); display:block; text-align:center;
    z-index:99; transition:all 0.5s ease; color:#fff; height:40px; margin-bottom:3px;
  }
  .wpfm-icon-block:hover { background: #0052a3; transform: translateX(4px); }

  /* CTA phone button */
  .phone-cta-icon {
    position:relative; display:block; margin:0;
    width:1em; height:1em; font-size:60px; line-height:60px;
    background-color:#0064b0; border-radius:.5em;
    box-shadow:0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    transform:translate3d(0,0,0) scale(1);
  }
  .phone-cta-icon::after, .phone-cta-icon::before {
    position:absolute; content:"";
  }
  .phone-cta-icon::after {
    top:.25em; left:.25em; width:.5em; height:.5em;
    background:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTYuNiAxMC44YzEuNCAyLjggMy44IDUuMSA2LjYgNi42bDIuMi0yLjJjLjMtLjMuNy0uNCAxLS4yIDEuMS40IDIuMy42IDMuNi42LjUgMCAxIC40IDEgMVYyMGMwIC41LS41IDEtMSAxLTkuNCAwLTE3LTcuNi0xNy0xNyAwLS42LjQtMSAxLTFoMy41Yy41IDAgMSAuNCAxIDEgMCAxLjIuMiAyLjUuNiAzLjYuMS40IDAgLjctLjIgMWwtMi4zIDIuMnoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=") 50% 50%/cover no-repeat;
    transform:translate3d(0,0,0);
  }
  .phone-cta-icon::before {
    color:#fff; font-size:34px; display:flex; align-items:center; justify-content:center;
    inset:0; width:100%; height:100%;
  }

  /* WhatsApp CTA */
  .whatsapp-cta-icon {
    position:relative; display:block; margin:0;
    width:1em; height:1em; font-size:60px; line-height:60px;
    background-color:#34a94d; border-radius:.5em;
    box-shadow:0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    transform:translate3d(0,0,0) scale(1);
  }
  .whatsapp-cta-icon::after, .whatsapp-cta-icon::before {
    position:absolute; content:"";
  }
  .whatsapp-cta-icon::before {
    color:#fff; font-size:34px; display:flex; align-items:center; justify-content:center;
    inset:0; width:100%; height:100%;
  }
  .whatsapp-cta-icon.is-animating { animation: 3s infinite phone-outer; }

  /* Scroll-triggered fade-in animations */
  .fade-in-left { opacity:0; transform:translateX(-60px); transition:opacity 0.8s ease, transform 0.8s ease; }
  .fade-in-right { opacity:0; transform:translateX(60px); transition:opacity 0.8s ease, transform 0.8s ease; }
  .fade-in-up { opacity:0; transform:translateY(40px); transition:opacity 0.7s ease, transform 0.7s ease; }
  .animated-visible { opacity:1 !important; transform:translate(0,0) !important; }

  /* Image hover scale */
  .img-hover-scale { transition: transform 0.5s ease; }
  .img-hover-scale:hover { transform: scale(1.06); }

  /* Icon list links */
  .icon-list-link { display:flex; align-items:center; gap:8px; padding:6px 0; color:#282828; text-decoration:none; font-size:15px; transition: color 0.2s; }
  .icon-list-link:hover { color: #0064b0; }
  .icon-list-icon { color: #0064b0; font-size:13px; flex-shrink:0; }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width:8px; }
  ::-webkit-scrollbar-track { background-color:#ebebeb; border-radius:10px; }
  ::-webkit-scrollbar-thumb { border-radius:10px; background:#193393; }

  /* Responsive img */
  .section-img { width:100%; height:auto; object-fit:cover; display:block; }
`;

/* ─────────────────────────────────────────────
   Intersection Observer hook for scroll animations
───────────────────────────────────────────── */
function useScrollAnimation() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-left, .fade-in-right, .fade-in-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const siblings = Array.from(e.target.parentElement?.children || []);
            const idx = siblings.indexOf(e.target);
            e.target.style.transitionDelay = `${idx * 0.15}s`;
            e.target.classList.add("animated-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   Chevron right SVG (angle-right)
───────────────────────────────────────────── */
const ChevronRight = () => (
  <svg aria-hidden="true" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg" width="10" height="14" fill="currentColor">
    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
  </svg>
);

/* ─────────────────────────────────────────────
   SECTION COMPONENTS
───────────────────────────────────────────── */

/** Hero banner image */
function HeroBanner() {
  return (
    <div className="w-full">
      <img
        src="/why.png"
        alt="Why AZ Consultations"
        className="section-img w-full"
        style={{ maxHeight: 384, objectFit: "cover" }}
      />
    </div>
  );
}

/** Expert Counsellors section */
function ExpertCounsellors() {
  return (
    <div className="w-full py-10 px-4" style={{ background: "#f9f9f9" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* Left image */}
        <div className="fade-in-left w-full md:w-1/2 overflow-hidden rounded">
          <img
            src="zahid.jpeg"
            alt="Expert Counsellors"
            className="section-img img-hover-scale rounded"
            style={{ maxHeight: 460 }}
            onError={(e) => { e.target.src = "https://www.ednetconsultants.com/wp-content/uploads/2024/09/whyednet.jpg"; }}
          />
        </div>
        {/* Right text */}
        <div className="fade-in-right w-full md:w-1/2 flex flex-col gap-4">
          <h6 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#0064b0" }}>
            AZ Consultations
          </h6>
          <h1
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: "#11346a", textAlign: "left" }}
          >
            Expert Counsellors
          </h1>
          <p className="text-base leading-relaxed text-justify" style={{ color: "#282828" }}>
            Choosing a career path involves critical decisions: Which course suits best? Which university offers the ideal environment? Which country enhances career prospects? Such questions can overwhelm students, making the decision daunting and confusing. This is where our mentoring and career counseling services prove invaluable. We consider each student's interests, background, achievements, and aspirations to provide tailored guidance. Our goal is to help Pakistani students handle these uncertainties with ease and secure admission into their dream universities abroad.
          </p>
          {/* Student letter / services info box */}
          <div
            style={{
              background: "#eef4fb",
              borderLeft: "4px solid #0064b0",
              borderRadius: 6,
              padding: "16px 20px",
              marginTop: 8,
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "#282828" }}>
              <strong>Dear Student,</strong><br />
              Greetings from Paris. Thank you for your interest in studying abroad. We are pleased to offer our professional educational consultancy services for students from <strong>Pakistan</strong> who wish to pursue higher education abroad.
            </p>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "#282828" }}>
              Our services include: University &amp; Program Selection, Admission Processing, CV &amp; Motivation Letter Preparation, Document Translation, and Interview Preparation for Campus France &amp; visa interviews.
            </p>
            <p className="text-sm mt-2" style={{ color: "#555" }}>
              <strong>Office:</strong> 77 Rue du Faubourg Saint-Martin, 75010 Paris, France<br />
              <strong>Tel:</strong> +33 1 83 96 57 23 &nbsp;|&nbsp; <strong>Mobile:</strong> +33 6 76 90 39 22
            </p>
            <p className="text-sm mt-1" style={{ color: "#0064b0" }}>
              — <em>Ahmad Jalal Syed, Education Consultant – Paris / Lahore</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 5+ Years section (dark bg) */
function YearsExperience() {
  return (
    <div className="w-full py-14 px-4" style={{ background: "#11346a" }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-5"
          style={{ fontFamily: "'Playfair Display', serif", color: "#fff", textAlign: "left" }}
        >
          5+ Years of Experience
        </h2>
        <p className="text-base leading-relaxed text-justify" style={{ color: "#d0dff5" }}>
          Established in 2020, AZ Consultations has assisted hundreds of Pakistani students in gaining admission to prestigious universities in France and across Europe. Our years of experience in counselling students for higher education abroad illustrates our expertise in connecting with students, parents, and leading academic institutions. Syed Ahmad Jalal, our director, is a highly knowledgeable and results-oriented professional based in Paris. Leveraging his expertise and deep exposure to French universities and their programs, he guides Pakistani students effectively through every step of their admission journey — from university selection to visa preparation.
        </p>
      </div>
    </div>
  );
}

/** 100% Successful Applications */
function SuccessfulApplications() {
  return (
    <div className="w-full py-10 px-4" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* Left image */}
        <div className="fade-in-left w-full md:w-1/2 overflow-hidden rounded">
          <img
            src="paki.png"
            alt="Successful Applications"
            className="section-img img-hover-scale rounded"
            style={{ maxHeight: 420 }}
          />
        </div>
        {/* Right text */}
        <div className="fade-in-right w-full md:w-1/2 flex flex-col gap-4">
          <h2
            className="text-2xl md:text-3xl font-bold leading-snug"
            style={{ fontFamily: "'Playfair Display', serif", color: "#11346a", textAlign: "left" }}
          >
            100% Successful Applications
          </h2>
          <p className="text-base leading-relaxed text-justify" style={{ color: "#282828" }}>
            With hundreds of Pakistani students joining our program annually, we have a proven track record of successful university admissions at both undergraduate and postgraduate levels. Our students have secured places at renowned institutions in France, including top Grandes Écoles, business schools, and leading engineering universities. At AZ Consultations, our transparent and rigorous process includes multiple checkpoints throughout the application, ensuring quality assurance and guaranteed results. We prioritize our clients' time, energy, and effort — ensuring every application is precise, compelling, and tailored to meet university and Campus France standards.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Highest Acceptance Rates */
function AcceptanceRates() {
  return (
    <div className="w-full py-10 px-4" style={{ background: "#f2f7ff" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* Left text */}
        <div className="fade-in-left w-full md:w-1/2 flex flex-col gap-4">
          <h2
            className="text-2xl md:text-3xl font-bold leading-snug"
            style={{ fontFamily: "'Playfair Display', serif", color: "#11346a", textAlign: "left" }}
          >
            Highest Acceptance Rates
          </h2>
          <p className="text-base leading-relaxed text-justify" style={{ color: "#282828" }}>
            Over the years, our Pakistani students have graduated with distinctions from prestigious universities across France and Europe. We maintain high acceptance rates in destinations such as France, Germany, Spain, Italy, and Belgium. A significant number of our students who followed our admissions guidance have successfully secured scholarships and financial assistance, enabling them to fully embrace university life abroad and build outstanding international careers.
          </p>
        </div>
        {/* Right image */}
        <div className="fade-in-right w-full md:w-1/2 overflow-hidden rounded">
          <img
            src="https://www.ednetconsultants.com/wp-content/uploads/2024/06/acceptance.jpg"
            alt="Acceptance Rates"
            className="section-img img-hover-scale rounded"
            style={{ maxHeight: 420 }}
          />
        </div>
      </div>
    </div>
  );
}

/** Students Counselled */
function StudentsCounselled() {
  return (
    <div className="w-full py-10 px-4" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* Left image */}
        <div className="fade-in-left w-full md:w-1/2 overflow-hidden rounded">
          <img
            src="paki_2.png"
            alt="Students Counselled"
            className="section-img img-hover-scale rounded"
            style={{ maxHeight: 420 }}
          />
        </div>
        {/* Right text */}
        <div className="fade-in-right w-full md:w-1/2 flex flex-col gap-4">
          <h2
            className="text-2xl md:text-3xl font-bold leading-snug"
            style={{ fontFamily: "'Playfair Display', serif", color: "#11346a", textAlign: "left" }}
          >
            500+ Pakistani Students Counselled
          </h2>
          <p className="text-base leading-relaxed text-justify" style={{ color: "#282828" }}>
            The AZ Consultations team is renowned for their passion and unwavering commitment to every Pakistani student. We bring together deep knowledge of the French higher education system, visa requirements, and Campus France procedures to ensure you receive the best guidance possible. Understanding each student's unique potential, academic background, and career ambitions is our top priority. Our goal is clear — to guide you towards the university and program that best fits your goals, with personalised, streamlined, and professional services every step of the way.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Personalised Attention */
function PersonalisedAttention() {
  return (
    <div className="w-full py-10 px-4" style={{ background: "#f2f7ff" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* Left text */}
        <div className="fade-in-left w-full md:w-1/2 flex flex-col gap-4">
          <h2
            className="text-2xl md:text-3xl font-bold leading-snug"
            style={{ fontFamily: "'Playfair Display', serif", color: "#11346a", textAlign: "left" }}
          >
            Personalised Attention
          </h2>
          <p className="text-base leading-relaxed text-justify" style={{ color: "#282828" }}>
            When you join AZ Consultations, you become part of our family. We are known for our dedication in providing tailored services to Pakistani students seeking education in France and Europe. Our team works diligently to ensure each university application highlights your strengths uniquely — from crafting a compelling motivation letter to preparing you thoroughly for your Campus France and visa interview. Want to study in France? Work hard, and let AZ Consultations guide you towards achieving your educational dreams.
          </p>
          {/* Pakistan-relevant recognitions */}
          <div style={{ marginTop: 8 }}>
            <h3
              className="text-lg font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: "#11346a" }}
            >
              Recognition &amp; Affiliations
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Recognised by Campus France Pakistan for student file preparation",
                "Affiliated with the French Embassy – Pakistan student visa process",
                "Trusted by leading universities across France and Europe",
                "Official partner for Pakistani students pursuing Grande École admissions",
                "Awarded Best Education Consultancy – Pakistan (France Destination) 2023",
                "Member of the Pakistan-France Education Cooperation Network",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ color: "#0064b0", marginTop: 3, flexShrink: 0 }}><ChevronRight /></span>
                  <span style={{ fontSize: 15, color: "#282828" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right image */}
        <div className="fade-in-right w-full md:w-1/2 overflow-hidden rounded">
          <img
            src="meetingg.png"
            alt="Personalised Attention"
            className="section-img img-hover-scale rounded"
            style={{ maxHeight: 420 }}
          />
        </div>
      </div>
    </div>
  );
}

/** Footer links section */
function FooterLinks() {
  const studyAbroadLinks = [
    { label: "Study in France", href: "/study_france/study_france.html" },
    { label: "Study in Germany", href: "/study_germany/study_germany.html" },
    { label: "Study in UK", href: "/study_uk/study_uk.html" },
    { label: "Study in Spain", href: "/study_spain/study_spain.html" },
    { label: "Study in Italy", href: "/study_italy/study_italy.html" },
    { label: "Study in Belgium", href: "/study_belgium/study_belgium.html" },
  ];
  const otherLinks = [
    { label: "Scholarships", href: "/sucess_scholarship_secured/sucess_scholarship_secured.html" },
    { label: "Testimonials", href: "/study_testimonials/study_testimonials.html" },
    { label: "Visa Assistance", href: "/visa_assist/visa_assist.html" },
  ];

  return (
    <div className="w-full py-12 px-4" style={{ background: "#0c2c52" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Company info */}
        <div className="fade-in-up flex flex-col gap-4 md:w-1/3">
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            AZ Consultations
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#b0c4de" }}>
            Established in 2020, AZ Consultations has helped hundreds of Pakistani students gain admission to prestigious universities in France and across Europe.
          </p>
          <p className="text-sm" style={{ color: "#b0c4de" }}>
            77 Rue du Faubourg Saint-Martin, 75010 Paris, France<br />
            Office: +33 1 83 96 57 23<br />
            Mobile: +33 6 76 90 39 22
          </p>
          {/* Social icons */}
          <div className="flex gap-3 mt-2">
            {[
              { href: "https://www.facebook.com/", icon: "fa-facebook", label: "Facebook" },
              { href: "https://www.youtube.com/", icon: "fa-youtube", label: "YouTube" },
              { href: "https://www.instagram.com/", icon: "fa-instagram", label: "Instagram" },
              { href: "https://www.linkedin.com/", icon: "fa-linkedin", label: "LinkedIn" },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center rounded-full transition-colors"
                style={{
                  width: 34, height: 34,
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: 15,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0064b0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              >
                <i className={`fa ${icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Study Abroad */}
        <div className="fade-in-up md:w-1/3">
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "#fff", textAlign: "left", fontFamily: "'Playfair Display', serif" }}
          >
            STUDY ABROAD
          </h2>
          <ul className="space-y-1">
            {studyAbroadLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="icon-list-link" style={{ color: "#b0c4de" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#60aeff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#b0c4de"; }}
                >
                  <span className="icon-list-icon" style={{ color: "#60aeff" }}><ChevronRight /></span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Links */}
        <div className="fade-in-up md:w-1/3">
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "#fff", textAlign: "left", fontFamily: "'Playfair Display', serif" }}
          >
            OTHER LINKS
          </h2>
          <ul className="space-y-1">
            {otherLinks.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="icon-list-link" style={{ color: "#b0c4de" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#60aeff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#b0c4de"; }}
                >
                  <span className="icon-list-icon" style={{ color: "#60aeff" }}><ChevronRight /></span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Floating social sidebar
───────────────────────────────────────────── */
function FloatingSocials() {
  const socials = [
    { href: "https://www.facebook.com/", icon: "fa-facebook", label: "Facebook" },
    { href: "https://twitter.com/", icon: "fa-twitter", label: "Twitter" },
    { href: "https://www.linkedin.com/in/syed-ahmad-jalal/", icon: "fa-linkedin", label: "LinkedIn" },
    { href: "https://www.instagram.com/", icon: "fa-instagram", label: "Instagram" },
  ];
  return (
    <ul className="floating-icon">
      {socials.map(({ href, icon, label }) => (
        <li key={label} className="wpfm-title-hidden">
          <a href={href} target="_blank" rel="noopener noreferrer" title={label}>
            <span className="wpfm-icon-block">
              <i aria-hidden="true" className={`fa ${icon}`}></i>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────────────────────────────
   Fixed CTA buttons (bottom)
───────────────────────────────────────────── */
function CTAButtons() {
  return (
    <>
      {/* Request Consultation – bottom left */}
      <div style={{ position: "fixed", bottom: 25, left: 20, zIndex: 999, cursor: "pointer" }}>
        <a
          href="/contact_us/contact_us.html"
          style={{
            background: "#0064b0", padding: "10px 14px", color: "#fff",
            borderRadius: 5, fontSize: 15, textDecoration: "none", display: "inline-block",
          }}
        >
          Request A Consultation
        </a>
      </div>

      {/* WhatsApp – bottom right */}
      <div style={{ position: "fixed", bottom: 25, right: 30, zIndex: 999, cursor: "pointer" }}>
        <a
          href="https://api.whatsapp.com/send?phone=33676903922"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="whatsapp-cta-icon fa fa-whatsapp is-animating"></i>
        </a>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────── */
export default function WhyAZ() {
  useScrollAnimation();

  return (
    <>
    <div id="whyaz">
      {/* Inject global styles once */}
      <style>{GLOBAL_STYLES}</style>

      {/* Floating social sidebar */}
      <FloatingSocials />

      {/* Fixed CTA buttons */}
      <CTAButtons />

      {/* Page content */}
      <main style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <HeroBanner />
        <ExpertCounsellors />
        <YearsExperience />
        <SuccessfulApplications />
        <AcceptanceRates />
        <StudentsCounselled />
        <PersonalisedAttention />
        <FooterLinks />
      </main>
      </div>
    </>
  );
}