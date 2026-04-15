import { useEffect, useRef, useState } from "react";

// Keyframe animations injected via style tag
const ANIMATIONS = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes phone-outer {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
      box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    }
    33.3333% {
      transform: translate3d(0, 0, 0) scale(1.1);
      box-shadow: 0 0 0 0 rgba(52,152,219,.3), 0 .05em .1em rgba(0,0,0,.5);
    }
    66.6666% {
      transform: translate3d(0, 0, 0) scale(1);
      box-shadow: 0 0 0 .5em rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    }
  }
  @keyframes phone-inner {
    0% { opacity: 1; transform: translate3d(0,0,0) scale(0); }
    33.3333% { opacity: 1; transform: translate3d(0,0,0) scale(.9); }
    66.6666%, 100% { opacity: 0; transform: translate3d(0,0,0) scale(0); }
  }
  @keyframes phone-icon {
    0%, 46% { transform: translate3d(0,0,0); }
    2%, 6%, 10%, 14%, 18%, 22%, 26%, 30%, 34%, 38%, 42% { transform: translate3d(.01em,0,0); }
    4%, 8%, 12%, 16%, 20%, 24%, 28%, 32%, 36%, 40%, 44% { transform: translate3d(-.01em,0,0); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .animate-fade-in-left {
    animation: fadeInLeft 0.8s ease forwards;
  }
  .animate-fade-in-right {
    animation: fadeInRight 0.8s ease forwards;
  }
  .is-animating {
    animation: phone-outer 3s infinite;
  }
  .is-animating::before {
    animation: phone-inner 3s infinite;
  }
  .is-animating::after {
    animation: phone-icon 3s infinite;
  }
  .phone-icon-pseudo {
    position: relative;
    display: block;
    margin: 0;
    width: 1em;
    height: 1em;
    font-size: 60px;
    line-height: 60px;
    border-radius: .5em;
    box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    transform: translate3d(0,0,0) scale(1);
  }
  .phone-icon-pseudo::after,
  .phone-icon-pseudo::before {
    position: absolute;
    content: "";
  }
  .phone-icon-pseudo::after {
    top: .25em;
    left: .25em;
    width: .5em;
    height: .5em;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTYuNiAxMC44YzEuNCAyLjggMy44IDUuMSA2LjYgNi42bDIuMi0yLjJjLjMtLjMuNy0uNCAxLS4yIDEuMS40IDIuMy42IDMuNi42LjUgMCAxIC40IDEgMVYyMGMwIC41LS41IDEtMSAxLTkuNCAwLTE3LTcuNi0xNy0xNyAwLS42LjQtMSAxLTFoMy41Yy41IDAgMSAuNCAxIDEgMCAxLjIuMiAyLjUuNiAzLjYuMS40IDAgLjctLjIgMWwtMi4zIDIuMnoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=") 50% 50% / cover no-repeat;
    transform: translate3d(0,0,0);
  }
  .phone-icon-pseudo::before {
    color: #fff;
    font-size: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wa-icon-pseudo {
    position: relative;
    display: block;
    margin: 0;
    width: 1em;
    height: 1em;
    font-size: 60px;
    line-height: 60px;
    background-color: #34a94d;
    border-radius: .5em;
    box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    transform: translate3d(0,0,0) scale(1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .overlay {
    position: relative;
    overflow: hidden;
  }
  .overlay a img {
    transition: 0.5s;
  }
  .overlay:hover a img {
    transform: scale(1.06);
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background-color: #ebebeb; border-radius: 10px; }
  ::-webkit-scrollbar-thumb { border-radius: 10px; background: #193393; }
`;

// Intersection observer hook for scroll animations
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

// ── Marquee Banner ──────────────────────────────────────────────────────────
function MarqueeBanner() {
  const text = "AZ Consultations – Helping Pakistani Students Pursue Higher Education in France & Europe. AZ Consultations – Helping Pakistani Students Pursue Higher Education in France & Europe. AZ Consultations – Helping Pakistani Students Pursue Higher Education in France & Europe. AZ Consultations – Helping Pakistani Students Pursue Higher Education in France & Europe. ";
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        maxWidth: "100vw",
        height: "40px",
        overflowX: "hidden",
        background: "#0c2c52",
      }}
    >
      <div
        style={{
          position: "absolute",
          whiteSpace: "nowrap",
          willChange: "transform",
          animation: "marquee 24s linear infinite",
          lineHeight: "40px",
        }}
      >
        <span style={{ color: "#fff", fontSize: "15px" }}>{text}</span>
      </div>
    </div>
  );
}

// ── Floating Social Icons (left side) ────────────────────────────────────
const socialLinks = [
  { href: "https://www.facebook.com/azconsultations", icon: "fa-facebook" },
  { href: "https://twitter.com/azconsultations", icon: "fa-twitter" },
  { href: "https://www.linkedin.com/in/syed-ahmad-jalal", icon: "fa-linkedin" },
  { href: "https://www.instagram.com/azconsultations/", icon: "fa-instagram" },
];

function FloatingSocialIcons() {
  return (
    <ul
      style={{
        position: "fixed",
        top: "50%",
        transform: "translateY(-50%)",
        left: 0,
        margin: 0,
        padding: 0,
        zIndex: 9,
        listStyle: "none",
      }}
    >
      {socialLinks.map((s) => (
        <li key={s.icon} style={{ listStyle: "none" }}>
          <a href={s.href} target="_blank" rel="noopener noreferrer">
            <span
              style={{
                position: "relative",
                top: 0,
                width: "40px",
                lineHeight: "40px",
                background: "rgb(0 100 176)",
                display: "block",
                textAlign: "center",
                color: "#fff",
                height: "40px",
                marginBottom: "3px",
                transition: "all 0.5s ease",
                zIndex: 99,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0a3a6e")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(0 100 176)")}
            >
              <i className={`fa ${s.icon}`} aria-hidden="true" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// ── CTA Buttons (bottom-fixed) ────────────────────────────────────────────
function CTAButtons() {
  return (
    <>
      {/* Phone / Consultation CTA - bottom left */}
      <div style={{ position: "fixed", bottom: "25px", left: "20px", zIndex: 999, cursor: "pointer" }}>
        <a
          href="../contact_us/contact_us.html"
          style={{
            background: "#0064b0",
            padding: "10px",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "15px",
            textDecoration: "none",
          }}
        >
          Request A Consultation
        </a>
      </div>

      {/* WhatsApp CTA - bottom right */}
      <div style={{ position: "fixed", bottom: "25px", right: "30px", zIndex: 999, cursor: "pointer" }}>
        <a href="https://api.whatsapp.com/send?phone=33652722078" target="_blank" rel="noopener noreferrer">
          <span className="wa-icon-pseudo is-animating">
            {/* WhatsApp SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              style={{ width: "0.5em", height: "0.5em" }}
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>
        </a>
      </div>
    </>
  );
}

// ── Hero Image ────────────────────────────────────────────────────────────
function HeroImage() {
  return (
    <div className="w-full">
      <img
        src="philosophy.jpg"
        alt="Philosophy Hero"
        className="w-full object-cover"
        style={{ display: "block", margin: "auto" }}
      />
    </div>
  );
}

// ── Philosophy Main Content ───────────────────────────────────────────────
function PhilosophyContent() {
  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();

  return (
    <div
      style={{
        background: "#0c2c52",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          alignItems: "center",
        }}
      >
        {/* Left Text Block */}
        <div
          ref={leftRef}
          style={{
            flex: "1 1 480px",
            opacity: leftInView ? 1 : 0,
            transform: leftInView ? "none" : "translateX(-60px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h6
            style={{
              color: "#a8c4e8",
              fontFamily: "'Roboto', sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              marginBottom: "8px",
              textAlign: "left",
            }}
          >
            – Syed Ahmad Jalal, Director
          </h6>
          <h6
            style={{
              color: "#fff",
              fontFamily: "'Roboto', sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              marginBottom: "16px",
              textAlign: "left",
              fontStyle: "italic",
            }}
          >
            We work with the student and for the student
          </h6>
          <h1
            style={{
              color: "#fff",
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              marginBottom: "24px",
              textAlign: "left",
              lineHeight: 1.2,
            }}
          >
            Our Philosophy
          </h1>
          <p
            style={{
              color: "#d0dff0",
              fontSize: "16px",
              lineHeight: "1.75",
              marginBottom: "16px",
              textAlign: "justify",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Syed Ahmad Jalal is dedicated to providing high-quality, personalized services to students from Pakistan. He emphasizes transparency and ensures that the university/college admission process in France and Europe is smooth, clear, and effective for every student he works with.
          </p>
          <p
            style={{
              color: "#d0dff0",
              fontSize: "16px",
              lineHeight: "1.75",
              marginBottom: "16px",
              textAlign: "justify",
              fontFamily: "'Roboto', sans-serif",
              fontStyle: "italic",
            }}
          >
            "Every student can learn, just not on the same day, or the same way," says George Evans.
          </p>
          <p
            style={{
              color: "#d0dff0",
              fontSize: "16px",
              lineHeight: "1.75",
              textAlign: "justify",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Like Evans, Syed Ahmad Jalal also believes that each student is unique and has individual needs. What works for one may not work for another — and therefore, he primarily focuses on understanding each student and evaluating their strengths, weaknesses, interests, and talents. Based on this analysis, he tailors solutions best suited for their academic profiles and personal goals, ensuring Pakistani students choose the right career path abroad.
          </p>
        </div>

        {/* Right Image Block */}
        <div
          ref={rightRef}
          style={{
            flex: "1 1 320px",
            opacity: rightInView ? 1 : 0,
            transform: rightInView ? "none" : "translateX(60px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/zahidd.png"
            alt="Philosophy Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
const FooterAngleRight = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 256 512"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "8px", height: "14px", fill: "currentColor", marginRight: "8px", flexShrink: 0 }}
  >
    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
  </svg>
);

function FooterLinkItem({ href, children }) {
  return (
    <li style={{ listStyle: "none", marginBottom: "10px" }}>
      <a
        href={href}
        style={{ color: "#b0c4de", fontSize: "14px", display: "flex", alignItems: "center", textDecoration: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#b0c4de")}
      >
        <FooterAngleRight />
        {children}
      </a>
    </li>
  );
}

const SocialSVGs = {
  facebook: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: 18, height: 18, fill: "currentColor" }}>
      <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" style={{ width: 18, height: 18, fill: "currentColor" }}>
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: 18, height: 18, fill: "currentColor" }}>
      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg" style={{ width: 18, height: 18, fill: "currentColor" }}>
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
    </svg>
  ),
};

function PreFooter() {
  return (
    <div style={{ background: "#0a2240", padding: "50px 20px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
        }}
      >
        {/* Col 1 – Branding */}
        <div>
          <a href="https://azconsultations.com">
            <img
              src="5e30e28cf2e00ecfa06dad825a441ae8beda87fbcd82c2bb8f69ef0ec2fa097a.png"
              alt="AZ Consultations Logo"
              style={{ height: "70px", width: "auto", marginBottom: "16px" }}
            />
          </a>
          <p style={{ color: "#b0c4de", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
            Established in 2020, AZ Consultations has helped hundreds of Pakistani students gain admission to reputed universities in France and across Europe.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { href: "https://www.facebook.com/azconsultations/", icon: "facebook", color: "#557dbc" },
              { href: "https://www.instagram.com/azconsultations/", icon: "instagram", color: "#8a3ab9" },
              { href: "#", icon: "twitter", color: "#7acdee" },
              { href: "#", icon: "youtube", color: "#e96651" },
            ].map((s) => (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: s.color, transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {SocialSVGs[s.icon]}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 – Study Abroad */}
        <div>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, marginBottom: "20px", letterSpacing: "0.05em" }}>
            STUDY ABROAD
          </h2>
          <ul style={{ padding: 0, margin: 0 }}>
            {[
              ["../study_uk/study_uk.html", "Study in UK"],
              ["https://azconsultants.com/study-aborad-usa/", "Study in US"],
              ["../study_cannada/study_cannada.html", "Study in Canada"],
              ["../study_nz/study_nz.html", "Study in New Zealand"],
              ["../study_australia/study_australia.html", "Study in Australia"],
              ["https://azconsultants.com/study-abroad-hong-kong/", "Study in Hong Kong"],
            ].map(([href, label]) => (
              <FooterLinkItem key={label} href={href}>{label}</FooterLinkItem>
            ))}
          </ul>
        </div>

        {/* Col 3 – Other Links */}
        <div>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, marginBottom: "20px", letterSpacing: "0.05em" }}>
            OTHER LINKS
          </h2>
          <ul style={{ padding: 0, margin: 0 }}>
            {[
              ["../sucess_scholarship_secured/sucess_scholarship_secured.html", "Scholarships"],
              ["../study_testimonials/study_testimonials.html", "Testimonials"],
              ["../visa_assist/visa_assist.html", "Visa Assistance"],
            ].map(([href, label]) => (
              <FooterLinkItem key={label} href={href}>{label}</FooterLinkItem>
            ))}
          </ul>
        </div>

        {/* Col 4 – Contact */}
        <div>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, marginBottom: "20px", letterSpacing: "0.05em" }}>
            CONTACT US
          </h2>
          <ul style={{ padding: 0, margin: 0 }}>
            <li style={{ listStyle: "none", marginBottom: "14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 16, fill: "#a8c4e8", flexShrink: 0, marginTop: 2 }}>
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
              </svg>
              <span style={{ color: "#b0c4de", fontSize: "14px" }}>77 Rue du Faubourg Saint-Martin, 75010 Paris, France</span>
            </li>
            <li style={{ listStyle: "none", marginBottom: "14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 16, fill: "#a8c4e8", flexShrink: 0, marginTop: 2 }}>
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
              </svg>
              <span style={{ color: "#b0c4de", fontSize: "14px" }}>Lahore Office – Pakistan</span>
            </li>
            <li style={{ listStyle: "none", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 14, fill: "#a8c4e8", flexShrink: 0 }}>
                <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z" />
              </svg>
              <span style={{ color: "#b0c4de", fontSize: "14px" }}>contact@azconsultations.fr</span>
            </li>
            <li style={{ listStyle: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 14, fill: "#a8c4e8", flexShrink: 0 }}>
                <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" />
              </svg>
              <a href="tel:+33183965723" style={{ color: "#b0c4de", fontSize: "14px", textDecoration: "none" }}>+33 1 83 96 57 23</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FooterBar() {
  return (
    <div
      style={{
        background: "#071628",
        padding: "16px 20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span style={{ color: "#7a9abf", fontSize: "13px" }}>
        Copyright © 2026 AZ Consultations | Powered by EdNet
      </span>
      <a
        href="https://azconsultants.com/privacy-policy/"
        style={{ color: "#7a9abf", fontSize: "13px", textDecoration: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9abf")}
      >
        Privacy Policy
      </a>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────
export default function PhilosophyPage() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute("href").substring(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
    <div id="our-philosophy">
      {/* Inject keyframe animations & global styles */}
      <style>{ANIMATIONS}</style>

      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      {/* Font Awesome 4 for social icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />

      <div style={{ fontFamily: "'Roboto', sans-serif", overflowX: "hidden" }}>
        

        {/* Floating social icons */}
        <FloatingSocialIcons />

        {/* Fixed CTA Buttons */}
        <CTAButtons />

        {/* Hero */}
        <HeroImage />

        {/* Philosophy content */}
        <PhilosophyContent />

        {/* Pre-Footer */}
        <PreFooter />

        {/* Footer bar */}
        <FooterBar />
      </div>
      </div>
    </>
  );
}