"use client";

import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { StatsMarquee } from "./Statsmarquee";

// ─── Shimmer Button ───────────────────────────────────────────────────────────
const shimmerKeyframes = `
@keyframes shimmer-slide { to { transform: translate(calc(100cqw - 100%), 0); } }
@keyframes spin-around {
  0%   { transform: translateZ(0) rotate(0deg); }
  15%, 35% { transform: translateZ(0) rotate(90deg); }
  65%, 85% { transform: translateZ(0) rotate(270deg); }
  100% { transform: translateZ(0) rotate(360deg); }
}
`;

function ShimmerButton({ children, className = "", ...props }) {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <button
        className={`relative z-0 inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full border border-white/10 bg-[rgba(0,35,149,1)] px-7 py-3 text-[14px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-px ${className}`}
        {...props}
      >
        <span className="absolute inset-0 -z-10 overflow-visible [container-type:size] blur-[3px]">
          <span className="absolute inset-0 h-[100cqh] aspect-square [animation:shimmer-slide_3s_ease-in-out_infinite_alternate]">
            <span className="absolute inset-[-100%] w-auto bg-[conic-gradient(from_calc(270deg-60deg),transparent_0,white_120deg,transparent_120deg)] [animation:spin-around_6s_infinite_linear]" />
          </span>
        </span>
        {children}
        <span className="pointer-events-none absolute inset-0 rounded-[18px] shadow-[inset_0_-12px_20px_rgba(255,255,255,0.35),inset_0_-4px_8px_rgba(255,255,255,0.5),inset_0_1px_0px_rgba(255,255,255,0.2)]" />
        <span className="absolute inset-[0.05em] -z-10 rounded-full bg-[rgba(0,35,149,1)]" />
      </button>
    </>
  );
}

