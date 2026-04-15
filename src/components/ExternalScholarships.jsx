import { useEffect } from "react";

/* ─── Inline keyframe styles injected once ─── */
const globalStyles = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

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

  @keyframes phone-inner {
    0%      { opacity:1; transform:translate3d(0,0,0) scale(0); }
    33.3333% { opacity:1; transform:translate3d(0,0,0) scale(.9); }
    66.6666%,100% { opacity:0; transform:translate3d(0,0,0) scale(0); }
  }

  @keyframes phone-icon {
    0%,46% { transform:translate3d(0,0,0); }
    2%,6%,10%,14%,18%,22%,26%,30%,34%,38%,42% { transform:translate3d(.01em,0,0); }
    4%,8%,12%,16%,20%,24%,28%,32%,36%,40%,44% { transform:translate3d(-.01em,0,0); }
  }

  .cta-phone-btn {
    position: relative;
    display: block;
    margin: 0;
    width: 1em;
    height: 1em;
    font-size: 60px;
    line-height: 60px;
    background-color: #0064b0;
    border-radius: .5em;
    box-shadow: 0 0 0 0 rgba(52,152,219,0), 0 .05em .1em rgba(0,0,0,.2);
    transform: translate3d(0,0,0) scale(1);
    animation: 3s infinite phone-outer;
    cursor: pointer;
  }
  .cta-phone-btn::before {
    position: absolute;
    content: "";
    top: .25em; left: .25em;
    width: .5em; height: .5em;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTYuNiAxMC44YzEuNCAyLjggMy44IDUuMSA2LjYgNi42bDIuMi0yLjJjLjMtLjMuNy0uNCAxLS4yIDEuMS40IDIuMy42IDMuNi42LjUgMCAxIC40IDEgMVYyMGMwIC41LS41IDEtMSAxLTkuNCAwLTE3LTcuNi0xNy0xNyAwLS42LjQtMSAxLTFoMy41Yy41IDAgMSAuNCAxIDEgMCAxLjIuMiAyLjUuNiAzLjYuMS40IDAgLjctLjIgMWwtMi4zIDIuMnoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=") 50% 50% / cover no-repeat;
    transform: translate3d(0,0,0);
    animation: 3s infinite phone-icon;
  }
  .cta-phone-btn::after {
    position: absolute;
    content: "";
    animation: 3s infinite phone-inner;
    color: #fff;
    font-size: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wa-btn {
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
    animation: 3s infinite phone-outer;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .floating-social-icon {
    transition: all 0.5s ease;
  }
  .floating-social-icon:hover {
    transform: translateX(5px);
  }

  .scholarship-card-s2:hover,
  .scholarship-card-s3:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0,100,176,0.15);
  }
  .scholarship-card-s2,
  .scholarship-card-s3 {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .shape-divider-fill {
    fill: #f0f4f8;
  }
`;

/* ─── SVG Check Circle Icon ─── */
const CheckCircleIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 flex-shrink-0 text-[#0064b0]"
    fill="currentColor"
  >
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
  </svg>
);

/* ─── Scholarship card (s2 / s3 style) ─── */
const ScholarshipCard = ({ title, href, variant = "s2" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`scholarship-card-${variant} flex flex-col items-center text-center gap-3 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-[#0064b0]/30`}
  >
    <div className="w-16 h-16 rounded-full bg-[#e8f0fb] flex items-center justify-center flex-shrink-0">
      {/* graduation cap icon */}
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-[#0064b0]" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    </div>
    <div>
      <h5 className="text-[#0064b0] font-semibold text-sm leading-snug mb-1 hover:underline">{title}</h5>
      <p className="text-xs text-gray-500 font-medium">Know More →</p>
    </div>
  </a>
);

/* ─── Bullet list item ─── */
const BulletItem = ({ href, text }) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2.5 py-1.5 text-[#282828] hover:text-[#0064b0] transition-colors duration-200 text-[15px]"
    >
      <CheckCircleIcon />
      <span>{text}</span>
    </a>
  </li>
);

/* ─── Floating Social Icons (left) ─── */
const FloatingSocials = () => {
  const socials = [
    { href: "http://www.facebook.com/azconsultations", icon: "f", label: "Facebook" },
    { href: "https://twitter.com/azconsultations", icon: "𝕏", label: "Twitter" },
    { href: "https://www.linkedin.com/in/syed-ahmad-jalal/", icon: "in", label: "LinkedIn" },
    { href: "https://www.instagram.com/azconsultations/", icon: "📷", label: "Instagram" },
  ];
  return (
    <ul className="fixed top-1/2 left-0 -translate-y-1/2 z-50 m-0 p-0">
      {socials.map((s) => (
        <li key={s.label} className="list-none mb-[3px]">
          <a href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}>
            <span className="floating-social-icon w-10 h-10 bg-[rgb(0,100,176)] text-white flex items-center justify-center z-[99] text-sm font-bold">
              {s.icon}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function ExternalScholarships() {
  /* inject global keyframe styles */
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = globalStyles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  /* ── data ── */
  const scholarshipsSection1 = [
    { title: "Higher Education Commission (HEC) Pakistan – Need & Merit Based Scholarships for study abroad", href: "https://www.hec.gov.pk/english/scholarshipsgrants/Pages/default.aspx" },
    { title: "Fulbright Pakistan Scholarship – US Government funded scholarships for Pakistani students", href: "https://www.usefpakistan.org/" },
    { title: "Commonwealth Scholarship – Scholarships for higher studies in Commonwealth countries", href: "https://www.britishcouncil.pk/programmes/education/scholarships" },
    { title: "DAAD Scholarships Pakistan – German Academic Exchange Service scholarships for Pakistani students", href: "https://www.daad.pk/" },
    { title: "Aga Khan Foundation International Scholarship – Need-based scholarships for outstanding students from Pakistan", href: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme" },
  ];

  const scholarshipsSection2 = [
    { title: "Erasmus Mundus Scholarships – EU funded scholarships for master's and doctoral studies in Europe", href: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus_en" },
    { title: "Chevening Scholarships – UK Government scholarships for Pakistani future leaders", href: "https://www.chevening.org/pakistan/" },
    { title: "Rhodes Scholarship – Higher studies at Oxford University for exceptional Pakistani students", href: "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/" },
    { title: "Turkish Government Scholarships (Türkiye Bursları) – Full scholarships for Pakistani students to study in Turkey", href: "https://www.turkiyeburslari.gov.tr/" },
    { title: "Chinese Government Scholarship – Full scholarships for Pakistani students to study in China", href: "https://www.campuschina.org/" },
    { title: "France Excellence Scholarship – French Government scholarships for Pakistani students to study in France", href: "https://www.institutfrancais-pakistan.com/bourses/" },
    { title: "MEXT Scholarships Japan – Japanese Government scholarships for Pakistani students", href: "https://www.pk.emb-japan.go.jp/itpr_en/scholarship.html" },
    { title: "Korean Government Scholarship (KGSP) – Full scholarships for Pakistani students in South Korea", href: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do" },
    { title: "HEC Overseas Scholarship for PhD – Government of Pakistan merit scholarship for PhD abroad", href: "https://www.hec.gov.pk/english/scholarshipsgrants/Pages/default.aspx" },
    { title: "Rotary Foundation Scholarships – International scholarships available to Pakistani students", href: "https://www.rotary.org/en/our-programs/scholarships" },
    { title: "KAIST International Scholarships – Full scholarships for Pakistani students in South Korea", href: "https://international.kaist.ac.kr/" },
    { title: "Austria OeAD Scholarships – Austrian Government scholarships for Pakistani postgraduate students", href: "https://oead.at/en/to-austria/grants-and-scholarships/" },
    { title: "Sweden SI Scholarships – Swedish Institute scholarships for Pakistani masters students", href: "https://si.se/en/apply/scholarships/" },
  ];

  const privateOrgBullets = [
    { text: "Aga Khan Education Services Pakistan – Merit & need based scholarships", href: "https://www.akes.edu.pk/" },
    { text: "Ihsan Trust Scholarships – Need-based scholarships for Pakistani students", href: "https://www.ihsantrust.org/" },
    { text: "Pakistan Poverty Alleviation Fund – Education support grants", href: "https://www.ppaf.org.pk/" },
    { text: "Saylani Welfare Trust – Educational scholarships for deserving Pakistani students", href: "https://saylaniwelfare.com/" },
    { text: "Edhi Foundation Education Support – Financial assistance for education", href: "https://www.edhi.org/" },
    { text: "Bestway Foundation Scholarships – Merit-based scholarships for Pakistani students", href: "https://www.bestwayfoundation.org/" },
    { text: "Commonwealth Scholarship & Fellowship Plan (Masters & PhD)", href: "https://www.britishcouncil.pk/programmes/education/scholarships" },
    { text: "Namal University Merit Scholarships – For talented Pakistani students", href: "https://namal.edu.pk/" },
    { text: "Oxford & Cambridge Pakistan Society Scholarship", href: "https://www.britishcouncil.pk/programmes/education/scholarships" },
    { text: "United Nations Scholarships for Pakistani Students – Various UN agency funded awards", href: "https://www.un.org/en/academic-impact/scholarships" },
  ];

  const moreBullets = [
    { text: "UCD Global Undergraduate Scholarship – Open to Pakistani undergraduate applicants", href: "https://www.ucd.ie/global/scholarships/" },
    { text: "London Met International Scholarship – For Pakistani students at London Metropolitan University", href: "https://www.londonmet.ac.uk/international/scholarships/" },
    { text: "France Excellence Eiffel Programme – French Embassy scholarships for Pakistani postgraduate students", href: "https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence" },
    { text: "Dr. Goh Keng Swee Scholarship Singapore – For academically outstanding Pakistani students", href: "https://www.psc.gov.sg/" },
    { text: "Australia Awards Pakistan – Australian Government scholarships for Pakistani students", href: "https://www.australiaawardspakistan.org/" },
  ];

  const footerStudyAbroad = [
    { text: "Study Abroad United Kingdom", href: "../study_uk/study_uk.html" },
    { text: "Study Abroad New Zealand", href: "../study_nz/study_nz.html" },
    { text: "Study Abroad Australia", href: "../study_australia/study_australia.html" },
    { text: "Study Abroad Canada", href: "../study_cannada/study_cannada.html" },
  ];

  const footerSuccessStories = [
    { text: "Testimonials", href: "../study_testimonials/study_testimonials.html" },
    { text: "External Scholarships", href: "#" },
    { text: "Scholarships Secured", href: "../sucess_scholarship_secured/sucess_scholarship_secured.html" },
  ];

  const footerGetInTouch = [
    { text: "Contact Us", href: "../contact_us/contact_us.html" },
    { text: "Careers", href: "../careers/careers.html" },
  ];

  return (
    <>
      {/* ── Marquee banner ── */}
      {/* <div className="relative w-full max-w-full h-10 overflow-x-hidden bg-[#0064b0]">
        <div
          className="absolute whitespace-nowrap will-change-transform"
          style={{ animation: "marquee 24s linear infinite" }}
        >
          <span className="text-white text-[15px] leading-10 px-4">
            AZ Consultations – Helping Pakistani Students Pursue Higher Education in France &amp; Europe.&nbsp;&nbsp;&nbsp;
            AZ Consultations – Helping Pakistani Students Pursue Higher Education in France &amp; Europe.&nbsp;&nbsp;&nbsp;
            AZ Consultations – Helping Pakistani Students Pursue Higher Education in France &amp; Europe.&nbsp;&nbsp;&nbsp;
            AZ Consultations – Helping Pakistani Students Pursue Higher Education in France &amp; Europe.&nbsp;&nbsp;&nbsp;
            AZ Consultations – Helping Pakistani Students Pursue Higher Education in France &amp; Europe.&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div> */}

      {/* ── Floating Social Icons ── */}
      <FloatingSocials />

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section
        className="relative w-full"
        style={{
          background: "linear-gradient(135deg, #0c2c52 0%, #0064b0 50%, #1a7fd4 100%)",
          paddingBottom: "60px",
        }}
      >
        {/* Hero Banner Image */}
        <div className="w-full">
          <img
            src="sch.jpg"
            alt="External Scholarships Banner"
            className="w-full object-cover"
            style={{ maxHeight: "340px", objectPosition: "center" }}
          />
        </div>

        {/* Hero content two-column */}
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
              External Scholarships
            </h1>
            <p className="text-white/90 text-base leading-relaxed text-justify">
              If you are a Pakistani student aspiring for higher education abroad, a scholarship can
              significantly ease your financial journey. The Government of Pakistan has established agreements
              with numerous countries to facilitate regular exchange of students and professionals. Many
              international organisations and private companies also provide scholarships to talented and
              deserving Pakistani students. Some of the most popular scholarships available are listed below.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="scholarship.jpg"
              alt="Scholarships illustration"
              className="rounded-xl shadow-2xl max-w-full"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Shape divider bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 2600 131.1"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12"
          >
            <path fill="#f0f4f8" d="M0 0L2600 0 2600 69.1 0 0z" />
            <path fill="#f0f4f8" d="M0 0L2600 0 2600 69.1 0 69.1z" style={{ opacity: 0.5 }} />
            <path fill="#f0f4f8" d="M2600 0L0 0 0 130.1 2600 69.1z" style={{ opacity: 0.25 }} />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 1 – Name of Scholarships and Type
      ══════════════════════════════════════ */}
      <section className="bg-[#f0f4f8] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h5 className="text-[#0c2c52] text-2xl font-bold mb-8 text-left">
            Name of Scholarships and Type
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {scholarshipsSection1.map((s, i) => (
              <ScholarshipCard key={i} title={s.title} href={s.href} variant="s2" />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 – External Scholarships Division
      ══════════════════════════════════════ */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h5 className="text-[#0c2c52] text-2xl font-bold mb-3 text-left">
            External Scholarships Division
          </h5>
          <p className="text-[#282828] text-base text-center mb-10">
            This department co-ordinates a large number of international scholarships in specialised and general
            areas that are offered to Pakistani citizens by governments of other countries, the European Union,
            and international organisations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {scholarshipsSection2.map((s, i) => (
              <ScholarshipCard key={i} title={s.title} href={s.href} variant="s3" />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 – Private Orgs + image + more list
      ══════════════════════════════════════ */}
      <section
        className="relative py-14 px-4"
        style={{
          background: "linear-gradient(135deg, #0c2c52 0%, #0064b0 60%, #1a7fd4 100%)",
          paddingBottom: "80px",
        }}
      >
        {/* Shape divider top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 2600 131.1"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12"
          >
            <path fill="white" d="M0 0L2600 0 2600 69.1 0 0z" />
            <path fill="white" d="M0 0L2600 0 2600 69.1 0 69.1z" style={{ opacity: 0.5 }} />
            <path fill="white" d="M2600 0L0 0 0 130.1 2600 69.1z" style={{ opacity: 0.25 }} />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto pt-8">
          <h4 className="text-white text-xl font-bold mb-6">
            There are other Private organisations that offer scholarships for Study abroad, such as:
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: bullet list */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <ul className="space-y-1">
                {privateOrgBullets.map((b, i) => (
                  <li key={i}>
                    <a
                      href={b.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 py-1.5 text-white hover:text-yellow-300 transition-colors duration-200 text-[15px]"
                    >
                      <svg viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-300">
                        <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                      </svg>
                      <span>{b.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: image */}
            <div className="flex justify-center">
              <img
                src="scl.jpg"
                alt="Scholarships"
                className="rounded-xl shadow-2xl max-w-full"
                style={{ maxHeight: "420px", objectFit: "cover", width: "100%" }}
              />
            </div>
          </div>

          {/* More scholarships bullet list */}
          <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <ul className="space-y-1 columns-1 md:columns-2">
              {moreBullets.map((b, i) => (
                <li key={i} className="break-inside-avoid">
                  <a
                    href={b.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 py-1.5 text-white hover:text-yellow-300 transition-colors duration-200 text-[15px]"
                  >
                    <svg viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-300">
                      <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                    </svg>
                    <span>{b.text}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-white/90 text-sm mt-6 text-justify leading-relaxed">
              Scholarships are also provided by countries you wish to study in — for example, the United Kingdom
              awards scholarships and bursaries to students from Commonwealth countries including Pakistan.
              Contact the British Council Pakistan for more information. Universities globally also award
              scholarships and grants based on merit. For more information, contact AZ Consultations.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#0c2c52] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Logo + description + socials */}
          <div className="lg:col-span-1">
            <a href="https://azconsultants.com">
              <img
                src="logobg_.png"
                alt="AZ Consultations"
                className="h-[122px] mb-4"
              />
            </a>
            <p className="text-white/80 text-sm leading-relaxed mb-5">
              Established in 2020, AZ Consultations has helped students from Pakistan get admitted to reputed
              universities all over the world, with a special focus on France and Europe.
            </p>
            <div className="flex gap-3">
              {[
                { href: "https://www.facebook.com/azconsultations/", label: "Facebook", path: "M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z", vb: "0 0 512 512" },
                { href: "https://www.youtube.com/azconsultations", label: "YouTube", path: "M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z", vb: "0 0 576 512" },
                { href: "https://www.instagram.com/azconsultations/", label: "Instagram", path: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z", vb: "0 0 448 512" },
                { href: "https://www.linkedin.com/in/syed-ahmad-jalal/", label: "LinkedIn", path: "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z", vb: "0 0 448 512" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#0064b0] rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg viewBox={s.vb} fill="white" className="w-4 h-4"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Study Abroad */}
          <div>
            <h2 className="text-white text-base font-bold uppercase tracking-wider mb-4">Study Abroad</h2>
            <ul className="space-y-2">
              {footerStudyAbroad.map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="text-white/75 hover:text-white text-sm transition-colors duration-150">
                    {l.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Success Stories */}
          <div>
            <h2 className="text-white text-base font-bold uppercase tracking-wider mb-4">Success Stories</h2>
            <ul className="space-y-2">
              {footerSuccessStories.map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="text-white/75 hover:text-white text-sm transition-colors duration-150">
                    {l.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Get in Touch */}
          <div>
            <h2 className="text-white text-base font-bold uppercase tracking-wider mb-4">Get in Touch</h2>
            <ul className="space-y-2 mb-5">
              {footerGetInTouch.map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="text-white/75 hover:text-white text-sm transition-colors duration-150">
                    {l.text}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-white/70 text-xs leading-relaxed">
              AZ Consultations<br />
              77 Rue du Faubourg Saint-Martin<br />
              75010 Paris, France<br />
              Office: +33 1 83 96 57 23<br />
              Mobile: +33 6 76 90 39 22
            </p>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} AZ Consultations. Director: Syed Ahmad Jalal. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Fixed CTAs ── */}
      {/* Request A Consultation (bottom left) */}
      <div className="fixed bottom-6 left-5 z-[999]">
        <a
          href="../contact_us/contact_us.html"
          className="bg-[#0064b0] text-white px-4 py-2.5 rounded-md text-[15px] font-medium shadow-lg hover:bg-[#004f8a] transition-colors duration-200"
        >
          Request A Consultation
        </a>
      </div>

      {/* WhatsApp (bottom right) */}
      <div className="fixed bottom-6 right-8 z-[999]">
        <a
          href="https://api.whatsapp.com/send?phone=33676903922"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="wa-btn">
            {/* WhatsApp SVG */}
            <svg viewBox="0 0 448 512" fill="white" className="w-8 h-8">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
          </span>
        </a>
      </div>
    </>
  );
}