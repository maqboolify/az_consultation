import { useState, useRef } from "react";

// ─── Inline keyframe styles injected once ───────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

  * { box-sizing: border-box; }

  /* Marquee */
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 24s linear infinite;
    white-space: nowrap;
    will-change: transform;
  }

  /* Phone pulse – outer icon */
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
    66.6666%,
    100%       { opacity:0; transform:translate3d(0,0,0) scale(0); }
  }

  /* Phone icon shake */
  @keyframes phone-icon {
    0%,46%       { transform:translate3d(0,0,0); }
    2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42%
                 { transform:translate3d(.04em,0,0); }
    4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44%
                 { transform:translate3d(-.04em,0,0); }
  }

  .cta-phone-icon {
    position: relative;
    display: block;
    width: 1em;
    height: 1em;
    font-size: 60px;
    line-height: 60px;
    background-color: #0064b0;
    border-radius: .5em;
    box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    transform: translate3d(0,0,0) scale(1);
    animation: 3s infinite phone-outer;
  }
  .cta-phone-icon::before {
    position: absolute;
    content: "";
    color: #fff;
    font-size: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: 3s infinite phone-inner;
  }
  .cta-phone-icon::after {
    position: absolute;
    content: "";
    top: .25em; left: .25em;
    width: .5em; height: .5em;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTYuNiAxMC44YzEuNCAyLjggMy44IDUuMSA2LjYgNi42bDIuMi0yLjJjLjMtLjMuNy0uNCAxLS4yIDEuMS40IDIuMy42IDMuNi42LjUgMCAxIC40IDEgMVYyMGMwIC41LS41IDEtMSAxLTkuNCAwLTE3LTcuNi0xNy0xNyAwLS42LjQtMSAxLTFoMy41Yy41IDAgMSAuNCAxIDEgMCAxLjIuMiAyLjUuNiAzLjYuMS40IDAgLjctLjIgMWwtMi4zIDIuMnoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=") 50% 50%/cover no-repeat;
    animation: 3s infinite phone-icon;
    transform: translate3d(0,0,0);
  }

  .cta-whatsapp-icon {
    position: relative;
    display: block;
    width: 1em;
    height: 1em;
    font-size: 60px;
    line-height: 60px;
    background-color: #34a94d;
    border-radius: .5em;
    box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    transform: translate3d(0,0,0) scale(1);
    animation: 3s infinite phone-outer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background-color: #ebebeb; border-radius: 10px; }
  ::-webkit-scrollbar-thumb { border-radius: 10px; background: #193393; }

  /* Image hover zoom */
  .overlay { position: relative; overflow: hidden; }
  .overlay img { transition: transform 0.5s; }
  .overlay:hover img { transform: scale(1.06); }

  /* Form field focus */
  .career-input:focus {
    outline: none;
    border-color: #0064b0;
    box-shadow: 0 0 0 3px rgba(0,100,176,0.15);
  }

  body { font-family: 'Poppins', sans-serif; }
`;

// ─── SVG icons ───────────────────────────────────────────────────────────────
const ChevronRight = () => (
  <svg aria-hidden="true" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3 mr-2 fill-current">
    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/>
  </svg>
);
const CheckCircle = () => (
  <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-2 fill-current text-blue-600">
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>
  </svg>
);
const MapPin = () => (
  <svg aria-hidden="true" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-2 fill-current">
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
  </svg>
);
const Envelope = () => (
  <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-2 fill-current">
    <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/>
  </svg>
);
const Phone = () => (
  <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-2 fill-current">
    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
  </svg>
);

// Social SVGs for footer
const FbSvg = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current">
    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
  </svg>
);
const YtSvg = () => (
  <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current">
    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
  </svg>
);
const IgSvg = () => (
  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
  </svg>
);
const LiSvg = () => (
  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current">
    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job: "Job Opportunity",
    phone: "",
    resume: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  

  return (
    <>
      {/* Inject global keyframes & font */}
      <style>{globalStyles}</style>

      {/* ── Hero image ───────────────────────────────────────────────────── */}
      <div className="overlay w-full">
        <img
          src="careers.jpeg"
          alt="Careers at AZ Consultations"
          className="w-full object-cover"
          style={{ maxHeight: 420 }}
        />
      </div>

      {/* ── Director Banner ──────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #11346a 60%, #0064b0 100%)",
          padding: "18px 0",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white text-xs uppercase tracking-widest font-semibold opacity-70 mb-1">
              Message from the Director
            </p>
            <h2 className="text-white text-lg font-bold leading-tight">
              Syed Ahmad Jalal
            </h2>
            <p className="text-blue-200 text-xs">
              Director &amp; Education Consultant — AZ Consultations, Paris
            </p>
          </div>
          <blockquote className="text-white text-sm italic opacity-90 max-w-lg text-center sm:text-right border-l-2 border-blue-400 pl-4">
            "Greetings from Paris. We are proud to guide Pakistani students in realising their dreams of higher education in France and Europe. Your future starts here."
          </blockquote>
        </div>
      </div>

      {/* ── Awards & Recognition ─────────────────────────────────────────── */}
      <div style={{ background: "#f0f5ff", padding: "32px 0" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-center text-sm font-bold uppercase tracking-widest text-[#11346a] mb-6 opacity-70">
            Awards &amp; Recognition
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              "Best France Study Abroad Consultant – Pakistan Education Expo 2023",
              "Top Overseas Education Advisor – Lahore Education Fair 2022",
              "Excellence in Student Placement – Pakistan Study Abroad Summit 2024",
              "Preferred France Education Partner – PEEF Affiliated Network 2023",
            ].map((award) => (
              <div
                key={award}
                style={{
                  background: "#fff",
                  border: "1px solid #d1deff",
                  borderRadius: 10,
                  padding: "12px 18px",
                  maxWidth: 220,
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,100,176,0.07)",
                }}
              >
                <span style={{ fontSize: 24 }}>🏆</span>
                <p className="text-xs text-[#11346a] font-semibold mt-2 leading-snug">
                  {award}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <section
        id="careers-main"
        className="w-full bg-white"
        style={{ backgroundColor: "#f5f8ff" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
          {/* ── LEFT: Application Form ─────────────────────────────────── */}
          <div className="w-full md:w-5/12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-xl font-bold text-[#0064b0] mb-6 uppercase tracking-wide">
                Apply Now
              </h2>

              {submitted && (
                <div className="mb-4 p-3 rounded bg-green-600 text-white text-sm font-medium">
                  ✓ Your application has been submitted!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="career-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 transition-all duration-200"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="career-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 transition-all duration-200"
                />

                {/* Select with caret */}
                <div className="relative">
                  <select
                    name="job"
                    required
                    value={formData.job}
                    onChange={handleChange}
                    className="career-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white transition-all duration-200"
                  >
                    <option value="Job Opportunity">Job Opportunity</option>
                    <option value="Marketing Communications">
                      Marketing Communications
                    </option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      viewBox="0 0 571.4 571.4"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 fill-current"
                    >
                      <path d="M571 393Q571 407 561 418L311 668Q300 679 286 679T261 668L11 418Q0 407 0 393T11 368 36 357H536Q550 357 561 368T571 393Z" />
                    </svg>
                  </div>
                </div>

                <input
                  type="number"
                  name="phone"
                  placeholder="Phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="career-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 transition-all duration-200"
                />

                {/* File upload */}
                <div>
                  <label
                    htmlFor="resume"
                    className="block text-sm text-gray-600 mb-1 font-medium"
                  >
                    Attach Resume
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0064b0] file:text-white file:cursor-pointer hover:file:bg-blue-700 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0064b0] hover:bg-blue-700 text-white font-semibold rounded-lg text-sm uppercase tracking-wider transition-colors duration-200 active:scale-95"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* ── RIGHT: Career info ─────────────────────────────────────── */}
          <div className="w-full md:w-7/12 space-y-5">
            <h1 className="text-2xl md:text-3xl font-bold text-[#11346a] leading-snug">
              We at AZ Consultations value &ldquo;Dedication&rdquo; above everything
              else.
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed text-justify">
              Founded in 2020 and based in Paris, AZ Consultations has been guiding Pakistani
              students toward their dreams of higher education abroad. We take pride in building
              genuine, long-lasting relationships with every student we serve — working hard
              together, supporting each other every step of the way, and celebrating every
              admission success as our own.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed text-justify">
              With a professional, welcoming work environment, meaningful employee benefits,
              and an unwavering commitment to shaping futures —
              We look forward to attracting passionate individuals to join our mission.{" "}
              <strong>IT'S NOT A JOB AT AZ CONSULTATIONS, IT'S A CAREER.</strong>
            </p>

            {/* Job Openings */}
            <div>
              <h4 className="text-base font-bold text-[#11346a] uppercase mb-3">
                JOB Openings
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle />
                  Marketing Communications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer>
        {/* Upper footer: logo + links + contact */}
        <div className="bg-[#11346a] text-white">
          <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Col 1: Logo + about + social */}
            <div>
              <a href="https://azconsultants.com">
                <img
                  src="logobg_.png"
                  alt="AZ "
                  className="h-32 mb-1"
                />
              </a>
              <p className="text-gray-300 text-xs leading-relaxed mb-4">
                Established in 2020, AZ Consultations has helped hundreds of Pakistani students get
                admitted to reputed universities across France and Europe.
              </p>
              <div className="flex gap-3">
                {[
                  {
                    href: "https://www.facebook.com/azconsultations/",
                    icon: <FbSvg />,
                    label: "Facebook",
                    color: "#557dbc",
                  },
                  {
                    href: "https://www.youtube.com/@azconsultations",
                    icon: <YtSvg />,
                    label: "YouTube",
                    color: "#e96651",
                  },
                  {
                    href: "https://www.instagram.com/azconsultations/",
                    icon: <IgSvg />,
                    label: "Instagram",
                    color: "#8a3ab9",
                  },
                  {
                    href: "https://www.linkedin.com/in/syed-ahmad-jalal/",
                    icon: <LiSvg />,
                    label: "LinkedIn",
                    color: "#0a66c2",
                  },
                ].map(({ href, icon, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{ color }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Study Abroad */}
            <div>
              <h2 className="text-sm font-bold uppercase mb-4 text-white tracking-wider">
                Study Abroad
              </h2>
              <ul className="space-y-2">
                {[
                  ["https://azconsultants.com/study-aborad-france/", "Study in France"],
                  ["../study_uk/study_uk.html", "Study in UK"],
                  
                  ["../study_cannada/study_cannada.html", "Study in Canada"],
                  ["../study_nz/study_nz.html", "Study in New Zealand"],
                  ["../study_australia/study_australia.html", "Study in Australia"],
                  
                ].map(([href, label]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-gray-300 hover:text-white text-xs flex items-center transition-colors"
                    >
                      <ChevronRight />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Other Links */}
            <div>
              <h2 className="text-sm font-bold uppercase mb-4 text-white tracking-wider">
                Other Links
              </h2>
              <ul className="space-y-2">
                {[
                  ["../sucess_scholarship_secured/sucess_scholarship_secured.html", "Scholarships"],
                  ["../study_testimonials/study_testimonials.html", "Testimonials"],
                  ["../visa_assist/visa_assist.html", "Visa Assistance"],
                ].map(([href, label]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-gray-300 hover:text-white text-xs flex items-center transition-colors"
                    >
                      <ChevronRight />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact Us */}
            <div>
              <h2 className="text-sm font-bold uppercase mb-4 text-white tracking-wider">
                Contact Us
              </h2>
              <ul className="space-y-3 text-gray-300 text-xs">
                <li className="flex items-start gap-1">
                  <span className="mt-0.5 shrink-0">
                    <MapPin />
                  </span>
                  77 Rue du Faubourg Saint-Martin, 75010 Paris, France
                </li>
                <li className="flex items-start gap-1">
                  <span className="mt-0.5 shrink-0">
                    <MapPin />
                  </span>
                  Paris Office – Pakistan
                </li>
                <li className="flex items-center gap-1">
                  <Envelope />
                  info@azconsultations.fr
                </li>
                <li>
                  <a
                    href="tel:+33183965723"
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Phone />
                    +33 1 83 96 57 23
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-[#0d2655] text-gray-400 text-xs">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Copyright © 2026 AZ Consultations | Paris, France</span>
            <a
              href="https://azconsultants.com/privacy-policy/"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

      {/* ── Floating Left Social Icons ────────────────────────────────────── */}
      <ul
        style={{
          position: "fixed",
          top: "50%",
          transform: "translateY(-50%)",
          left: 0,
          zIndex: 9,
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {[
          {
            href: "http://www.facebook.com/azconsultations",
            icon: "fa-facebook",
            label: "Facebook",
          },
          {
            href: "https://twitter.com/azconsultations",
            icon: "fa-twitter",
            label: "Twitter",
          },
          {
            href: "https://www.linkedin.com/in/syed-ahmad-jalal/",
            icon: "fa-linkedin",
            label: "LinkedIn",
          },
          {
            href: "https://www.instagram.com/azconsultations/",
            icon: "fa-instagram",
            label: "Instagram",
          },
        ].map(({ href, icon, label }) => (
          <li key={label} style={{ marginBottom: 3 }}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              style={{
                display: "block",
                width: 40,
                height: 40,
                lineHeight: "40px",
                background: "rgb(0 100 176)",
                textAlign: "center",
                color: "#fff",
                transition: "all 0.5s ease",
                zIndex: 99,
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#11346a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgb(0 100 176)")
              }
            >
              <i aria-hidden="true" className={`fa ${icon}`} />
            </a>
          </li>
        ))}
      </ul>

      {/* ── Fixed bottom-left: Request Consultation ───────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 25,
          left: 20,
          zIndex: 999,
          cursor: "pointer",
        }}
      >
        <a
          href="../contact_us/contact_us.html"
          style={{
            background: "#0064b0",
            padding: "10px 14px",
            color: "#fff",
            borderRadius: 5,
            fontSize: 15,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Request A Consultation
        </a>
      </div>

      {/* ── Fixed bottom-right: WhatsApp button ──────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 25,
          right: 30,
          zIndex: 999,
          cursor: "pointer",
        }}
      >
        <a
          href="https://api.whatsapp.com/send?phone=33652722078"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <i className="cta-whatsapp-icon fa fa-whatsapp" />
        </a>
      </div>
    </>
  );
}