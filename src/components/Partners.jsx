import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

.school-card {
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:16px;
  transition:transform .35s cubic-bezier(.34,1.56,.64,1), background .3s, border-color .3s, box-shadow .3s;
  position:relative; overflow:hidden;
}
.school-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,transparent,#d4af37,transparent);
  transform:scaleX(0); transition:transform .4s ease;
}
.school-card:hover::before { transform:scaleX(1); }
.school-card:hover {
  transform:translateY(-6px);
  background:rgba(212,175,55,0.07);
  border-color:rgba(212,175,55,0.25);
  box-shadow:0 16px 40px rgba(0,0,0,.4), 0 0 30px rgba(212,175,55,.05);
}

.filter-btn {
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:8px;
  padding:6px 14px;
  color:rgba(255,255,255,0.5);
  font-size:12px;
  cursor:pointer;
  transition:all .25s ease;
  font-family:'DM Sans', sans-serif;
}
.filter-btn:hover { background:rgba(212,175,55,0.1); border-color:rgba(212,175,55,0.3); color:#d4af37; }
.filter-btn.active { background:rgba(212,175,55,0.15); border-color:rgba(212,175,55,0.4); color:#d4af37; }

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#08111f; }
::-webkit-scrollbar-thumb { background:#d4af37; border-radius:10px; }
`;

/* ─── HOOKS ─── */
function useReveal(threshold = 0.1) {
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

/* ─── FLOATING UI ─── */
const SOCIALS = [
  { title:"Facebook",  href:"https://www.facebook.com/azconsultations",    vb:"0 0 512 512", d:"M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" },
  { title:"Twitter",   href:"https://twitter.com/azconsultations",          vb:"0 0 512 512", d:"M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" },
  { title:"LinkedIn",  href:"https://www.linkedin.com/in/ahmad-jalal-syed", vb:"0 0 448 512", d:"M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" },
  { title:"Instagram", href:"https://www.instagram.com/azconsultations/",   vb:"0 0 448 512", d:"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" },
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
            <svg viewBox={s.vb} style={{ width:14, height:14, fill:"#d4af37" }}><path d={s.d} /></svg>
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
        <a href="/contact" className="animate-gold-pulse"
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

/* ─── SCHOOL DATA ─── */
const SCHOOLS = [
  {
    abbr: "CESCOM",
    name: "Centre des Études Supérieures Commerciales de Paris",
    category: "Business & Commerce",
    description: "Centre d'enseignement supérieur dédié au commerce, au management et à la stratégie commerciale, avec une approche professionnalisante.",
    campuses: [
      "Noisiel (47, Grande Allée du 12 février 1934 3, 77186 Noisiel)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 66 58 33 75",
    email: "contact@cescom-paris.fr",
    img: "https://www.esce.fr/wp-content/uploads/sites/11/2023/07/Fichier-6-scaled.jpg",
    color: "#4A90D9",
  },
  {
    abbr: "ESMOSS",
    name: "École Supérieure de Management des Organisations Sanitaires et Sociales",
    category: "Healthcare Management",
    description: "Centre d'enseignement supérieur dédié à la Formation en management des organisations dans le sanitaire et social, alliant rigueur professionnelle et éthique.",
    campuses: [
      "Noisiel (47, Grande Allée du 12 février 1934 3, 77186 Noisiel)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 66 58 33 75",
    email: "contact@esmoss.fr",
    img: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx4BBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/AABEIAKAAuQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APobTNyPk8ehrqrC7EURRhuUjIrkrebY/wA4zWhHdEcg8YrpaMEzZkaMMSuCvpTmghfDwN8vcHtWNHdA8E1NDOQODStYq5t21vhtxHOKvCGPdvKLn1FZtveMsA+XcfSrIuw8BH3CV4OelQykSXskMYG7gt0PpXLajIouWIfOKuXTytLteQkDoe1U3025mwI4ywbqaSGZSyIZssw69KarK1wRnIbgUl7YXCzEeWVIOCPSnx2bxFWLg/SrRDL8UZjiClRxzmnSM54Rjs9KeiSNEd2f/rVXuJjEwiRcljVx1M27EM4AXIOW9KbD/rBnpTypZ/un1oOFGe9JjRZurnuOAOlUVdS7SyZJ7CklYnjNMRCT1qbiZDLIC/I6nmmSwgv+FXYrUMRkVOloPMx6nvRcLFK1spHbI5HvWrbWyQjoC3rWnYacxXkED0FF1/ZlnG811fW8UUYLOzyDCgdzU3KUSjKsjL8gzSJZTCPzZjtHvVG9+IXguy+WPUJL1l7Wtuzj88Y/WsLVvixph/48tC1C4CjjzpUiU/luP+RRzFWR0xiYsQgzS/Zbj0q34Tujq3hyy1SW3jt2uUL+Ujbgo3EAZP0rR2L6frS5h8pxincKaXmj6cimwTFuQQT71dyrqNyfjWxmVVuWH3hU0M8jHADDmnC2hfjcRW3ZWsFva79xb6rSkxoSymeTEZ4Hr6GtNLSRE+dw2Bxio7dYmAK4B9q0oZfLjHyA+9ZNmqM+KNXkwRnBq+lwUfy44xtx0z0qCTHnMydWOTjtVl4w+GSRUIHP/wBepGZnjVo4vCmp3YiUXC2snk5OMyFSEGR6tgfjXmvw38RxXM66FrDYn3FLaZv+WoHRT/tD9a6n4rXAXwmbJrgmS6u4I4WVScOsglGR3XERz7Zrxi4jPmuOcByVKnDKQeo9/wAqCJM+g5FXdtVWAHHI61QudPcyYUn1OT3z+lct4Y+I9idK+z+IZvKvbdTiZ1OJl6DoCd3TgA8fSmr8QY7s3AsdOmu0jk2pIpwjDapJO/aw5JHQ9M9+LjOxMonUynyWYMBn1FR29q9zuZUO3NcJJ4u1m+kcW0NnbFZChDuZMfkF5/GqF9rmuyWwin1ALliMxQqMYx0J3EdfWqbJPRbi3jjyXnjBA6ZyfyFZVxr2jWZ/eXkQIHd1Ug+hBIP6VwNzLPcxbL26urpMggXEzOoPsCcVZt7nT7axZJJLWCNfncjAA7ZOPrU8wjoLjx3pSZEKTzD/AGImOfbnaP1NQz+P54SRaaW29CQWlkVBn6KGP6157d+J/Ca3q2cOt2lxcSSqkccUgdiWOFGBWpNDcyzykQbAZGI3MOmfandD1N698Z+IrqBGEttDvZsgRmQ4GMcuSOh54FYmo6hq99bvFd6peyxMfmj8zah+qrgenbtSSWlwbeMCZFwzcBc+nrQbUpb/AL2Znf0UYWpbK16lLyVGdg6+lRyWz7SBG35VbOp3DOYrPw/enDEb5dsS/XnPFOuP7aeL5ILK2yOd8jORx04x0rN1NDf2ElJxejXn/X4Htvw8Rk8CaQjjBEB/9DNbm1fSsbwOXXwXpCsAXFqN2BgZya18v6ULUl2Wm55ZbPOOCTn1xWlbSPn75qrGd6hosTIRkNGdwP0IqeKUxpnymY+9dDkYJGnbrzgkg+laitiNVeQqg7NxXBeLb7ULdrUWl1PbK6NuEZxnkd+v5GuB1DV5RfnT5tfmadm+S2e8JdiRnOC2T0JrNyNFoe+SeIdF0xAt5dwQn0ZwM+wzVd/iDoa4FhDeXe77qxwthuCeGI29vXvXg8bX8Oo28Ol6bc3dxMjN5Vui7tqbQckkADLKOTya1rG/vrIIWaJkhACgg9/lH86hjuesN4z1K6uXW30aCBQR/r7gBvf7oYdP51la7rfiR/Dl1d/2jHARAZFECOrjIJHzBh69cZ4FctpuoSTv5txemFmA/wBSgA6n+8G9Kt3kUUnhq8ke7u5ZFgcKjTkIuOnyjAPHrms+ZlHGa34l1zU1sb+9miuHtpS6KIkQDK7SflAJyM/0q/NCWuLsb/ljLHPfAbGK5y9mjh0SCWYkb2RcD1Ix/WuhnuZY5Lk/Z1kLhs7Zec5z0I/rVEsyLmNvtMZ3AghmBB/Cr+lXmoWdm1vp2h3GpOzliy3MUSR/7xdgefYHpUBdJntwsZjwrAqT0OSf61paZdG1gdI4A7yH7xOAAM0IT2LdlHrFzpvl3MNnp1x5hxHbv54K/wC+QvPXPB+tRw+GL/VYktm12603y5JDIYYY3Z8hNuC4IXGD2PX2qI394FGERMH7wYnPv/OrMF7dm03C8likMjDKgA9F9c+9VqRsxY/D9noMiwzXl7qZZVZpL4ozBueAFVQBx2FXb/8As7UNIn06WytntnGXhdFMbAdiDwaoKfNLPe3VxdKNnDueuGpHi09LeQxRtkAffct3HrRcd0EI0u0hMUBs4I3GNsShR+O0YqzcXlou5UnRzuK/KCxz74rHl8h3zHD859BgVO8U8lxKWUjLtjIPIz1qtWF0LcamkaRqkEshJY/dx/dHeq0l5eMAwtlVSwXDHpmrcduWYKW3MpPH5VZvdLYaa12XGI3TKgj+8BUtjTK013qLEkNaRfSJm/UsP5VnzvfEMX1CUYHGxEX+lX58ohYRtJ3whGT+dVpF3KSR26UrDv0Pcvh2f+KD0YuzM32YZJOSa2/l/umud+H5b/hC9JAHS3ArexJ/dNBaPlpbPVrO2mubCWeJowyF7OfBHvjI4rU8M+LPEGhafDBfXA1RHTeZNQ3GRuM4EnU/r0qnBPaTKEt71SJQSipNkt74571YAuo4rfM5KwMCqsmcHGOo7c1hzNF8p0F14hTXoIG+xNaSQKQ3zB1bPcHA9PSsRbqG01DVIYihnuNnnDeA2AuFyOuOSfxq3o8f764byYo97Bvk7np/jXn3juzVvHs5kuvLaazLRoIyScROD1I9DWkZdWZyT2R6Lp19dWepLLFHAJDGVV2ywxkHHGO4H5VXvBK1vGGeNRKU6Kc4yD615fo2vXGjRpPDqN7cLLPsEU67lI2J0yx2gZ/h9TmutsvE813PeWs1qqRWJJDK4JYLIq9COKbaJTZtTrcW5SLc+0JkcD1b2qwbh0huLV4929pSrHk/xetWmsgsiILiRztB5C+p7VJJaxYuZHV2KrLsy5IBw3OKHYZx2uRM+g2QQZP2iE9eAM9f0ramjxLMSHQqSWJXGOfeq15Ev9h2r/Kp3oCTgZO04/nV6TUrQXNxJLfWi+YGEW64XcfnXHGc9O1O4mQ2ykzod5flhu9eBWhA6RIQwPPRtvA5NVojG0sHlsrKNwyDnuamuNhhSFWPn7iVUE8g/h7UJ2BrSxI6TOw2QyFOgIHX3ps++3tkDjy/3r8P3+VPStGCK7ubCMRwTMUj+ZhGQV5OOvtiqdzbzy20K+TvcSPuLj1CY/kaFU6XJcSKFpvsbTqImVphHw56gEnjHuKuW+n30sZDIiLINoLqeTkH1FMs2itrcW12hX98ZDsK46Y7kehq3eavZJB5UNreSFME5lXnkDjrjrSc1cajoI2mz224y3EESkYXy13E54qG5UmYp9quTj3Rf5L0qvPqbuqmHTJYsHJaRi2QOTzwP0p6XMsrvL9iWQgkY3HGAapNDGS2sa7cSXBJZsnzTnotV54NtypSAiEZbLEsd2ODk96UX7mUmRooAHYAgZx8q+9UJvEdhcatb6RDrVrcXDuN0Csm8gjPQc9OaV0xWaZtuBjjp6VUuBhSR97pV5x7Yqjq5nTTbiS2KiVIyUJXdz6Yz/hVDPcfh+IU8F6UxZd3kL3rf8xf7v8A46P8a8Q8F+MvD/hnRor3xN40urm6SPyv7PMUaxxH/ZjjTeT7kmtT/hdvhn/qJf8AgK3+NJSi+pSZ43qHhGWa2txHdwMLdSNssWQ43E9iOeaz7u3EN008VxEkc0TIiq5TBxj07f8A6q5CTxxeTGzgsdclZ2zHOsqjLfN1BIweDisvx5ezy38cdrJL5flIThsggj34HXrivNrVWo+6bUoqbt5HVWXjXVtEvITNdpNbtKMpKN+VGR1JB79z/Lk8ZeI49T8YxX9hb2k1t9hBSdnbO45Vk4YDgE8+9eaSXF/GieYwLbiQuN20AcNjGAT9f8KSC7uB8hhWdj3J+Qnp2wN2fwNc8a1aEdyvZRutzprnU/stkWfSbdUimcqqGRuNkeGGX9sVq6b4pP8Ab2rwPPEJAJFA8hTu/fqOcg+prkBp3iDUYwsVmbdch3djsCDnPU8n7v59u2tpOk29nqU91PJZXfmQbWkaSQEMSCRkN8w4BHp0q445L3ajV/67GU1TS91nrLeP/DF4sd/FqLLE8anZMXD5zyMc5PIzjP8AWtmPVdLllkCXcLSyO6qglDHJYjjv3rxy+j0WKFIV0228sDbEQz4LHsMtn8/8a0NH/s2P4pWsSaXp8YZpmSVS5laQRM+eXOCD7VvQxVOrszNNM9L1q1kvdBsYrfa0iTRuVJ5UYb/A1nTeANbMjMzQFS2flmPP/jtY/wAV4727+G0cNpJcqwcMwhJyUWKQnIHUdyDxXjz2TRajqS2lyqm2HygFcjLqo/8AQq7GwaPo7QNKn0ZBaXQVXaZ5B8wOQQoHT6U7WfEEOlslq975Pm5OBkAAEhssOB0PUjJGOteLabr9/pNvHbQXsj5kDtk7sHaM9fp0/rVu98X3UmmxTyiGS7SYo+9VztYnHJ7HAPbrXJPFJKyQK19TvtN8U5bfb3EioSzAk4BJY85Pbv8AjSyfEOzsj5VwH+zR3E4eZO2yOJzx65bA+vuK8pOpzSzxpDPGuGIYKOexzj04P/684fa+JFFosclz5ce15FlIGTuxwB06KBkHqT3rBYlrYd09zttW+KQNkdQt9AmMZlKxq8+15VAO1sBeM5+71Hv3xP8AhYHiHWbbU1sYo9PAtd1uVGWV/OiA3MeGyuTkLjtWU3iKe2UJHJMzMxkMiuVPzH7pK9vl4HXOeetRS6/d3MptY5LhmaLc7zzNkEY3fhk+nbrxWn1m4/dJ7C+8Z3WrxXt54mvlh80OEjuWVAm7kFQcDjI6Ac1l+LB4vvNbubq01PUpy0pkVklcIgJ4VcEAckngf41Wl1aWW7dklwE4c7iwYqfvEjgjGByepFTf8JDsMatM0aO7bw0hXDccfMSTjjjJPPOTzVRnMLo6D+2PFb/D22spzdyX00rpJJHGTLt+UBS2OPlBGeprL+FujX+mfEnSJbjSdSijSTBuJYGSMHY3cjvkD+nq+HWLxS8AuLgJlvL2yMkjfL0YZ44Pfv8ASul8C3Mk9poDXF5cXjrrl0vmXDs7AC2XAJJJxnPH1rem+d6g7HtTTRk5MkYzzjeDUF1LCbeRfNUkrwAaz3+8fXvUbYwecV0XFY8F8f6vPbfEDUjZuytFOPnztxwOlUf+Ekv/APnkf+/a/wDxNU/iHKF+IetApu/f447/ACj/ADis7yj/AM85/wAq4JvkloVGm5HrF7H4PsQ0Sar9vvkU7kF75FsG64L4JY8HhR+XWsfXbF5h9rsNO1bUkQf8u+myiPbgc73ydpHfpXrUur3Go2YtJbHRrWJwC6NbRupI6YQjH0zz7Uy4gvL6ZpbjXb+6e3QyESXKJDEFGSwVhheO4BPvzXo+yv0ObVbM8t0L4beOdatPthsbXS7fdmP7TneV7HaMkceuPpVjxL8PdI8OabaLq/iCJNRJO8ZB87jjZHgFe2SWP611Or+O7+Jm07TbsyXKAbztWZkz03YwEPB4xn0Brkj4J1XVZbq71q/e5kumD7ZgokB9PMChgg/u/KOehqJUKfVI1hXrLaRyaXCzGPTbCe6n3PtiUxgueCcYUsCO/HTBroPDXgPxPfvJe73w6bW3x9R9Qce3JHTmup8C6Lf+HruWDR9NsJrp15ZInmkC9/uncPX7p+vNT+KfirJolhsS1ijuJU+WUlj1HUA849jjNYfUqNnZGc5SlLmkc3a6LJ4Muby41a/+2XF3p81l5IjXdCJcYfhzjGOFyCeT2NN07x1pGhTO9zbQTyPEVFwrbSoJwMDBPbp1rz/XvGMM9wZSj3W6QyO11kNIT67TkdeeecdhxW/4U8D+NPFjRXMmgS6dp0ZBEohjiuCDyPLaX5265BLAHnmto0Yx2QJyO/1HVbbxf4UbS9PhnS6TY4ilOw7WjOx85xtO4deuR2IzQfwl44mk1YW6QyxTxhbVBdIcfMmRwcj5Q1ei6dpMHh3TkjttIvIsnONhuZ2Y9Wdk3FmPc1Dq0FzcRoW0fUJXdgqq9jKoznjJKfKM9zVcl9GU5nz94l8PeJNBlZ9Y+yWzlMBJb6IMQf8AZLBiM5x2z9Kfo8kkvhrdNDI873IjVEyrPxjp69B/+oVteJPBN5rfi3UdU1W6n0/TnmkSFWgQSGGNgsSqofOSir8zAdM85FdH4Rgv9CEEvhbSPDt1b26+Ura5JLM24j5ipiO3OODkDGWXC/Nu55YdNWQNnLzeDPFkloksHhnVhDLubz0s2kDLjPLDoMHGD7+tMTwr4qsmmuJfCGv+WZDLsNhMQpTOxuBg/Q5B7nFerXPxZ+I8Udxbal4U8LahEE2zJBM4UoRyCrsTjB9OlSW3x68TvmWf4bQTRopdpodYRSozycFDzzj3zxnNJYFXumSrHg/lalpN1JFNHPZum1pEkVTIuef3ncbgynnnH4YjN6i273QjS3Ii2ORLnn2B6DkHjpx16nvvi/qr+K7Oy8S6VpN3pdjGzabJYSsJJI3P7zzAF6mXc/T/AJ5tnsB5de30LTPAs0V/GHxCyMQjMpIDKOCBgZG5RwTwOgxqYdqVi0y2Jy7rIxjjkKCJV4KlT+pzz3PP0zUhi2IOUd8/MrAEYz3GPbIPH51StrnNvvhLCQ4YjOMfgO3Pv364rq/BuqxXF2LDU47i6jkjyuxsSjqBtJ6YOOM4ODWsKTemw7mRoNzeLqtpDBc4VXKxwJhlXI5UY56+3fHY16j4WvtVT+xjeh1H9sTo4eALiMQLt52jHP8AEME+uMAYlhbRJOshtJEnjbcv73lT7EVqPrlxDchbv+0FZlwCbgMCAcg9e3pXRCjKLuCkj1IsCxO786JfljYmuL0nV9SldWHk3MBxhZSqkj2IPzfTj61oeJ9cm0TMd3pVw0Eygw3MQIRh1xg5ww6EZ6jgkclyTW5cWnseH/EUEfEjW4xIEAuFHUgFtq9cfWsj7Mf+esP/AIFV0XjzQtS1nxxqmp6ckTW1xIrqC/zDCKOR2Oazf+ET1v8A542//f8AX/GuGpZvRm8VzLU0LTxBe+WdNl/sZdpIa8vpvNVv++n+b8jWH4m8Sahbxmzt9b06RGPzf2dlVPfkYA68j3rvJvAvh4N+9toW/wCuZLf4CgeGtFtceRpNscdCyZrvdXQ5PZGN4BnFj4egma5sbRPtQuke5iyJ2U9C3plcYPvjGaLX4sSWk0gOhwX8jIyb7mQtHncCGVSdoIA/X6Ym1jSdTmPl6aqWzLzlP3ZX8R+FcvdeE/E89ygluYVeMYQ4A6nsVH60lUXUOU3vFnxl8aXumy6XCLfSLO9jxJDZKF3KT93dnKqcDgY9fSuIlt02JLOwkkkG5nZxkHr09Ov+RXQQfDjWJ5Ha91RfMMm3PLsx6nkkV0eleAY4IM6lNNL5XSNsLkkj+EfNjHqe1JyXQpI7b4V6H4G8F6ToviHxRaXB1HWE862la380QJkFQoP3CVKtv68kV7doPi34faleQ6dYeJYWvJhlYGieMngnjcoB4z3rwix+IEmhW407UxFc2MA8qFGCsEUYAGDz09PSrNt8VPBVhfpqcXh/T/tUJJjcR/MPvDgqw6j+eK0jYk99v9V8K2PzXGpsrE5H+jyNk9uQtec/FT4jWei6KslhBNc3FyzC3t4ztZo1xulY87VBIA7kntgmvNfGXxy0jUdPa2stHt7XJ6x2kaEdBwxJYcZ6Yrg7DxPFr2rTTOXMqQRw2sT4OVG7dj0O5ieOmSc8U27BY7PVb+91Cdnt7W9vcxGaYQRNIY0wMM4UHAyVGfevYtD8P+HPGmhR+ItF1dtEuNQZ5rq1eASRRTliJAiblZF3BiFLHGR04A5r9ntI9Kt9TG6Nrl/s+SxGWH7zcB7fd/SvWdQjsb6y8iOKO1JOQYhgD14FQrt3NHKLp8jjrffr6Hl9z8G9ae/cw+LtLuoXHzK1u8JI44OHcdqS7+DPiJ3T7NNoLJxuX7ZKMn1/1VdydAcHdFqTDjHWrkeiQ3WlTWOo6jcqJkMbPDKyMFIxwR3rVSZz8kex5RHJ4e0vUpfC88lt4gudS1G1Nw9owhtLUiUqux2+aVg2SdqqpDEAtXC3Umlpqd1ay6RLKsVxJEsgty4cKxXPGT2+vrXrEXwP+H9rMk76nrdxNAqsqx3bRqWBJH+0MHHRq8U8WNFdat4m05YyrQalNdW+3Hy4YpKOfUBT/wAAFc84Sl8R6LnRhZUb7a3tv5HF6hbrHqV2kdxh1bzEQR4RlddwTp1wQMHjjp6auj3VgmsWU+nwPbBY0iuC0hYPLnO9c5wCAO/XPpzzd213b6gZbpjJEwC8DBChQoX/AL5HHXpWlp8ZnRIY5BHKm1RIOFYZ+V/wOBWsEkcs9T33V9L+2xJqWkSmSEx5K4DNxjOQBz/h61l29gt6hY28ykAq65wMkcH6VyHhvz9SilhcNDqVsCJI1cqWPTIIPfPX3/K3bXd/Yh40ubwIx/eI8rHn3yciulbWOdx7G/cWV9ZyIuyQxjJA/wAD2rotC13FmdO1K3SW3l+SWCYBo5AOh9j7jpXHx6prt1bS+TMJkTkjZ5jKPYZzj3rWt/D+q31olwfEFtHK6g+S9jgp6gkP1/ColG4cr6Gn4l8MWllZNq9pLPeaKq73gRcvbH1YD/WL/tcn19a5b+2/Cf8Az+W//fg//E123hi38SaLc86rpU9sww6mORM/z/wq/wD2Vpn/AEDNK/75H+Fc31ePY6YV5xVmck3lSRF4xjA+meelRW0QaUguEUDlgefwqrNLM75JYAdPmziozM33csagRpSbC8zN91025TnH51HuiUictGWHyrHglgB69APzOKz2uXAxuGPagTgjBGB9KloZba6mh4tgLdXOTs5b/vo8/lis2eEPnBwT71Z+VhlSwpjrzkHJ96LBc56/0NLoEtlsmsO68GWsjZw34Cu6Hy8nGO1OBjJGRjPcimrhY4W08F6ajhpI2OPXpXQ6VolnbLI9vEkMaLmSQKMAe/r7CtuGz86YCEgY5JPQD1pt/Ijw/ZYBtgQ5/wB4/wB4+9PUdkc94k1y6s0SfTX8uCA42hQTg9WIPUk7enI7dKfoXj/xYqJJp16t4HGfKjuw0oP+4xYj8Fpb6xEsEgKg7uQDXBa14ecSMVjGCewq4ztoTJK39eX9ff5Hrq/GDxLZqBfWbxkdfOtsn8wy/wAqv2fxzjOFntIm9WDuv6bT/OvBIX1/ThstNSvrdCfupMwH5dKJtU12WOWG4mjmWUbWLwRlvwbbkH8a050Z8rPoofGnRxHJIbV5Hx9yJySVz1+ZQO9eQf2pC/iu61iAuYZ72acZ/iR3Y8j6N0rjGtNTnOQyqSuz5UC/L+FdTp9sI7OGMrkoiqccdBipbuaKNtncPEemiKaWDnbw8ZPOVYZHP+ehrEstP1GZpLq2t3uILCESXSLIF+Tdz3yeB0FdvqEP23w9bXbD5rRvs7tjnaTkZ+n/ALNTfBlvI9xf6dbTRo95EpVGYjzSpJ2gj6j69Oc0Lcpq5ofC82utXPnpcNbXtuyxxmckpKrdFZh90dtx4G4Z9R6Br2lJtMk4+y36qHaOYbWZcdz3HTDDIrwnwDqVzpuvXMUP7xJlaOSEBS7rnPy5+ViCAdp64xkZyPU/DmvxPokOmyBrmxt5zi0ujlIcjrBMf3kJBz8rduvGK6oSMJIntLaVXW7tQqyoeoHzA+n61eluNRCecDskXho8ZU+49PcflTm1CzhM7QvdWxTGLTUohE7E9BHPnyZM9uVJ/GlsNb027VVmvRZOe1zEY8dsZPBP41veDM/eQ+x8QXC/JdQkKf4lPGKu/b9M/wCe7/8Afv8A+vVkaDC9u0sE9rcq3OA3T8arf8I7F/z6/wDkdaXs09iuY5s4P3WK4pp3ty5zjp70o4pa8o2ItnOTzTgMU40lAwyaaSaU000DQ3HFH8vSlJprHFAx2E29KaI8/NvH0Ipu6jcaYXHyoT9wA8elUbm03jLIOT3q2HYDg4pjyHZgHHvTFcxZdOgOAYgc1VbSrc/wLn6VuOwI5A/Cm+Wp64FAGILCFedhHpinrZAqD1H0rVaJc8Y9uOaTaAeU69waCrDvDtushutOlIWO6iIDdcMOn+P/AAEVyeoJqFlcGewYw3cG4DH5EfX09wK6+1byLqKZeEVwTjrj/wDVmpPEllEb8zxlCs67iVbOH6H+h/Gi9htHiieabrK+ak0bZYAfMMc5HqR1rvNI8T2jxxw675m9uItUtWAbjnD4x5g/2Www96o+JNGbeJ4gUkU5V16giqlhd6VeTi11qR9IuJMI19BHugkH/TaLv9R+XetoSM5xXU619W1CxhKwaohtJiWFxp7kRye7w8FW9+Pap9J1qBLTyZI9kY+bzbIqNx/20bKn8QD71wviPSdT8PvFdKq/ZZsmG9s5C1vMvbaR90+oJrKGryM4dmw/Tcq7c/lwa25rbmXK+jPSp/FKaXMss1lBcws3y3FiXtZM+jqMqMfX6VY/4WFo/wDz8a9/4Gn/AOLrzeDVC6srsSrDDD1qz51j/cH5Cpcn0KUU9z2KiikNcpQGmmlNNJqShDSE0E00mgYZpGNBppoASkJpaSmAjVE5p7VG3WmBGabTzTSKAG7jmk3c0EU00DHgqx+YZp0jhxtfnkYOOagzg0jMaBjLpBJwQDntnrXN61oqSjKoR+FdHIcioWkboW/OgNzhrOTV9BeVbCb/AEeU/vraVQ8MvsyHg1WuJNFusubWfS7g/eSP95A3qQCQyfTkV3c9tDOMFVz6Vk3/AIejfLJVKbSIcTD0S2sPtaBphJGx64I/Suy/srw//eWuQn0O4ibjp2Ipn2K9/vyfnWiq2IcD/9k=",
    color: "#3DB88A",
  },
  {
    abbr: "ESUV",
    name: "École Supérieure de Vente et de la Relation Client",
    category: "Sales & Marketing",
    description: "Centre d'enseignement supérieur dédié aux Formations axées sur la vente, le marketing, la relation client et orientée employabilité.",
    campuses: [
      "Noisiel (47, Grande Allée du 12 février 1934 3, 77186 Noisiel)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 66 58 33 75",
    email: "contact@esuv-ecole.fr",
    img: "https://www.campusfrance.org/sites/default/files/styles/mobile_visuel_principal_page/public/toulouse.jpg?itok=qThUwTZ0",
    color: "#E8854A",
  },
  {
    abbr: "ESEA",
    name: "École Supérieure des Énergies Alternatives",
    category: "Renewable Energy",
    description: "Centre d'enseignement supérieur dédié aux Formations axées sur les énergies renouvelables, le développement durable et montage de projets énergétiques responsables.",
    campuses: [
      "Noisiel (47, Grande Allée du 12 février 1934 3, 77186 Noisiel)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)1 84 80 24 88",
    natTel: "+33 (0)7 66 58 33 75",
    email: "contact@esea-bs.fr",
    img: "https://international.univ-rennes2.fr/system/files/styles/crop_visuel_paysage/private/UHB/ARTICLES/sebastien-l-dA70YbaMP4Q-unsplash%20copy.jpg?itok=0oZ21bdG",
    color: "#6AB04C",
  },
  {
    abbr: "ESMAS",
    name: "École Supérieure de Management du Sport",
    category: "Sports Management",
    description: "Centre d'enseignement supérieur dédié aux formations axées sur le management du sport, préparant aux métiers du sport business, de l'événementiel et des structures sportives.",
    campuses: [
      "Noisiel (47, Grande Allée du 12 février 1934 3, 77186 Noisiel)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 66 58 33 75",
    email: "contact@esmas.fr",
    img: "https://www.campusfrance.org/sites/default/files/styles/mobile_rte_petit/public/medias/images/2017-10/Diff%C3%A9rents%20types%20d%27%C3%A9tablissements_corps%20du%20texte4.jpg?itok=tS8htx-t",
    color: "#C0392B",
  },
  {
    abbr: "ESETH",
    name: "École Supérieure des Établissements Touristiques et Hôtellerie",
    category: "Tourism & Hospitality",
    description: "Institution d'enseignement supérieur spécialisée dans les métiers du tourisme, de l'hôtellerie et des services. L'école forme une nouvelle génération de professionnels capables de répondre aux exigences croissantes d'un secteur dynamique et compétitif.",
    campuses: [
      "Torcy (38 Avenue de Lingenfeld, 77200 Torcy)",
      "Evry (6 Boulevard de l'Europe, 91000 Evry)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 45 25 02 70",
    email: "contact@eseth-bs.fr",
    img: "https://theamericaninparis.com/wp-content/uploads/2022/12/unnamed-2.jpg",
    color: "#F39C12",
  },
  {
    abbr: "ISMOD",
    name: "Institut Supérieur de la Mode et du Luxe de Paris",
    category: "Fashion & Luxury",
    description: "Centre d'enseignement supérieur proposant des formations spécialisées dans les domaines de la mode, du luxe et de l'industrie textile, articulant approches créatives, managériales et techniques propres au secteur.",
    campuses: [
      "Torcy (38 Avenue de Lingenfeld, 77200 Torcy)",
      "Evry (6 Boulevard de l'Europe, 91000 Evry)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 45 25 02 70",
    email: "contact@ismod-paris.fr",
    img: "https://www.lingoda.com/blog/wp-content/uploads/2023/03/best-universities-in-france-e1680251654183.jpg",
    color: "#E91E8C",
  },
  {
    abbr: "ESMEP",
    name: "École Supérieure de Management et d'Entrepreneuriat de Paris",
    category: "Management & Entrepreneurship",
    description: "Centre d'enseignement supérieur proposant des formations axées sur le développement des compétences en management et en entrepreneuriat, s'appuyant sur une pédagogie pratique et professionnalisante.",
    campuses: [
      "Torcy (38 Avenue de Lingenfeld, 77200 Torcy)",
      "Evry (6 Boulevard de l'Europe, 91000 Evry)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 45 25 02 70",
    email: "contact@esmep.fr",
    img: "https://www.emsp-bs.fr/wp-content/uploads/2020/03/small.png",
    color: "#3498DB",
  },
  {
    abbr: "ESIIA",
    name: "École Supérieure d'Informatique et d'Intelligence Artificielle",
    category: "Tech & AI",
    description: "Organisme de formation privé proposant des formations dans les secteurs du numérique, de l'informatique, de la cybersécurité et de l'intelligence artificielle.",
    campuses: [
      "Torcy (38 Avenue de Lingenfeld, 77200 Torcy)",
      "Evry (6 Boulevard de l'Europe, 91000 Evry)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 45 25 02 70",
    email: "contact@esiia.fr",
    img: "https://www.esiea.fr/wp-content/uploads/2025/03/nouveau-campus-esiea-700x475.png",
    color: "#9B59B6",
  },
  {
    abbr: "DCG",
    name: "DCG Formations – Droit, Comptabilité, Gestion & RH",
    category: "Law, Finance & HR",
    description: "Organisme de formation privé proposant des formations axées sur droit, comptabilité, gestion et ressources humaines, préparation aux diplômes professionnels.",
    campuses: [
      "Torcy (38 Avenue de Lingenfeld, 77200 Torcy)",
      "Evry (6 Boulevard de l'Europe, 91000 Evry)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 45 25 02 70",
    email: "contact@dcgformations.fr",
    img: "https://dcgformations.fr/wp-content/uploads/2024/01/Bureaux-min-1024x576-min.png",
    color: "#D4AF37",
  },
  {
    abbr: "ILMIS",
    name: "Institut des Langues et du Management Interculturel et Stratégique",
    category: "Languages & Intercultural",
    description: "Organisme de formation privé proposant des formations axées sur le développement des compétences linguistiques et le management interculturel, afin de favoriser l'évolution dans un contexte professionnel international.",
    campuses: [
      "Torcy (38 Avenue de Lingenfeld, 77200 Torcy)",
      "Evry (6 Boulevard de l'Europe, 91000 Evry)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 45 25 02 70",
    email: "contact@ilmis.fr",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgIbjDnpdBUazLCy2MO0ZTKbcUD5l7dwUb-Q&s",
    color: "#1ABC9C",
  },
  {
    abbr: "EMSP",
    name: "Executive Management School of Paris (Business & Management)",
    category: "Business & Management",
    description: "Organisme de formation privé proposant des formations axées sur le management, le commerce et le numérique (BTS, Bachelor, Mastère), avec des formats disponibles en présentiel ou en e-learning.",
    campuses: [
      "Torcy (38 Avenue de Lingenfeld, 77200 Torcy)",
      "Evry (6 Boulevard de l'Europe, 91000 Evry)",
      "Lyon (30 Rue Edouard NIEUPORT, 69008 Lyon)",
    ],
    intlTel: "+33 (0)7.66.74.93.35 / +33 (0)6.95.85.70.85",
    natTel: "+33 (0)7 45 25 02 70",
    email: "contact@emsp-bs.fr",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlUZb5uYy1vOB1TA0Ozf2hRvmpAajGZARTvQ&s",
    color: "#E74C3C",
  },
];

const ALL_CATEGORIES = ["All", ...Array.from(new Set(SCHOOLS.map(s => s.category)))];

/* ─── SCHOOL CARD ─── */
function SchoolCard({ school, delay = 0 }) {
  const [ref, inView] = useReveal(0.08);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="flex flex-col overflow-hidden rounded-3xl"
        style={{
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "DM Sans, sans-serif",
        }}
        whileHover={{
          scale: 1.015,
          boxShadow: `0 35px 60px -15px rgba(0,0,0,0.7), 0 0 30px -5px ${school.color}30`,
          borderColor: "rgba(212,175,55,0.3)",
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* ── Top bar: logo left, apply arrow right ── */}
        <motion.div
          className="flex justify-between items-center px-4 pt-4 pb-2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.15, duration: 0.5 }}
        >
          {/* Logo */}
          <div
            className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ background: `${school.color}15`, border: `1px solid ${school.color}35` }}
          >
            <img
              src={school.img}
              alt={school.abbr}
              className="w-full h-full object-contain"
              style={{ padding: "5px" }}
            />
          </div>

          {/* Apply arrow button */}
          <motion.a
            href="/contact"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#d4af37" }}
            whileHover={{ scale: 1.12, boxShadow: "0 0 18px rgba(212,175,55,0.6)" }}
            whileTap={{ scale: 0.93 }}
            title="Apply via AZ Consultations"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
              fill="none" stroke="#0a0e1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </motion.a>
        </motion.div>

        {/* ── School name (title block) ── */}
        <motion.div
          className="px-4 pb-1 text-center"
          initial={{ opacity: 0, y: -8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: delay + 0.25, duration: 0.55 }}
        >
          <div
            className="inline-flex items-center px-2.5 py-0.5 rounded-full mb-2"
            style={{ background: `${school.color}18`, border: `1px solid ${school.color}35` }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: school.color }}>{school.category}</span>
          </div>
          <div
            className="font-bold text-[#d4af37] text-sm tracking-[0.18em] uppercase mb-0.5"
          >{school.abbr}</div>
        </motion.div>

        {/* ── Image block ── */}
        <motion.div
          className="relative mx-3 mb-3"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: delay + 0.35, duration: 0.7 }}
        >
          {/* Blurred background echo */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden z-0 opacity-20">
            <motion.img
              src={school.img}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain scale-150 blur-md"
              animate={{ scale: hovered ? 1.6 : 1.5 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
          {/* Main logo image */}
          <motion.div
            className="relative z-10 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{
              height: "140px",
              background: `linear-gradient(135deg, ${school.color}12 0%, rgba(8,17,31,0.6) 100%)`,
              border: `1px solid ${school.color}25`,
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "easeInOut", duration: 0.4 }}
          >
            <img
              src={school.img}
              alt={school.name}
              className="max-h-20 max-w-[80%] object-contain drop-shadow-lg"
            />
          </motion.div>
        </motion.div>

        {/* ── Name + description ── */}
        <motion.div
          className="px-4 pb-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.45, duration: 0.6 }}
        >
          <h3 className="font-bold text-white/90 text-center leading-snug mb-2"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.95rem" }}>
            {school.name}
          </h3>
          <p className="text-white/45 text-xs leading-relaxed text-center">
            {school.description}
          </p>
        </motion.div>

        {/* ── Expand toggle ── */}
        <div className="px-4 pb-3 flex justify-center">
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="filter-btn flex items-center gap-1.5 text-xs"
            whileTap={{ scale: 0.96 }}
          >
            <span>{expanded ? "Hide Details" : "View Details"}</span>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: "inline-block" }}
            >↓</motion.span>
          </motion.button>
        </div>

        {/* ── Expanded details ── */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="px-4 pb-5 pt-1 space-y-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

                {/* Campuses */}
                <div>
                  <p className="text-[#d4af37] text-[10px] font-semibold uppercase tracking-widest mb-2">
                    Campuses
                  </p>
                  <ul className="space-y-1.5">
                    {school.campuses.map((c, i) => (
                      <li key={i} className="text-white/45 text-xs leading-relaxed flex gap-2 items-start">
                        <span className="text-[#d4af37] mt-0.5 flex-shrink-0">▪</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                  <p className="text-[#d4af37] text-[10px] font-semibold uppercase tracking-widest mb-2">
                    Contact
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-white/45 text-xs">
                      <span className="text-white/60">Intl: </span>{school.intlTel}
                    </p>
                    <p className="text-white/45 text-xs">
                      <span className="text-white/60">National: </span>{school.natTel}
                    </p>
                    <a href={`mailto:${school.email}`}
                      className="text-[#d4af37] text-xs hover:underline block">
                      {school.email}
                    </a>
                  </div>
                </div>

                {/* CTA */}
                <motion.a
                  href="/contact"
                  className="block w-full text-center py-2.5 rounded-2xl text-slate-950 text-xs font-semibold"
                  style={{ background: "#d4af37" }}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(212,175,55,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Apply via AZ Consultations →
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  const footerSocials = [
    { href:"https://www.facebook.com/azconsultations/",  vb:"0 0 512 512", d:"M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" },
    { href:"https://www.instagram.com/azconsultations/", vb:"0 0 448 512", d:"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" },
    { href:"https://www.linkedin.com/in/ahmad-jalal-syed/", vb:"0 0 448 512", d:"M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" },
  ];
  return (
    <footer style={{ background:"#060f1c", borderTop:"1px solid rgba(212,175,55,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-bold gold-shimmer" style={{ fontFamily:"Cormorant Garamond, serif" }}>AZ Consultations</div>
          <p className="text-sm text-white/45 leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
            Established in 2020, AZ Consultations has helped hundreds of Pakistani students gain admission to reputed universities across France and Europe.
          </p>
          <div className="flex gap-3">{footerSocials.map((s,i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center hover:brightness-125 transition-all glass-gold">
              <svg viewBox={s.vb} style={{ width:13, height:13, fill:"#d4af37" }}><path d={s.d}/></svg>
            </a>
          ))}</div>
        </div>
        <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]" style={{ fontFamily:"DM Sans, sans-serif" }}>Study Abroad</h2>
          <ul className="flex flex-col gap-2">
            {["France","United Kingdom","Germany","Belgium"].map(c => (
              <li key={c}><a href="#" className="text-white/40 text-sm hover:text-[#d4af37] transition-colors" style={{ fontFamily:"DM Sans, sans-serif" }}>Study Abroad {c}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]" style={{ fontFamily:"DM Sans, sans-serif" }}>Partner Schools</h2>
          <ul className="flex flex-col gap-2">
            {SCHOOLS.slice(0,6).map(s => (
              <li key={s.abbr}><span className="text-white/40 text-sm" style={{ fontFamily:"DM Sans, sans-serif" }}>{s.abbr}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-5 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]" style={{ fontFamily:"DM Sans, sans-serif" }}>Contact Us</h2>
          <div className="space-y-2 text-white/40 text-sm" style={{ fontFamily:"DM Sans, sans-serif" }}>
            <p>📍 77 Rue du Faubourg Saint-Martin, 75010 Paris, France</p>
            <p>📞 <a href="tel:+33183965723" className="hover:text-[#d4af37] transition-colors">+33 1 83 96 57 23</a></p>
            <p>📱 <a href="tel:+33676903922" className="hover:text-[#d4af37] transition-colors">+33 6 76 90 39 22</a></p>
          </div>
          <a href="/contact"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl text-slate-950 text-sm font-semibold hover:brightness-110 transition-all animate-gold-pulse"
            style={{ background:"#d4af37", fontFamily:"DM Sans, sans-serif" }}>
            Request A Consultation
          </a>
        </div>
      </div>
      <div style={{ background:"rgba(0,0,0,0.3)", borderTop:"1px solid rgba(255,255,255,0.04)" }} className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-white/25 text-xs" style={{ fontFamily:"DM Sans, sans-serif" }}>© {new Date().getFullYear()} AZ Consultations. All rights reserved.</span>
          <a href="/privacy-policy" className="text-white/25 text-xs hover:text-[#d4af37] transition-colors" style={{ fontFamily:"DM Sans, sans-serif" }}>Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════ */
export default function PartnerSchoolsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = SCHOOLS.filter(s => {
    const matchCat = activeFilter === "All" || s.category === activeFilter;
    const matchSearch = search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.abbr.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ fontFamily:"DM Sans, sans-serif", background:"#08111f", color:"#e5dcc8" }}>
        <FloatingSocials />
        <FloatingCTAs />

        {/* ══ HERO ══ */}
        <section className="relative overflow-hidden py-20 px-6"
          style={{ background:"linear-gradient(135deg,#060f1c 0%,#0e1e35 100%)" }}>
          <div className="absolute top-8 right-16 w-32 h-32 rounded-full border border-[#d4af37]/10 pointer-events-none animate-rotate" />
          <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full border border-white/5 pointer-events-none animate-rotate-rev" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Reveal anim="fadeIn">
              <GoldBadge text="AZ Consultations · Partner Network" />
              <h1 className="font-bold leading-tight mb-4"
                style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(2rem,5vw,3.4rem)" }}>
                Our Partner Schools
                <span className="block gold-shimmer">in France</span>
              </h1>
              <p className="text-white/55 text-sm max-w-2xl mx-auto leading-relaxed mb-2"
                style={{ fontFamily:"DM Sans, sans-serif" }}>
                AZ Consultations works directly with {SCHOOLS.length} accredited French institutions spanning business,
                technology, healthcare, fashion, energy, and more. We guide Pakistani students through the admission
                process for each of these schools.
              </p>
            </Reveal>

            {/* Stats row */}
            <Reveal anim="fadeInUp" delay={0.15} className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { n:`${SCHOOLS.length}`, label:"Partner Schools" },
                { n:"3", label:"Campus Cities" },
                { n:"500+", label:"Students Placed" },
              ].map((s, i) => (
                <div key={i} className="glass rounded-xl px-4 py-4 text-center">
                  <div className="gold-shimmer font-bold text-2xl" style={{ fontFamily:"Cormorant Garamond, serif" }}>{s.n}</div>
                  <div className="text-white/40 text-xs mt-1" style={{ fontFamily:"DM Sans, sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ══ FILTERS & SEARCH ══ */}
        <section className="py-10 px-6 sticky top-0 z-20"
          style={{ background:"rgba(8,17,31,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(212,175,55,0.1)" }}>
          <div className="max-w-6xl mx-auto">
            {/* Search */}
            <div className="relative max-w-sm mb-5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search schools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:8, padding:"8px 12px 8px 32px", color:"rgba(255,255,255,0.7)",
                  fontSize:13, fontFamily:"DM Sans, sans-serif", outline:"none",
                }}
                onFocus={e => e.target.style.borderColor="rgba(212,175,55,0.4)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map(cat => (
                <button key={cat}
                  className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
                  onClick={() => setActiveFilter(cat)}>
                  {cat}
                  {cat !== "All" && (
                    <span className="ml-1.5 opacity-60">
                      ({SCHOOLS.filter(s => s.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-white/30 text-xs mt-3" style={{ fontFamily:"DM Sans, sans-serif" }}>
              Showing {filtered.length} of {SCHOOLS.length} schools
            </p>
          </div>
        </section>

        {/* ══ SCHOOLS GRID ══ */}
        <section className="py-14 px-6"
          style={{ background:"radial-gradient(ellipse at top, rgba(212,175,55,0.04) 0%, transparent 55%), #08111f" }}>
          <div className="max-w-6xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/40 text-sm" style={{ fontFamily:"DM Sans, sans-serif" }}>
                  No schools found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((school, i) => (
                  <SchoolCard key={school.abbr} school={school} delay={i * 0.05} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══ CTA STRIP ══ */}
        <section className="py-14 px-6"
          style={{ background:"radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 65%), #060f1c" }}>
          <div className="max-w-5xl mx-auto">
            <Reveal anim="fadeInUp">
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 glass"
                style={{ border:"1px solid rgba(212,175,55,0.2)" }}>
                <div className="absolute top-0 left-1/4 w-1/2 h-px"
                  style={{ background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)" }} />
                <div>
                  <GoldBadge text="Ready to Apply?" />
                  <h2 className="font-bold mt-1 mb-3"
                    style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(1.4rem,2.4vw,2rem)" }}>
                    Interested in Any of These Schools?
                  </h2>
                  <p className="text-white/50 text-sm max-w-[480px] leading-relaxed" style={{ fontFamily:"DM Sans, sans-serif" }}>
                    AZ Consultations handles the entire admission process for you — from university selection and document preparation to Campus France registration and visa support.
                  </p>
                </div>
                <a href="/contact"
                  className="animate-gold-pulse flex-shrink-0 px-9 py-4 rounded-2xl text-slate-950 text-sm font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
                  style={{ background:"#d4af37", fontFamily:"DM Sans, sans-serif" }}>
                  Start Your Application →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}