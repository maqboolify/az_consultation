"use client";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// ─── Check Icon ───────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <div className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#002395] mt-0.5">
      <svg width="9" height="8" viewBox="0 0 10 8" fill="none">
        <polyline points="1,4 4,7 9,1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Feature Row ──────────────────────────────────────────────────────────────
function FeatureRow({ children }) {
  return (
    <div className="flex items-start gap-3 text-[13.5px] leading-[1.55] text-[#4a5e80] hover:text-[#00185a] transition-colors cursor-default">
      <CheckIcon />
      <span>{children}</span>
    </div>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────
function InfoCard({ iconColor, iconBg, icon, badge, title, children }) {
  return (
    <div className="rounded-3xl border-[1.5px] border-[#dde8f8] bg-white p-5 shadow-[0_2px_16px_rgba(0,35,149,0.05)]">
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: iconBg }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      {badge && (
        <span className="mb-2 inline-block rounded-lg bg-[#fff3e0] px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-[#b36a00]">
          {badge}
        </span>
      )}
      <h3 className="mb-1.5 text-[14px] font-extrabold text-[#00185a]">{title}</h3>
      <p className="text-[13px] leading-[1.65] text-[#4a5e80]">{children}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FeesSection() {
  const features = [
    "University search & shortlisting tailored to your profile",
    "Full admission file preparation & submission",
    "Professional CV writing & formatting",
    "Personalised motivation letter drafting",
    "Step-by-step guidance through the entire process",
    "Dedicated consultant support until acceptance",
  ];

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, ease: "easeOut", delay },
  });

  return (
    <section id="package" className="bg-[#f5f8ff] px-5 py-16 font-[DM_Sans,Segoe_UI,sans-serif] sm:py-20 lg:py-24">
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-12">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex flex-col items-center text-center">
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#002395]">
              Transparent pricing
            </span>
            <span className="block h-0.5 w-8 shrink-0 rounded-sm bg-[#002395]" />
          </div>
          <h2 className="mb-3 font-black leading-[1.1] tracking-[-1px] text-[#00185a] text-[clamp(28px,5vw,40px)]">
            Consultancy <span className="text-[#c9a84c]">Fees</span>
          </h2>
          <p className="max-w-[520px] text-[14.5px] leading-[1.75] text-[#4a5e80]">
            One flat fee. No surprises. We take care of the entire process so you can focus on your future in France.
          </p>
        </motion.div>

        {/* Cards row */}
        <div className="flex w-full flex-wrap justify-center gap-6 items-stretch">

          {/* ── Main fee card ── */}
          <motion.div {...fadeUp(0.1)}
            className="flex w-full max-w-[420px] flex-col gap-5 rounded-[38px] border-[1.5px] border-[#dde8f8] bg-white p-7 shadow-[0_4px_32px_rgba(0,35,149,0.07)]"
          >
            {/* Card header */}
            <div>
              <h3 className="text-[18px] font-extrabold text-[#00185a]">Complete Admission Package</h3>
              <p className="mt-1 text-[13.5px] text-[#4a5e80]">Everything you need, from first contact to acceptance</p>
            </div>

            {/* Features list */}
            <div className="flex flex-col gap-[18px] rounded-[26px] border border-[#dde8f8] bg-[#f5f8ff] px-6 py-6">
              {features.map((f, i) => (
                <FeatureRow key={i}>{f}</FeatureRow>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-[12px] text-[#6a7fa8]">One-time advance payment</p>
                <p className="text-[36px] font-bold leading-[1.1] text-[#00185a]">
                  <span className="text-[18px] font-semibold">€</span>1,000
                </p>
              </div>
              <a
                href="#contact"
                className="flex items-center gap-2.5 rounded-full bg-gradient-to-br from-[#002395] via-[#1a4fd6] to-[#3a6fd8] px-5 py-3.5 text-[14px] font-bold text-white no-underline transition-all duration-150 hover:opacity-90 hover:-translate-y-0.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 16.92V19.92C22 20.92 21.1 21.82 20.09 21.99C17.29 22.44 14.61 21.46 12.42 19.77C10.38 18.22 8.72 16.13 7.67 13.72C5.95 11.49 4.97 8.74 5.01 5.91C5.03 4.91 5.91 4.01 6.91 4H9.92C10.82 4 11.58 4.62 11.82 5.5L12.62 8.5C12.84 9.28 12.56 10.11 11.94 10.57L10.94 11.32C12.11 13.41 13.79 15.09 15.88 16.26L16.63 15.26C17.09 14.64 17.93 14.36 18.7 14.58L21.7 15.38C22.58 15.62 23.2 16.38 23.2 17.28L22 16.92Z"/>
                </svg>
                Make Appointment
              </a>
            </div>
          </motion.div>

          {/* ── Info cards column ── */}
          <motion.div {...fadeUp(0.2)} className="flex w-full max-w-[380px] flex-col gap-4">

            <InfoCard
              iconBg="#e6edfa"
              iconColor="#002395"
              icon={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
              title="Advance payment"
            >
              The full consultancy fee of{" "}
              <strong className="font-bold text-[#002395]">€1,000</strong> is due upfront before
              we begin working on your file. This secures your place and ensures we dedicate full
              attention to your application from day one.
            </InfoCard>

            <InfoCard
              iconBg="#fdf3e3"
              iconColor="#b36a00"
              icon={<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
              badge="Not included"
              title="Additional costs"
            >
              Document{" "}
              <strong className="font-bold text-[#002395]">translation fees</strong> and{" "}
              <strong className="font-bold text-[#002395]">health insurance</strong> are not
              covered and must be paid separately by the student to the relevant providers.
            </InfoCard>

            <InfoCard
              iconBg="#e8f5e9"
              iconColor="#2e7d32"
              icon={<polyline points="20 6 9 17 4 12"/>}
              title="What's covered"
            >
              University search · Admission processing · CV preparation · Motivation letter ·
              Complete file preparation &amp; submission. All in one flat fee — no hidden charges.
            </InfoCard>

          </motion.div>
        </div>
      </div>
    </section>
  );
}