// ─── Floating BG paths ────────────────────────────────────────────────────────
const PATH_DURATIONS = Array.from({ length: 36 }, () => 20 + Math.random() * 10);

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        {paths.map(p => (
          <motion.path key={p.id} d={p.d} stroke="#002395" strokeWidth={p.width}
            strokeOpacity={0.1 + p.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
            transition={{ duration: PATH_DURATIONS[p.id], repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Decorators ───────────────────────────────────────────────────────────────
const StarShape = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0L13.6 10.4L24 12L13.6 13.6L12 24L10.4 13.6L0 12L10.4 10.4Z" />
  </svg>
);



// ─── Blob Image ───────────────────────────────────────────────────────────────
function BlobImage({ desktop = false }) {
  return (
    <div className={`relative flex w-full items-end justify-center ${desktop ? "h-[430px]" : "h-[210px] sm:h-[310px]"}`}>
      {/* shadow blob */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#3a6fd8] to-[#002395] [border-radius:58%_58%_50%_50%_/_58%_58%_42%_42%] ${desktop ? "w-[360px] h-[470px]" : "w-[185px] h-[245px] sm:w-[265px] sm:h-[345px]"}`} />
      {/* image blob */}
      <div className={`relative z-10 overflow-hidden bg-[#b8cef0] [border-radius:58%_58%_50%_50%_/_58%_58%_42%_42%] ${desktop ? "w-[320px] h-[430px]" : "w-[158px] h-[210px] sm:w-[230px] sm:h-[308px]"}`}>
        <img src="/student.png" alt="Consultant" className="h-full w-full object-cover object-top"
          onError={e => { e.currentTarget.style.display = "none"; }} />
      </div>

      {/* decorators */}
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute left-[3%] text-[#3a6fd8] opacity-50 ${desktop ? "top-[50px]" : "top-[6px]"}`}>
        <StarShape size={desktop ? 18 : 13} />
      </motion.div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-[28%] text-[#00185a] opacity-60 ${desktop ? "left-[2%]" : "left-0"}`}>
        <StarShape size={desktop ? 24 : 16} />
      </motion.div>
      <motion.div animate={{ rotate: [0, 20, 0], scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute right-[2%] text-[#c0d0ee] ${desktop ? "top-[20px]" : "top-[6px]"}`}>
        <StarShape size={desktop ? 46 : 30} />
      </motion.div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 },
    transition: { duration: 0.55, ease: "easeOut", delay },
  });

  return (
    <div className="font-[DM_Sans,Segoe_UI,sans-serif] min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden bg-[#f5f8ff] min-h-[calc(100vh-60px)]">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />

        {/* Radial overlay */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_130%_65%_at_50%_18%,rgba(245,248,255,0.97)_0%,rgba(245,248,255,0.8)_50%,transparent_100%)] sm:bg-[radial-gradient(ellipse_75%_90%_at_28%_52%,rgba(245,248,255,0.88)_0%,rgba(245,248,255,0.55)_55%,transparent_100%)]" />

        <div className="relative z-[2] mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-0 px-[18px] pb-14 pt-7 sm:px-8 sm:pb-16 sm:pt-10 lg:grid-cols-[1fr_480px] lg:gap-6 lg:px-9 lg:pb-20 lg:pt-14">

          {/* Blob top on mobile/tablet */}
          <motion.div
            className="mb-6 sm:mb-9 lg:hidden"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          >
            <BlobImage desktop={false} />
          </motion.div>

          {/* ── Text ── */}
          <div>
            {/* Badge */}
            <motion.div {...fadeUp(0)} className="mb-3 flex items-center gap-2.5">
              <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#002395] sm:text-[11px]">
                Study in France Specialists
              </span>
              <span className="block h-0.5 w-5 shrink-0 rounded-sm bg-[#002395] sm:w-8" />
            </motion.div>

            {/* Headline */}
            <h1 className="mb-3 font-black leading-[1.07] tracking-[-1.2px] text-[#00185a]
              text-[clamp(26px,7vw,33px)]
              sm:text-[clamp(32px,5vw,44px)]
              lg:text-[clamp(38px,4vw,56px)]
              sm:mb-4 lg:mb-5"
            >
              {["Your Dream of", "Studying in", "Starts Here"].map((line, li) => (
                <span key={li} className="block">
                  {line.split("").map((ch, ci) => (
                    <motion.span key={`${li}-${ci}`}
                      initial={{ y: 34, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.22 + li * 0.07 + ci * 0.022, type: "spring", stiffness: 140, damping: 22 }}
                      className="inline-block"
                    >{ch === " " ? "\u00a0" : ch}</motion.span>
                  ))}
                  {li === 1 && " France".split("").map((ch, ci) => (
                    <motion.span key={`france-${ci}`}
                      initial={{ y: 34, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.22 + 1 * 0.07 + (line.length + ci) * 0.022, type: "spring", stiffness: 140, damping: 22 }}
                      className="inline-block text-[#c9a84c]"
                    >{ch === " " ? "\u00a0" : ch}</motion.span>
                  ))}
                </span>
              ))}
            </h1>

            {/* Description */}
            <motion.p {...fadeUp(0.4)}
              className="mb-5 text-[13px] leading-[1.75] text-[#4a5e80] sm:mb-7 sm:max-w-[460px] sm:text-[14.5px] lg:mb-8"
            >
              AZ Consultations is a France-based education consultancy specialising in helping international students gain admission to top French universities — from application to accommodation, we guide you every step of the way.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.5)}
              className="mb-6 flex flex-col gap-2.5 sm:mb-10 sm:flex-row sm:items-center sm:gap-3"
            >
              <ShimmerButton
                className="w-full !justify-center !py-[11px] !text-[13px] sm:w-auto sm:!py-3 sm:!text-[14px]"
                onClick={() => window.location.href = "#contact"}
              >
                Contact Us
              </ShimmerButton>

              <a href="#services"
                className="flex w-full items-center justify-center rounded-full border-2 border-[#002395] px-7 py-[10px] text-[13px] font-semibold text-[#002395] no-underline transition-colors duration-200 hover:bg-[#eef3fb] sm:w-auto sm:py-3 sm:text-[14px]"
              >
                Our Services
              </a>
            </motion.div>

            {/* Consultant cards */}
            
          </div>

          {/* Desktop blob — right column */}
          <motion.div
            className="hidden lg:flex"
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <BlobImage desktop={true} />
          </motion.div>

        </div>
      </section>

      <StatsMarquee />
    </div>
  );
}