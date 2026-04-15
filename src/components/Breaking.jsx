import { useEffect } from "react";

// Inject keyframe animations and global styles into <head>
const globalStyles = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @keyframes phone-outer {
    0%, 100% {
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
    0% { opacity: 1; transform: translate3d(0,0,0) scale(0); }
    33.3333% { opacity: 1; transform: translate3d(0,0,0) scale(.9); }
    66.6666%, 100% { opacity: 0; transform: translate3d(0,0,0) scale(0); }
  }

  @keyframes phone-icon {
    0%, 46% { transform: translate3d(0,0,0); }
    2%, 6%, 10%, 14%, 18%, 22%, 26%, 30%, 34%, 38%, 42% { transform: translate3d(.01em,0,0); }
    4%, 8%, 12%, 16%, 20%, 24%, 28%, 32%, 36%, 40%, 44% { transform: translate3d(-.01em,0,0); }
  }

  .cta-phone-btn.is-animating {
    animation: 3s infinite phone-outer;
  }
  .cta-phone-btn.is-animating::before {
    animation: 3s infinite phone-inner;
  }
  .cta-phone-btn.is-animating::after {
    animation: 3s infinite phone-icon;
  }

  .cta-phone-btn {
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
    cursor: pointer;
  }
  .cta-phone-btn::before {
    position: absolute;
    content: "";
    color: #fff;
    font-size: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cta-phone-btn::after {
    position: absolute;
    content: "";
    top: .25em;
    left: .25em;
    width: .5em;
    height: .5em;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTYuNiAxMC44YzEuNCAyLjggMy44IDUuMSA2LjYgNi42bDIuMi0yLjJjLjMtLjMuNy0uNCAxLS4yIDEuMS40IDIuMy42IDMuNi42LjUgMCAxIC40IDEgMVYyMGMwIC41LS41IDEtMSAxLTkuNCAwLTE3LTcuNi0xNy0xNyAwLS42LjQtMSAxLTFoMy41Yy41IDAgMSAuNCAxIDEgMCAxLjIuMiAyLjUuNiAzLjYuMS40IDAgLjctLjIgMWwtMi4zIDIuMnoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=") 50% 50% / cover no-repeat;
    transform: translate3d(0,0,0);
  }

  .floating-social-icon {
    transition: all 0.5s ease;
  }
  .floating-social-icon:hover {
    background: #0c2c52 !important;
  }

  .overlay-img {
    transition: 0.5s;
  }
  .overlay-img:hover {
    transform: scale(1.06);
  }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background-color: #ebebeb; border-radius: 10px; }
  ::-webkit-scrollbar-thumb { border-radius: 10px; background: #193393; }

  .footer-link:hover {
    color: #7ab8f5;
  }
`;

// SVG Icons
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V20c0 .5-.5 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.5 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z"/>
  </svg>
);

const MapMarkerIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current flex-shrink-0">
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
  </svg>
);

const EnvelopeIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current flex-shrink-0">
    <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/>
  </svg>
);

const PhoneAltIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current flex-shrink-0">
    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
  </svg>
);

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
            <img src="az_logo.png"
              alt="AZ Consultations" style={{ height:150, width:246 }} className="object-contain" />
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
const AngleRightIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-current">
    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white">
    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white">
    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white">
    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-white">
    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-white">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);
function ChevronRight() {
  return (
    <svg viewBox="0 0 256 512" style={{ width:8, height:12, fill:"#d4af37", display:"inline-block", marginRight:6, verticalAlign:"middle", flexShrink:0 }}>
      <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/>
    </svg>
  );
}
const studyAbroadLinks = [
  { label: "Study in UK", href: "https://ednetconsultants.com/study-abroad-united-kingdom/" },
  { label: "Study in US", href: "https://ednetconsultants.com/study-aborad-usa/" },
  { label: "Study in Canada", href: "https://ednetconsultants.com/study-abroad-canada/" },
  { label: "Study in New Zealand", href: "https://ednetconsultants.com/study-abroad-new-zealand/" },
  { label: "Study in Australia", href: "https://ednetconsultants.com/study-abroad-australia/" },
  { label: "Study in Hong Kong", href: "https://ednetconsultants.com/study-abroad-hong-kong/" },
];

const otherLinks = [
  { label: "Niharika's Blog", href: "https://ednetconsultants.com/niharikas-blog" },
  { label: "Scholarships", href: "https://ednetconsultants.com/scholarships-secured/" },
  { label: "Test Prep", href: "https://ednetconsultants.com/test-prep/" },
  { label: "Art & Design", href: "https://ednetconsultants.com/art-design/" },
  { label: "Testimonials", href: "https://ednetconsultants.com/testimonials/" },
  { label: "Visa Assistance", href: "https://ednetconsultants.com/visa-assistance/" },
];

const socialFloating = [
  { icon: <FacebookIcon />, href: "http://www.facebook.com/ednetconsultants", title: "Facebook" },
  { icon: <TwitterIcon />, href: "https://twitter.com/ednetconsultant", title: "Twitter" },
  { icon: <LinkedinIcon />, href: "https://in.linkedin.com/in/niharikasondhi", title: "LinkedIn" },
  { icon: <InstagramIcon />, href: "https://www.instagram.com/ednetconsultants/", title: "Instagram" },
];

export default function EdNetPage() {
  useEffect(() => {
    // Inject global styles
    const styleTag = document.createElement("style");
    styleTag.innerHTML = globalStyles;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  // Smooth scroll for anchor links
  // eslint-disable-next-line no-unused-vars
  const handleAnchorClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.getElementById(href.substring(1));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* ── Marquee Banner ── */}
      

      {/* ── Main Content ── */}
      <main>
        {/* Hero Banner Image */}
        <div className="w-full">
          <img
            alt=""
            className="w-full"
            src="/breakinf.png"
            style={{ display: "block", margin: "auto" }}
          />
        </div>

        {/* Marquette Collaboration Image */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
          <a
            href="https://sites.google.com/ednetconsultants.com/credit-course/ednet-collaboration-with-marquette-university"
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden block"
          >
            <img
              alt="Marquette-Ednet Collaboration"
              className="overlay-img h-92 w10 rounded-xl"
              src="/degree.png"
            />
          </a>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer/>

      {/* ── Floating Left Social Icons ── */}
      <ul
        className="fixed left-0 top-1/2 z-50 m-0 p-0"
        style={{ transform: "translateY(-50%)" }}
      >
        {socialFloating.map((s) => (
          <li key={s.title} className="list-none">
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              title={s.title}
              className="floating-social-icon flex items-center justify-center mb-[3px]"
              style={{ width: 40, height: 40, background: "rgb(0 100 176)", color: "#fff", display: "flex" }}
              aria-label={s.title}
            >
              {s.icon}
            </a>
          </li>
        ))}
      </ul>

      {/* ── CTA: Request A Consultation (bottom-left) ── */}
      <div className="fixed bottom-6 left-5 z-[999] cursor-pointer">
        <a
          href="https://ednetconsultants.com/contact/"
          className="inline-block text-white text-sm font-medium px-4 py-2 rounded"
          style={{ background: "#0064b0" }}
        >
          Request A Consultation
        </a>
      </div>

      {/* ── CTA: WhatsApp (bottom-right, animated) ── */}
      <div className="fixed bottom-6 right-7 z-[999] cursor-pointer">
        <a
          href="https://api.whatsapp.com/send?phone=919560028144"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
        >
          <i className="cta-phone-btn is-animating">
            <span className="sr-only">WhatsApp</span>
          </i>
        </a>
      </div>
    </div>
  );
}