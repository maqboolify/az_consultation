"use client";

import { useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const universities = [
  { initials: "UM",   name: "EMSMP", city: "Paris", badge: "Confirmed Admission",    color: "#990000", badgeVariant: "red" },
  { initials: "SU",   name: "Sorbonne University",       city: "Paris",       badge: "QS Top 100",   color: "#003d87", badgeVariant: "blue" },
  { initials: "ENS",  name: "École Normale Supérieure",  city: "Paris",       badge: "Grande École", color: "#be0000", badgeVariant: "red" },
  { initials: "UGA",  name: "Université Grenoble Alpes", city: "Grenoble",    badge: "Research",     color: "#005a8e", badgeVariant: "blue" },
  { initials: "UP",   name: "Paris-Saclay University",   city: "Paris",       badge: "QS Top 15",    color: "#002395", badgeVariant: "blue" },
  { initials: "UDS",  name: "Université de Strasbourg",  city: "Strasbourg",  badge: "Nobel Legacy", color: "#4a1060", badgeVariant: "purple" },
  { initials: "INSA", name: "INSA Lyon",                 city: "Lyon",        badge: "Engineering",  color: "#006633", badgeVariant: "green" },
  { initials: "HEC",  name: "HEC Paris",                 city: "Paris",       badge: "#1 Business",  color: "#c9a84c", textColor: "#1a1a2e", badgeVariant: "gold" },
  { initials: "X",    name: "École Polytechnique",       city: "Palaiseau",   badge: "Grande École", color: "#003366", badgeVariant: "blue" },
  
  { initials: "UNS",  name: "Université Côte d'Azur",   city: "Nice",        badge: "Excellence",   color: "#008060", badgeVariant: "green" },
];

const badgeStyles = {
  blue:   "bg-[#eef1fc] text-[#002395]",
  red:    "bg-[#fdecea] text-[#ED2939]",
  gold:   "bg-[#f5e9c8] text-[#c9a84c]",
  green:  "bg-[#edf7ef] text-[#006633]",
  purple: "bg-[#f3eef8] text-[#4a1060]",
};

const glowColorMap = {
  blue:   { base: 220, spread: 200 },
  red:    { base: 0,   spread: 200 },
  gold:   { base: 30,  spread: 200 },
  green:  { base: 120, spread: 200 },
  purple: { base: 280, spread: 200 },
};

const GLOW_CSS = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }
  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
    );
    filter: brightness(2);
  }
  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
    );
  }
  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }
  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`;

function GlowCard({ children, glowColor = "blue" }) {
  const cardRef = useRef(null);
  const { base, spread } = glowColorMap[glowColor] ?? glowColorMap.blue;

  useEffect(() => {
    const syncPointer = (e) => {
      const { clientX: x, clientY: y } = e;
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", x.toFixed(2));
        cardRef.current.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty("--y", y.toFixed(2));
        cardRef.current.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  return (
    <div
      ref={cardRef}
      data-glow
      style={{
        "--base":           base,
        "--spread":         spread,
        "--radius":         "14",
        "--border":         "3",
        "--backdrop":       "hsl(0 0% 95% / 0.80)",
        "--backup-border":  "hsl(0 0% 80% / 0.6)",
        "--size":           "200",
        "--outer":          "1",
        "--border-size":    "calc(var(--border, 2) * 1px)",
        "--spotlight-size": "calc(var(--size, 150) * 1px)",
        "--hue":            "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
        backgroundImage: `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
          hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
        )`,
        backgroundColor:      "var(--backdrop, transparent)",
        backgroundSize:       "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
        backgroundPosition:   "50% 50%",
        backgroundAttachment: "fixed",
        border:               "var(--border-size) solid var(--backup-border)",
        position:             "relative",
        touchAction:          "none",
      }}
      className="rounded-2xl relative grid grid-rows-[1fr_auto] shadow-[0_1rem_2rem_-1rem_black] p-4 gap-4 backdrop-blur-[5px]"
    >
      <div data-glow />
      {children}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function UniversitiesSection() {
  return (
    <section
      id="universities"
      className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-9 bg-white font-[DM_Sans,Segoe_UI,sans-serif]"
    >
      <style dangerouslySetInnerHTML={{ __html: GLOW_CSS }} />

      <div className="max-w-[1160px] mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-1.5 bg-[#eef1fc] text-[#002395] border border-[rgba(0,35,149,0.15)] text-[10.5px] font-bold uppercase tracking-[1.2px] px-3.5 py-1.5 rounded-full mb-3">
              Partner Institutions
            </span>
            <h2
              className="font-black leading-[1.1] tracking-[-0.8px] text-[#00185a]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3.5vw, 40px)" }}
            >
              Leading French{" "}
              <em className="text-[#002395]" style={{ fontStyle: "italic" }}>
                Universities
              </em>
            </h2>
          </motion.div>

          <motion.a
            href="#contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group inline-flex items-center gap-1.5 text-[#002395] text-[13.5px] font-semibold whitespace-nowrap"
          >
            See All Partners
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
          </motion.a>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {universities.map((uni) => (
            <motion.div key={uni.name} variants={cardVariants}>
              <GlowCard glowColor={uni.badgeVariant === "gold" ? "gold" : uni.badgeVariant}>
                {/* Avatar */}
                <div
                  className="w-[52px] h-[52px] rounded-full flex items-center justify-center mx-auto flex-shrink-0 shadow-md"
                  style={{
                    background:    uni.color,
                    fontFamily:    "'Playfair Display', serif",
                    fontSize:      uni.initials.length >= 3 ? "12px" : "14px",
                    fontWeight:    700,
                    color:         uni.textColor ?? "#fff",
                    letterSpacing: uni.initials.length >= 3 ? "-0.5px" : "0",
                  }}
                >
                  {uni.initials}
                </div>

                {/* Text */}
                <div className="flex flex-col items-center text-center gap-1.5">
                  <p className="text-[12px] font-semibold text-[#00185a] leading-[1.35]">
                    {uni.name}
                  </p>
                  <p className="text-[11px] text-[#6b7280]">{uni.city}</p>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2.5 py-[3px] rounded-[5px] ${
                      badgeStyles[uni.badgeVariant] ?? badgeStyles.blue
                    }`}
                  >
                    {uni.badge}
                  </span>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#dde8f8] bg-[#f5f8ff] px-6 py-5"
        >
          <div>
            <p className="text-[13.5px] font-semibold text-[#00185a]">
              Don't see your preferred university?
            </p>
            <p className="text-[12.5px] text-[#6b7280] mt-0.5">
              We partner with 50+ institutions across France — get a free consultation to explore all options.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 inline-flex items-center gap-2 bg-[#002395] text-white text-[13px] font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-[#001070] hover:-translate-y-0.5 whitespace-nowrap"
          >
            Explore All Partners →
          </a>
        </motion.div>

      </div>
    </section>
  );
}