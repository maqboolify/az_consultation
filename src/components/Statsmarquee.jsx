"use client";

import React from "react";

// ─── Marquee primitive (inline, no external dep) ──────────────────────────────
function Marquee({
  children,
//   className = "",
  duration = 30,
  pauseOnHover = false,
  direction = "left",
  fade = true,
  fadeAmount = 8,
  style = {},
  ...props
}) {
  const [isPaused, setIsPaused] = React.useState(false);
  const items = React.Children.toArray(children);
  const isVertical = direction === "up" || direction === "down";

  const animationName =
    isVertical
      ? direction === "up" ? "scroll-y" : "scroll-y-reverse"
      : direction === "left" ? "scroll" : "scroll-reverse";

  const maskImage = fade
    ? isVertical
      ? `linear-gradient(to bottom, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`
      : `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`
    : undefined;

  return (
    <>
      <style>{`
        @keyframes scroll           { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes scroll-reverse   { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes scroll-y         { from { transform: translateY(0); }    to { transform: translateY(-50%); } }
        @keyframes scroll-y-reverse { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      `}</style>
      <div
        style={{
          display: "flex",
          width: "100%",
          overflow: "hidden",
          flexDirection: isVertical ? "column" : "row",
          maskImage,
          WebkitMaskImage: maskImage,
          ...style,
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        {...props}
      >
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            flexDirection: isVertical ? "column" : "row",
            animation: `${animationName} ${duration}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {items.map((item, i) => (
            <div key={`a-${i}`} style={{ display: "flex", flexShrink: 0, ...(isVertical && { width: "100%" }) }}>{item}</div>
          ))}
          {items.map((item, i) => (
            <div key={`b-${i}`} style={{ display: "flex", flexShrink: 0, ...(isVertical && { width: "100%" }) }}>{item}</div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { emoji: "🎓", text: "World-Class Education System" },
  { emoji: "💰", text: "Affordable Tuition Fees" },
  { emoji: "🌍", text: "350,000+ International Students" },
  { emoji: "💼", text: "Post-Study Work Visa Available" },
  { emoji: "🥐", text: "Rich Culture & Lifestyle" },
];

// ─── Separator dot ────────────────────────────────────────────────────────────
function Dot() {
  return (
    <span style={{
      width: 5, height: 5,
      borderRadius: "50%",
      background: "rgba(0,35,149,0.25)",
      display: "inline-block",
      flexShrink: 0,
      alignSelf: "center",
    }} />
  );
}

// ─── Single stat pill ─────────────────────────────────────────────────────────
function StatPill({ emoji, text }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "0 32px",
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
      <span style={{
        fontSize: 14,
        fontWeight: 600,
        color: "#00185a",
        letterSpacing: "-0.1px",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}>{text}</span>
      
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function StatsMarquee() {
  return (
    <section style={{
      background: "#fff",
      borderTop: "1px solid #e8eef8",
      borderBottom: "1px solid #e8eef8",
      padding: "18px 0",
      overflow: "hidden",
    }}>
      <Marquee
        duration={28}
        pauseOnHover={true}
        direction="left"
        fade={true}
        fadeAmount={8}
      >
        {STATS.map((s) => (
          <StatPill key={s.text} emoji={s.emoji} text={s.text} />
        ))}
      </Marquee>
    </section>
  );
}

export default StatsMarquee;